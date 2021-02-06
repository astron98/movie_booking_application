require('dotenv').config();

exports.aadhar = function(aadharid){
    
    
    return new Promise((resolve,reject)=>{
        var unirest = require("unirest");

        var req = unirest("POST", "https://aadhaarnumber-verify.p.rapidapi.com/Uidverify");


        /*
            aadhar card examples: 206222101293
            valid : 776968182745
        */
        req.query({
            "uidnumber": aadharid,
            "clientid": "111",
            "method": "uidverify",
            "txn_id": "123456"
        });

        req.headers({
            "x-rapidapi-host": "aadhaarnumber-verify.p.rapidapi.com",
            "x-rapidapi-key": process.env.RAPID_API_KEY,
            "content-type": "application/x-www-form-urlencoded"
        });

        req.form({});

        const aadhar_results = {};
        req.end(function (res) {
            if (res.error){
                //throw new Error(res.error);
                reject(res.error);
            } 
            console.log(res.body);
            //aadhar_results = res.body;
            resolve(res.body);
        });

    });

}
