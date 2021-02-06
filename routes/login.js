const aadhar_f = require('./aadhar.js');
const sendEmail = require('./sendEmail.js');
const otp = require('./otp.js');

// const axios = require('axios');
// axios.defaults.baseURL = "http://localhost:3000";

exports.signupPost = function(req,res,next){
	// var email_regex  = "^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$";
	// var password_regex = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})";
	// if(req.method=="POST"){
		const user = {
			name: req.body.userName,
			userid: req.body.email,
			password: req.body.password,
			dob: req.body.dob,
			address: req.body.addr,
			aadhar_id: req.body.aadhar_id,
			contact: req.body.contact
		};
		req.session.user = user;
		
		//validating the aadhar number:
		//1. check if same aadhar card is already present or not
		//2. check if the aadhar card is valid or not
    
	async function check_aadhar(aadhar_id){ 
		let results;
		let msg="";
		try{
			results = await aadhar_f.aadhar(aadhar_id);
			//console.log(JSON.stringify(results));
			if(results["Succeeded"]!=null) {
				msg = true;
			} else {
				msg = false;   
			}
			//console.log(msg);
			return msg;
		}catch(err){
			console.log(err)
		}    
	}

	//validating the email address by sending the otp to it.
	async function verifyEmail(){
		try{
			let email = {
				emailList: user.userid,
				subject: `EmailID Verification for Ticket Booking Site!`,
				body: ``
			}

			await otp.sendOtp(email,req);
			return "otpSent";
		} catch(error) {
			console.log(error);
			return error;
		}
	}


	async function final(){
		try{
			const [aadharVerify,emailVerify] = await Promise.all([check_aadhar(user.aadhar_id),verifyEmail()]);
			console.log([aadharVerify,emailVerify]);
			if(aadharVerify==false || emailVerify!="otpSent"){
				let msg = "";
				if(aadharVerify==false && emailVerify!="otpSent")
					msg = `aadhar & email are invalid`;
				else if(!aadharVerify)
					msg = "aadhar is invalid";
				else 
					msg = "email is invalid";		
				res.render("signup.ejs",{user:user,message:msg});
			} 
			else {
				//console.log(JSON.stringify(user));
				// var sql1  = 'insert into customer set ?';
				// // var array = [user.name,user.userid,user.password,user.dob,user.address,user.aadhar_id,user.contact];
				// connection.query(sql1,user,(err,results)=>{
				// 	if(err){
				// 		console.log("error while signup: \n",err);
				// 		res.render('signup.ejs',{user:user,message:"check the details "});
				// 	} else {
				// 		console.log('successfully signed up!');
				// 		// next();
				// 		return true;
				// 		//res.end();
				// 		// res.redirect('/home',{message:"s"});
				// 		//res.redirect('/login'); 
				// 	}
				// });

				// aadhar verified and email-verification link sent.
				res.send("<h2>A Verification link has been sent to your email.</h2><br><h3>Click on that link to verify.</h3>");
			}
		} catch(err) {
			console.log(err);
		}
	}	

	final();
}

exports.signup = (req,res)=>{
	res.render("signup.ejs",{message:""});
};


exports.loginPost = function(req,res){
	// if(req.method=='POST'){
		// var user = req.params.user;
		// var user{

		// }
		var user = req.body.userName;
		console.log("the user is: ",user);

		var userid = req.body.userid;
		var password = req.body.password;

		var verify = 'select * from booking_movies.'+ user+ ' where userid = ?';

		connection.query(verify,[userid],function(err,results){
			if(!err  && results.length>0){
				var userid1 = results[0].userid;
				var password1 = results[0].password;

				console.log("userid: ",userid1,", passowrd: ",password1);

				if(userid==userid1 && password==password1 && results[0].verified == true){
					req.session.loggedin = true;
					req.session.userid = userid1;
					//req.session.user = results;
					req.session.name = results[0].name;
					console.log("The current logged in userid:",JSON.stringify(req.session.userid));
					res.redirect('/home');
				} else {
					let msg = (results[0].verified)? "wrong credentials" : "Email not verified!";
					res.render('login.ejs',{message:msg});
				}
			} else {          //if(err || results.length==0)
				console.log("Issues in mysql-query for login-check or no such user found! \n",err);
				res.render('login.ejs',{message:"wrong credentials"});
			}
		});

}

exports.login = (req,res)=>{
	// if(!err)
	if(!req.session.loggedin)
	{
		res.render('login.ejs',{message:'Please Login!'});
	} else {
		res.render('homepage.ejs');
	}
	// else
	// 	console.log("error at /login GET-Request: \n",err);
}

exports.logout = (req,res)=>{
	if(req.session.loggedin){
	req.session.destroy(function(err){
			res.render("login.ejs",{message:"You are Logged out! Please login again."});
	});
	}else{
		res.render('/home');
	}

};
