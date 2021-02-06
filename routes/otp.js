const sendEmail = require('./sendEmail.js'),
	  app = require('../app.js');
const connection = require('../app.js');

/*
for future improvements: also use timer and total attempts.
function(email,attempts,time){}

*/
async function sendOtp(email,req){
	try{
		
		let generatedOtp = await getRandom();
		
		let url = `${req.protocol}://${req.hostname}:${app.serverPort}/verify?code=${generatedOtp}`;
		email.body = `	<h2>Greetings from <strong>BookThatShow</strong></h2><br>
						<p>
						<h4>Here, is the verification link for your EmailID. Please, click on it to verify the EmailID.</h4>
						<br>
						<a href="${url}">${url}</a>
						</p>`;
		
		Promise.all([sendEmail.sendEmail(email),saveOtp(generatedOtp,req)])
			.then(function(results){
				console.log("Information of the sent link to email & savedOtp:\n",results);
				return generatedOtp;
			})
			.catch(function(error){
				console.log("error while sending the OTP:\n",error);
			});
	} catch(error) {
		console.log(error);
	}
	
}	

function getRandom(){
	return new Promise((resolve,reject)=>{
		min = Math.ceil(400000);
		 max = Math.floor(999999);
		 resolve(Math.floor(Math.random() * (max - min)) + min);
	}); 
}

async function saveOtp(generatedOtp,req){
	try{
		let time = new Date();
		time.setMinutes(time.getMinutes() + 15);
		let newOtp = {
			generatedOtp: generatedOtp,
			exp: time,
			verified: false
		}
		// if(!req.session.otps){
		// 	//there are no OTPs stored yet.
		// 	req.session.otps = new Array();
		// 	req.session.otps.push(newOtp);
		// }
		// else {
			//Already the 'otps' array is present in the session, so directly push the newOtp to the array.
		req.session.otp = JSON.parse(JSON.stringify(newOtp));
		// }

		console.log("otp object: ",newOtp);
		req.session.save((error)=>{
			if(error){
				console.log(error);
				return error;
			}
			else	
				return "otpSaved";
		});
	} catch(err) {
		console.log(err);
	}		
}

exports.verifyOtp = function(req,res){
	const enteredOtp = parseInt(req.query.code);
	console.log("enteredotp:",req.query.code);

	let validOtp = Object.assign({},JSON.stringify(req.session));
	console.log("generatedOtp:",JSON.stringify(req.session));
	// console.log(req.session.otps,",validOtps:",validOtps);
	let currTime = new Date();
	let result = {
		isValid: false,
		msg: ""
	}
	let i=0;
	
	try{
	// let fetchOtpFromRedis = async ()=>{
		// for(i=0;i<validOtps.length;i++){
		// 	if(validOtps[i][1].generatedOtp == enteredOtp){
		// 		let temp = new Date(validOtps[i][1].exp)
		// 		if(temp.getTime() > currTime.getTime() && validOtps[i][1].verified==false){
		// 			result.isValid = true;
		// 			result.msg = "OTP is Valid & verified.";
		// 			return true;
		// 		}
		// 		else{
		// 			result.msg = "Verification Link Expired! \n"; 
		// 			return false;
		// 		}
		// 		// break;
		// 	}
		// }

		let temp = new Date(validOtp.exp);
		if(validOtp.generatedOtp == enteredOtp){
			if(temp.getTime() > currTime.getTime() && validOtp.verified==false){
				result.isValid = true;
				result.msg = "OTP is Valid & verified.";
				// return true;
			}
			else{
					result.msg = "Verification Link Expired! \n"; 
					// return false;
				}
		}
		else {
			result.msg = "Invalid verification-Link."
		}
	// }
	// fetchOtpFromRedis()
	// .then((ans)=>{

	// })
	// .catch((error)=>{

	// });
	console.log("is the entered otp correct",enteredOtp==validOtp.generatedOtp,"enteredOtp:",enteredOtp);

	if(result.isValid){
		req.session.otp.verified = true;	//make the verified-key value true in session object.

		//store the signup details in the db.
		let copy = req.session.user;
		let sql1  = 'insert into customer (name,userid,password,dob,address,aadhar_id,contact,verified) values();';
		let arr = [copy.name,copy.userid,copy.password,
					copy.dob,copy.address,copy.aadhar_id,
					copy.contact,true
					];
		connection.query(sql1,[arr],(err,results)=>{
			if(err){
				console.log("error while saving signup-details: \n",err);
				res.render('signup.ejs',{user:user,message:"check the details"});
			} else {
				console.log('successfully signed up & verified!');
				copy = null;	//deleting the user-object,coz its not required now.
				req.session.save((err)=>{
					if(!err)
						res.render("login.ejs",{message:result.msg});
					else
						console.log(err);
				});
				// next();
				// return true;
				//res.end();
				// res.redirect('/home',{message:"s"});
				//res.redirect('/login'); 
			}
		});
	}
	else{
		res.json(result);
	}
	
	} catch(error) {
		console.log(error);
	}
	
}

exports.sendOtp = sendOtp;
exports.saveOtp = saveOtp;
