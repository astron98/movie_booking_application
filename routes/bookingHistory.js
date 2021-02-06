// const connection = require("../app");

exports.bookedHistory = function(req,res,next) {
    let query = `select * from booked_details where userid = ?`;

    connection.query(query,[req.session.userid],(err,rows)=>{
        if(!err) {
            res.json(JSON.stringify(rows));
        }
        else {
            console.log(err);
            res.redirect('back');
        }
    });
}