const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);
const History = require("./models/Email");
const Admin = require("./models/Admin");

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL }));
const PORT = process.env.PORT || 5000;
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({
    email: email,
    password: password,
  });
  if (admin) {
    res.json({ message: "Login successful..." });
  } else {
    res.status(401).json({ message: "Login failed..." });
  }
});

//send mail by using nodemailer
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
transporter.verify((error) => {
  if (error) console.log("SMTP FAILED:", error.message);
  else console.log("SMTP OK");
});

const now = new Date().toLocaleDateString("en-IN").replace(/\//g, "-");
app.post("/api/sendmail", async (req, res) => {
  const { subject, message, emails } = req.body;
   let sent = 0;
   const failed = [];
  
   for (let i = 0; i < emails.length; i++) {
     try {
       await transporter.sendMail({
         from: process.env.EMAIL_USER,
         to: emails[i],
         subject: subject,
         text: message,
         html: `<h2>${subject}</h2><p>${message}</p>`,
       });
        sent++;
        
     } catch (error) {
       console.log("Failed for", emails[i], error.message);
       failed.push(emails[i]);
     }
   }
   let mailstatus;

   if (sent === 0) {
     mailstatus = "failed";
   } else if (failed.length > 0) {
     mailstatus = "partial";
   } else {
     mailstatus = "success";
   }
   
   try {
     await History.create({
       subject: subject,
       message: message,
       recipients: emails.length,
       successCount: sent,
       failedCount: failed.length,
       mailstatus: mailstatus,
       sentTime: now,
     });
   } catch (error) {
     console.log("History save failed:", error.message);
   }
   //console.log(res.data)
   return res.status(sent === 0 ? 500 : 200).json({
     message: `${sent} of ${emails.length} email(s) sent`,
     mailstatus,
     failed,
   });
  
});

app.get("/api/history", async (req, res) => {
   const history = await History.find();
   res.set("Cache-Control", "no-store");
   return res.json(history);
})
