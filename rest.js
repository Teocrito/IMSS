var mysql = require('mysql');
var path = require('path');
var express = require('express');

function REST_ROUTER(router, connection, md5) {
	var self = this;
	self.handleRoutes(router, connection, md5);
}

REST_ROUTER.prototype.handleRoutes = function(router, connection, md5) {
	router.get('/IMSS', function(req, res){
		router.use(express.static(__dirname + ''));
		res.sendFile(path.normalize(__dirname + '/index.html'));
	});
	router.get('/IMSS/registro', function(req, res){
		router.use(express.static(__dirname + '../../'));
		res.sendFile(path.normalize(__dirname + '/registro.html'));
	});
	router.get('/IMSS/citas', function(req, res){
		router.use(express.static(__dirname + '../../'));
		res.sendFile(path.normalize(__dirname + '/datosCita.html'));
	});
	router.post("/IMSS/registro", function(req, res){
		var query = "INSERT INTO afiliados VALUES(0, ?, ?, ?, ?, ?, ?, ?, ?);";
		var table = ["idAfiliado", "contraseña","numeroAfiliacion","nombre","primerApellido","segundoApellido","telefono","email","idHospital"];

		query = mysql.format(query, table);
		connection.query(query, function(err, rows){
			if(err) {
				res.json({"Error" : true,
						"Message" : "Error executing Query"
				});
			} else{
				res.json({"Error" : false,
						"Message" : "Usuario registrado"
				});
			}
		});
	});
}

module.exports = REST_ROUTER;