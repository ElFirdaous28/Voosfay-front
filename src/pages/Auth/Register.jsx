import React, { useState } from 'react'
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import useTogglePasswordVisibility from '../../hooks/useTogglePasswordVisibility';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import useValidation from '../../hooks/useValidation';

export default function Register() {
  const { showPassword, togglePasswordVisibility } = useTogglePasswordVisibility();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [errors, setErrors] = useState({});


  const { register } = useAuth();
  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await register({ name, email, password, password_confirmation: passwordConfirmation });
      console.log("Registration successful!");
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors)
      }
      else
        console.log('Login error', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-800">
      <div className="flex w-full max-w-5xl shadow-lg rounded-lg overflow-hidden relative bg-cover bg-center max-h-[740px]"
        style={{ backgroundImage: "url('images/background1.jpg')" }}>

        <div className="absolute inset-0 bg-black opacity-40"></div>

        <div className="hidden md:block w-1/2 relative z-10">
        </div>

        <div className="w-full md:w-1/2 p-8 space-y-8 bg-gray-800/90 backdrop-blur-sm relative z-10">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">Register</h1>
            <p className="mt-2 text-gray-400">
              Create an account to get started.
            </p>
          </div>

          <form className="mt-8 space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <User size={18} className="text-gray-500" />
                </div>
                <input id="name" name="name" onChange={(e) => setName(e.target.value)}
                  type="text" required className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-md bg-gray-900 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="John Doe" />
              </div>
              {useValidation(errors, "name")}
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Mail size={18} className="text-gray-500" />
                </div>
                <input id="email" name="email" onChange={(e) => setEmail(e.target.value)}
                  type="email" required className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-md bg-gray-900 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="your@email.com" />
              </div>
              {useValidation(errors, "email")}
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Lock size={18} className="text-gray-500" />
                </div>
                <input id="password" name="password" onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"} required className="block w-full pl-10 pr-10 py-2 border border-gray-700 rounded-md bg-gray-900 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="••••••••" />
                <button type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-400" >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {useValidation(errors, "password")}
            </div>

            <div className="space-y-2">
              <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-300">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Lock size={18} className="text-gray-500" />
                </div>
                <input id="password_confirmation" name="password_confirmation" onChange={(e) => setPasswordConfirmation(e.target.value)}
                  type={showPassword ? "text" : "password"} required className="block w-full pl-10 pr-10 py-2 border border-gray-700 rounded-md bg-gray-900 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="••••••••" />
                <button type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-400" >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {useValidation(errors, "password_confirmation")}
            </div>

            <div>
              <button
                onClick={handleRegister}
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Create account
              </button>
            </div>
          </form>

          <div className="text-center">
            <p className="text-sm text-gray-400">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-blue-500 hover:text-blue-400">
                Sign in
              </Link>
            </p>
          </div>

          {/* <div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-800 text-gray-400">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div>
                <button className="w-full flex justify-center py-2 px-4 border border-gray-700 rounded-md shadow-sm bg-gray-800 text-sm font-medium text-gray-300 hover:bg-gray-700">
                  Google
                </button>
              </div>
              <div>
                <button className="w-full flex justify-center py-2 px-4 border border-gray-700 rounded-md shadow-sm bg-gray-800 text-sm font-medium text-gray-300 hover:bg-gray-700">
                  GitHub
                </button>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  )
}