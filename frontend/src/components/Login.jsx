import React from "react";
import ReactDom from "react-dom";
import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext.jsx";

const API_URL = import.meta.env.VITE_API_URL;

const Login = () => {
  const [email, setEmail] = useState("");
   const { loggedInUser,setLoggedInUser } = useContext(AuthContext);
   const [password, setPassword] = useState("");
   const navigate = useNavigate();
   const handleLogin = async (e) => {
      e.preventDefault();
      try {
         const response = await axios.post(`${API_URL}/api/login`, { email, password });
         alert(response.data.message);
         setLoggedInUser(email);
         localStorage.setItem("loggedInUser", JSON.stringify(email));
         navigate("/dashboard");
      } catch (error) {
         alert("Login failed. Please check your credentials.");
         console.log("Login error:", error);
      }
   }
  return (
    <section id="login" className="grid min-h-screen place-items-center p-4">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8">
        <h1 className="text-2xl font-extrabold">Admin login</h1>
           <p className="mb-6 mt-1 text-sm text-slate-600">Sign in to send emails.</p>
           <form>
           <label htmlFor="email" className="mb-2 block text-sm font-semibold">Email</label>
           <input
              id="email"
              type="email"
              placeholder="tamil@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mb-4 min-h-[48px] w-full rounded-lg border border-slate-300 px-3 text-sm"
              required />
        <label htmlFor="password" className="mb-2 block text-sm font-semibold">Password</label>
           <input
              id="password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mb-6 min-h-[48px] w-full rounded-lg border border-slate-300 px-3 text-sm"
              required />
           <button
              onClick={handleLogin}
                 className="min-h-[48px] w-full rounded-lg bg-indigo-700 font-semibold text-white hover:bg-indigo-800 cursor-pointer">Log in</button>
           </form>
      </div>
    </section>
  );
}

export default Login;