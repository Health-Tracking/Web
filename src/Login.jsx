import React, { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from './firebase'; // Firebase Auth 및 GoogleAuthProvider import
import googleLogo from './images/google.png'; // 이미지 import

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            onLogin(); // 로그인 성공 시 호출
        } catch (error) {
            alert('로그인 실패: ' + error.message);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            onLogin(); // 로그인 성공 시 호출
        } catch (error) {
            if (error.code === 'auth/popup-closed-by-user') {
                console.log('User closed the popup without finishing the sign in process');
            } else {
                alert('구글 로그인 실패: ' + error.message);
            }
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="flex w-3/4 max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="w-1/2 bg-blue-500 flex flex-col items-center justify-center p-12">
                    <h2 className="text-white text-3xl mb-4">언제나 건강한 삶을 위해</h2>
                    <p className="text-white text-center">
                        환자 관리 시스템은 환자의 건강 정보를 효율적으로 관리하고 추적할 수 있도록 도와줍니다.
                    </p>
                </div>
                <div className="w-1/2 p-12">
                    <h2 className="text-2xl font-bold mb-4">Login</h2>
                    <form onSubmit={handleSubmit} className="flex flex-col">
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200">
                            Login
                        </button>
                        <div className="mt-4 text-center">
                            <a href="#" className="text-blue-500 hover:underline">Forgot password?</a>
                        </div>
                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            className="w-full bg-white border border-gray-300 text-gray-700 py-2 rounded mt-4 flex items-center justify-center hover:bg-gray-100 transition duration-200">
                            <img src={googleLogo} alt="Google Logo" className="w-5 h-5 mr-2" />
                            Sign in with Google
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;