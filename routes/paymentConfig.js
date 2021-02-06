//backend-configuration for the  payment-gateway.
const sendEmail = require('./sendEmail.js');

let wallet={},
    savedCards={},
    promocodes={},
    totalAmount,totalAmount_copy;

exports.getPayment = function(req,res){
	let today = new Date();
	const userid = req.session.userid;

	let q1 = 'select wallet from customer where userid=?';
	let q2 = 'select * from savedCards where userid=?';
	let	q3 = "select * from promocode where validFrom <= DATE_FORMAT(?,'%Y-%m-%d')";	// ?=today

	const seatDetails = req.session.seatDetails;
	const totalSeatsBooked = parseInt(seatDetails.seats.length);
	const seatPrice = parseFloat(seatDetails.seatPrice);

	totalAmount = totalSeatsBooked*seatPrice;
	totalAmount_copy = totalAmount;

	//Wallet() is fetching the wallet balance.
	function Wallet() {
		return new Promise((resolve,reject)=>{
			connection.query(q1,[userid],(err,rows)=>{
				if(!err && rows.length>=0){
					resolve(rows);
				}
				else{
					reject(new Error('error in walletBalance query:\n '+ err));
				}
			});
		});
	}

	function SavedCards() {
		return new Promise((resolve,reject)=>{
			connection.query(q2,[userid],(err,rows)=>{
				if(!err && rows.length>=0){
					resolve({savedCards:rows});
				}
				else{
					reject(new Error('error in savedCards query:\n' + err));
				}
			});
		});
	}

	function Promocodes() {
		return new Promise((resolve,reject)=>{
			connection.query(q3,[today],(err,rows)=>{
				if(!err && rows.length>=0){
					resolve({promocodes:rows});
				}
				else{
					reject(new Error('error in promocode query:\n'));
				}
			});
		});
	}

	async function results(){
		try{
			[wallet,savedCards,promocodes] = await Promise.all([Wallet(),SavedCards(),Promocodes()]);
			wallet = JSON.parse(JSON.stringify(wallet));
			savedCards = JSON.parse(JSON.stringify(savedCards));
			promocodes = JSON.parse(JSON.stringify(promocodes));
			console.log("debugging the paymentConfig.js code...\n",JSON.stringify(wallet),"\n",JSON.stringify(savedCards),"\n",JSON.stringify(promocodes),"\n total:",totalAmount,"\n userid value:",userid);
			res.render('payments.ejs',{wallet,savedCards,promocodes,totalAmount});
		} catch(err){
			console.log('error in the paymentConfig.js file-code!\n',err);
		}
	}

	results();	// calling the asynchronous function.
}


