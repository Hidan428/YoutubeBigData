const express = require('express');

const fs = require('fs');

let data;

class Config {

	constructor() {
		data = fs.readFileSync("./config.txt", 'utf8');
		console.log("test");
	}

	afficher()
	{
		console.log(data);
	}
	
}

module.exports = new Config();