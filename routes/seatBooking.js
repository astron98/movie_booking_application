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
    console.log(details)
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
