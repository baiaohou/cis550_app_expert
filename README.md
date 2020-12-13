# cis550_app_expert

## How to run the codes?

1. build a local MySQL database and the relevant tables, following the schemas shown in the project report  
2. add a file called db-config.js in the server directory, and include the information of your local MySQL database in this file, using the format below  
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
