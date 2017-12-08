function msgErr(msg){
	noti(2, msg);
}

function msgAlrt(msg){
	noti(1,msg);
}

function noti(type,msg){
	var classs = (type==1)?'alrt':'err';
	doc = '<div id="not"><div id="cont"><h2 class="'+classs;
	doc += '">Aviso</h2><p>'+msg+'</p><button onclick="hide()" class="'+classs;
	doc+= '">Aceptar</butto></div></div>';
	document.getElementsByTagName('body')[0].innerHTML += doc;
}

function hide(){
	document.getElementById('not').remove();
}

function ini(){
	if (localStorage.getItem('usrId') != null){
		location.assign('imss/citas')
	}
}

function validar(){
	if (localStorage.getItem('usrId') == null){
		location.assign('imss/')
	}
}