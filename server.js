const express = require('express');

const fs = require('fs');


class Server {

	constructor() {
		
		this.server = express();



		this.server.get('/', (req, res) => {

			res.send(fs.readFileSync('./index.html', 'utf8'));

		});


		this.server.use('/js', express.static('./js'));

		this.server.use('/config.txt', express.static('./config.txt'));

		this.server.use('/write.php', express.static('./write.php'));

		this.server.use('/quizz.txt', express.static('./quizz.txt'));

		this.server.use('/css', express.static('./css'));

	}



	start(host, port) {

		this.server.listen(port, host, () => {

			console.log(`Listening on '${host}' on the port ${port}...`);

		});

	}

}



module.exports = new Server();

