import { useState, useContext } from "react";
import { useMutation } from "@apollo/client/react";

import AppContext from "../context/appContext";
import { LOGIN } from "../mutations/login";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { showLogin, toggleLogin, user, setUser } = useContext(AppContext);

    const [loginUser, { error }] = useMutation(LOGIN, {
        errorPolicy: "all",
    });

    const onSubmit = async (e) => {
        e.preventDefault();
        const res = await loginUser({
            variables: { email, password },
        });
        console.log(res);
        setEmail("");
        setPassword("");

        if (res.error) {
            setUser({ id: "", name: "", email: "" });
            return;
        }

        if (res.data && res.data.login) {
            const { user_id: id, name, email: usr_email } = res.data.login;
            setUser({ id, name, email: usr_email });
            return;
        }

        return;
    };

    return (
        <div
            className={`${
                !showLogin && "hidden"
            } absolute w-screen h-screen z-10 top-0 bg-green-500 flex items-center justify-center`}
        >
            <div className="bg-white shadow-md rounded-md h-max p-8 w-96">
                <form onSubmit={onSubmit} className=" flex flex-col">
                    <h3>Login</h3>
                    <div className="formGroup">
                        <label htmlFor="lemail">Email</label>
                        <input
                            type="text"
                            id="lemail"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                            }}
                        />
                    </div>
                    <div className="formGroup">
                        <label htmlFor="lpassword">Password</label>
                        <input
                            type="password"
                            id="lpassword"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                            }}
                        />
                    </div>
                    <input type="submit" className="btn" value="Submit" />
                    {error
                        ? "Incorrect username or password."
                        : user.name && `${user.name} has logged in!`}
                </form>
                <button onClick={toggleLogin} className="btn">
                    Close
                </button>
            </div>
        </div>
    );
};

export default Login;
