require('dotenv').config()

function sendEmail(email){
    return new Promise((resolve,reject)=>{
        
        const nodeMailer = require('nodemailer');

        //-------------------------nodeMailer-------------------------
        const transporter = nodeMailer.createTransport({
        //    host: 'smtp.gmail.com',
        //    port: 465,
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_ID,
                pass: process.env.EMAIL_PASS
            }
        });
        
        let mailOptions = {
          from: process.env.EMAIL_ID, // sender address
                to: email.emailList, // list of receivers
                subject: email.subject, // Subject line
//                text: text, // plain text body
                html: email.body // html body
        };

        transporter.sendMail(mailOptions, (error, info) => {
                  if (error) {
                      reject(error);
                  }
                  else{
                  console.log('Message %s sent: %s', info.messageId, info.response);
                  resolve(info);
                     // res.render('index');
                  }
                  });
            });
}

exports.sendEmail = sendEmail;