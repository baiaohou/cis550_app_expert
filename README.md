# CIS550-Project: App Expert

## How to run the codes?

1. Build a local MySQL database and the relevant tables, using the .sql files in the code file submitted to Canvas. **Inserting corresponding data is also required**. However, data is too big to submit to Canvas, so please be sure to contact our team members for the data.  
Please execute the .sql files and insert the corresponding data  in the following order:  
(1) app_detail, then insert the data  
(2) app_review, then insert the data  
(3) package_info, then insert the data  
(4) genre, then insert the data  
(5) has_genre, then insert the data  
(6) user  
(7) follow  
(8) wishlist  
(9) user_review  
(10) materialized_view    
**Please feel free to contact our team if you meet any trouble.**
2. Add a file called db-config.js in the server directory, and include the information of your local MySQL database in this file, using the format below  
`module.exports = {  
host: "127.0.0.1",  
port: "3306",  
user: "root",  
password: "<password>",  
database: "<database_name>",  
charset : 'utf8mb4'  
};`  
3. cd to the server directory, do "npm install"
4. cd to the client directory, do “npm install”
5. cd to the server directory, do "npm start" to start the back-end server
6. cd to the client directory, do “npm start” to start the front-end server  
7. You may use the following initial accounts in our database to directly log into our website and begin testing. You may also create your own ones on our website.    
account: baiaohou@gmail.com  
password: 123  
account: xueningz@gmail.com  
password: 123  
account: zimaow@gmail.com  
password: 123  
account: hanli@gmail.com  
password: 123  
account: didi@gmail.com  
password: 123  

## Team members

Baiao Hou (baiaohou@seas.upenn.edu)  
Xuening Zhang (xueningz@seas.upenn.edu)  
Zimao Wang (zimaow@seas.upenn.edu)  
Han Li (baiaohou@seas.upenn.edu)
