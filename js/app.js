var i,intervalo,tiempo,nuevo_dulces;
var rbh,rbv,valor_nuevo_d;
var lencol=["","","","","","",""];
var lenres=["","","","","","",""];
var maximo,matriz,eliminar;
var contador=0,conc1=0;
var espera=0;
var score=0;
var mov=0;
var min=2;
var seg=0;

$(function(){//Función de inicio que cambia el color de texto y se repite indefinidamente
  white() //Invoca la función white
  })

  function white(){//Función que cambia el color a blanco
    $(".main-titulo").animate({
      color: "white"
    },500)
    yellow()
  }

  function yellow(){ //Función que cambia el color a amarillo
    $(".main-titulo").animate({
      color: "#DCFF0E"
    },500)
    white()
  }

var seg=0,min=2; //Cronómetro inicializa en 2 minutos

function timer() //Función de cronómetro
 {
   if(seg!=0)
   {
     seg=seg-1;
   }
   if(seg==0)
   {
     if(min==0)
     {
       clearInterval(eliminar);
       clearInterval(nuevo_dulces);
       clearInterval(intervalo);
       clearInterval(tiempo);
       $(".panel-tablero").hide("drop","slow",callback);
       $(".time").hide();
     }
     seg=59;
     min=min-1;
   }
   $("#timer").html("0"+min+":"+seg)
 }

 function callback()//muestra el resultado
 {
     $(".panel-score").prepend('<h1 class="main-titulo-2">Juego Terminado</h1>');
     $(".main-titulo-2").css("fontFamily","gameFont");
     $(".main-titulo-2").css("width","100%");
     $(".main-titulo-2").css("color","yellow");
     $( ".panel-score" ).animate({width:'100%'},1000);
 }

function llenar_img() // Función que llena de  dulces
{
  i=i+1
  var numero=0;
  var imagen;

  $(".elemento").draggable({ disabled: true });  //deshabilita draggable
  if(i<8)
  {
    for(var j=1;j<8;j++)
    {
      if($(".col-"+j).children("img:nth-child("+i+")").html()==null)
      {
        numero=Math.floor(Math.random() * 4) + 1 ; //retorna número entero aleatorio del 1 al 4
        imagen="image/"+numero+".png"; //asigna el número a la imagen
        $(".col-"+j).prepend("<img src="+imagen+" class='elemento'/>").css("justify-content","flex-start") //inserta un nuevo dulce
      }
    }
  }
  if(i==8)
  {
    clearInterval(intervalo);   //desactivar funcion llenar_img()
    eliminar=setInterval(function(){eliminarlinea()},150)  //activar funcion eliminar línea
  }
}

function eliminarlinea()
{
  matriz=0;
  rbh=horizontal()
  rbv=vertical()
  for(var j=1;j<8;j++)
  {
      matriz=matriz+$(".col-"+j).children().length;
  }

  if(rbh==0 && rbv==0 && matriz!=49)  //condicion si no encuentra 3 dulces o mas llamar a funcion para volver a completar el espacio
  {
      clearInterval(eliminar);//utiliza la función temporizador
      valor_nuevo_d=0;
      nuevo_dulces=setInterval(function()
      {
        nuevosdulces()  //Funcion completar nuevos dulces
      },600)
  }
  if(rbh==1 || rbv==1)
  {
    $(".elemento").draggable({ disabled: true });//deshabilitar draggable
    $("div[class^='col']").css("justify-content","flex-end")
    $(".activo").hide("pulsate",1000,function(){
      var scoretmp=$(".activo").length * 10;//calcula puntaje
      $(".activo").remove("img")//elimina imagen
      score=score+scoretmp;//acumula puntaje
      $("#score-text").html(score)  //Cambiar puntuacion
    })
  }

  if(rbh==0 && rbv==0 && matriz==49)
  {
    $(".elemento").draggable({//mover dulces
      disabled: false,
      containment: ".panel-tablero",
      revert: true,
      revertDuration: 0,
      snap: ".elemento",
      snapMode: "inner",
      snapTolerance: 40,
      start: function(event, ui){
        mov=mov+1;
        $("#movimientos-text").html(mov)
      }
    });
  }

  $(".elemento").droppable({//recibir dulces
    drop: function (event, ui) {
      var dropped = ui.draggable;
      var droppedOn = this;
      espera=0;
      do{
        espera=dropped.swap($(droppedOn));
      }while(espera==0)
      rbh=horizontal()  //funcion busqueda dulces horizontal
      rbv=vertical()    //funcion buscar dulces vertical
      if(rbh==0 && rbv==0)
      {
        dropped.swap($(droppedOn));
      }
      if(rbh==1 || rbv==1)
      {
        clearInterval(nuevo_dulces);
        clearInterval(eliminar);   //desactivar funcion llenar_img()
        eliminar=setInterval(function(){eliminarlinea()},150)  //activar funcion eliminarlinea
      }
    },
  });
}

