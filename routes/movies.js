//require('connection');
exports.get_movies = function(req,res){
let sql = 'select _mid,title,DATE_FORMAT(release_date,"%Y-%m-%d") as release_date,link,image,lang,genre from movies';
//let movies = {
//    _mid : movies[0]._mid,
//    title: movies[0].title,
//    link: "https://www.imdb.com/title/"+ movies[0].link,
//    image: movies[0]
//    lang : movies[0].lang,
//    
//};
  connection.query(sql,function(err,rows) {
    
    if(!err && rows.length>0) {
        res.render('movies.ejs',{movies:rows});   
        
    } else {
       console.log("/movies route: \n",err);
        res.redirect(400,'back');
    }
  });
};


/* retrieving all the cities. (ajax request from the frontend.)*/
exports.getCity = function(req,res){
    var city = "select distinct city from theatre";
    connection.query(city,(err,rows)=>{
        console.log(rows);
        if(!err && rows.length>0){
//            rows = JSON.stringify(rows);
//            console.log(rows,"\n JSON.parse: ",JSON.parse(rows))
            rows.push(req.session.city);
            console.log("printing all the current and selected cities...\n",rows,"\n\n")
            res.json(rows);
        } 
        else{
            console.log(err);
        }
    });
};



