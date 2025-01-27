import React, { useState, useContext, useEffect } from "react";
import { CiUser } from "react-icons/ci";
import { FaKey } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";
import useApi from "../../hooks/useData";
import UserContext from "../../Context";

const Login = () => {
    const { data: porteros, loading, error } = useApi("/porters");
    const { login } = useContext(UserContext);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        let formErrors = {};
        if (!username) formErrors.username = "Username cannot be empty";
        if (!password) formErrors.password = "Password cannot be empty";
        setErrors(formErrors);

        if (Object.keys(formErrors).length === 0) {
            const userf = porteros.find(
                (porter) => porter.user.userName === username && porter.user.password === password
            );

            if (userf) {
                login(userf);
                navigate(`/home`);
            } else {
                setMessage("Invalid username or password");
            }
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading users</div>;

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-red-100">
            <section className="bg-white/10 backdrop-blur-md bg-opacity-20 p-8 rounded-lg shadow-lg w-full max-w-md">
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <h2 className="text-3xl font-bold text-center text-gray-800 uppercase">Sign In</h2>
                    <div className="space-y-5">
                        <div className="relative flex flex-col">
                            <label htmlFor="username" className="mb-2 font-semibold text-gray-200">Username</label>
                            <input
                                type="text"
                                name="username"
                                id="username"
                                placeholder="Enter your username"
                                className="p-3 text-white border-b border-gray-700 bg-transparent placeholder-white focus:outline-none focus:ring-0"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            {errors.username && <span className="text-red-500 text-sm mt-1">{errors.username}</span>}
                        </div>
                        <div className="relative flex flex-col">
                            <label htmlFor="password" className="mb-2 font-semibold text-gray-200">Password</label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                placeholder="Enter your password"
                                className="p-3 text-white border-b border-gray-700 bg-transparent placeholder-white focus:outline-none focus:ring-0"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {errors.password && <span className="text-red-500 text-sm mt-1">{errors.password}</span>}
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full px-4 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition duration-300 cursor-pointer"
                    >
                        Enter
                    </button>
                    <div className="mt-4">
                        {message && <span className={`text-sm ${message === "Access granted" ? "text-green-500" : "text-red-500"}`}>{message}</span>}
                    </div>
                </form>
            </section>
        </div>
    );
};

export default Login;
