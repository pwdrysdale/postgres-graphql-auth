import { useContext } from "react";
import AppContext from "../context/appContext";

const Me = () => {
    const { user } = useContext(AppContext);

    return <div>{user.name}</div>;
};

export default Me;
