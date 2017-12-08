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
	fecha = fecha.split('-');
	fecha = new Date(fecha[1]+'-'+fecha[2]+'-'+fecha[0]);
	var esp = document.getElementById('esp').value;
	hoy = new Date(Date.now);
	mes = ((Number(hoy.getMonth())+3) < 12)?(Number(hoy.getMonth())+3):(Number(hoy.getMonth())+3-12)
	limite = new Date(mes+'-'+hoy.getDate()+'-'+hoy.getFullYear());
	if ( fecha.getDate() != NaN){
		if (fecha > hoy && fecha < limite){
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
			f = fecha.getDate()+"/"+(Number(fecha.getMonth())+1)+"/"+fecha.getFullYear();
			ajax.send('fecha='+f+'&hosp='+hosp+'&esp='+esp);
		}else{
			msgErr('Selecciona una fecha posterior a hoy y anterior a dos meses.');	
		}
	}else{
		msgErr('Fecha no valida.');
	}
}

function guardarCita(){
	var fecha = document.getElementById('fecha').value;
	fecha = fecha.split('-');
	fecha = new Date(fecha[1]+'-'+fecha[2]+'-'+fecha[0]);
	var espDiv = document.getElementById('esp');
	var esp = espDiv.options[espDiv.selectedIndex].value;
	var hr = document.getElementById('hrs').value;
	hoy = new Date(Date.now);
	mes = ((Number(hoy.getMonth())+3) < 12)?(Number(hoy.getMonth())+3):(Number(hoy.getMonth())+3-12)
	limite = new Date(mes+'-'+hoy.getDate()+'-'+hoy.getFullYear());
	if ( fecha.getDate() != NaN){
		if (fecha > hoy && fecha < limite){
			var ajax = new XMLHttpRequest();
			ajax.onreadystatechange = function (){
				if (this.status == 200 && this.readyState == 4){
					var datos = JSON.parse(this.responseText);
					if (!datos.err){
						msgAlrt('Se ha agendado su cita.')
						getEspecialidades()
					}else{
						msgErr(datos.msg)
					}
				}
			};
			ajax.open('POST','http://localhost:3000/IMSS/agendarCita');
			ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			f = fecha.getFullYear()+'-'+(Number(fecha.getMonth())+1)+'-'+fecha.getDate();
			f += ' '+hr;
			ajax.send('user='+us+'&fecha='+f+'&hosp='+hosp+'&esp='+esp);
		}else{
			msgErr('Selecciona una fecha posterior a hoy y anterior a dos meses.');	
		}
	}else{
		msgErr('Fecha no valida.');
	}	
}