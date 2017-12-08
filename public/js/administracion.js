function show(opcion){
	document.getElementById(opcion).classList.toggle('hidden');
}

function mostrar(opcion){
	document.getElementById('regClin').classList.add('hidden');
	document.getElementById('regDoc').classList.add('hidden');
	document.getElementById('regAfi').classList.add('hidden');
	document.getElementById('modAfi').classList.add('hidden');
	document.getElementById('delAfi').classList.add('hidden');
	document.getElementById('delDoc').classList.add('hidden');
	document.getElementById(opcion).classList.toggle('hidden');
}

function newClinica(){
	var colonia 	= document.getElementById('col').value;
	var calle		= document.getElementById('calle').value;
	var numero		= document.getElementById('no').value;
	var ajax = new XMLHttpRequest();
	ajax.onreadystatechange = function(){
		if(this.status == 200 && this.readyState == 4){
			var datos = JSON.parse(this.responseText);
			if(datos.reg){
				msgAlrt(datos.reg)
			}else{
				msgErr(datos.error)
			}
		}
	};
	ajax.open('POST', 'http://127.0.0.1:3000/imss/regClinica');
	ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	dts = 'col='+colonia+'&calle='+calle+'&numero='+numero;
	ajax.send(dts);
}

function newAfiliado(){
	var afiliacion 	= document.getElementById('noAfiliacionRegAfi').value;
	var nombre 		= document.getElementById('nombreRegAfi').value;
	var aPaterno	= document.getElementById('aPaternoRegAfi').value;
	var aMaterno	= document.getElementById('aMaternoRegAfi').value;
	var telefono	= document.getElementById('telefonoRegAfi').value;
	var clinica		= document.getElementById('clinicaRegAfi').value;
	var correo		= document.getElementById('correoRegAfi').value;
	var pass 		= document.getElementById('passRegAfi').value;
	var pass2		= document.getElementById('pass2RegAfi').value;
	if(pass==pass2){
		var ajax = new XMLHttpRequest();
		ajax.onreadystatechange = function (){
			if (this.status == 200 && this.readyState == 4){
				var datos = JSON.parse(this.responseText);
				if (datos.reg){
					msgAlrt(datos.reg)
				}else{
					msgErr(datos.error)
				}
			}
		};
		ajax.open('POST','http://127.0.0.1:3000/imss/regAfiliado');
		ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		dts = 'af='+afiliacion+'&name='+nombre+'&aP='+aPaterno+'&aM='+aMaterno+'&tel='+telefono+'&clinica='+clinica+'&correo='+correo+'&pass='+pass;
		ajax.send(dts);
	}else{
		msgErr("Las contraseñas no coinciden.");
	}
}

function newDoctor(){
	var nombre 	= document.getElementById('nombreRegDoc').value;
	var primerA	= document.getElementById('aPaternoRegDoc').value;
	var segundoA= document.getElementById('aMaternoRegDoc').value;
	var hospital= document.getElementById('hospitalRegDoc').value;
	var esp		= document.getElementById('especialidadRegDoc').value;
	var cedula	= document.getElementById('cedulaRegDoc').value;
	var ajax = new XMLHttpRequest();
	ajax.onreadystatechange = function(){
		if(this.status == 200 && this.readyState == 4){
			var datos = JSON.parse(this.responseText);
			if(datos.reg){
				msgAlrt(datos.reg)
			}else{
				msgErr(datos.error)
			}
		}
	};
	ajax.open('POST', 'http://127.0.0.1:3000/imss/regDoctor');
	ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	dts = 'nombre='+nombre+'&pA='+primerA+'&sA='+segundoA+'&h='+hospital+'&e='+esp+'&c='+cedula;
	ajax.send(dts);

}

function buscarAfiliadoMod(){
	var noAfiliacion 	= document.getElementById('noAfiliacionModAfi').value;
	var ajax = new XMLHttpRequest();
	ajax.onreadystatechange = function(){
		if(this.status == 200 && this.readyState == 4){
			var datos = JSON.parse(this.responseText);
			if(datos.n){
				show('datosModAfi');
				cargarDatosAfiliadoMod(datos.n, datos.ap, datos.am, datos.t, datos.c, datos.h);
			}else{
				msgErr(datos.error)
			}
		}
	};
	ajax.open('POST', 'http://127.0.0.1:3000/imss/busqAfiliado');
	ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	dts = 'af='+noAfiliacion;
	ajax.send(dts);
}

