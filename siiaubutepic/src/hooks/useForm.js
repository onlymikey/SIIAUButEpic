import { useReducer, useState } from "react";
const initialState = {
    email: "", 
    password: ""
}
const initialStateError = {
    email: false, 
    password: false
}

function validateEmail(email){
    return email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g) !== null;
}

function validatePassword(password){
    return password.length >= 6;
}

function reducerError(state, action){
    switch(action.type){
        case 'SET_EMAIL':
            return {...state, email: validateEmail(action.payload)}
        case 'SET_PASSWORD':
            return {...state, password: validatePassword(action.payload)}
        default:
            throw new Error('Invalid action type');
    }
}

function reducer(state, action){
    switch(action.type){
        case 'SET_EMAIL':
            return {...state, email: action.payload}
        case 'SET_PASSWORD':
            return {...state, password: action.payload}
        default:
            throw new Error('Invalid action type');
            
    }
}

export default function useForm(){
    const [state, dispatch] = useReducer(reducer, initialState); 
    const [stateError, dispatchError] = useReducer(reducerError, initialStateError);
    function register(label){
        return {
            onChange: (event) => dispatch({type: `SET_${label.toUpperCase()}`, payload: event.target.value}),
            errorMesage: `El campo ${label} es requerido`,
            onBlur: () => dispatchError({type: `SET_${label.toUpperCase()}`, payload: state[label]}),
            isInvalid: stateError[label], 
            value: state[label]
        }
    }

    return [state, register]; 
}