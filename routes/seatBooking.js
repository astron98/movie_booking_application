/* /seats/:hid/:tid/:mtiming/:mdate  */




exports.seatBooking = function(req,res){
	let details = {
		hid: req.params.hid,
		tid: req.params.tid,
		mtiming: req.params.mtiming,
		mdate: req.params.mdate
};
	//saving the movie_details in the current-session.
	req.session.movie_details = details;
    console.log(details);
     req.session.save(function(err){
         if(!err){
        console.log('movie details saved!');
         } else {
             console.log(err);
             res.redirect("back");
         }
      });

     

	let sql = "select rcs.rid,rcs.sid from booked_details  inner join rcs using(rid) where (booked_details.hid=? and booked_details.tid=? and booked_details.mtiming=? and booked_details.mdate=?);";
	// let arr = [];
	// arry.push([,]);
	connection.query(sql,[details.hid,details.tid,details.mtiming,details.mdate],function(err,rows){
		if(!err && rows.length>=0){
			console.log("printing all the bookedseats: \n",rows);
			res.render('seats.ejs',{bookedSeats:rows});
		} else{
			console.log(err);
			res.redirect('back');
		}
	});
}

exports.seatPrices = function(req,res){
	let time = [
		"none",
		"08:00-11:30",
		"12:00-15:30",
		"16:00-19:30",
		"20:00-23:30"
	];
	let time_id;
	
	let timeVal = new String(req.session.movie_details.mtiming);
	console.log("timeVAL : "+timeVal.toString());
	for(let i=1;i<time.length;i++){
		if(((timeVal).trim()).localeCompare(time[i])==0)
		{	
			time_id = i;
			break;
		}	  
	}
	console.log("time_id value: "+time_id);

	let q1 = 'select gold_price,plat_price from hall where hid=? and tid=? and time_id=? and screening_date=?';
	connection.query(q1,[req.session.movie_details.hid,req.session.movie_details.tid,time_id,req.session.movie_details.mdate],function(err,rows){
		if(!err && rows.length>=0){
			console.log("printing all the seatPrices: \n",rows);
			res.json(rows);
		}
		else{
			console.log(err);
			res.redirect('back');
		}
	});	

};

exports.seatDetails = function(req,res){
	req.session.seatDetails = req.body.seatDetails;
	console.log("updated bookedseats details:\n"+JSON.stringify(req.session.seatDetails));
	req.session.save(function(err){
         if(!err){
        	console.log('Seat-details saved!');
         } else {
             console.log(err);
             res.redirect("back");
         }
      });
};	


/*
exports.booked_details = function(req,res){
	let details = req.session.details;

	// let arr = [];
	// arry.push([,]);
	// for(let i;i<rows.length;i++){
	// 	arr.pusj([]);
	// }

	console.log(details);
	

	//  (cid,mname,hid,tid,amount,city,mtiming,mdate)
	let sql = 'insert into booked_details  set ?';
	connection.query(sql,,(err,rows)=>{

	});
}

*/
