const nodemailer = require('nodemailer');
const name = 'mr cho';

const transporter = nodemailer.createTransport({
    service:"outlook",
    auth: {
      user: "kinslycho237@outlook.com",
      pass: "Atenchong237@"  
    }
});


const options = {
    from: "kinslycho237@outlook.com",
    to: "chokinsly237@gmail.com",
    subject: name,
    text: "wow it works"
}

transporter.sendMail(options,function(err,info){
  if(err){
    console.log(err);
    return;
  }
  console.log("Sent : " + info.response);

})
