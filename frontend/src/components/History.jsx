import React from "react"
import ReactDom from "react-dom"
import axios from "axios"
import { useState, useEffect } from "react"



const History = () => {
   const [records, setRecords] = useState([]);   // start with an empty list
   const [loading, setLoading] = useState(true);
   useEffect(() => {
      const getData = async () => {
         try {
            const res = await axios.get("http://localhost:5000/api/history");
            setRecords(res.data);
         } catch (err) {
            console.log(err);
         } finally {
            setLoading(false);
         }
      };
      getData();
   }, []);
   return (
      <section id="history" className="p-4 md:p-8">
         <div className="mx-auto max-w-2xl">
            <h1 className="mb-5 text-2xl font-extrabold">Email history</h1>
            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
               <table className="w-full min-w-[480px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs text-slate-600">
                     <tr>
                        <th className="px-4 py-3">Subject</th>
                        <th className="px-4 py-3">Recipients</th>
                        <th className="px-4 py-3">Success</th>
                        <th className="px-4 py-3">Failed</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Time</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                     {loading && (
                        <tr><td colSpan="6" className="px-4 py-4">Loading...</td></tr>
                     )}
                     {!loading && records.length === 0 && (
                        <tr><td colSpan="6" className="px-4 py-4">No history yet</td></tr>
                     )}
                     {records.map((item) => (
                        <tr key={item._id}>
                           <td className="px-4 py-4 font-semibold">{item.subject}</td>
                           <td className="px-4 py-4">{item.recipients}</td>
                           <td className="px-4 py-4">{item.successCount}</td>
                           <td className="px-4 py-4">{item.failedCount}</td>
                           <td className="px-4 py-4">
                              <span className={`rounded-full px-3 py-1 text-xs font-semibold `}>
                                 {item.mailstatus}
                              </span>
                           </td>
                           <td className="px-4 py-4">{item.sentTime}</td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      </section>
   );
};

export default History;