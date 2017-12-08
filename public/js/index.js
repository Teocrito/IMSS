function log(){
	var us = document.getElementById('usuario').value;
	var pass = document.getElementById('pass').value;
	var ajax = new XMLHttpRequest();
	ajax.onreadystatechange = function (){
		if (this.status == 200 && this.readyState == 4){
			var datos = JSON.parse(this.responseText);
			if (datos.log){
				localStorage.setItem('usrId',datos.usrId);
				localStorage.setItem('usrHosp',datos.hosp);
				location.assign('imss/citas');
			}else{
				msgErr("No se pudo iniciar sesión. Verifica usuario y contraseña")
			}
		}
	};
	ajax.open('POST','http://127.0.0.1:3000/IMSS/logIn');
	ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	dts = 'user='+us+'&pass='+pass;
	ajax.send(dts);
}

function key(event){
	if (event.keyCode == 13){
		log()
	}
}