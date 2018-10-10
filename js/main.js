//SIP.js ejemplo



//Habilitar notificaciones NOTIFICATION API


Notification.requestPermission().then(function(result) {
  console.log(result);
  if(result==="granted"){
	  
	  
  }
});

//reconocer explorador

function browser(a){


	a=is.chrome();
		
	if(a){
		
		return "chrome";
	}

	a=is.firefox();
		
	if(a){
		
		return "firefox";
	}

return "no es ni firefox ni chrome";
}


//reconocer sistema operativo

function os(a){
	
		a=is.android();
		
	if(a){
		
		return "android";
	}

	a=is.windows();
		
	if(a){
		
		return "windows";
	}
	return "no es ni android ni windows";
}

var sistemaOS= os();
var explorador = browser();
//$.notify("tu sistema operativo es "+ sistemaOS + " y tu explorador es " + explorador,"success");
/*alertify.notify("tu sistema operativo es "+ sistemaOS + " y tu explorador es " + explorador, 'success', 5, function(){*/  console.log("tu sistema operativo es "+ sistemaOS + " y tu explorador es " + explorador);
/*alertify.set('notifier','position', 'bottom-right');
*/


///////////////////////////////////////////


//Registro SIP


///////////////////////////////////////////

//settings de registro 
var sipUser=document.querySelector('input#usuario');
var sipPasswd=document.querySelector('input#contraseña');
var statusReg=document.getElementById("statusReg");
var userReg=document.getElementById("userReg");
var botonRegistro=document.querySelector('button#registro');
var noRegistro=document.getElementById('noRegistro');
var botonCallPBX=document.querySelector('button#botonCallPBX');
var videoCam=window.video=document.querySelector('video#mediaLocal');
var videoRemoto=window.video=document.querySelector('video#mediaRemoto');
var botonColgarPBX=document.querySelector('button#botonColgarPBX');
var user;
var passwd;
var config1;
var intervalo;
var expireTime=60000; //default SIP Register Expire 60 segundos
var usuarioLocal;




//settings de Llamada Entrante

var numeroTexto=document.getElementById('escritoLLamada');
var sessionIN;
var notificacion;
var botonRechazar=document.getElementById('botonRechazar');

//settings de Llamada Saliente
var sessionOUT;
var destino;
var opciones = {
		
		media: {
			
			render: {
				remote: videoRemoto,
				local: videoCam
			}
		}
	};
//settings de Chat

var botonSend=document.getElementById("send");
var mensaje=document.getElementById("chatMessage");
var	chatHistory=document.getElementById("chatArea");
var destinoChat=document.getElementById("destinoChat");
var usuarioRemoto=new Array();
//var audio1=new Audio("res/audios/1.wav");
//var audio2=new Audio("res/audios/2.wav");
var contadorChat=0;
var contadorLetras=-1;
var flagMensaje=true;
var typingImg=document.getElementById("typing");

// Settings generales
var toggleVideo=document.getElementById("toggleVideo");
var botonVideoOff=document.getElementById("botonVideoOff");
var botonMute=document.getElementById("botonMute");
var toogleMute=document.getElementById("toogleMute");
var contenedorVideos=document.getElementById("contenedorVideos");
var containerBotonesCtl =document.getElementById("containerBotonesCtl");

$(".botonMenu").attr("disabled","disabled");

$('#usuario').keydown(function(event) {
        if (event.keyCode == 13) {
            sipPasswd.focus();
            return false;
         }
    });


$('#contraseña').keydown(function(event) {
        if (event.keyCode == 13) {
            botonRegistro.click();
            return false;
         }
    });


