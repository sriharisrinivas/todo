import { combineReducers } from "redux";
import { todosListReducer } from "./todosListReducer";

export const rootReducer = combineReducers({
    todosListReducer: todosListReducer
})