require('dotenv').config();
const nodeMailer = require('nodemailer');

function sendEmail(email){
    return new Promise((resolve,reject)=>{
        
        

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
            from: process.env.EMAIL_ID, // sender emailID
            to: email.emailList,        // list of receiving email-IDs
            subject: email.subject,     // Subject line
            html: email.body            // html body
        };

        transporter.sendMail(mailOptions, (error, info) => {
                  if (error) {
                      reject(error);
                  }
                  else{
                    console.log('Message %s sent: %s', info.messageId, info.response);
                    resolve(info);
                  }
                  });
            });
}

exports.sendEmail = sendEmail;