var cont = 0;
var us = localStorage.getItem('usrId');
var hosp = localStorage.getItem('usrHosp');

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
	var ajax = new XMLHttpRequest();
	ajax.onreadystatechange = function (){
		if (this.status == 200 && this.readyState == 4){
			var datos = JSON.parse(this.responseText);
			if (!datos.err){
				for (var x = 0; x < datos.length; x++){
					op += '<option value="'+datos[x].id+'">'+datos[x].nombre+'</option>';
				}	
			}
			drop.innerHTML = op;
		}
	};
	ajax.open('POST','http://localhost:3000/IMSS/getEspecialidades');
	ajax.send();
	getClinica();
}

function getClinica(){
	var drop = document.getElementById('dir');
	var ajax = new XMLHttpRequest();
	ajax.onreadystatechange = function (){
		if (this.status == 200 && this.readyState == 4){
			var datos = JSON.parse(this.responseText);
			if (!datos.err){
				for (var x = 0; x < datos.length; x++){
					drop.value = datos;
				}	
			}
		}
	};
	ajax.open('POST','http://localhost:3000/IMSS/getClinicaUsuario');
	ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	ajax.send('user='+us);
}

function getHrs(){
	var fecha = document.getElementById('fecha').value;
	var esp = document.getElementById('esp').value;
	if ( fecha = new Date(fecha)){
		if (fecha > Date.now()){
			var op = "";
			var drop = document.getElementById('hrs');
			var ajax = new XMLHttpRequest();
			ajax.onreadystatechange = function (){
				if (this.status == 200 && this.readyState == 4){
					var datos = JSON.parse(this.responseText);
					if (!datos.err){
						for (var x = 0; x < datos.length; x++){
							op += '<option value="'+datos[x].horario+'">'+datos[x].horario+'</option>';
						}	
					}else{
						msgErr(datos.msg)
					}
					drop.innerHTML = op;
				}
			};
			ajax.open('POST','http://localhost:3000/IMSS/horariosDisponibles');
			ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			f = fecha.getDate()+"/"+fecha.getMonth()+"/"+fecha.getFullYear();
			ajax.send('fecha='+f+'&hosp='+hosp+'&esp='+esp);
		}else{
			msgErr('Selecciona una fecha posterior a hoy');	
		}
	}else{
		msgErr('Fecha no valida.');
	}
}