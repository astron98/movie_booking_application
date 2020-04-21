# Movie Booking web-app.  

### Steps for the preinstallation:
1. install nvm source:https://www.sitepoint.com/quick-tip-multiple-versions-node-nvm/
2. install nodejs(version=10.17.0) using nvm.(command: `nvm install 10.17.0`)  
3. **install mysql (version = 10.17.0)**  
	sources:a.https://www.digitalocean.com/community/tutorials/how-to-install-mysql-on-ubuntu-16-04  
		b. https://blog.zedfox.us/install-mysql-5-7-windows-10/  
4. **Install redis server**.  
  	a. **for windows 10:**  
   	   i. https://github.com/microsoftarchive/redis/releases/download/win-3.0.504/Redis-x64-3.0.504.zip) (download this zipfile)   
           ii. follow the instructions from this site from step 2:  
	      https://riptutorial.com/redis/example/29962/installing-and-running-redis-server-on-windows  
	
  	b. **for Ubuntu:** https://codeforgeek.com/node-js-redis-tutorial-installation-commands/  
   			
---
### Installation  

1. Complete the **_preinstallations steps mentioned above_**.   
2. `git clone <this repository link on the right corner> `  
3. `cd movie_booking_application `  
4. `npm install`	_(it will install all the required dependencies present in the 'package.json' file.)_  
5. **In the 'app.js' file update the following lines(for Mysql) according to your 'password'**  

    host: 'localhost',  
    user: 'root',	//mysql username  
    password : ' ',	// type the mysql password which you have set.  
    database:'booking_movies'	// mysql database name  
    
6. Open a new-terminal(1st) and start the redis-server.  
	1. `redis-server &`  
	2. `redis-cli`  
7. And now open another terminal(2nd) for starting the nodejs server.  
	Command: `nodemon app.js`	(Now,the server will start at port:3000)  
8. Lastly,open your Browser and enter this URL: `localhost:3000/home`  
---

### Version of all the softwares.  
	Note:All the '*' must have the mentioned version installed in your computer.   
	
	*mysql = 5.7.29	  
	*nodejs = 10.17.0  
	 redis = 3.0.6  

---
## Useful Commands.
### command to stop the redis-server(for linux only.)  
	`/etc/init.d/redis-server stop`  

### command to list all the redis keys  
1. `keys *`  
2. `get <keyname(session)>`  

