import React, { useState, useContext } from "react";
import { useNavigate } from "react-router";
import UserContext from "../../Context";
import axiosInstance, { axiosInstanceLogin } from "../../Services/apiService";
import useApi from "../../hooks/useData";
import { CiUser } from "react-icons/ci";
import { FaKey } from "react-icons/fa";
import { Link } from "react-router-dom";

const Login = () => {
    const { login } = useContext(UserContext);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        let formErrors = {};
        if (!username) formErrors.username = "Username cannot be empty";
        if (!password) formErrors.password = "Password cannot be empty";
        setErrors(formErrors);

        if (Object.keys(formErrors).length > 0) return;

        try {
            const response = await axiosInstanceLogin.post(
                "login",
                new URLSearchParams({ userName: username, password })
            );

            if (!response.data || !response.data.token) {
                setMessage("Invalid username or password");
                return;
            }

            const { token, userName } = response.data;
            localStorage.setItem("authToken", token);

            let porters = [];
            try {
                const portersResponse = await axiosInstance.get("/porters", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                porters = portersResponse.data;
            } catch (error) {
                console.error("Error obteniendo porteros:", error);
            }

            // 🔹 Buscar el usuario en los porteros
            let userf = null;
            if (porters && porters.length > 0) {
                userf = porters.find((porter) => porter.user && porter.user.userName === username);
            }

            login(userf || { userName });

            alert("Welcome!");
            navigate("/home");

        } catch (error) {
            if (error.response) {
                console.error("Respuesta del servidor:", error.response.data);
                setMessage("Invalid username or password");
            } else {
                console.error("Error de conexión:", error.message);
                alert("Hubo un problema al intentar conectarse con el servidor.");
            }
        }
    };
    

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "username") {
          setUsername(value);
        } else if (name === "password") {
          setPassword(value);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-red-100">
            <section className="m-5 bg-white/10 backdrop-blur-md bg-opacity-20 p-8 rounded-lg shadow-lg w-full max-w-md">
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <h2 className="text-3xl font-bold text-center text-gray-800 uppercase">Sign In</h2>
                    <div className="space-y-5">
                        <div className="relative flex flex-col">
                            <label htmlFor="username" className="mb-2 font-semibold text-gray-200">Username</label>
                            <CiUser className="absolute text-white  left-3 top-10 text-gray-400" size={24} />
                            <input
                                type="text"
                                name="username"
                                id="username"
                                placeholder="Enter your username"
                                autoComplete="off"
                                className="p-3 pl-12 text-white border-b border-gray-700 bg-transparent placeholder-white focus:outline-none focus:ring-0"
                                value={username}
                                onChange={handleChange}
                            />
                            {errors.username && <span className="text-red-500 text-sm mt-1">{errors.username}</span>}
                        </div>
                        <div className="relative flex flex-col">
                            <label htmlFor="password" className="mb-2 font-semibold text-gray-200">Password</label>
                            <FaKey className="absolute text-white left-3 top-10 text-gray-400" size={24} />
                            <input
                                type="password"
                                name="password"
                                id="password"
                                placeholder="Enter your password"
                                className="p-3 pl-12 text-white border-b border-gray-700 bg-transparent  placeholder-white focus:outline-none focus:ring-0"
                                value={password}
                                onChange={handleChange}
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
                    <div className="flex flex-row items-center justify-center mt-4 text-gray-200">
                        <p className="mr-2">Don't have an account?</p>
                        <Link to="/signin">
                        <button 
                            type="button" 
                            className="text-blue-400 font-semibold hover:text-blue-700 transition duration-300 cursor-pointer"
                        >
                            Sign Up
                        </button>
                        </Link>
                        
                    </div>
                </form>
            </section>
        </div>
    );
}
export default Login;