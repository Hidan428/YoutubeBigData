const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const fs = require('fs');
const sql = require('./sql');

let sess;

class Server {

	constructor() {
		
		this.server = express();
		this.server.use(session({secret: 'ytb-big-data'}));
		this.server.use(bodyParser.json());
		this.server.use(bodyParser.urlencoded({extended: true}));

		this.server.get('/', (req, res) => {
			sess = req.session;
			res.send(fs.readFileSync('./view/index.html', 'utf8'));

		});

		this.server.get('/loged', (req,res) => {
			sess = req.session;
			if(sess.email) {
			    res.end('Already');
			}
			else {
				res.end('done');
			    
			}
		});
		this.server.post('/login', (req, res) => {
			sess = req.session;
			sql.selectUser(req.body.email,req.body.pass,(data) =>{
				if (typeof data[0] !== "undefined")
				{
					sess.email = req.body.email;
					res.end('done');
				}
				else{
					res.end('Erreur');
				}
			});
		});

		this.server.get('/logout',(req,res) => {
			req.session.destroy(function(err) {
			  if(err) {
			    console.log(err);
			  } else {
			    res.end('done');
			  }
			});
		});


		this.server.use('/js', express.static('./js'));

		this.server.use('/config.txt', express.static('./model/config.txt'));

		this.server.use('/write.php', express.static('./model/write.php'));

		this.server.use('/quizz.txt', express.static('./model/quizz.txt'));

		this.server.use('/css', express.static('./css'));

	}



	start(host, port) {

		this.server.listen(port, host, () => {

			console.log(`Listening on '${host}' on the port ${port}...`);

		});

	}

}



module.exports = new Server();

