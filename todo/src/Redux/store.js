import { thunk } from "redux-thunk";
import { applyMiddleware, createStore } from "redux";
import { rootReducer } from "./Reducer";

export const store = createStore(rootReducer, applyMiddleware(thunk));