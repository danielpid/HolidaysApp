- #0 package.json
+ #1 client/
	- ##1.0 package.json
    - ##1.1 index.html
	+ ## 1.2 app/
		+ ### 1.2.1 common/
		    - #### 1.2.1.1 app.js
			- #### 1.2.1.2 security.js
		+ ### 1.2.2 components/
			+ #### 1.2.2.1 navbar/
			    - ##### 1.2.2.1.1 navbar.html
				- ##### 1.2.2.1.2 navbar.js
		+ ### 1.2.3 states/
		    + #### 1.2.3.1 dashboard/
			+ #### 1.2.3.2 user/
			    - ##### 1.2.3.2.1 user.js
				- ##### 1.2.3.2.2 userDataService.js
				+ ##### 1.2.3.2.3 login/
				    - ###### 1.2.3.2.3.1 login.html
				    - ###### 1.2.3.2.3.2 login.js
+ #2 server/
	- ##2.0 package.json
    - ##2.1 mean_template.js
    + ##2.2 lib/
	    - ###2.2.1 express.js
		- ###2.2.2 convert.js
		- ###2.2.3 settings.js
		+ ###2.2.8 routes/
			- ####2.2.8.1 apiIndex.js
			- ####2.2.8.2 staticFiles.js
		    + ####2.2.8.9 api/
			    - #####2.2.8.9.1 rolesApi.js
				- #####2.2.8.9.1 usersApi.js
			    + #####2.2.8.9.9 util/
				    - ######2.2.8.9.9.1 crudApi.js
		+ ###2.2.9 data/
		    - ####2.2.9.1 rolesData.js
			- ####2.2.9.2 usersData.js
			+ ####2.2.9.9 util/
			    - #####2.2.9.9.1 crudData.js
				- #####2.2.9.9.1 mongodb.js
