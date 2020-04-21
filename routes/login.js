const aadhar_f = require('./aadhar.js');


exports.signupPost = function(req,res){
	// var email_regex  = "^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$";
	// var password_regex = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})";
	// if(req.method=="POST"){
		var user = {
			name: req.body.userName,
			userid: req.body.email,
			password: req.body.password,
			dob: req.body.dob,
			address: req.body.addr,
			aadhar_id: req.body.aadhar_id,
			contact: req.body.contact
		};
		//validating the aadhar number:
		//1. check if same aadhar card is already present or not
		//2. check if the aadhar card is valid or not
    
//        async function myAsyncFunction() {
//          try {
//            const result = await somethingThatReturnsAPromise();
//
//            console.log(result);
//          } catch (error) {
//            console.log(error);
//          }
//        }
        async function check_aadhar(aadhar_id,user){
            // NOTE: use the try-catch block 
             
            let results = await aadhar_f.aadhar(aadhar_id);
            let msg="";
            try{
                console.log(JSON.stringify(results));
                if(results["Succeeded"]!=null) {
                    msg = true;
                } else {
                    msg = false;   
                }
                
                console.log(msg);
//                msg = msg.toString();
                //if(msg.includes("not Valid")){
                if(msg==false){
                    res.render("signup.ejs",{user:user,message:"aadhar is invalid"});
                } 
                //else if(msg.includes("Valid")){
                else if(msg){
                    console.log(JSON.stringify(user));

                    // var  sql1 = `insert into customer (name,userid,password,dob,address,aadhar_id,contact) values(?,?,?,?,?,?,?);`;
                    var sql1  = 'insert into customer set ?';
                    // var array = [user.name,user.userid,user.password,user.dob,user.address,user.aadhar_id,user.contact];
                    connection.query(sql1,user,(err,results)=>{
                        if(err){
                            console.log("error while signup: \n",err);
                            res.render('signup.ejs',{user:user,message:"check the details "});
                        } else {
                            console.log('successfully signed up!');
                            // res.redirect('/home',{message:"s"});
                            res.redirect('/login');
                        }
                    });
                }
            }catch(err){
                console.log(err)
            }
            
              
        };
        
    check_aadhar(user.aadhar_id,user);

		//validating the email address by sending the otp to it.


		//validating the phone number by sending the otp to it.

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

				if(userid==userid1 && password==password1){
					req.session.loggedin = true;
					req.session.userid = userid1;
					//req.session.user = results;
					req.session.name = results[0].name;
					console.log("The current logged in userid:",JSON.stringify(req.session.userid));
					res.redirect('/home');
				} else {
					var message = 'Wrong Credentials!';
					res.render('login.ejs',{message:message});
				}
			} else {          //if(err || results.length==0)
				console.log("Issues in mysql-query for login-check! \n",err);
				res.render('login.ejs',{message:"check your credentials"});
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
