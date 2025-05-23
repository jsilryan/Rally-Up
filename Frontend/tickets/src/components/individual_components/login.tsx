import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import { serverLink } from '../../constants';
import { FcGoogle } from "react-icons/fc";

export default function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [isGooglePopupVisible, setGooglePopupVisible] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const navigate = useNavigate();
    const [submitPressed, setPressed] = useState(false)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleLogin = () => {
        if (submitPressed === true) {
            alert("Wait for response before trying again.")
            return
          }
      
        setPressed(true)
        
        if (!formData.email || !formData.password) {
            alert('Please fill in both fields!');
            setPressed(false)
            return;
        }
    
        const body = {
            email: formData.email,
            password: formData.password,
        };
    
        fetch(`${serverLink}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        })
            .then((res) => {
                if (!res.ok) {
                    alert("Server Error. Enter correct Password or email.")
                    setPressed(false)
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then((data) => {
                // console.log("Token Data:", data)
                if (data?.access_token && data?.refresh_token) {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    localStorage.setItem('accessToken', data.access_token);
                    localStorage.setItem('refreshToken', data.refresh_token);
                    // let token: string | null = localStorage.getItem('accessToken');
                    // console.log("New Token:", token)
                    console.log()
    
                    setShowPopup(true);
                    setFormData({ email: '', password: '' });
                    setPressed(false)
                    setTimeout(() => {
                        setShowPopup(false);
                        navigate('/myevents');
                    }, 3000);
                } else {
                    throw new Error('Invalid data or missing tokens');
                }
            })
            .catch((error) => {
                alert("Server Error. Enter correct Password or email.")
                console.error('Error during login:', error);
                setPressed(false)
            });
    };
    
    

    const handleGoogleLogin = () => {
        setGooglePopupVisible(true);
    };

    const handleClosePopup = () => {
        setGooglePopupVisible(false);
    };

    return (
        <div className="login-container bg-gray-100 p-6 min-h-screen flex justify-center items-center">
            <div className="login-form bg-white p-6 rounded shadow-md w-full max-w-md relative">
                <h2 className="text-xl font-semibold mb-4">Login</h2>

                {/* Input Fields */}
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="border w-full p-2 mb-4 rounded"
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="border w-full p-2 mb-6 rounded"
                />

                {/* Login Button */}
                <button
                    onClick={handleLogin}
                    className="bg-blue-500 text-white w-full p-2 rounded hover:bg-blue-600"
                >
                    Login
                </button>

                {/* Divider */}
                <div className="flex items-center mt-6">
                    <div className="border-b border-gray-300 flex-grow"></div>
                    <span className="mx-4 text-gray-500">OR</span>
                    <div className="border-b border-gray-300 flex-grow"></div>
                </div>

                {/* Google Login */}
                <button
                    onClick={handleGoogleLogin}
                    className="bg-gray-100 mt-4 w-full flex items-center justify-center p-2 rounded hover:bg-gray-200"
                >
                    <FcGoogle className="w-6 h-6 mr-2" />
                    Login with Google
                </button>

                {/* Google Login Popup */}
                {isGooglePopupVisible && (
                    <div className="popup-container absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                        <div className="popup bg-white p-4 rounded shadow-lg w-96">
                            <h3 className="text-lg font-semibold mb-4">Google Login</h3>
                            <input
                                type="email"
                                placeholder="Enter your Gmail"
                                className="border w-full p-2 mb-4 rounded"
                            />
                            <div className="flex justify-end">
                                <button
                                    onClick={handleClosePopup}
                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {/* Success Popup */}
            {showPopup && (
                <div className="fixed top-0 left-0 right-0 bg-green-500 text-white p-4 flex items-center justify-center z-50">
                    <FaCheckCircle className="text-white mr-2" size={24} />
                    <span>Submitted Successfully!</span>
                </div>
            )}
        </div>
    );
}