function cargarDatosAfiliadoMod(n, ap, am, t, c, h){
	document.getElementById('nombreModAfi').value = n;
	document.getElementById('aPaternoModAfi').value = ap;
	document.getElementById('aMaternoModAfi').value = am;
	document.getElementById('telefonoModAfi').value = t;
	document.getElementById('clinicaModAfi').value = h;
	document.getElementById('correoModAfi').value = c;
}

function modAfiliado(){
	var noAfi 	= document.getElementById('noAfiliacionModAfi').value;
	var tel 	= document.getElementById('telefonoModAfi').value;
	var clinica = document.getElementById('clinicaModAfi').value;
	var correo  = document.getElementById('correoModAfi').value;
	var ajax = new XMLHttpRequest();
	ajax.onreadystatechange = function(){
		if(this.status == 200 && this.readyState == 4){
			var datos = JSON.parse(this.responseText);
			if(datos.mod){
				msgAlrt(datos.mod)
			}else{
				msgErr("No se pudo procesar la operación.")
			}
		}
	};
	ajax.open('POST', 'http://127.0.0.1:3000/imss/modAfiliado');
	ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	dts = 'af='+noAfi+'&tel='+tel+'&cli='+clinica+'&c='+correo;
	ajax.send(dts);
}

function buscarAfiliadoDel(){
	var noAfiliacion 	= document.getElementById('noAfiliacionDelAfi').value;
	var ajax = new XMLHttpRequest();
	ajax.onreadystatechange = function(){
		if(this.status == 200 && this.readyState == 4){
			var datos = JSON.parse(this.responseText);
			if(datos.n){
				show('datosDelAfi');
				cargarDatosAfiliadoDel(datos.n, datos.ap, datos.am, datos.t, datos.c, datos.h);
			}else{
				msgErr(datos.error)
			}
		}
	};
	ajax.open('POST', 'http://127.0.0.1:3000/imss/busqAfiliado');
	ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	dts = 'af='+noAfiliacion;
	ajax.send(dts);
}

function cargarDatosAfiliadoDel(n, ap, am, t, c, h){
	document.getElementById('nombreDelAfi').value = n;
	document.getElementById('aPaternoDelAfi').value = ap;
	document.getElementById('aMaternoDelAfi').value = am;
	document.getElementById('telefonoDelAfi').value = t;
	document.getElementById('clinicaDelAfi').value = h;
	document.getElementById('correoDelAfi').value = c;
}

function eliminarAfiliado(){
	var noAfiliacion = document.getElementById('noAfiliacionDelAfi').value;
	var ajax = new XMLHttpRequest();
	ajax.onreadystatechange = function(){
		if(this.status == 200 && this.readyState == 4){
			var datos = JSON.parse(this.responseText);
			if(datos.del){
				msgAlrt(datos.del)
			}else{
				msgErr("No se pudo procesar la operación.")
			}
		}
	};
	ajax.open('POST', 'http://127.0.0.1:3000/imss/delAfiliado');
	ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	dts = 'af='+noAfiliacion;
	ajax.send(dts);
}

function buscarDoctor(){
	var cedula 	= document.getElementById('cedulaDelDoc').value;
	var ajax = new XMLHttpRequest();
	ajax.onreadystatechange = function(){
		if(this.status == 200 && this.readyState == 4){
			var datos = JSON.parse(this.responseText);
			if(datos.n){
				show('datosDelDoc');
				cargarDatosDoctor(datos.n, datos.ap, datos.am, datos.e, datos.h);
			}else{
				msgErr(datos.error)
			}
		}
	};
	ajax.open('POST', 'http://127.0.0.1:3000/imss/busqDoctor');
	ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	dts = 'c='+cedula;
	ajax.send(dts);
}

function cargarDatosDoctor(n, ap, am, e, h){
	document.getElementById('nombreDelDoc').value = n;
	document.getElementById('aPaternoDelDoc').value = ap;
	document.getElementById('aMaternoDelDoc').value = am;
	document.getElementById('especialidadDelDoc').value = e;
	document.getElementById('hospitalDelDoc').value = h;
}

function eliminarDoctor(){
	var cedula = document.getElementById('cedulaDelDoc').value;
	var ajax = new XMLHttpRequest();
	ajax.onreadystatechange = function(){
		if(this.status == 200 && this.readyState == 4){
			var datos = JSON.parse(this.responseText);
			if(datos.del){
				msgAlrt(datos.del)
			}else{
				msgErr("No se pudo procesar la operación.")
			}
		}
	};
	ajax.open('POST', 'http://127.0.0.1:3000/imss/delDoctor');
	ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	dts = 'c='+cedula;
	ajax.send(dts);
}