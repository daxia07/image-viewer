import React from "react";
import ReactDOM from "react-dom";
import {createStore, applyMiddleware } from "redux"
import thunk from "redux-thunk";
import reducer from "./store";
import { Provider } from "react-redux";
import App from "./app";
import './index.css'

const store = createStore(reducer, applyMiddleware(thunk))

const rootElement = document.getElementById("root");
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>
    , rootElement);
