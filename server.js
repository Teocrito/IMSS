var express 	= require("express");
var mysql		= require("mysql");
var bodyParser 	= require("body-parser");
var md5			= require("md5");
var rest		= require("./rest.js");
var app 		= express();
var cors 		= require('cors');

function REST(){
	var self = this;
	self.connectMySQL();
};

REST.prototype.connectMySQL = function() {
	var self = this;
	var pool = mysql.createPool({
		connectionLimit : 500,
		host			: 'localhost',
		user			: 'root',
		password 		: '',
		database		: 'IMSS',
		debug			: false
	});
	pool.getConnection(function(err, connection){
		if(err) {
			self.stop(err);
		} else{
			self.configureExpress(connection);
		}
	});
}

REST.prototype.configureExpress = function(connection) {
	var self = this;
	app.use(bodyParser.urlencoded( {
		extended : true
	}));
	app.use(cors());
	app.use(bodyParser.json());
	var router = express.Router();
	app.use('/', router);
	var rest_router = new rest(router, connection, md5);
	self.startServer();
}

REST.prototype.startServer = function() {
	app.listen(3000, function() {
		console.log("Listening on port: 3000");
	});
}

REST.prototype.stop = function(err) {
	console.log("Error on connection: " + err);
	process.exit(1);
}

new REST();