botonRegistro.onclick=function(){
	
	botonRegistro.disabled=true;
	
	var primerRegistro;
		 user=sipUser.value;//
		 passwd=sipPasswd.value;//
		
		//Variable de configuracion del peer a registrarse
	
	 config1 = {
	  // Replace this IP address with your FreeSWITCH IP address
	  uri: user+'@34.200.151.61',
	  //autostart: false,
	  // Replace this IP address with your FreeSWITCH IP address
	  // and replace the port with your FreeSWITCH ws port
	  //ws_servers: 'ws://34.200.151.61:7443',
	wsServers: 'wss://34.200.151.61:7443',
	  // FreeSWITCH Default Username
	  authorizationUser: user,
      stunServers: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"],
	  // FreeSWITCH Default Password
	 password: passwd,
	  register: true,
	autostart: true,
	log:[
		  { //loggin disable
			builtinEnabled: false
		  }],
	traceSip: false
	
	};

		
		
		if(user==="" || passwd===""){
			
			$.notify("Datos de registro incompleto", "warn");
			botonRegistro.disabled=false;
		}else{
			
			// Registrarse
						
			usuarioLocal=new SIP.UA(config1);//usuario local registrado
			primerRegistro=true;
			
			
			//codigo para cargar los audios y que esten disponibles para chrome de android
			audio1.muted=true;
			audio1.play();
			audio1.addEventListener("ended",function(){
				
				if(audio1.muted){
					
					audio1.muted=false;
				}
				
			});
			
			audio2.muted=true;
			audio2.play();
			audio2.addEventListener("ended",function(){
				
				if(audio2.muted){
					
					audio2.muted=false;
				}
				
			});
			
			
		}
		 
	 //Registro correcto
			
			usuarioLocal.on('registered', function (){
				
			 
			
			w3_close();
				
				$("#botonMenu").css("opacity","1");
				$("#contenedorLogin").css("opacity","0");
		 		$("#contenedorLogin").css("z-index","0");
				$(".botonMenu").removeAttr("disabled");
				document.getElementById("dial").click();
		 
				
			//Revisar Registro
			if(primerRegistro)
			{
				
				$.notify("Usuario Registrado", "success");
				primerRegistro=false;
				intervalo=setInterval(checkRegister,expireTime*1000);
				
			}
			
			userReg.innerText=user;
			statusReg.innerHTML="<b>Registrado</b>";
			statusReg.style.color="green";
			
			});

			
			//Registro fallido por credenciales erradas
			usuarioLocal.on('registrationFailed', function (){
				
				
				$.notify("Verifique su usuario o password", "error");
				botonRegistro.disabled=false;
				
			});
			
				//desregistrar

			noRegistro.onclick=function(){
				

				usuarioLocal.unregister();
				
				//clearInterval(intervalo);
				botonRegistro.disabled=false;
				$.notify("Desregistrado", "warn");
				sipUser.value="";
				sipPasswd.value="";
				userReg.innerText="XXX";
				statusReg.innerHTML="<b>No Registrado</b>";
				statusReg.style.color="red";
				location.reload(true);
				
			};

		
			
///////////////////////////////////////////////////////	
///////////////////////////////////////////////////////	
///////////Llamada entrante v2/////////////////////////	
///////////////////////////////////////////////////////	
///////////////////////////////////////////////////////	


	//Repique y notificacion v2


	usuarioLocal.on('invite',function(session){
					
					console.log("Llamada repicando");
					ringbackTone.startRinging();
					$.notify("Llamada entrante", "success");
					document.getElementById("dial").click(); //para mostrar el teclado en caso de no estar en el
					//alertify.notify('"Llamada entrante"', 'success', 5, function(){  console.log('Llamada entrante'); });
					
					$("#ringing").css("display","block");
					$('.num').css("display","none");
					$("#clear").css("opacity","0");
					
					if(sistemaOS==="windows" || sistemaOS==="mac" || sistemaOS==="linux"){
						notificacion= new Notification("Llamada entrante",{body: "Click para ver dialer"});
						
					setTimeout(notificacion.close.bind(notificacion), 5000);
						
						notificacion.onclick=function(){
							
							console.log("click en notificacion");
							/*window.moveTo(0,0);
							window.resizeTo(screen.availWidth, screen.availHeight);*/
							window.focus();
							notificacion.close();
						};
					}

						sessionIN=session;
						
	
						//Rechazar llamada cuando esta repicando
		
						
		sessionIN.on('bye',function(){
										
						
						console.log("Llamada finalizada");
						 $.notify("Llamada finalizada", "error");
						sessionIN=cerrarVideos(sessionIN);

						
					});	
					
						//Llamada aceptada
			
		sessionIN.on("accepted",function(){
					
								console.log("llamada Entrante aceptada");	
				  
				  
					// The tone is currently off, so we need to turn it on.
					ringbackTone.stopRinging();
					/*document.getElementById("loading").style.display="none";
					document.getElementById("mediaRemoto").style.display="block";*/

				});
					//Llamada aceptada fin
					
					//Llamada cancelada
		sessionIN.on("canceled",function(){
					
						console.log("llamada entrante cancelada");			
				  
				  
					sessionIN=cerrarVideos(sessionIN);

				});
				//Llamada cancelada fin
				
				//Llamada rechazada
		sessionIN.on("rejected",function(){
					
									
				  console.log("llamada entrante rechazada");
				  
					sessionIN=cerrarVideos(sessionIN);

				});
				
		sessionIN.on("failed",function(){
					
									
				  console.log("llamada entrante fallida");
				  
					sessionIN=cerrarVideos(sessionIN);

				});

				
				//Llamada rechazada fin
	
		
	});

	// Llamada entrante v2 FIN




	botonCallPBX.onclick=function() {
		console.log("boton llamar presionado");
		botonCallPBX.disabled=true;			
///////////////////////////////////////////////////////	
///////////////////////////////////////////////////////	
/////////// Atender Llamada ///////////////////////////	
///////////////////////////////////////////////////////	
///////////////////////////////////////////////////////	

					if(sessionIN)
					{
							botonCallPBX.disabled=false;			
											
						
						
						
						if(sistemaOS==="windows" || sistemaOS==="mac" || sistemaOS==="linux"){
							notificacion.close.bind(notificacion);
						}
					
						
						
							
							sessionIN.accept(opciones);
							showVideo(sessionIN);
						
						
					}else{
///////////////////////////////////////////////////////	
///////////////////////////////////////////////////////	
///////////  Llamada Saliente  ////////////////////////	
///////////////////////////////////////////////////////	
///////////////////////////////////////////////////////						
						
						
							destino=numeroTexto.value;
						
						
						if(destino===""){
							
							$.notify("Debe introducir un numero","error");
										
								
							
						botonCallPBX.disabled=false;
						return;
						  
						
						
						}else{
							
							console.log("llamando a "+ destino);
							sessionOUT = usuarioLocal.invite(destino+"@34.200.151.61",opciones);
							

						}
						
						
						//ringing
					
					
				
					sessionOUT.on("progress",function(){
						
										
					  console.log("llamada en progreso");
					  
						// The tone is currently off, so we need to turn it on.
						if(ringbackTone.status === 0)
						{
							ringbackTone.startRinging();
							
							}
							
							

					});
						//ringing fin

						
							//Llamada aceptada
					
					
				
					sessionOUT.on("accepted",function(){
						
									console.log("llamada saliente  aceptada");	
					  showVideo(sessionOUT);
					  /*document.getElementById("loading").style.display="none";
					document.getElementById("mediaRemoto").style.display="block";*/
					  
						// The tone is currently off, so we need to turn it on.
						ringbackTone.stopRinging();
						


					});
						//Llamada aceptada fin

						
						//Llamada cancelada
					sessionOUT.on("canceled",function(){
						
										
					  
					  console.log("llamada cancelada");
						sessionOUT=cerrarVideos();
						

					});
					//Llamada cancelada fin
					
					
					//Llamada rechazada
					sessionOUT.on("rejected",function(){
						
										
					  console.log("llamada rechazada");
					  sessionOUT=cerrarVideos();
						
						
					});
					
					sessionOUT.on("failed",function(){
						
										
					  console.log("llamada fallida");
					  
						// The tone is currently off, so we need to turn it on.
						sessionOUT=cerrarVideos();
					});

				
					
					//Llamada rechazada fin
			
						
						//Llamada colgada remotamente
					
					sessionOUT.on('bye',function(a){
						a="Llamada finalizada";
						console.log(a);
						 $.notify(a, "error");
						
						sessionOUT=cerrarVideos();
						
						});	
						
						
					}						

					
					
					//termino el else del gran IF
				};

				
				
				
				
	
					
					
			



	
	
///////////////////////////////////////////////////////	
///////////////////////////////////////////////////////	
///////////			Chat	entrante   ////////////////	
///////////////////////////////////////////////////////	
///////////////////////////////////////////////////////	
	
	usuarioLocal.on('message',function(recibido){
		
		
		
		console.log("mensaje recibido: " + recibido.body);
		
	
		
		
		
	if(recibido.body==="_Usuario_No_Escribiendo_#002" && $('.writing')){
		console.log("se borrara el writing");
		$('.writing').remove();
		return;
	}		
		

		
				
				/*nuevoChat(recibido.remoteIdentity.uri.user,recibido.body,"in");*/
		var usuarioRemoto=recibido.remoteIdentity.uri.user;
		var idSelector="chat"+usuarioRemoto;

		verificaChat(usuarioRemoto,recibido.body,"in");
		
		if(recibido.body !== "_Usuario_Escribiendo_#001"){
			checkWarning(idSelector,usuarioRemoto,recibido.body);
			
				if(sistemaOS==="windows" || sistemaOS==="mac" || sistemaOS==="linux"){
						var notificacion2= new Notification("Mensaje entrante",{body: "Click para ver dialer"});
						
					setTimeout(notificacion2.close.bind(notificacion2), 2000);
						
						notificacion2.onclick=function(){
							
							console.log("click en notificacion2");
							/*window.moveTo(0,0);
							window.resizeTo(screen.availWidth, screen.availHeight);*/
							window.focus();
							notificacion2.close();
						};
					}
		}
					
		
	
	
		/*console.log("el estado de visualizacion del chat actual es "+document.getElementById(idSelector).style.display);
		
		if(document.getElementById(idSelector).style.display==="none" ){
			
			var selChatWarn=document.getElementById("chatWarn"+recibido.remoteIdentity.uri.user);

			if(selChatWarn.style.display==="inline-block"){
				console.log("no se cuenta el warning del mensaje porque ya esta mostrandose el " + "chatWarn"+recibido.remoteIdentity.uri.user);
			}else{
				$("#chatWarn"+recibido.remoteIdentity.uri.user).css("display","inline-block");
				contadorChat++;
			}
				document.getElementById("nuevoMensaje").style.display="block";
				$.notify("Nuevo Mensaje de Texto Recibido","success");

				audio1.play();
			

		}
		*/
		
		
	});
	

}; //Boton Registro Fin

