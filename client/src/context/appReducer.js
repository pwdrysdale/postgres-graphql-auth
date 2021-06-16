import { TOGGLE_LOGIN, TOGGLE_REGISTER, SET_USER } from "./constants";

const reducer = (state, action) => {
    switch (action.type) {
        case TOGGLE_LOGIN:
            return { ...state, showLogin: !state.showLogin };
        case TOGGLE_REGISTER:
            return { ...state, showRegister: !state.showRegister };
        case SET_USER:
            return {
                ...state,
                user: action.payload,
            };
        default:
            return state;
    }
};

export default reducer;
