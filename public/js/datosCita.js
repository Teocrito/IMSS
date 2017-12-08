var cont = 0;
var us = localStorage.getItem('usrId');

function mostrarCitas(){
	div = document.getElementById("calendario");
	if (div.style.top == "0px"){
		div.style.top = "calc(100% - 8vmin)";
	}else{
		div.style.top = "0px"
	}
}

function loadCitas(){
	var div = document.getElementById('calendario');
	var contenido = '<div class="barraTitulo" onclick="mostrarCitas()">Citas Registradas</div>';
	var dts = new XMLHttpRequest();
	dts.onreadystatechange = function (){
		if (this.status == 200 && this.readyState == 4){
			var datos = JSON.parse(this.responseText);
			if (!datos.err){
				for (var x = 0; x < datos.length; x++){
					var cita = '<div class="cita"><h3 class="tituloCita">'+datos[x].especialidad+'</h3>';
					cita +='<p class="doc">'+datos[x].doctor+'</p><p class="fecha">'+datos[x].fecha+'</p></div>';
					contenido += cita;
				}	
			}else{
				if (cont < 8){
					contenido += '<h1>No hemos podido conectar con el servidor lo reintentaremos en un momento.</h1>';
					var lap = 1000 + (500 * cont);
					setTimeout(function (){loadCitas()},lap);
					cont++
				}else{
					contenido += '<h1>No hemos podido conectar con el servidor.</h1>';
				}
			}
		}
		div.innerHTML = contenido
	};
	dts.open('POST','http://localhost:3000/IMSS/getCitas');
	dts.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	dts.send('user='+us);
	getEspecialidades();
}

function getEspecialidades(){
	var op = "";
	var drop = document.getElementById('esp');
	var clin = document.getElementById('dir');
	var ajax = new XMLHttpRequest();
	ajax.onreadystatechange = function (){
		if (this.status == 200 && this.readyState == 4){
			console.log(this.responseText)
			var datos = JSON.parse(this.responseText);
			if (!datos.err){
				optns = datos.especialidades;
				for (var x = 0; x < optns.length; x++){
					op += '<option value="'+optins[x].id+'">'+options[x].nombre+'</option>';
				}	
			}
			drop.innerHTML = op;
			clin.innerHTML = datos.clinica;
		}
	};
	ajax.open('POST','http://localhost:3000/IMSS/getInfoCitas');
	ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	ajax.send('user='+us);
}