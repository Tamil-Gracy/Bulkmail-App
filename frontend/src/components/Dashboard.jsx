import React from "react"
import ReactDom from "react-dom"
import { useState, useContext } from "react";
import Compose from "./Compose"
import { useNavigate, useLocation } from "react-router-dom"
import { AuthContext } from "../AuthContext.jsx";
import axios from "axios"
const API_URL = import.meta.env.VITE_API_URL;

const Dashboard = () => {
   const navigate = useNavigate();
   const location = useLocation();
   const { loggedInUser, setLoggedInUser } = useContext(AuthContext);
   const [history, setHistory] = useState([]);

   const [activeNav, setActiveNav] = useState("compose");
   
   const handleHistory = async () => {
      setActiveNav("history");
      document.getElementById("compose").style.display = "none";
      document.getElementById("history").style.display = "block";
      //navigate("/history");
   }
   const handleCompose = () => {
      setActiveNav("compose");
      document.getElementById("compose").style.display = "block";
      document.getElementById("history").style.display = "none";
      //navigate("/compose");
   }

   const handleLogout = () => {
      setLoggedInUser(null);
      navigate("/");
   }
   return (
      <>
         <div id="top" className="mx-auto max-w-2xl items-center justify-between bg-slate-900 px-4 py-5 text-slate-100">
            <h1 className="text-3xl font-bold text-center p-3">BulkMail</h1>
            <h4 className="text-center text-2xl">Welcome! {loggedInUser}</h4>
            <div className="flex gap-2 text-sm font-semibold items-center justify-center mt-4">

               <button  className={`min-h-[44px] px-3 cursor-pointer ${activeNav === "compose" ? "bg-indigo-800" : "bg-gray-500"} rounded`} onClick={handleCompose}>Compose</button>
               <button className={`min-h-[44px] px-3 cursor-pointer ${activeNav === "history" ? "bg-indigo-800" : "bg-gray-500"} rounded`} onClick={handleHistory}>History</button>
               <button  className="min-h-[44px] px-3 cursor-pointer bg-white text-red-800" onClick={handleLogout}>Logout</button>
            </div>
         </div>
         <Compose activeNav={activeNav}  setActiveNav={setActiveNav} />
      </>
   )
}

export default Dashboard;