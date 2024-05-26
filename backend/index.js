const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const bcrypt = require("bcrypt");
const path = require("path");
const cors = require("cors");
const jwt = require("jsonwebtoken");

let port = 3001;
let db = null;

const app = express();
app.use(express.json());
app.use(cors());

app.get("/greeting", (request, response) => {
    response.send("Hi")
})

const dbAndServerInitalize = async () => {
    try {
        db = await open({
            filename: path.join(__dirname, "myTodoApp.db"),
            driver: sqlite3.Database,
        });

        app.listen(port, () => {
            console.log(`Running on port number ${port}`);
        });
    } catch (error) {
        process.exit(1);
    }

};

dbAndServerInitalize();

/* Validating User MiddleWare */

const authenticateToken = (request, response, next) => {
    let jwtToken;
    const authHeader = request.headers["authorization"];
    if (authHeader !== undefined) {
        jwtToken = authHeader.split(" ")[1];
    }
    jwt.verify(jwtToken, "MY_SECRET_TOKEN", async (error, payload) => {
        if (error) {
            response.send({ message: "Invalid Access Token" });
        } else {
            request.userName = payload.userName;
            next();
        }
    });
};

/******************  Login Page APIs *******************/

/*  Registering an User */

app.post("/createUser/", async (request, response) => {

    let { firstName, lastName, userName, password, gender, profilePic } = request.body;

    let userNameCheckQuery = `SELECT * FROM users WHERE USER_NAME = '${userName}';`;

    let userNameCheck = await db.get(userNameCheckQuery);

    if (userNameCheck == undefined) {

        let hashedPassword = await bcrypt.hash(password, 10);
        let query = `
            INSERT INTO users (FIRST_NAME, LAST_NAME, USER_NAME, PASSWORD, GENDER, PROFILE_PIC)
            VALUES ('${firstName}', '${lastName}', '${userName}', '${hashedPassword}', ${gender}, '${profilePic}');
        `;
        await db.run(query);
        response.send({ message: "User Created Succesfully." });
        response.status(200);
    } else {
        response.status(400);
        response.send({ message: "User Already Exists" });
    }


});

/*  Login API */

app.post("/login/", async (request, response) => {
    const { userName, password } = request.body;

    let query = `SELECT * FROM users WHERE USER_NAME = '${userName}';`;

    let getUserDetails = await db.get(query);

    if (getUserDetails == undefined) {
        response.status(400);
        response.send({ message: "User Not Registered. Register by clicking Sign Up" });
    } else {
        const validPassword = await bcrypt.compare(password, getUserDetails.PASSWORD);
        if (validPassword) {
            const payload = { userName: userName };
            let jwtToken = jwt.sign(payload, "MY_SECRET_TOKEN");

            response.status(200);
            response.send({ jwtToken });
        } else {
            response.status(400);
            response.send({ message: "Invalid Password. Try Again." });
        }
    }

});

/*  Get All Users API */

app.get("/getAllUsers/", authenticateToken, async (request, response) => {
    let query = `SELECT * FROM users;`;
    let usersList = await db.all(query);

    // Deleting sensitive information from response
    usersList.forEach(item => {
        if (item.PASSWORD) {
            delete item.PASSWORD;
        }
        if (item.USER_ID) {
            delete item.USER_ID;
        }
    });
    response.send(usersList);
});

/*  Get Profile Details API */

app.get("/profile/", authenticateToken, async (request, response) => {
    let query = `SELECT * FROM users WHERE USER_NAME='${request.userName}';`;
    let userDetails = await db.get(query);

    response.send(userDetails);
});

/*  Change API */

app.put("/changePassword/", authenticateToken, async (request, response) => {
    const { newPassword, oldPassword } = request.body;
    let query = `SELECT * FROM users WHERE USER_NAME='${request.userName}';`;
    let userDetails = await db.get(query);

    let hashedPassword = await bcrypt.hash(newPassword, 10);
    let isPasswordValid = await bcrypt.compare(oldPassword, userDetails.PASSWORD);
    if (isPasswordValid) {
        let updatePassQuery = `UPDATE users SET PASSWORD='${hashedPassword}' WHERE USER_NAME='${request.userName}';`;
        await db.run(updatePassQuery);
        response.status(200);
        response.send({ message: "Password Updated Successfully" });
    } else {
        response.status(400);
        response.send({ message: "Invalid Password" });
    }
});



