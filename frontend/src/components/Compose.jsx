import { useState,useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";
import History from "./History"
const Compose = (props) => {
   const [subject, setSubject] = useState("");
   const [fileKey, setFileKey] = useState(0);
   const [recipient, setRecipient] = useState("");
   const [recemails, setRecEmails] = useState([]);
   const [emails, setEmails] = useState([]);
   const [message, setMessage] = useState("Hello, thank you for being with us.");
   const [fieldError, setFieldError] = useState([{
     subject: "", recipient: "", message: ""
   }])
   const [loading, setLoading] = useState(false);
   const setActiveNav = props.setActiveNav;
   const activeNav = props.activeNav;
   const API_URL = import.meta.env.VITE_API_URL;


   const handleFileChange = (e) => {
      const file = e.target.files[0];   // the real file
      if (!file) return;    
      const reader = new FileReader();
      reader.onload = (event) => {
         const filedata = event.target.result;
         const workBook = XLSX.read(filedata, { type: "Array" })
         const sheetName = workBook.SheetNames[0];
         const workSheet = workBook.Sheets[sheetName];
         const emailsFromSheet = XLSX.utils.sheet_to_json(workSheet, { header: 'A' });
         const emailList = emailsFromSheet.map((item) => { return item.A });
         setEmails([...emails, ...emailList]);
         
      }
      reader.readAsArrayBuffer(file);
   }
 

   const addEmail = () => {
      const email = recipient.trim();
      if (!email || emails.includes(email)) return;
      const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!isValidEmail) {
         setFieldError({ ...fieldError, recipient: "Enter valid email" })
         return;
      }
      setEmails([...emails, email]);
      setRecipient("");
      setRecEmails([...recemails,email]);
      setFieldError({ ...fieldError, message: "" })
      
   };

   const removeEmail = (index) => {
      setEmails(emails.filter((emailItem,i) => i!==index));
   };


   //console.log(emails);

   const handleSend = async () => {
      if (!subject) {
         setFieldError({subject: "Subject is required."});
         return;
      }
      if (!message) {
         setFieldError({message: "Message is required."});
         return;
      }
      if (emails.length === 0) {
         setFieldError({recipient: "At least one recipient is required."});
         return;
      }
      if (!subject || !message || emails.length === 0) {
         alert("Please fill in all fields and add at least one recipient.");
         return;
      }
      if (subject && message && emails.length > 0) {
         
         setFieldError({subject: "", recipient: "", message: ""});
         try {
            setLoading(true)
            const response = await axios.post(`${API_URL}/api/sendmail`, {
               subject,
               emails,
               message
            });
               setSubject("");
               setMessage("");
               setEmails([]);
               setFileKey((k) => k + 1);
            setActiveNav('history');
            alert(response.data.message);
         } catch (error) {
            alert(error.response?.data?.message || "Something went wrong");
            setActiveNav('compose');
         } finally {
            setLoading(false)
         }
      }
      
   };

   return (
      <>
      {activeNav !== 'history' ? 
      <section className="p-4 md:p-8" id="compose">
         <div className="mx-auto max-w-2xl rounded-xl border border-slate-200 bg-white p-6">
            <h1 className="mb-5 text-2xl font-extrabold">Compose bulk email</h1>

            <label htmlFor="sub" className="mb-2 block text-sm font-semibold">Subject <span>{fieldError.subject && <p className="text-red-500 text-sm">{fieldError.subject}</p>}</span></label>
            <input
               id="sub"
               value={subject}
               onChange={(e) => {
                  setSubject(e.target.value);
                  setFieldError({ ...fieldError, subject: "" });
               }}
               placeholder="e.g. October offers"
               className="mb-5 min-h-[48px] w-full rounded-lg border border-slate-300 px-3 text-sm"
               required
            />

            
            <label htmlFor="rec" className="mb-2 block text-sm font-semibold">Recipients <span>{fieldError.recipient && <p className="text-red-500 text-sm">{fieldError.recipient}</p>}</span></label>
            <input
               type="file"
               key={fileKey}
               onChange={handleFileChange}
               className="mb-5 block w-full cursor-pointer rounded-lg border border-slate-300 text-sm text-slate-600
             file:mr-4 file:cursor-pointer file:rounded-lg file:border-0
             file:bg-slate-800 file:px-5 file:py-3 file:font-semibold file:text-white
             hover:file:bg-slate-900"
            />
            <span className="block py-5 text-center mx-auto">(OR)</span>
            
            <div className="flex gap-2">
               <input
                  id="rec"
                  type="email"
                  value={recipient}
                  onChange={(e) => {
                     setRecipient(e.target.value)
                     setFieldError({...fieldError,recipient:""})
                  }
                  }
                  placeholder="Type an email"
                  className="min-h-[48px] flex-1 rounded-lg border border-slate-300 px-3 text-sm"
               />
               
               <button
                  type="button"
                  onClick={addEmail}
                  className="min-h-[48px] rounded-lg bg-slate-800 px-5 text-sm font-semibold text-white cursor-pointer"
               >
                  Add
               </button>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
               {recemails.map((email, i) => (
                  <span
                     key={email}
                     className="rounded-full bg-slate-200 px-3 py-1 text-sm font-semibold text-slate-800"
                  >
                     {email}
                     <button
                        type="button"
                        onClick={() => removeEmail(i)}
                        aria-label="Remove"
                        className="ml-2 cursor-pointer"
                     >
                        ×
                     </button>
                  </span>
               ))}
            </div>

            <p className="mb-5 mt-2 text-sm text-slate-600">
               Recipients added: <strong>{emails.length}</strong>
            </p>

            <label htmlFor="msg" className="mb-2 block text-sm font-semibold">Message             <span>{fieldError.message && <p className="text-red-500 text-sm">{fieldError.message}</p>}</span>
</label>
            <textarea
               id="msg"
               rows="6"
               value={message}
               onChange={(e) => {
                  setMessage(e.target.value)
                  setFieldError({...fieldError,message:""})
               }
               }
               placeholder="Write your email here..."
               className="mb-6 w-full rounded-lg border border-slate-300 p-3 text-sm"
               required
            />
            <button
               type="button"
               onClick={handleSend}
               className="min-h-[48px] rounded-lg bg-indigo-700 px-8 font-semibold text-white hover:bg-indigo-800 cursor-pointer"
            >
              {loading ? "Sending" : "Send mail"}
            </button>
         </div>
      </section> : <History /> }
      </>
   );
};

export default Compose;
