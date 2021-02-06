const user = require('./routes/login.js');
const movies = require('./routes/movies.js');
const theatre = require('./routes/theatre.js');
const seatBooking = require('./routes/seatBooking.js');
const paymentConfig = require('./routes/paymentConfig.js');
const otp = require('./routes/otp.js');
const bookedHistory = require('./routes/bookingHistory.js');
const sendEmail = require('./routes/sendEmail.js');

const express = require('express');
require('dotenv').config()		//configure the env-variables
const helmet = require('helmet');
const app = express();
const mysql = require('mysql');
const path = require('path');
var session = require('express-session');
// const bcrypt = require('bcrypt');
// const salthRounds = 10;

// connecting to redis for session storage.
const redis = require('redis');
const redisStore = require('connect-redis')(session);
const client = redis.createClient();




app.use(express.json())
app.use(express.urlencoded());
app.use(helmet.noSniff());



// var req.session = user.req.session;


// --------------------- Database Connection--------
var connection = mysql.createConnection({
	host : process.env.DB_HOST,
	user : process.env.DB_USER,
	password : process.env.DB_PASS,
	database : 'booking_movies'
});
module.exports = connection;

connection.connect((err)=>{
	if(!err){
		console.log("The database is connected...");
	} else {
		console.log("Database error: "+err);
	}
});
global.connection = connection;
// --------------------- end of the Database connection-------------


//------- setting paths for ejs and for /public-folder.
app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,'/public')));
//app.use(express.static(__dirname + '/public'));
//-------------------------------end--------------------------------


//---------- login-session---------------------
app.use(session({
	secret: process.env.REDIS_SECRET_KEY,
	cookie: {
		httpOnly:true,
		secure:false,
		sameSite:true,
		maxAge: 86400000
	},
	store: new redisStore({
		host:'localhost',
		port: 6379,
		client: client,
		ttl: 86400
	}),
	resave: false,
	saveUninitialized: false
}));

function authChecker(req, res, next) {
    console.log("checking the authentication.....\n session-id:",req.session.id);

    if (req.session.loggedin) {
        next();
    } else {
       res.render("login.ejs",{message:"please login!"});
    }
}


app.get('/template',(req,res,err)=>{
		res.render('template.ejs');
});
app.get('/login',user.login);
app.post('/login',user.loginPost);

app.get('/signup',user.signup);
app.post('/signup',user.signupPost);
// app.get('/verify',(req,res)=>{
// 	res.render("verify.ejs",{msg:""});
// });
app.get('/verify/',otp.verifyOtp);

//checking for the authentication before loading the data from any of the below routes.
app.use(authChecker);
//-------------end-----------------------------

app.get('/logout',user.logout); //call for logout

//movies page.
app.get('/movies',movies.get_movies);

//list of theatres.
app.get("/theatres/:_mid",theatre.getTheatres);

/* route for selecting the seats. */
app.get('/seats/:hid/:tid/:mtiming/:mdate',seatBooking.seatBooking);


app.get('/city',movies.getCity);

app.post("/changeCity",(req,res)=>{
    req.session.city = req.body.city;
    console.log("updated city name: "+req.session.city);
    req.session.save(function(err) {
        console.log('new city saved?!');
      });
});

app.get('/seatPrices',seatBooking.seatPrices);
app.post('/seatDetails',seatBooking.seatDetails);

app.get('/payments',paymentConfig.getPayment);
app.post('/payments',paymentConfig.postPayment);

/* Deprecated Route: (/tickets is not needed.)*/
// app.get('/tickets',(req,res,next)=>{
//     console.log("booked=Details:  in the /tickets route... ",JSON.stringify(paymentConfig.bd));
// //	let data = JSON.parse(JSON.stringify(paymentConfig.bd));
    
//     res.render('template.ejs',{data:paymentConfig.bd});
// });

app.get('/bookedHistory',bookedHistory.bookedHistory);

/* route for the homepage. */
app.get('/home',(req,res,err)=>{
	var message = "Welcome, Back";
	// if(err){
	// 	console.log("ERROR in GET (/home): \n",err);
	// 	res.redirect('error.ejs');
	// } else {
	console.log("session details: \n"+JSON.stringify(req.session));
	if(req.session.loggedin)
		res.render('homepage.ejs',{message:"Welcome, Back "+ req.session.name+"!\n"});
	else
		res.render('login.ejs',{message:"you aren't logged-in.."});
	// }
});


app.get('/profile',(req,res,err)=>{
	const userid = req.session.userid;
	let sql1 = `select name,DATE_FORMAT(dob, "%Y-%m-%d") as dob,address from customer where userid=?`;
	// DATE_FORMAT(date, "%Y-%m-%d")
	// var user = {};
	connection.query(sql1,userid,(err,results)=>{
		if(!err && results.length>0){
			let user = {
				name: results[0].name,
				dob: results[0].dob,
				address: results[0].address

			};
			res.render('profile.ejs',{user:user});
		}else{
			console.log("error in /profile while querying: \n",err);
			res.render('profile.ejs',{user:user});
		}
	});
});


app.post('/profile/edit',(req,res)=>{
	let user={
		name: req.body.name,
		dob:	req.body.dob,
		address: req.body.address,
		userid:req.session.userid
	};
	console.log(user);

	let sql1 = "update customer set name=?,dob=?,address=? where userid=?;";
	connection.query(sql1,[user.name,user.dob,user.address,user.userid],(err,results)=>{
		if(!err && results.affectedRows>0){
			console.log(user.userid+": details updated successfully!");
			res.redirect('/profile');
		} else {
			console.log("error in /profile/edit while updating: \n",err);
			res.render('profile.ejs',{user:user});
		}
	});
});


app.post('/password_reset',(req,res)=>{
	let t = {
		old_pass : req.body.pold,
		userid : req.session.userid,
		new_password : req.body.pnew //retrieving the new password.
	};
	console.log(t);
	//verification of the old password
	let sql1 = "select password from customer where userid=?";
	connection.query(sql1,[t.userid],(err,results)=>{
		if(!err && results.length>0){
			let password = results[0].password;
			if(t.old_pass!=password){
				console.log("wrong old_password!Type again!");
				res.redirect('back'); //redirecting to the previous http request.
			} else {

				let sql2 = "update customer set password=? where userid=?";
				connection.query(sql2,[t.new_password,t.userid],(err,results)=>{
					if(!err && results.affectedRows>0){
						console.log(t.userid+": password updated successfully!");
					} else {
						console.log("error in /password_reset while updating password: \n",err);
					}
					res.redirect('/profile'); //redirect to /profile
				});
			}
		} else {
			console.log("error in the sql1 query of /password_reset:\n",err);
			res.redirect('back'); //redirect to the previous route.
		}
	});

});


/* code for starting the server at port=3000. */
const port = process.env.SERVER_PORT;
app.listen(port,()=>{
	console.log(`Server started on port ${port}! \n`);
});

module.exports = {app};

exports.serverPort = port;