function checkWarning(id,user){
	
	
	console.log("el estado de visualizacion del chat actual es "+document.getElementById(id).style.display);
		
		if((document.getElementById(id).style.display==="none") || (document.getElementById("chat").style.opacity==0 && document.getElementById(id).style.display==="block")){
			
			
				if(document.getElementById("chatWarn"+user).style.display==="inline-block"){
					console.log("no se cuenta el warning del mensaje porque ya esta mostrandose el " + "chatWarn"+user);
				}else{
					$("#chatWarn"+user).css("display","inline-block");
					contadorChat++;
				}
				document.getElementById("nuevoMensaje").style.display="block";
				
			
				$.notify("Nuevo Mensaje de Texto Recibido","success");

				audio1.play();
						
			
				
		}
		
	
}

///////////////////////////////////////////////////////	
///////////////////////////////////////////////////////	
///////////			Chat	saliente   ////////////////	
///////////////////////////////////////////////////////	
///////////////////////////////////////////////////////	

botonSend.onclick=function(){
	
	contadorLetras=0;
	flagMensaje=true;
	
	if(mensaje.value===""){
				$.notify("No ha introducido ningún mensaje","error");
			}else{
				
				if(destinoChat.value!==""){
					
					usuarioLocal.message(destinoChat.value+"@34.200.151.61",mensaje.value);
					console.log("enviando mensaje " + mensaje.value);
					audio2.play();
					destinoChat.disabled=true;
					verificaChat(destinoChat.value,mensaje.value,"out");

					
				}else{
					
					$.notify("No ha introducido ningún destinatario","error");
				}
				
			}			
			
	
		
};