/******************* Common APIS  **********************/

app.get("/getStatuses/:id/", authenticateToken, async (request, response) => {
    let query = `SELECT * FROM masters WHERE DETAIL_SEQ_ID=${request.params.id};`;
    let statusesList = await db.all(query);
    response.send(statusesList);
});


/*******************  To Do APIs ************************/

/* Old Method fetching status without filters */

// app.get("/todos/", authenticateToken, async (request, response) => {
//     let getUserDetailsQuery = `SELECT * FROM users WHERE USER_NAME = '${request.userName}';`;
//     let getUserDetails = await db.get(getUserDetailsQuery);
//     // let todosQuery = `SELECT * FROM tasks WHERE USER_ID=${getUserDetails.USER_ID} ORDER BY TASK_ID DESC;`;
//     let todosQuery = `SELECT TASK_ID, TITLE, A.DESCRIPTION, STATUS, 
//                         B.DT_DESCRIPTION AS STATUS_DESC, SEVERITY, C.DT_DESCRIPTION AS SEVERITY_DESC, 
//                         CATEGORY, D.DT_DESCRIPTION AS CATEGORY_DESC, TASK_DATE
//                         FROM tasks A
//                         LEFT JOIN masters B ON A.STATUS = B.DT_CODE AND B.DETAIL_SEQ_ID = 3
//                         LEFT JOIN masters C ON A.SEVERITY = C.DT_CODE AND C.DETAIL_SEQ_ID = 1
//                         LEFT JOIN masters D ON A.CATEGORY = D.DT_CODE  AND D.DETAIL_SEQ_ID = 2
//                         WHERE USER_ID=${getUserDetails.USER_ID} ORDER BY TASK_ID DESC;
//                         ;`;
//     let todosList = await db.all(todosQuery);
//     // Deleting sensitive information from response
//     todosList.forEach(item => {
//         if (item.USER_ID) {
//             delete item.USER_ID;
//         }
//     });
//     response.send(todosList);
// });


/* New Method fetching status with filters */

app.post("/todos/", authenticateToken, async (request, response) => {
    const { status, sortBySeverity, search, category, fromDate, toDate, sortByDate } = request.body;

    let getUserDetailsQuery = `SELECT * FROM users WHERE USER_NAME = '${request.userName}';`;
    let getUserDetails = await db.get(getUserDetailsQuery);
    // let todosQuery = `SELECT * FROM tasks WHERE USER_ID=${getUserDetails.USER_ID} ORDER BY TASK_ID DESC;`;
    let todosQuery = `SELECT TASK_ID, TITLE, A.DESCRIPTION, STATUS, 
        B.DT_DESCRIPTION AS STATUS_DESC, SEVERITY, C.DT_DESCRIPTION AS SEVERITY_DESC, 
        CATEGORY, D.DT_DESCRIPTION AS CATEGORY_DESC, TASK_DATE
        FROM tasks A
        LEFT JOIN masters B ON A.STATUS = B.DT_CODE AND B.DETAIL_SEQ_ID = 3
        LEFT JOIN masters C ON A.SEVERITY = C.DT_CODE AND C.DETAIL_SEQ_ID = 1
        LEFT JOIN masters D ON A.CATEGORY = D.DT_CODE  AND D.DETAIL_SEQ_ID = 2
        WHERE USER_ID=${getUserDetails.USER_ID} AND STATUS IN (${status})
        AND TITLE LIKE '%${search}%' AND CATEGORY IN (${category})
		AND DATE(TASK_DATE) BETWEEN DATE('${fromDate}') AND DATE('${toDate}')
        ORDER BY DATE(TASK_DATE) ${sortByDate}, SEVERITY ${sortBySeverity};`;

    let todosList = await db.all(todosQuery);
    // Deleting sensitive information from response
    todosList.forEach(item => {
        if (item.USER_ID) {
            delete item.USER_ID;
        }
    });
    response.send(todosList);
});

