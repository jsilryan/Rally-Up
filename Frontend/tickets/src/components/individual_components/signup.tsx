import React, { useState } from 'react';
import { FcGoogle } from "react-icons/fc";
import { FaCheckCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { serverLink } from '../../constants';

export default function Signup() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phone: '',
        firstName: '',
        lastName: '',
        password: '',
        confirmPassword: '',
    });
    const [isGooglePopupVisible, setGooglePopupVisible] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const navigate = useNavigate();
    const [submitPressed, setPressed] = useState(false)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validatePassword = (password: string) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return regex.test(password);
    };

    const handleSignup = () => {
        if (submitPressed === true) {
            alert("Wait for response before trying again.")
            return
          }
      
        setPressed(true)

        const { username, email, phone, firstName, lastName, password, confirmPassword } = formData;
    
        // Check for empty fields
        if (!username || !email || !phone || !firstName || !lastName || !password || !confirmPassword) {
            alert('All fields are required!');
            setPressed(false)
            return;
        }
    
        // Validate username length
        if (username.length < 8) {
            alert('Username must be 8 characters or longer!');
            setPressed(false)
            return;
        }
    
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email validation regex
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address!');
            setPressed(false)
            return;
        }
    
        // Check password match
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            setPressed(false)
            return;
        }
    
        // Validate password strength
        if (!validatePassword(password)) {
            setPressed(false)
            alert(
                'Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.'
            );
            return;
        }
    
        console.log('Signup Details:\n', formData);

        const body = {
            username : formData.username,
            firstName : formData.firstName,
            lastName : formData.lastName,
            phone : formData.phone,
            email : formData.email,
            password : formData.password
        }

        console.log('Body Details:\n', body);

        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json", // Inform the backend you're sending JSON
            }, 
            body: JSON.stringify(body)
          }

          fetch(`${serverLink}/sign_up`, requestOptions)
          .then(res => res.json())
          .then(data => {
                if (data && data.access_token && data.refresh_token) {
                    const { access_token, refresh_token } = data;

                    // Save tokens
                    localStorage.setItem('accessToken', access_token);
                    localStorage.setItem('refreshToken', refresh_token);
                
                    setTimeout(() => {
                        const token = localStorage.getItem('accessToken');
                        console.log("Access Token after delay:\n", token);
                        // Debugging fallback
                        if (!token) {
                            console.error("Failed to retrieve accessToken from localStorage");
                        }
                    }, 200);
                   
                } else {
                    console.error("Invalid data object or missing tokens:", data);
                    alert("Server error. Retry signup")
                    
                }
                    
                // Show success popup
                setShowPopup(true);
                    
                // Redirect to "/myevents" after 3 seconds
                setTimeout(() => {
                    setShowPopup(false);
                    navigate('/myevents');
                }, 3000);
                setPressed(false)

                // Clear form
                setFormData({
                    username: '',
                    email: '',
                    phone: '',
                    firstName: '',
                    lastName: '',
                    password: '',
                    confirmPassword: '',
                });
          })
          .catch((err) => {
            console.log(err)
            alert(err)
            setPressed(false)
          });
    
    };
    

    const handleGoogleSignup = () => {
        setGooglePopupVisible(true);
    };

    const handleClosePopup = () => {
        setGooglePopupVisible(false);
    };

    return (
        <div className="signup-container bg-gray-100 p-6 min-h-screen flex justify-center items-center lg:pt-[95px] md:pt-12 sm:pt-28 pt-32">
            <div className="signup-form bg-white p-6 rounded shadow-md w-full max-w-md relative">
                <h2 className="text-xl font-semibold mb-4">Sign Up</h2>

                {/* Input Fields */}
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="border w-full p-2 mb-4 rounded"
                />
                <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="border w-full p-2 mb-4 rounded"
                />
                <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="border w-full p-2 mb-4 rounded"
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="border w-full p-2 mb-4 rounded"
                />
                <input
                    type="text"
                    name="phone"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="border w-full p-2 mb-4 rounded"
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="border w-full p-2 mb-4 rounded"
                />
                <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Re-enter Password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="border w-full p-2 mb-6 rounded"
                />

                {/* Submit Button */}
                <button
                    onClick={handleSignup}
                    className="bg-blue-500 text-white w-full p-2 rounded hover:bg-blue-600"
                >
                    Sign Up
                </button>

                {/* Divider */}
                <div className="flex items-center mt-6">
                    <div className="border-b border-gray-300 flex-grow"></div>
                    <span className="mx-4 text-gray-500">OR</span>
                    <div className="border-b border-gray-300 flex-grow"></div>
                </div>

                {/* Google Signup */}
                <button
                    onClick={handleGoogleSignup}
                    className="bg-gray-100 mt-4 w-full flex items-center justify-center p-2 rounded hover:bg-gray-200"
                >
                    <FcGoogle className="w-6 h-6 mr-2" />
                    Sign Up with Google
                </button>

                {/* Google Signup Popup */}
                {isGooglePopupVisible && (
                    <div className="popup-container absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                        <div className="popup bg-white p-4 rounded shadow-lg w-96">
                            <h3 className="text-lg font-semibold mb-4">Google Sign Up</h3>
                            <input
                                type="email"
                                placeholder="Enter your email"
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
