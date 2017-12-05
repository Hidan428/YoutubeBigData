const mysql = require('mysql')

var connection;

class MySQL {
	
	constructor() {
		connection = mysql.createConnection({
		  	host: 'localhost',
		  	user: 'root',
		  	password: '',
		  	database: 'YoutubeBigData'
		})
		connection.connect(function(err) {
			if (err) throw err
			console.log('You are now connected...')
		})
	}
	createDB(){
		connection.query('CREATE TABLE login(id int primary key, email varchar(255), password varchar(255))', function(err, result) {
	    if (err) throw err
		    connection.query('INSERT INTO login (email, password) VALUES (?, ?)', ['test@gmail.com', 'youtube'], function(err, result) {
		      if (err) throw err
			      connection.query('SELECT * FROM login', function(err, results) {
			        if (err) throw err
			        console.log(results[0].id)
			        console.log(results[0].email)
			        console.log(results[0].password)
		      })
		    })
		  }) 
	}
	selectUser(email, password,cb)
	{
		connection.query('SELECT * FROM login WHERE email = \'' + email + '\' AND password = \'' + password + '\'', function(err, results) {
			if (err) throw err
				console.log(results[0].email);
			if(results[0].email)
			{
				cb("USER");
			}
		})
	}
}

module.exports = new MySQL();