app.post("/createTodo/", authenticateToken, async (request, response) => {
    let getUserDetailsQuery = `SELECT * FROM users WHERE USER_NAME = '${request.userName}';`;
    let getUserDetails = await db.get(getUserDetailsQuery);
    const { title, description, status, severity, category, taskCreatedDate, taskDate } = request.body;

    let query = `INSERT INTO tasks (TITLE, DESCRIPTION, STATUS, SEVERITY, CATEGORY, USER_ID, TASK_CREATED_DATE,TASK_DATE)
            VALUES('${title}', '${description}', ${status}, ${severity}, '${category}', ${getUserDetails.USER_ID}, '${taskCreatedDate}', '${taskDate}');`;
    await db.run(query);
    response.send({ message: "Saved Succesfully." });
});

app.put("/updateTodo/", authenticateToken, async (request, response) => {
    const { title, description, status, severity, category, taskDate, taskId } = request.body;

    let query = `UPDATE tasks 
        SET TITLE='${title}', DESCRIPTION='${description}',STATUS=${status}, SEVERITY=${severity},CATEGORY='${category}',TASK_DATE='${taskDate}'
        WHERE TASK_ID=${taskId};`;

    await db.run(query);
    response.send({ message: "Updated Successfully." });
});


/******************* Cash Book  **********************/


app.post("/createNewCashbook/", authenticateToken, async (request, response) => {
    let getUserDetailsQuery = `SELECT * FROM users WHERE USER_NAME = '${request.userName}';`;
    let getUserDetails = await db.get(getUserDetailsQuery);
    const { title } = request.body;

    let query = `INSERT INTO cashbook (TITLE, USER_ID)
            VALUES('${title}', ${getUserDetails.USER_ID});`;
    await db.run(query);
    response.send({ message: "Saved Succesfully." });
});

app.get("/getCashbookNames/", authenticateToken, async (request, response) => {
    let getUserDetailsQuery = `SELECT * FROM users WHERE USER_NAME = '${request.userName}';`;
    let getUserDetails = await db.get(getUserDetailsQuery);

    let query = `SELECT * FROM cashbook WHERE USER_ID=${getUserDetails.USER_ID};`;
    let cashBookNames = await db.all(query);
    response.send(cashBookNames);
});

app.post("/createNewEntry/", authenticateToken, async (request, response) => {
    const { description, amount, transactionType, date, cbmId } = request.body;

    let query = `INSERT INTO cashbook_details (DESCRIPTION, AMOUNT, TRANSACTION_TYPE, DATE, CBM_ID)
            VALUES('${description}', ${amount}, ${transactionType}, '${date}', ${cbmId});`;
    await db.run(query);
    response.send({ message: "Saved Succesfully." });

});

app.put("/updateEntry/", authenticateToken, async (request, response) => {
    const { cbsmId, description, amount, transactionType, date } = request.body;

    let query = `UPDATE cashbook_details SET DESCRIPTION = '${description}', AMOUNT = ${amount},
        TRANSACTION_TYPE = ${transactionType}, DATE = '${date}' WHERE CBSM_ID=${cbsmId};`;
    await db.run(query);
    response.send({ message: "Saved Succesfully." });

});

app.get("/getCashbookDetails/:id/", authenticateToken, async (request, response) => {
    let query = `SELECT * FROM cashbook_details WHERE CBM_ID=${request.params.id} ORDER BY DATE ASC;`;
    let cashBookNames = await db.all(query);
    response.send(cashBookNames);
});

app.delete("/deleteEntry/:cbsmId/", authenticateToken, async (request, response) => {
    const { cbsmId } = request.params;

    let query = `DELETE FROM cashbook_details WHERE CBSM_ID=${cbsmId};`;
    await db.run(query);
    response.send({ message: "Deleted Succesfully." });

});