$('#destinoChat').keydown(function(event) {
        if (event.keyCode == 13) {
            mensaje.focus();
            return false;
         }
    });



$('#chatMessage').keyup(function(event) {
	
	if(event.keyCode == 13) {//esto evita que se quede un enter en la caja de escritura de chat
			console.log("boton enter up");
            mensaje.value="";
				
	            
	         }else if(event.keyCode == 8){//backspace
			
				if(contadorLetras>0)
					{contadorLetras --;}
				
				if( mensaje.value=== ""){
					
					flagMensaje=true;
					console.log("mensaje en vacio wei");
					usuarioLocal.message(destinoChat.value+"@34.200.151.61","_Usuario_No_Escribiendo_#002");

				
			}
			
		}

	});




$('#chatMessage').keydown(function(event) {
	
	
	
	
	
	
	if(event.keyCode== 32){//si presiona espacio
		contadorLetras=0;
	}else if (event.keyCode == 9){
		
		console.log("se pulso el tabulador");
		
		
	}else {//cualquier otro caracter
		
		contadorLetras ++;
	}
	
	if(contadorLetras==24){//hace CR al escribir 25 letras
		mensaje.value=mensaje.value+"\n";
		contadorLetras=0;
	}
	
	
	if(event.keyCode == 13 && event.shiftKey){ //shift enter hace CR
		mensaje.value=mensaje.value+"\n";
		console.log("boton enter y shift presionado");
		contadorLetras=0;
		
	}else if(event.keyCode == 13) {//enter para enviar mensaje
			console.log("boton enter presionado");
            botonSend.click();
			
            //return false;
         }
	
	if( contadorLetras !== 0){
		
		if(flagMensaje){
			
			usuarioLocal.message(destinoChat.value+"@34.200.151.61","_Usuario_Escribiendo_#001");
			flagMensaje=false;
			console.log("el contador de letras es "+contadorLetras);
		}
	}
	
	console.log("el keycode presionado es " + event.keyCode + " y el numero de letras  es " + contadorLetras + " y la caja de chat tiene este valor " + mensaje.value);
	
	
	
	
    });

//nuevoChat(destinoChat.value,mensaje.value,"out");
function verificaChat(numero,mensajito,direccion){
	
	
	var i;
	
	for (i in usuarioRemoto){
		
		if(numero===usuarioRemoto[i]){
			oldChat(numero,mensajito,direccion);
			return;
		}	 		
	}
	
	nuevoChat(numero,mensajito,direccion);
	
}

