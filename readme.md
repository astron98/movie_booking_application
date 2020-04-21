# Movie Booking web-app.
---

### Steps for the preinstallation:
1. install nvm https://www.sitepoint.com/quick-tip-multiple-versions-node-nvm/
2. install nodejs(version=10.17.0) using nvm.  
	(command: `nvm install 10.17.0`)  
3. **install mysql (version = 10.17.0)**  
	sources:  
			1.https://www.digitalocean.com/community/tutorials/how-to-install-mysql-on-ubuntu-16-04  
			2. https://blog.zedfox.us/install-mysql-5-7-windows-10/  
4. install redis server.  
  1. **Steps(windows 10):**  
   1. https://github.com/microsoftarchive/redis/releases/download/win-3.0.504/Redis-x64-3.0.504.zip) (download this zipfile)  
   2. follow the instructions from this site from step 2:  
	 https://riptutorial.com/redis/example/29962/installing-and-running-redis-server-on-windows  
	
  2. **for Linux(ubuntu):** https://codeforgeek.com/node-js-redis-tutorial-installation-commands/  
   			
---
### Installation  

1. Complete the **_preinstallations steps mentioned above_**.   
2. `git clone <this repository link on the right corner> `  
3. `cd se_project`  
4. `npm install`	_(it will install all the required dependencies present in the 'package.json' file.)_  
5. **Configuration (database)**  

	**In the 'app.js' file update the following line according to your 'password'**  

    host: 'localhost',  
    user: 'root',	//mysql username  
    password : ' ',	// type the mysql password which you have set.  
    database:'booking_movies'	// mysql database name  
    
6. Open a new-terminal and start the redis-server.  
	Commands:   
		```
		1. redis-server &  
		2. redis-cli  
		```
7. And now open another terminal for starting the nodejs server.  
	Commands
		1. `nodemon app.js`	(the server will start at port:3000)  
8. Open your Browser
	And type: `localhost:3000/home`  
---

### Versions of all the tools.  
	Note:All the '*' must have the mentioned version installed in your computer.   
	
	*mysql = 5.7.29	  
	*nodejs = 10.17.0  
	 redis = 3.0.6  

---
### command to stop the redis-server(for linux only.)  
	`/etc/init.d/redis-server stop`  

### command to list all the redis keys  
1. `keys *`  
2. `get <keyname(session)>`  

