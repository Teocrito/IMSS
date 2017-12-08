function reg(){
	var afiliacion 	= document.getElementById('noAfiliacion').value;
	var nombre 		= document.getElementById('nombre').value;
	var aPaterno	= document.getElementById('aPaterno').value;
	var aMaterno	= document.getElementById('aMaterno').value;
	var telefono	= document.getElementById('telefono').value;
	var clinica		= document.getElementById('clinica').value;
	var correo		= document.getElementById('correo').value;
	var pass 		= document.getElementById('pass').value;
	var pass2		= document.getElementById('pass2').value;
	if(pass==pass2){
		var ajax = new XMLHttpRequest();
		ajax.onreadystatechange = function (){
			if (this.status == 200 && this.readyState == 4){
				var datos = JSON.parse(this.responseText);
				if (datos.reg){
					localStorage.setItem('usrId',datos.usrId);
					location.assign('citas');
				}else{
					msgErr(datos.error)
				}
			}
		};
		ajax.open('POST','http://127.0.0.1:3000/IMSS/registrar');
		ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		dts = 'af='+afiliacion+'&name='+nombre+'&aP='+aPaterno+'&aM='+aMaterno+'&tel='+telefono+'&clinica='+clinica+'&correo='+correo+'&pass='+pass;
		ajax.send(dts);
	}else{
		msgErr("Las contraseñas no coinciden.");
	}
}

function key(event){
	if (event.keyCode == 13){
		reg()
	}
}