function oldChat(numero,mensajito,direccion){
	
	
	
		//falta por implemenar:
		//	reproducir sonido
		//	noificacion al sistema y en el lobby (quizas) de mensajes
		//	warning en el simbolo de mensaje
		//se coloca el mensaje dentro del espacio del nuevo chat si es saliente o entrante 
	
	
	mensajito=mensajito.replace(/\n/g,"<br>");
	
	if(direccion==="out"){
		
		if($('.writing').css('display')==="block"){
			
			$('.writing').remove();
			document.getElementById("chat"+numero).innerHTML=document.getElementById("chat"+numero).innerHTML+'<p class="enviado">'+ mensajito +'</p><div class="writing"><img id="typing" preload="auto" src="res/imagenes/typing.gif" style="height: 35px;"></div>';
			mensaje.value="";
		
		}else{
			
			document.getElementById("chat"+numero).innerHTML=document.getElementById("chat"+numero).innerHTML+'<p class="enviado">'+ mensajito +'</p>';
			mensaje.value="";
			
			
		}
		
	}else{
		
		
		
		
			if(mensajito==="_Usuario_Escribiendo_#001"){
				
				console.log("Simbolo de tipeando va a mostrarse si chat respectivo esta block y la opacidad de chat esta en 1");
				
				if( $('#chat').css('opacity') === "1" && $('#chat'+numero).css('display') === "block"){
				
					
					document.getElementById("chat"+numero).innerHTML=document.getElementById("chat"+numero).innerHTML+'<div class="writing"><img id="typing" preload="auto" src="res/imagenes/typing.gif" style="height: 35px;"></div>';
					
					console.log("Simbolo de tipeando mostrandose");
				}
			
			}else if(mensajito==="_Usuario_No_Escribiendo_#002"){

				$('.writing').remove();

			}else{
				
				console.log("el mensaje entrante es: " + mensajito);
				$('.writing').remove();
				
				document.getElementById("chat"+numero).innerHTML=document.getElementById("chat"+numero).innerHTML+'<p class="recibido">'+ mensajito +'</p>';
			}
		
		
	}
					
	
		if($('#chatArea').css('display')==='block' && $('#chat').css('opacity')==="1" ){
			$('#chatArea').animate({
			  scrollTop: document.getElementById("chatArea").scrollHeight - document.getElementById("chatArea").clientHeight
			}, 500);
			
		}
		/*if($('#chatArea').css('display')==='block' && $('#chat').css('opacity')==="1" ){
			$('#chat'+numero).animate({
			  scrollTop: document.getElementById("#chat"+numero).scrollHeight - document.getElementById("#chat"+numero).clientHeight
			}, 500);
			
		}*/

	
}

function onChatClick(){
	
	
	//var numero=$(this).attr('id');
	console.log("Haz seleccionado el chat "+ this.id);
	
	document.getElementById('chat'+this.id).style.display="block";
	
		destinoChat.value=this.id;
	destinoChat.disabled=true;
	
	document.getElementById('chatControl').style.display="block";
	document.getElementById("chatLobby").style.display="none";
	
	
	if(document.getElementById('chatWarn'+this.id).style.display==="inline-block"){
		
		$("#chatWarn"+this.id).css("display","none");
		contadorChat--;
		
		if(contadorChat==0){
		
		document.getElementById("nuevoMensaje").style.display="none";
		}
		
		//return;
	}
	
	

	
//		document.getElementById("chatArea").scrollTop=document.getElementById("chatArea").scrollHeight;

	
	
			
	
	
}

function nuevoChat(numero,mensajito,direccion){

	if(mensajito==="_Usuario_Escribiendo_#001"){
		
		oldChat(numero,mensajito,direccion);
		return;
		
	}
	//se crea el nuevo historial
	document.getElementById("noIM").style.display="none";
	var historialMensajes=document.getElementById("historialMensajes");
	historialMensajes.style.display="block";
	historialMensajes.innerHTML="<tr class='historial' id='"+numero+"'><td  class='historialIn'><i class='material-icons'>chat</i> Chat con " + numero +"<i id='chatWarn"+numero+"' class='material-icons ' style='display:none'>error</i></td></tr>" +historialMensajes.innerHTML;
	usuarioRemoto.push(numero);
	
	
	
	
	$(".historial").each(function(){
		
		this.addEventListener("click",onChatClick,false);
	
	});
	
	
	//se crea el espacio del nuevo chat
	document.getElementById("chat000").style.display="none";
	
	if(direccion=="out"){
		chatHistory.innerHTML=chatHistory.innerHTML + "<div id='chat"+numero+"' class='conversaciones' style='display:block;'></div>";
	}else{
		chatHistory.innerHTML=chatHistory.innerHTML + "<div id='chat"+numero+"' class='conversaciones' style='display:none;'></div>";
	}
	
	
	
	oldChat(numero,mensajito,direccion);
	
	
	
}




