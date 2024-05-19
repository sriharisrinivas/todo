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

/*  Change API */

app.put("/changePassword/", authenticateToken, async (request, response) => {
    const { password } = request.body;
    let hashedPassword = await bcrypt.hash(password, 10);
    let updatePassQuery = `UPDATE users SET PASSWORD='${hashedPassword}' WHERE USER_NAME='${payload.userName}';`;
    await db.run(updatePassQuery);
    response.send({ message: "Password Updated Successfully" });
});







/*******************  To Do APIs ************************/

app.get("/todos/", authenticateToken, async (request, response) => {
    let getUserDetailsQuery = `SELECT * FROM users WHERE USER_NAME = '${request.userName}';`;
    let getUserDetails = await db.get(getUserDetailsQuery);
    let todosQuery = `SELECT * FROM tasks WHERE USER_ID=${getUserDetails.USER_ID} ORDER BY TASK_ID DESC;`;
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
    db.run(query);
    response.send({ message: "Saved." });
});
