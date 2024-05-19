import { API_END_POINTS, CONSTANTS } from "../../config";
import { REDUX_CONSTANTS } from "../reduxConstants";
import axios from "axios"

const fetchTodosOnSuccess = payload => {
    return {
        type: REDUX_CONSTANTS.FETCH_TODOS,
        payload: payload
    };
};


export const fetchTodos = (payload) => {
    return async function (dispatch) {
        let url = CONSTANTS.SERVICE_URL + API_END_POINTS.FETCH_TODOS;
        let options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                "Authorization": `Bearer ${sessionStorage.getItem("token")}`
            },
        };
        let response = await fetch(url, options);
        response = await response.json();
        dispatch(fetchTodosOnSuccess(response));

        // axios
        //     .get(url,
        //         {
        //             'headers':
        //             {
        //                 Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        //             },
        //         }
        //     )
        //     .then(response => {
        //         // response.data is the users
        //         dispatch(fetchTodosOnSuccess(response.json()))
        //     })
        //     .catch(error => {
        //         // error.message is the error message
        //         // dispatch(fetchRestaurantsFailure(error.message))
        //     })
    };
}; 