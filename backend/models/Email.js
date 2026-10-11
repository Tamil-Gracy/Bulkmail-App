const mongoose = require("mongoose");
const emailsSchema = new mongoose.Schema(
  {
    subject: String,
    message: String,
    recipients: Number,
    successCount: Number,
    failedCount: Number,
    mailstatus: String, // "success" | "partial" | "failed"
    sentTime: { type: Date, default: Date.now },
  },
  { collection: "emailHistory" },
);
const Emails = mongoose.model("Emails", emailsSchema);
module.exports = Emails;