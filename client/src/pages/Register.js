import { useState, useContext } from "react";
import { useMutation } from "@apollo/client/react";

import AppContext from "../context/appContext";
import { REGISTER } from "../mutations/register";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [registerUser, { error }] = useMutation(REGISTER, {
        errorPolicy: "all",
    });

    const { showRegister, toggleRegister, user, setUser } =
        useContext(AppContext);

    const onSubmit = async (e) => {
        e.preventDefault();
        const res = await registerUser({
            variables: { name, email, password },
        });
        console.log(res);
        setName("");
        setEmail("");
        setPassword("");

        if (res.error) {
            setUser({ name: "", email: "", id: "" });
            return;
        }

        if (res.data && res.data.register) {
            const { user_id: id, name, email: usr_email } = res.data.register;
            setUser({ id, name, email: usr_email });
            return;
        }
        return;
    };

    return (
        <div
            className={`${
                !showRegister && "hidden"
            } absolute w-screen h-screen z-10 top-0 bg-green-500 flex items-center justify-center`}
        >
            <div className="bg-white shadow-md rounded-md h-max p-8 w-96">
                <form onSubmit={onSubmit}>
                    <h3>Register</h3>
                    <div className="formGroup">
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                            }}
                        />
                    </div>
                    <div className="formGroup">
                        <label htmlFor="email">Email</label>
                        <input
                            type="text"
                            id="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                            }}
                        />
                    </div>
                    <div className="formGroup">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                            }}
                        />
                    </div>
                    <input type="submit" value="Submit" className="btn" />
                </form>
                {error
                    ? "There was an error. Please try again!"
                    : user.name && `${user.name} has registered!`}
                <button className="btn" onClick={toggleRegister}>
                    Close
                </button>
            </div>
        </div>
    );
};

export default Register;