//implementando "escribiendo"





///////////////////////////////////////////////////////	
///////////////////////////////////////////////////////	
///////////			Chat	add		   ////////////////	
///////////////////////////////////////////////////////	
///////////////////////////////////////////////////////	

var botonNewChat=document.getElementById("newChat");
var botonBack=document.getElementById("back");

botonNewChat.onclick=function(){

		if(usuarioLocal){
			
			document.getElementById("chatControl").style.display="block";
			if(destinoChat.disabled){destinoChat.disabled=false; destinoChat.value="";}
			document.getElementById("chatLobby").style.display="none";
			
				
				
			
		}else{
			
			$.notify("Debe Iniciar Sesion antes de enviar mensajes","error");
		}
	
	
};

botonBack.onclick=function(){
	
	
	document.getElementById("chatControl").style.display="none";
	$(".conversaciones").css("display","none");
	document.getElementById("chatLobby").style.display="block";
	document.getElementById("chat000").style.display="block";
	mensaje.value="";
	destinoChat.value="";
	
};




///////////			FIN Chat	add		   ////////////////	

botonRechazar.onclick=function(){
	
							
							console.log("boton rechazar presionado");
							
							if(sessionIN){sessionIN.reject();}else{sessionOUT.terminate();}
	
						};
	
		botonColgarPBX.onclick=function(){
			
			if(sessionIN)
			{
				
				sessionIN.bye();
				
				
				
		}else{
		
			
			if(sessionOUT.status===12){
			sessionOUT.bye();
			return;
			}
			
			if(sessionOUT.status===2){
				
				sessionOUT.cancel();
				
				return;
			}
			sessionOUT.terminate();
			
			
		}
			
			
				
		}
		
		
$(document).ready(function(){
	
	//efecto de transicion entre elementos centrales
	$('#menuContainer button').click(function() {
	
	console.log("el id del boton presionado es "+$(this).attr('id'));
	var botonId=$(this).attr('id');
	$("#zonaCentral > div").css("opacity","0");
	$("#zonaCentral > div").css("z-index","0");	
	
	switch(botonId){
			
		case "im" :
			
			
			$("#chat").css("opacity","1");
			$("#chat").css("z-index","10");
			botonBack.click();
			
			
			
			break;
			
		case "setting" :


		$("#config").css("opacity","1");
		$("#config").css("z-index","10");

			break;
			
		case "contact" :
			
			
			$("#contactos").css("opacity","1");
			$("#contactos").css("z-index","10");
			break;
			
		case "dial" :
			
			
			$("#teclas").css("opacity","1");
			$("#teclas").css("z-index","10");
			
			break;
		case "buzon" :
			
			$("#teclas").css("opacity","1");
			$("#teclas").css("z-index","10");
			numeroTexto.value=userReg.innerText;
			botonCallPBX.click();
			numeroTexto.value="";
			
			break;
			
		default:
			break;
			
	}
	
});

	// efecto al presionar boton 
	$('.tabla-dialpad button').mousedown(function(){
		
		$(this).css("box-shadow","none");	
	});
	
	$('.tabla-dialpad button').mouseup(function(){
		
		$(this).css("box-shadow","0 8px 16px 0 rgba(0,0,0,0.2),0 6px 10px 0 rgba(0,0,0,0.19)");	
	});
	
	
});

function checkRegister (){


	

		console.log("Re Registrando");
		usuarioLocal.register(config1);
		
	



}
// JavaScript Document

function w3_open() {

$(document).ready(function(){
	
	
	
	$("#mySidebar").css("display","block");
	$("#mySidebar").css("z-index","20");
	$(".wrapper").css("display","none");
});
  //document.getElementById("mySidebar").style.width = "100%";
  //document.getElementById("mySidebar").style.display = "block";
 /// document.getElementById("openNav").style.display = 'none';
}

function w3_close() {

 $(document).ready(function(){
	
	$("#mySidebar").css("display","none");
	$("#mySidebar").css("z-index","0");
	$(".wrapper").css("display","block");
});
  //document.getElementById("mySidebar").style.display = "none";
 /// document.getElementById("openNav").style.display = 'none';
}

function showVideo(session){
	
	contenedorVideos.style.display = "block";
	document.getElementById("principal").style.display = "none";
	
						
}
		
