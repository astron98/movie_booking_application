exports.getTheatres = function(req,res){
//    let date_format = "DATE_FORMAT(release_date,"%Y-%m-%d")";
    let _mid = req.params._mid;
    console.log("session: ",JSON.stringify(req.session))
    let city = req.session.city;
    console.log("_mid: "+_mid,", city:",city);
    if(city===""){
        res.redirect("back");
    }
   const rows={};
    // res.render('theatre',{rows:rows});
    let sql = 'select theatre.tname,timings.timing,hall.tid,hall.hid,DATE_FORMAT(hall.screening_date,"%Y-%m-%d") as screening_date from theatre inner join hall using(tid) inner join timings using(time_id) where theatre.city=? and hall._mid=? group by concat(theatre.tname,hall.tid,screening_date,hall.hid,timings.timing)';
    connection.query(sql,[city,_mid],(err,rows)=>{
        if(!err){
            console.log(rows);
            res.render('theatre.ejs',{rows:rows,city_name:city});
        } else {
            console.log("err at /theatres: \n",err);
            res.redirect('back');
        }
            
    });
    
};