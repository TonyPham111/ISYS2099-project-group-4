import { UserContext } from "@/contexts/userContext";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";

export default function LoginPage() {
    const {userData, setUserData} = useContext(UserContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    async function handleLogin(e) {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.post("http://localhost:8000/user/login", {
                email,
                password
            }, { withCredentials: true }).then(response=>response.data);
            console.log( `check response data:${JSON.stringify(response)}`);
            //set local storage for persist data
            localStorage.setItem("userData", JSON.stringify(response.credentials));
            setUserData({
                id: response.credentials.id,
                job_role: response.credentials.job_name,
                department_id: response.credentials.department_id,
                job_id: response.credentials.job_id,
            });
            // Redirect to dashboard
            navigate("/dashboard");
            

        } catch (err) {
            setError(err.response?.data?.error || "An error occurred during login");
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form
                className="flex flex-col items-center p-8 bg-white shadow-lg rounded-lg"
                onSubmit={handleLogin}
            >
                <h2 className="mb-6 text-2xl font-bold text-teal-600">Login</h2>
                <input
                    type="email"
                    placeholder="EMAIL"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mb-4 w-64 px-4 py-2 border-2 border-teal-500 rounded focus:outline-none focus:border-teal-600"
                    required
                />
                <input
                    type="password"
                    placeholder="PASSWORD"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mb-4 w-64 px-4 py-2 border-2 border-teal-500 rounded focus:outline-none focus:border-teal-600"
                    required
                />
                {error && <p className="mb-4 text-red-500">{error}</p>}
                <button
                    type="submit"
                    className="w-64 px-4 py-2 mt-4 text-white bg-teal-500 rounded hover:bg-teal-600 transition duration-300"
                >
                    LOGIN
                </button>
            </form>
        </div>
        
    );
}
