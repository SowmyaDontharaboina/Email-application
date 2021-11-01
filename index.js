const express = require('express');
const nodemailer = require("nodemailer");
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

const fs = require('fs');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.get('/', (req, res) => {
    //res.send('Hello World!')
    res.sendFile(process.cwd() + "/public/index.html");
})

app.get('/list_movies', (req, res) => {
   fs.readFile(__dirname + '/' + 'movies.json', 'utf8', (err, data) => {
    res.send(data);
   })
})

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", //replace with your email provider
    port: 587,
    auth: {
      user: "",//username
      pass: "",//password
    },
    // secure: true, // true for 587, false for other ports
    // requireTLS: true,
});

// verify connection configuration
transporter.verify(function(error, success) {
    if (error) {
        console.log(error);
    } else {
        console.log("Server is ready to take our messages");
    }
});

app.post('/send',(req,res) => {
    console.log('Got body:', req.body);
    // res.sendStatus(200);
    //You can configure the object however you want
    const mail = {
        from: '@gmail.com', //gmail
        to: req.body.to,
        subject: req.body.subject,
        text: req.body.body,
        html: req.body.body, // html body
      };
      transporter.sendMail(mail, (err,data) => {
        if (err) {
            console.log(err);
            res.status(500).send("Something went wrong.");
        } else {
            res.status(200).send("Email successfully sent to recipient!");
        }
      })
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})