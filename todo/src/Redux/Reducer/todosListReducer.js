import { REDUX_CONSTANTS } from "../reduxConstants";

const initialState = {
    todosList: []
};

export const todosListReducer = (state = initialState, action) => {
    switch (action.type) {
        case REDUX_CONSTANTS.FETCH_TODOS:
            return { ...state, todosList: action.payload };
        default:
            return { ...state };
    }
};