var mysql = require('mysql');
var path = require('path');
var express = require('express');

function REST_ROUTER(router, connection, md5) {
	var self = this;
	self.handleRoutes(router, connection, md5);
}

REST_ROUTER.prototype.handleRoutes = function(router, connection, md5) {
	router.get('/IMSS', function(req, res){
		router.use(express.static(__dirname));
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
	router.get('/IMSS/admin', function(req, res){
		router.use(express.static(__dirname + '/'));
		res.sendFile(path.normalize(__dirname + '/administracion.html'));
	});
	router.post("/IMSS/registrar", function(req, res){
		var afiliacion 	= req.body.af;
		var nombre 		= req.body.name;
		var aP 			= req.body.aP;
		var aM			= req.body.aM;
		var telefono 	= req.body.tel;
		var clinica		= req.body.clinica;
		var correo		= req.body.correo;
		var pass 		= req.body.pass;
		var values 		= `'${pass}', '${afiliacion}', '${nombre}', '${aP}', '${aM}', '${telefono}', '${correo}', ${clinica}`;
		var query = `INSERT INTO afiliados(contrasenia, numeroAfiliacion, nombre, primerApellido, segundoApellido, telefono, email, idHospital) VALUES(${values});`;
		connection.query(query, function(err){
			if(err) {
				res.json({error:"Es posible que el número de afiliación, correo o teléfono ya están registrados. Verifica tus datos"});
			} else{
				res.json({reg:true});
			}
		});
	});
	router.post("/IMSS/logIn", function(req, res){
		var user = req.body.user;
		var pass = req.body.pass;
		if (usr == 'admin' && pass == 'admin'){
			res.json({admin:true});
			return
		}
		if (user && pass) {
			
			var query = `SELECT * FROM afiliados WHERE numeroAfiliacion LIKE '${user}' OR telefono LIKE '${user}' OR email LIKE '${user}'`;
			connection.query(query,function(err,rows){
				if (err){
					res.json(err);
				}else{
					if (Array.isArray(rows)){
						if (rows.length == 1){
							if (rows[0].contrasenia == pass){
								res.json({log:true,usrId:rows[0].idAfiliado,hosp:rows[0].idHospital});
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
			
		var query = `SELECT DATE_FORMAT(cA.fecha, '%d/%m/%Y %H:%i') as "fecha", 
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
	router.post("/IMSS/getEspecialidades", function(req, res){
		var query = 'SELECT DISTINCT nombre, idEspecialidad as "id" FROM especialidades';
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
	router.post("/IMSS/getClinicaUsuario", function(req, res){
		var user = req.body.user;
		var query = `SELECT CONCAT(h.calle," #",h.numeroExterior,", ",h.colonia) as "direccion" FROM afiliados a 
INNER JOIN hospitales h ON a.idHospital=h.idHospital WHERE idAfiliado=${user}`;
		connection.query(query,function(err,rows){
			if (err){
				res.json({err:true});
			}else{
				if (Array.isArray(rows)){
					res.json(rows[0].direccion);
				}else{
					res.json({err:true});
				}
			}
		});
	});
	router.post("/IMSS/horariosDisponibles", function(req, res){
		var fecha = req.body.fecha;
		var hosp = req.body.hosp;
		var esp = req.body.esp;
		var query = `SELECT h.horario FROM horarios h WHERE (SELECT COUNT(ca.idCita) FROM citasAfiliados ca WHERE 
(SELECT a.idHospital FROM afiliados a WHERE a.idAfiliado = ca.idAfiliado) = ${hosp} and ca.especialidad = ${esp} and 
DATE_FORMAT(ca.fecha, '%H:%i') LIKE TIME_FORMAT(h.horario,'%H:%i') and DATE_FORMAT(ca.fecha, '%e/%m/%Y') LIKE '${fecha}')
 < (SELECT COUNT(d.idDoctor) FROM doctores d WHERE  d.idHospital= ${hosp} and d.especialidad = ${esp})`;
		connection.query(query,function(err,rows){
			if (err){
				res.json({err:true,msg:'No se pudo conectar con el servidor'});
			}else{
				if (Array.isArray(rows)){
					res.json(rows);
				}else{
					res.json({err:true,msg:'No hay horarios disonibles para esa fecha'});
				}
			}
		});
	});
	router.post("/IMSS/agendarCita", function(req, res){
		var user = req.body.user;
		var fecha = req.body.fecha;
		var f = fecha.substr(0,10);
		var f = f.split('-');
		f = new Date(f[1]+'-'+f[2]+'-'+f[0]);
		var esp = req.body.esp;
		var hosp = req.body.hosp;
		var query = `INSERT INTO citasAfiliados (idAfiliado,fecha,especialidad,doctor) VALUES (${user},TIMESTAMP('${fecha}'),${esp},
(SELECT idDoctor FROM doctores WHERE idHospital=${hosp} and idDoctor not in (SELECT DISTINCT doctor FROM citasAfiliados ca WHERE 
especialidad=${esp} and (SELECT idHospital FROM afiliados a WHERE a.idAfiliado = ca.idAfiliado) = ${hosp}) LIMIT 1))`;
console.log(query);
		hoy = new Date(Date.now);
		mes = ((Number(hoy.getMonth())+3) < 12)?(Number(hoy.getMonth())+3):(Number(hoy.getMonth())+3-12)
		limite = new Date(mes+'-'+hoy.getDate()+'-'+hoy.getFullYear());
		if (f > hoy && f < limite){
			connection.query(query,function(err,rows){
				if (err){
					res.json({err:true,msg:'Error al realizar el registro. Intenta mas tarde.'});
				}else{
					res.json({err:false});
				}
			});
		}else{
			res.json({err:true,msg:'Datos invalidos.'});
		}
	});
}

module.exports = REST_ROUTER;