function cerrarVideos(session){
				
				
				session=null;
				botonCallPBX.disabled=false;
				contenedorVideos.style.display = "none";	
								document.getElementById("principal").style.display = "block";						
								
				
				if(ringbackTone.status===1){
					
					ringbackTone.stopRinging();
					
				}
				
				
			document.getElementById("dtmfPad").style.display ="none";
			document.getElementById("botonPad").innerHTML="<i  class='material-icons ' style='font-size:36px;color:black'>dialpad</i>";
			
			document.getElementById("mediaLocal").style.display="block";
			toogleVideo.innerText="videocam";
			
			videoRemoto.muted=false;
			toogleMute.innerText="volume_up";
	
					$("#ringing").css("display","none");
					$('.num').css("display","inline-block");
					$("#clear").css("opacity","1");
			
				return session;
				
			}


///////////////////////////////////////////////////////	
///////////////////////////////////////////////////////	
///////////    Directorio Contactos     ///////////////
///////////////////////////////////////////////////////	
///////////////////////////////////////////////////////
	


var selecDest=document.querySelector('select#destinoLLamada');


	selecDest.onchange=function (){
		
		var sel=selecDest.value;
		
		
		if(sel==="jainer"){
			  destino='205';
			  numeroTexto.value=destinoChat.value=205;
			

			  
			  

		  }else if(sel==="joel"){
			  destino='203';
			  numeroTexto.value=destinoChat.value=203;

			}else if(sel==="did"){
				
				numeroTexto.value=destinoChat.value=15208914487;
				destino='15208914487';
			
			}else{ 		
				console.log("no se ha seleccionado destino");
				
				return;
				}
			console.log("se va a llamar a "+ destino);
			

	};


	numeroTexto.oninput=function (){
		
		//botonCallPBX.disabled=false;
		if(selecDest.value!="")
		{
			
			selecDest.selectedIndex="0";
		}
		
	}
	
//

///////////////////////////////////////////////////////	
///////////////////////////////////////////////////////	
///////////    Teclado numerico   /////////////////////	
///////////////////////////////////////////////////////	
///////////////////////////////////////////////////////		
var valores = {
    "num1": {a:1},
    "num2": {a:2},
    "num3": {a:3},
    "num4": {a:4},
    "num5": {a:5},
    "num6": {a:6},
    "num7": {a:7},
    "num8": {a:8},
    "num9": {a:9},
    "asterisco": {a:"*"},
    "num0": {a:0},
    "numeral": {a:"#"},
	"clear": {a:"clr"},
	"botonCallPBX": {a:"call"},
	"botonRechazar": {a:"bye"}
};

$(".js-dtmf-interface").on("mousedown touchstart", function(e){
	
    e.preventDefault();
	
	

     var keyPressed = $(this).attr('id'); // this gets the number/character that was pressed
	 
    var frequencyPair = dtmfFrequencies[keyPressed]; // this looks up which frequency pair we need
	var numeros = valores[keyPressed];
	console.log("El boton presionado es "+numeros.a);
    // this sets the freq1 and freq2 properties
   
	dtmf.freq1 = frequencyPair.f1;
    dtmf.freq2 = frequencyPair.f2;
	

    if (dtmf.status == 0){
        dtmf.start();
    }
	
	if(numeros.a!="clr")
	{
		numeroTexto.value=numeroTexto.value+numeros.a;
	}else{
		numeroTexto.value="";
	}
});

// we detect the mouseup event on the window tag as opposed to the li
// tag because otherwise if we release the mouse when not over a button,
// the tone will remain playing
$(window).on("mouseup touchend", function(){
    if (typeof dtmf !== "undefined" && dtmf.status){
        
		setTimeout(function(){ dtmf.stop(); }, 180);
		
    }
});

	//Teclado fin


///////////////////////////////////////////////////////	
///////////////////////////////////////////////////////	
///////////    Teclado DTMF////   /////////////////////	
///////////////////////////////////////////////////////	
///////////////////////////////////////////////////////
document.getElementById("dtmfPad").style.display ="none";

document.getElementById('botonPad').onclick=function(){
	
	if(document.getElementById("dtmfPad").style.display === "none"){
		console.log("Teclado DTMF ON");
		document.getElementById("dtmfPad").style.display = "block";
		containerBotonesCtl.style.opacity=0.65;
		document.getElementById("botonPad").innerHTML="<img style='width:36px;height:36px;margin:0 0 0 0' src='res/imagenes/dialpad_none.png'>";

		}else{
		console.log("Teclado DTMF OFF");
		document.getElementById("dtmfPad").style.display ="none";
			containerBotonesCtl.style.opacity=0;
		document.getElementById("botonPad").innerHTML="<i  class='material-icons ' style='font-size:36px;color:black'>dialpad</i>";
	}
	
	
};

