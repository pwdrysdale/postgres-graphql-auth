import { useReducer } from "react";

import appReducer from "./appReducer";
import AppContext from "./appContext";
import { SET_USER, TOGGLE_LOGIN, TOGGLE_REGISTER } from "./constants";

const AppState = (props) => {
    const initialState = {
        user: { name: "", id: "", email: "" },
        showLogin: false,
        showRegister: false,
    };

    const [state, dispatch] = useReducer(appReducer, initialState);

    const setUser = (user) => {
        dispatch({ type: SET_USER, payload: user });
        return;
    };

    const toggleLogin = () => {
        dispatch({ type: TOGGLE_LOGIN });
        return;
    };

    const toggleRegister = () => {
        dispatch({ type: TOGGLE_REGISTER });
        return;
    };

    return (
        <AppContext.Provider
            value={{
                user: state.user,
                showLogin: state.showLogin,
                showRegister: state.showRegister,
                setUser,
                toggleLogin,
                toggleRegister,
            }}
        >
            {props.children}
        </AppContext.Provider>
    );
};

export default AppState;
