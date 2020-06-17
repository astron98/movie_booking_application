const sendEmail = require('./sendEmail.js');
/*
for future improvements also use timer and total attempts.
function(email,attempts,time){}

*/
async function sendOtp(email,generatedOtp){
	try{
		generatedOtp.code = await getRandom();
		
		
		email.body = `<p>OTP for the user:${email.emailList} is: <strong> ${generatedOtp.code} </strong></p>`;
		
		sendEmail.sendEmail(email)
			.then(function(info){
				console.log("Information of the sent email:\n",info);
				return generatedOtp;
			})
			.catch(function(error){
				console.log("error while sending the OTP:\n",error);
			})
	} catch(error) {
		console.log(error);
	}
	
}	

function getRandom(){
	return new Promise((resolve,reject)=>{
		min = Math.ceil(400000);
		 max = Math.floor(999999);
		 resolve(Math.floor(Math.random() * (max - min)) + min);
	}) 
}

async function saveOtp(req,generatedOtp){
	try{
		let time = new Date();
		time.setMinutes(time.getMinutes() + 15);
		const otp = {
			validOtp: generatedOtp,
			exp: time
		}
		req.session.otp = JSON.parse(JSON.stringify(otp)); 
		console.log("otp: ",JSON.stringify(otp))
		req.session.save((error)=>{
			if(error){
				console.log(error);
				return error;
			}
			else	
				return "saved";
		});
	} catch(err) {
		console.log(err);
	}		
}

exports.verifyOtp = function(req,res){
	const enteredOtp = parseInt(req.body.enteredOtp);
	console.log("enteredotp:",req.body.enteredOtp);
	const validOtp = req.session.otp.validOtp;
	let currTime = new Date();
	console.log("is the entered otp correct",enteredOtp==validOtp,"enteredOtp",enteredOtp)
	if(enteredOtp == validOtp){ //&& req.session.otp.exp.getTime() > currTime.getTime()){
		req.session.verifyEmail = true;
		req.session.save((err)=>{
			if(!err)
				res.json({isValid: true});
			else
				console.log(err);
		})
	}
	else{
		res.json({isValid: false});
	}
}

exports.sendOtp = sendOtp;
exports.saveOtp = saveOtp;