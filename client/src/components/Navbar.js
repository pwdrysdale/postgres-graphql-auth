import { useContext } from "react";

import AppContext from "../context/appContext";

const Navbar = () => {
    const { toggleRegister, toggleLogin } = useContext(AppContext);

    return (
        <div className="sticky top-0">
            <div className="px-9 py-3 bg-red-300 grid grid-cols-3 items-center ">
                <div className="text-red-500">
                    <img src="./rw.svg" alt="" className="h-6" />
                </div>
                <div className=" w-full flex ">
                    <div className="mx-auto">report writer</div>
                </div>

                <img
                    src="./bc.svg"
                    alt=""
                    className="lg:hidden h-5 rounded-sm ml-auto"
                />

                <div className="hidden lg:flex ">
                    <ul className="flex space-x-3 ml-auto">
                        <li
                            className="hover:text-white cursor-pointer"
                            onClick={toggleRegister}
                        >
                            Register
                        </li>
                        <li
                            className="hover:text-white cursor-pointer"
                            onClick={toggleLogin}
                        >
                            Login
                        </li>
                        <li className="hover:text-white  cursor-pointer">
                            Nav Item 3
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