function borrartotal()
{
  for(var j=1;j<8;j++)
  {
    $(".col-"+j).children("img").detach();
  }
}
$(".btn-reinicio").click(function(){
  i=0;
  score=0;
  mov=0;
  $(".panel-score").css("width","25%");
  $(".panel-tablero").show();
  $(".time").show();

  $("#score-text").html("0")
  $("#movimientos-text").html("0")
  $(this).html("REINICIAR")
  clearInterval(intervalo);
  clearInterval(eliminar);
  clearInterval(nuevo_dulces);
  clearInterval(tiempo);
  min=2;  //2 minutos
  seg=0;  //0 segundos
  borrartotal()
  intervalo=setInterval(function(){llenar_img()},600)
  tiempo=setInterval(function(){timer()},1000)
})

jQuery.fn.swap = function(b)//Cambia el lugar del dulce
{
    b = jQuery(b)[0];
    var a = this[0];
    var t = a.parentNode.insertBefore(document.createTextNode(''), a);
    b.parentNode.insertBefore(a, b);
    t.parentNode.insertBefore(b, t);
    t.parentNode.removeChild(t);
    return this;
};

function nuevosdulces()
{
  $(".elemento").draggable({ disabled: true });//deshabilita el draggable
  $("div[class^='col']").css("justify-content","flex-start")
  for(var j=1;j<8;j++)
  {
      lencol[j-1]=$(".col-"+j).children().length;
  }
  if(valor_nuevo_d==0)
  {
    for(var j=0;j<7;j++)
    {
      lenres[j]=(7-lencol[j]);
    }
    maximo=Math.max.apply(null,lenres);
    contador=maximo;
  }
  if(maximo!=0)
  {
    if(valor_nuevo_d==1)
    {
      for(var j=1;j<8;j++)
      {
        if(contador>(maximo-lenres[j-1]))
        {
          $(".col-"+j).children("img:nth-child("+(lenres[j-1])+")").remove("img")//elimina imagen
        }
      }
    }
    if(valor_nuevo_d==0)
    {
      valor_nuevo_d=1;
      for(var k=1;k<8;k++)
      {
        for(var j=0;j<(lenres[k-1]-1);j++)
        {
            $(".col-"+k).prepend("<img src='' class='elemento' style='visibility:hidden'/>")
        }
      }
    }
    for(var j=1;j<8;j++)
    {
      if(contador>(maximo-lenres[j-1]))
      {
        numero=Math.floor(Math.random() * 4) + 1 ;
        imagen="image/"+numero+".png";
        $(".col-"+j).prepend("<img src="+imagen+" class='elemento'/>")
      }
    }
  }
  if(contador==1)
  {
      clearInterval(nuevo_dulces);
      eliminar=setInterval(function(){eliminarlinea()},150)
  }
  contador=contador-1;
}

function horizontal()
{
  var bh=0;
  for(var j=1;j<8;j++)
  {
    for(var k=1;k<6;k++)
    {
      var valor_1=$(".col-"+k).children("img:nth-last-child("+j+")").attr("src")
      var valor_2=$(".col-"+(k+1)).children("img:nth-last-child("+j+")").attr("src")
      var valor_3=$(".col-"+(k+2)).children("img:nth-last-child("+j+")").attr("src")
      if((valor_1==valor_2) && (valor_2==valor_3) && (valor_1!=null) && (valor_2!=null) && (valor_3!=null))
      {
          $(".col-"+k).children("img:nth-last-child("+(j)+")").attr("class","elemento activo")
          $(".col-"+(k+1)).children("img:nth-last-child("+(j)+")").attr("class","elemento activo")
          $(".col-"+(k+2)).children("img:nth-last-child("+(j)+")").attr("class","elemento activo")
          bh=1;
      }
    }
  }
  return bh;
}


function vertical()
{
  var bv=0;
  for(var l=1;l<6;l++)
  {
    for(var k=1;k<8;k++)
    {
      var valor_1=$(".col-"+k).children("img:nth-child("+l+")").attr("src")
      var valor_2=$(".col-"+k).children("img:nth-child("+(l+1)+")").attr("src")
      var valor_3=$(".col-"+k).children("img:nth-child("+(l+2)+")").attr("src")
      if((valor_1==valor_2) && (valor_2==valor_3) && (valor_1!=null) && (valor_2!=null) && (valor_3!=null))
      {
          $(".col-"+k).children("img:nth-child("+(l)+")").attr("class","elemento activo")
          $(".col-"+k).children("img:nth-child("+(l+1)+")").attr("class","elemento activo")
          $(".col-"+k).children("img:nth-child("+(l+2)+")").attr("class","elemento activo")
          bv=1;
      }
    }
  }
  return bv;
}
