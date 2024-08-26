import React, { useState, useContext } from 'react';
// import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState('');
    const [error, setError] = useState('');
    const axiosPostData = async () => {
        const postData = {
            username: username, password: password
        }

        await axios.post('http://localhost:4000/login', postData, { withCredentials: true })
            .then(res => {
                setUser(res.data.user);
                setError(res.data.message);
            })
            .catch(er => {
                console.log(er);
            });

    };
    const handleSubmit = async (e) => {
        e.preventDefault();
         axiosPostData();
            if (error) {
                notify(error);
            }
    };

    const notify = (error) => {
        toast.error(error, {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            draggable: true,
            progress: undefined,
            pauseOnHover: false,
            theme: "light",
        });
    }

    return (

            
    <>
      <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={true}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover={false}
                theme="light"
            />
            
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form className="bg-white p-6 rounded-lg shadow-md w-80" onSubmit={handleSubmit}>
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                        required
                    />
                </div>
                <div className="mb-6">
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full py-2 bg-teal-500 text-white rounded hover:bg-teal-600 focus:outline-none"
                >
                    Login
                </button>
            </form>
        </div>
    </>
    );
};

export default Login;