//post route for /payments.
exports.postPayment = function(req,res){

	//storing all the paymentDetails from the frontend.
	const pay = {
		selectedMethod: req.body.payment,           // "cards" or "wallet"
		partialBilling: req.body.partialBilling,	// value is either "on"(not selected) or "allow"(selected).
		selectedCard: req.body.savedCards,
		cardNumber: req.body.cardNumber,
		expiryMonth: req.body.expiryMonth,
		expiryYear: req.body.expiryYear,
		cardCVV: req.body.cardCVV,
		promocode: req.body.promocode
	}
    
    let cards =[];
     Array.prototype.push.apply(cards,(savedCards.savedCards));  //creating a local obj for the global obj. "savedCards"
    console.log("type of selectedCard: ",typeof(pay.selectedCard)," .. ",pay.selectedCard,",\ncards:",JSON.stringify(cards)," \n");
    let oldCardBal = 0;
    if(pay.selectedCard != "-1"){
    	oldCardBal = Number(cards[pay.selectedCard].balance);
    }else {
    	oldCardBal = 0;
    } 
    console.log("value of oldCardBal:",oldCardBal," ....\n");
	let newCardBal=0;    //total balance in the new card.
    let walletBal = Number(wallet[0].wallet);   //creating a local obj for the global obj. "wallet"
    let promocode = JSON.parse(JSON.stringify(promocodes.promocodes));
	
	console.log("\nwalletBal: ",walletBal);
	console.log("\n promocode: ",JSON.stringify(promocode));
		   
    //Part 0: apply promocode.
    function applyPromo(){
    	return new Promise((resolve,reject)=>{
    		if(pay.promocode.length>0){
				let flag=0,i=0;
				for (i = 0; i < promocode.length; i++) {
				    //console.log(promocode[i].promocode);
				    if (pay.promocode == promocode[i].promocode) {
				        flag = 1;
				        break;
				    }
				}
				if (flag == 1) {
				    totalAmount -= Number(promocode[i].discount);
				    resolve();
				} else{
					//return redirect('back');
					reject(new Error('error while applying Promocode...\n'));
				}
			}
			else
				resolve();
    	});
    }
    
    //Part 1: for only "new-cards" (verify the new Cards throught validCards table.)
    function verifyNewCard(){
    	return new Promise((resolve,reject)=>{
    		if(pay.selectedCard=="-1"){
				let newcardQ = 'select * from savedCards where cardNo = ?';
				connection.query(newcardQ,[pay.cardNumber],(err,rows)=>{
					if(!err && rows.length>0){
				        //valid card.
						if(pay.expiryMonth==rows[0].month && pay.expiryYear==rows[0].year && pay.cardCVV == rows[0].cvv){

							//low balance in the new card.(considering the partial-billing factor)
							if((totalAmount>rows[0].balance && pay.partialBilling!="allow") || (totalAmount>rows[0].balance && pay.partialBilling=="allow" && (totalAmount-wallet[0].wallet)>row[0].balance))
							{	
								return res.redirect(406,'back');	// sending back "Not Accceptable" 406 status code.
								reject();
							}
							else {
								//update the userid for the newly-added card.
								newCardBal = Number(rows[0].balance);
								connection.query(`update savedCards set userid=? where cardNo=${pay.cardNumber}`,[req.session.userid],(err,rows)=>{
									if(err){
										return res.redirect('back');
										reject(new Error("error in the (paymentConfig.js) update-query...\n",err));
									}
									else
										resolve();
								});
							}
						}
					}
					else {
				        //(invalid card,since no such cards are found!)
						return res.redirect('back');
						reject(new Error("no such newCard are found in the db...\n"));
					}
				});
			}
			else
				resolve();
    	});
    }
    
    

    //Part 2: updating all the variables for "newCardBal/oldCardBal/walletBal"
    
    let flagWallet=0,flagCard=0; 
    function updateBalance(){
    	return new Promise((resolve,reject)=>{
    		//for partial billing.
			if(pay.partialBilling=="allow"){
				if(pay.selectedCard=="-1"){
				    //selected card is a new-card.
				    if(totalAmount<=walletBal){
				        walletBal -= totalAmount;
				        flagWallet=1;
				    }
				    else {
				        totalAmount -=walletBal;
				        walletBal=0;   //all the balance of wallet is used. 
				        flagWallet=1;
				        newCardBal -=totalAmount;
				        flagCard=1;
				    }
				}
				else{
				    //selected card is a savedCard(or oldCard)
				    if(totalAmount<=walletBal){
				        walletBal -= totalAmount;
				        flagCard=1;
				    }
				    else {
				        totalAmount -=walletBal;
				        walletBal=0;   //all the balance of wallet is used. 
				        flagWallet=1;
				        newCardBal -=totalAmount;
				        flagCard=1;
				    } 
				}    
			}
			else {
				// Here partial billing isn't allowed.
				//for the selected billing: (wallets/cards)
				if(pay.selectedMethod=="cards"){
				    if(pay.selectedCard=="-1"){
				        if(totalAmount<=newCardBal){
				            newCardBal -= totalAmount;
				            flagCard=1;
				        }
				        else    
				            reject(new Error("low balance in the newCard!\n"));
				    }
				    else{
				        if(totalAmount<=oldCardBal){
				            oldCardBal -= totalAmount;
				            flagCard=1;
				        }
				        else    
				           	reject(new Error("low balance in the oldCard!\n"));
				    }
				}
				else{
				    //for wallets.
				    if(totalAmount<=walletBal){
				            walletBal -= totalAmount;
				            flagCard=1;
				        }
				        else    
				            reject(new Error("low balance in the wallet!\n"));
				}
			}

			if(flagCard==1 || flagWallet==1)
				resolve();
    	});
    }
    
   let rid;

   //generating a unique-key. for rid(receipt id)
   function uniqueKey(length){
   		return new Promise((resolve,reject)=>{
			var result           = '';
			var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
			var charactersLength = characters.length;
			for ( var i = 0; i < length; i++ ) {
			  result += characters.charAt(Math.floor(Math.random() * charactersLength));
			}
			if(result.length==10) //&& arr.length==seats.length)
			{
				resolve(result);
				console.log("generated unique key: ",result);
			}
   		});
   }
   
   
   let arr=new Array();
   function createArr(){
   		return new Promise((resolve,reject)=>{
   			// making the 2D array for booked_details.
   			const seats = req.session.seatDetails.seats;
   			for(let i=0;i<seats.length;i++){
   				arr.push([rid,seats[i]]);
   			}
   			
   			if(arr.length == seats.length)
   				resolve();
   		});	
   }
   
   	function updateWallet(){
   		return new Promise((resolve,reject)=>{
   			//Part 3: deducting the balance from the wallet/cards.
			
			let updateWallet = "update customer set wallet=? where userid = ?";
			
		
			if(flagWallet==1){
				flagWallet=0;
				connection.query(updateWallet,[walletBal,req.session.userid],(err,rows)=>{
				    if(!err){
						//if(err) throw err;
				        console.log("balance got deducted from *Wallet* successfully!\n");
				        resolve();
				        
				    } else {
				        reject("error while deducting the balance from wallet...\n",err);
				    }
				});
			}
			else 
				resolve();
   		});
   	}
   	
   	function updateCard(){
   		return new Promise((resolve,reject)=>{
   			let updateCardBal = "update savedCards set balance=? where cardNo = ?";
   			if(flagCard==1){
				flagCard=0;
				let currCardBal = (pay.selectedCard=="-1")? newCardBal:oldCardBal;
				console.log("currCardBal value: ",currCardBal,"\ncardNo:",pay.cardNumber,"\n");
				connection.query(updateCardBal,[currCardBal,pay.cardNumber],(err,rows)=>{
				    if(!err){
					//if(err) throw err;
						
				        console.log("balance got deducted from *card* successfully!\n");
				        resolve();
				    } else{
				        reject("error while deducting the balance from card...\n",err);
				    }
				});
			}
			else 
				resolve();
   		});
   	}

	let bookedDetails = {};
    function updateDb(){
    	return new Promise((resolve,reject)=>{
    	
			//Part 4: update booked-details table.(booking history.)
			bookedDetails = {
				rid: rid,
				userid: req.session.userid,
				mname: req.session.mname,
				hid: req.session.movie_details.hid,
				tid: req.session.movie_details.tid,
				amount: totalAmount_copy,
				city: req.session.city,
				mtiming: req.session.movie_details.mtiming,
				mdate: req.session.movie_details.mdate
			}

			//sending the ticket through email.
			let email = {
				emailList: bookedDetails.userid,
				subject: `Here is you Tickets for "${bookedDetails.mname}".`,
				body: `
						<div class="card" style="width: 18rem;border:3px solid grey; background: #b08ae6;">
							<!-- <img class="card-img-top" src="..." alt="Card image cap"> -->
							<div class="card-body">
							<h5 class="card-title"> <b>BookThatShow</b></h5>
							<p class="card-text"><b>movie name:</b> ${bookedDetails.mname}<br>
								<b>ticket id:</b> ${bookedDetails.rid}<br>
								<b>hall id:</b> ${bookedDetails.hid}<br>
								<b>theatre id:</b> ${bookedDetails.tid}<br>
								<b>movie time:</b> ${bookedDetails.mtiming}<br>
								<b>movie date:</b> ${bookedDetails.mdate}<br>
							</p>
							</div>
						</div>
						<hr>
						<p><strong>Note: Reach to the venue around 20 minutes before the show.</strong></p>	
					  `
			}

			sendEmail.sendEmail(email)
			.then((emailResults)=>{
				console.log(emailResults);
				
			})
			.catch((err)=>{console.log(err)});
			
			console.log("bookedDetails: ",JSON.stringify(bookedDetails),"\n");
			let insertQuery = "insert into booked_details set ?";
			connection.query(insertQuery,[bookedDetails],(err,rows)=>{
		   		if(err){
		   			reject(new Error("err while inserting into booked_details...\n",err));
		   		}
		   		else{
		   			console.log("booked_details table updated successfully!\n");
					let seatsUpdate = 'insert into rcs(rid,sid) values ?'; 
					console.log("\n printing arr array: ",arr);   		
					connection.query(seatsUpdate,[arr],(err,rows)=>{
						if(!err){
							console.log("rcs-table updated successfully!\n");
							resolve();
						} else {
							reject(new Error("err while inserting into rcs-table...\n",err));
						}
					});
				}
			});
    	});
	}
	
	let u1,u2,u3;	//not needed...
	//part 5: Calling the finalResult() function.
    async function finalResult(){
    	try{
    		console.log("entered the finalResult() func...\n\n")
    		await applyPromo();
			await verifyNewCard();
			[u1,rid,u2,u3] = await Promise.all([updateBalance(),uniqueKey(10),updateCard(),updateWallet()]);
			await createArr();
			await updateDb();	//updateDB and sendTickets through email.
			res.render('tickets.ejs',{data:bookedDetails});
    	} catch(err) {
    		console.log("error in the finalResult() function...\n",err);
    		//return res.redirect('back');
    	}	
    }
    
    finalResult();	//calling the async func.

}
