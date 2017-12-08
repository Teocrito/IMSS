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
	router.post("/IMSS/registrar", function(req, res){
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
	router.post("/IMSS/logIn", function(req, res){
		var user = req.body.user;
		var pass = req.body.pass;
		if (user && pass) {
			
			var query = `SELECT * FROM afiliados WHERE numeroAfiliacion LIKE '${user}' OR telefono LIKE '${user}' OR email LIKE '${user}'`;
			connection.query(query,function(err,rows){
				if (err){
					res.json(err);
				}else{
					if (Array.isArray(rows)){
						if (rows.length == 1){
							if (rows[0].contrasenia == pass){
								res.json({log:true,usrId:rows[0].idAfiliado});
							}else{
								res.json({log:false})
							}

						}else{
							res.json({log:false});
						}
					}else{
						res.json({log:false});
					}
				}
			});
		}else{
			res.json({log:false});
		}
	});
	router.post("/IMSS/getCitas", function(req, res){
		var user = req.body.user;
			
		var query = `SELECT DATE_FORMAT(cA.fecha, '%d/%m/%Y') as "fecha", 
CONCAT(d.primerApellido," ",d.segundoApellido," ",d.nombre) as "doctor",
e.nombre as "especialidad" FROM citasAfiliados cA
INNER JOIN especialidades e ON cA.especialidad = e.idEspecialidad 
INNER JOIN doctores d ON cA.doctor = d.idDoctor
WHERE idAfiliado = ${user};`;
		connection.query(query,function(err,rows){
			if (err){
				res.json({err:true});
			}else{
				if (Array.isArray(rows)){
					res.json(rows);
				}else{
					res.json({err:true});
				}
			}
		});
	});
	router.post("/IMSS/getInfoCitas", function(req, res){
		var user = req.body.user;
		var query = 'SELECT DISTINCT nombre, idEspecialidad as "id" FROM especialidades';
		var esp;
		var dir;
		connection.query(query,function(err,rows){
			if (err){
				res.json({err:true});
			}else{
				if (Array.isArray(rows)){
					esp = rows;
				}else{
					res.json({err:true});
				}
			}
		});
		query = `SELECT CONCAT(h.calle," #",a.numeroExterior,", ",h.colonia) as "direccion" 
FROM afiliados a INNER JOIN hospitales h ON a.idHospital = h.idHospital WHERE idAfiliado=${user}`;
		/*connection.query(query,function(err,rows){
			if (err){
				res.json({err:true});
			}else{
				if (Array.isArray(rows)){
					dir = rows[0].direccion;
				}else{
					res.json({err:true});
				}
			}
		});*/
		res.json(esp);
	});
}

module.exports = REST_ROUTER;