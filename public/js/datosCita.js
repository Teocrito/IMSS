function mostrarCitas(){
	div = document.getElementById("calendario");
	if (div.style.top == "0px"){
		div.style.top = "calc(100% - 8vmin)";
	}else{
		div.style.top = "0px"
	}
}