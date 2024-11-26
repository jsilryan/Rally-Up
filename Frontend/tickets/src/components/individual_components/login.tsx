import React, { useState } from 'react';
import { google } from '../../assets'; // Assuming `google` is an SVG import
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [isGooglePopupVisible, setGooglePopupVisible] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleLogin = () => {
        if (!formData.email || !formData.password) {
            alert('Please fill in both fields!');
            return;
        }

        console.log('Login Details:', formData);

        // Simulate successful login
        alert('Login Successful!');

        // Navigate to myevents and clear the form
        navigate('/myevents');
        setFormData({
            email: '',
            password: '',
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
                    <img src={google} alt="Google Icon" className="w-6 h-6 mr-2" />
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
        </div>
    );
}