$(document).ready(function(){
	
	$('#dtmfPad button').click(function(session){
		
		var a=$(this).attr('id');
		if(sessionIN)
			{
				
				session=sessionIN;
				
				
				
		}else{
			
			session=sessionOUT;
		}
		
		
		console.log('dtmf enviado es '+ a);
		
    if(a === 'num'){
		
		a="#";
		
		
	}else if(a==='ast'){
		
		a="*";
	}
		session.dtmf(a);
	
		
		
		
		
	});
	
	
	
});	

///////////////////////////////////////////////////////	
///////////////////////////////////////////////////////	
///////////    Toogle Video       /////////////////////	
///////////////////////////////////////////////////////	
///////////////////////////////////////////////////////


botonVideoOff.onclick=function(){
	
	
	if(toogleVideo.innerText==="videocam"){
		
			$.notify("Video Local OFF","error");
			if(sessionIN){
				
				
				sessionIN.getLocalStreams()[0].getVideoTracks()[0].enabled=false;
			}else{
				
				sessionOUT.getLocalStreams()[0].getVideoTracks()[0].enabled=false;
			}
			
			toogleVideo.innerText="videocam_off";
			document.getElementById('mediaLocal').style.display='none';
		
		}else{
			
			if(sessionIN){
				
				
				sessionIN.getLocalStreams()[0].getVideoTracks()[0].enabled=true;
			}else{
				
				sessionOUT.getLocalStreams()[0].getVideoTracks()[0].enabled=true;
			}
			
			
			
			
			$.notify("Video Local ON","success");
			toogleVideo.innerText="videocam";
			document.getElementById('mediaLocal').style.display='block';
		
		}
		
		
	
	
	
	
}
		




///////////////////////////////////////////////////////	
///////////////////////////////////////////////////////	
///////////    Toogle Mic       /////////////////////	
///////////////////////////////////////////////////////	
///////////////////////////////////////////////////////


botonMute.onclick=function(){
	
	
	
	if(toogleMute.innerText==="mic"){
		
			if(sessionIN){
				
				
				sessionIN.getLocalStreams()[0].getAudioTracks()[0].enabled=false;
			}else{
				
				sessionOUT.getLocalStreams()[0].getAudioTracks()[0].enabled=false;
			}
			toogleMute.innerText="mic_off";
			$.notify("Mic off","error");
		
		}else{
			
			if(sessionIN){
				
				
				sessionIN.getLocalStreams()[0].getAudioTracks()[0].enabled=true;
			}else{
				
				sessionOUT.getLocalStreams()[0].getAudioTracks()[0].enabled=true;
			}
			toogleMute.innerText="mic";
			$.notify("Mic on","success");
		}
	
	
};






///////////////////////////////////////////////////////	
///////////////////////////////////////////////////////	
/////////////    settings de registro     /////////////	
///////////////////////////////////////////////////////	
///////////////////////////////////////////////////////

var sipExpire=document.getElementById("sipExpire");

 sipExpire.onchange=function(){
	
	if(isNaN(sipExpire.value)){
		
		$.notify("Debe introdicir un número","error");
		sipExpire.value="";
	}else{
		
		
			expireTime=sipExpire.value*1000;
			
			if(intervalo)
			{
				usuarioLocal.register(config1);
				clearInterval(intervalo);
				intervalo=setInterval(checkRegister,expireTime);
			}
					
			$.notify("Sip Expire "+expireTime/1000+" s","success");
		
			
	}
	
};

	

			/*function checkRegister (){
				
				
					
					console.log("Re Registrando");
					usuarioLocal.register(config1);
					
				
				
			}*/



$("#botonMenu").click(function(){
	
	if($("#menu").css("display")==="none"){
		
		$("#menu").css("display","block");
		
	}else{
		
				$("#menu").css("display","none");

	}
	
	
	
});


///////////////////////////////////////////////////////	
///////////////////////////////////////////////////////	
////////  toogle botones de control de llamada     ////	
///////////////////////////////////////////////////////	
///////////////////////////////////////////////////////

contenedorVideos.addEventListener('click',cambiaOpacidad);

	
contenedorVideos.addEventListener('mousemove',cambiaOpacidad);

function cambiaOpacidad(){
	
	if(containerBotonesCtl.style.getPropertyValue('opacity')===''){
		
		containerBotonesCtl.style.opacity=0;
	}
	
	if(containerBotonesCtl.style.getPropertyValue('opacity')==='0'){
		
		console.log('la opacidad de los botones de control es '+ containerBotonesCtl.style.getPropertyValue('opacity'));
	
		containerBotonesCtl.style.opacity=0.65;
		setTimeout(function(){
			
			
			if(dtmfPad.style.getPropertyValue('display')==='none'){
				
				containerBotonesCtl.style.opacity=0;
			}
			
		
		
		
		
		},4500);
		
	console.log('la opacidad de los botones de control es '+ containerBotonesCtl.style.getPropertyValue('opacity'));
	
	
	}
	
	
}




