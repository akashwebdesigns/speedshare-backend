const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const File = require("../models/file");
const { v4: uuid4 } = require("uuid");
const sendEmail = require("../services/mailService.js");

//Multer Config
//storing details about the file
let storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"), //where the file will be stored in disk
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

let upload = multer({ storage, limits: { fileSize: 1000000 * 100 } }).single(
  "myfile"
); //100mb size max and name attribute from frontend form should be named 'myfile

router.post("/", (req, res) => {
  if(!req.file){
    return res.json({error:"Please select a file"});
  }
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).send({ error: err.message });
    }
      const file = new File({
          filename: req.file.filename,
          uuid: uuid4(),
          path: req.file.path,
          size: req.file.size
      });
      const response = await file.save();
      res.json({ file: `${req.protocol}://${req.get("host")}/files/${response.uuid}` });
    });
});

router.post("/send", async (req, res) => {
  const { uuid, emailTo, emailFrom } = req.body;
  if (!uuid || !emailTo || !emailFrom) {
    return res
      .status(422)
      .send({ error: "All fields are required except expiry." });
  }
  // Get data from db
  try {
    const file = await File.findOne({ uuid: uuid });
    if (file.sender) {
      return res.status(422).send({ error: "Email already sent once." });
    }
    file.sender = emailFrom;
    file.receiver = emailTo;
    const response = await file.save();
    // send mail
    await sendEmail({
      from: emailFrom,
      to: emailTo,
      subject: "SpeedShare file sharing",
      text: `${emailFrom} shared a file with you.`,
      html: require("../services/emailTemplate.js")({
        emailFrom,
        downloadLink: `${req.protocol}://${req.get("host")}/files/${file.uuid}`,
        size: parseInt(file.size / 1000) + " KB",
        expires: "24 hours",
      }),
    });
    res.status(200).json({ success: true, message: "Email Sent" });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: "Something went wrong." });
  }
});

module.exports = router;
