import { Anuncio_Mascota } from "../js/entidades.js";


let contenedorTabla = document.getElementById("contenedorTabla");
let contenedorSpinner = document.getElementById("paraSpinner");
let miSpinner = document.createElement("img");
let srcMiSpinner = "../Imagenes/miSpinner.gif";
contenedorSpinner.appendChild(miSpinner);


let tabla = document.createElement("table");;
let formulario = document.getElementById("formulario");


let datos;

let transaccionAnuncio = "venta";
let idAnuncio;
let tituloAnuncio;
let descripcionAnuncio;
let tipoAnimal;
let precioAnuncio;
let razaAnuncio;
let fechaAnuncio;


let vacunaAplicada;
let tiposAnimales = document.getElementsByName("tipoAnimales");

let botonesModificar = document.getElementById("botonesModificar");


/****************** TRAER DATOS *******************/
/*function TraerDatos(){

    //tabla.classList.add("miTabla");
    
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
        miSpinner.setAttribute("src", srcMiSpinner);
        if(xhr.readyState==4){
            miSpinner.removeAttribute("src");
            if(xhr.status==200){            
                let rtaXhr = xhr.response;
                let rtaJson = JSON.parse(rtaXhr);
                datos = rtaJson.data;
                console.log(rtaJson.message);
                CrearTablaConDatos(datos);
                let tdsTabla = document.getElementsByTagName("td");
                cargarEventosTdsTabla(tdsTabla);
            }
            else{
                console.log("HUBO ERROR AL CARGAR");
            }
        }
    }

    xhr.open("GET", "http://localhost:3000/traer");
    xhr.setRequestHeader("content-type", "application/json");
    xhr.send();
}*/
let listaMascotas = [];
function TraerDatos(){
    tabla.classList.add("table", "table-dark", "border", "text-center");
    if(!localStorage.getItem("listaMascotas")){
        localStorage.setItem("listaMascotas", JSON.stringify(listaMascotas));
    }        
    else{
        listaMascotas=JSON.parse(localStorage.getItem("listaMascotas"));
        CrearTablaConDatos(listaMascotas);    
        let tdsTabla = document.getElementsByTagName("td");
        cargarEventosTdsTabla(tdsTabla);
    }
}

TraerDatos();

/******************* CARGAR TABLA ******************/

function CrearTablaConDatos(datosTabla){
    while(tabla.childElementCount>0){
        tabla.removeChild(tabla.firstElementChild);
    }

    let trHead = document.createElement("tr");

    for (const key in datosTabla[0]) {
        let th = document.createElement("th");
        th.textContent = key;
        trHead.appendChild(th);
    }
    tabla.appendChild(trHead);

    datosTabla.forEach(fila => {
      let tr = document.createElement("tr");
      for (const key in fila) {
          let td = document.createElement("td");
          td.textContent = fila[key];
          tr.appendChild(td);
      }
      tabla.appendChild(tr);
    })
    contenedorTabla.appendChild(tabla);
}


/******************* ALTA ******************/

let btnAlta = document.getElementById("btnGuardar");

btnAlta.addEventListener("click", function(){
    tituloAnuncio = document.getElementById("txtTitulo").value;
    descripcionAnuncio = document.getElementById("txtDescripcion").value;
    precioAnuncio = document.getElementById("txtPrecio").value;
    razaAnuncio = document.getElementById("txtRaza").value;
    fechaAnuncio = document.getElementById("dateFecha").value;

    vacunaAplicada = VacunaFueAplicada();

    tipoAnimal = obtenerTipoAnimal();
    if(tituloAnuncio.length>3 && tipoAnimal!=null && vacunaAplicada!=null){
        let idNuevo = ObtenerNuevoId(listaMascotas);
        idNuevo = parseInt(idNuevo);
        let anuncioMascota = new Anuncio_Mascota(idNuevo, tituloAnuncio, transaccionAnuncio, descripcionAnuncio,
            precioAnuncio, tipoAnimal, razaAnuncio, fechaAnuncio, vacunaAplicada);
        
        insertarEnLocalStorage(anuncioMascota);
        TraerDatos();
        formulario.reset();

    }
    else{
        alert("COMPLETE LOS CAMPOS");
    }
})




function insertarEnLocalStorage(objetoInsertar){    
    listaMascotas.push(objetoInsertar);    
    
    GuardarEnLocalStorage();
}
function GuardarEnLocalStorage(){
    localStorage.setItem("listaMascotas", JSON.stringify(listaMascotas));
}



function ObtenerNuevoId(lista){
    if(lista.length==0){
        return 1;
    }
    else if(lista.length==1){
        return 2;
    }
    let  nroIdMax = 1;
    for (let index = 0; index < lista.length; index++) {
        const element = (lista[index]).id;
        if(element>nroIdMax){
            nroIdMax = element;
        }        
    }
    nroIdMax = parseInt(nroIdMax);
    return nroIdMax+1;
}


function obtenerTipoAnimal(){
    let elementoSeleccionado;
    tiposAnimales.forEach(element => {
        if(element.checked){
            elementoSeleccionado = element.value;
        }
    })
    return elementoSeleccionado;
}

let vacunas = document.getElementsByTagName("option");

function VacunaFueAplicada(){
    let retorno;
    for (let index = 0; index < vacunas.length; index++) {
        const element = vacunas[index];
        if(element.selected && element.value!="todos"){
            retorno = element.value;
        }
    }
    return retorno;
}

/************** CARGAR ANUNCIOS EVENTOS***************/

function cargarEventosTdsTabla(tdsTabla){
    for (let index = 0; index < tdsTabla.length; index++) {
        const td = tdsTabla[index];
        td.addEventListener("click", function(){
            let elementoPadre = td.parentElement;
            //let elementoIdBuscado = elementoPadre.firstElementChild;
            //retornoId = elementoIdBuscado.textContent;
            botonesModificar.style.display = "flex";
            LlenarFormularioSegunElementoPadre(elementoPadre);
        })
        
    }
}

function LlenarFormularioSegunElementoPadre(elementoPadre){
    idAnuncio = elementoPadre.children[0].textContent;


    document.getElementById("txtTitulo").value = elementoPadre.children[1].textContent;

    document.getElementById("txtDescripcion").value = elementoPadre.children[3].textContent;
    document.getElementById("txtPrecio").value = elementoPadre.children[4].textContent;
    
    tipoAnimal = elementoPadre.children[5].textContent;
    tiposAnimales.forEach(element => {
        if(element.value == tipoAnimal){
           element.setAttribute("checked", "true");
        }
    })
    
    document.getElementById("txtRaza").value = elementoPadre.children[6].textContent;
    document.getElementById("dateFecha").value = elementoPadre.children[7].textContent;

    //VACUNAAA8
    vacunaAplicada = elementoPadre.children[8].textContent;    
    for (let index = 0; index < vacunas.length; index++) {
        const element = vacunas[index];
        if(element.value == vacunaAplicada){
            element.setAttribute("selected", "true");
        }
        if(element.value !=vacunaAplicada){
            element.removeAttribute("selected");
        }
    }

}
    


/*************CANCELAR **************/

let btnCancelar = document.getElementById("btnCancelar");

btnCancelar.addEventListener("click", function(){
    formulario.reset();
    botonesModificar.style.display = "none";
})


/************************** BAJA **************************/
//OBS EL ID ANUNCIO YA LO TENGO CUANDO SELECCIONA UN TD EN IDANUNCIO
let btnEliminar = document.getElementById("btnEliminar");

btnEliminar.addEventListener("click", function(){

    EliminarObjeto(idAnuncio);
    GuardarEnLocalStorage();
    TraerDatos();
    formulario.reset();
    botonesModificar.style.display = "none";
})

function EliminarObjeto(idABorrar){
    for (let index = 0; index < listaMascotas.length; index++) {
        const fila = listaMascotas[index];
        for (const key in fila) {
            const element = fila[key];
            if(key=="id" && element==idABorrar){
                listaMascotas.splice(index,1);
            }
            break;
        }        
    }
}

/************************** MODIFICAR **************************/

let btnModificar = document.getElementById("btnModificar");
btnModificar.addEventListener("click", function(){

    tituloAnuncio = document.getElementById("txtTitulo").value;
    descripcionAnuncio = document.getElementById("txtDescripcion").value;
    precioAnuncio = document.getElementById("txtPrecio").value;
    razaAnuncio = document.getElementById("txtRaza").value;
    fechaAnuncio = document.getElementById("dateFecha").value;

    vacunaAplicada = VacunaFueAplicada();

    tipoAnimal = obtenerTipoAnimal();
    if(tituloAnuncio.length>3 && tipoAnimal!=null && vacunaAplicada!=null){
        let anuncioMascota = new Anuncio_Mascota(idAnuncio, tituloAnuncio, transaccionAnuncio, descripcionAnuncio,
            precioAnuncio, tipoAnimal, razaAnuncio, fechaAnuncio, vacunaAplicada);
        
        ModificarMascota(idAnuncio ,anuncioMascota);
        GuardarEnLocalStorage();    
        TraerDatos();
        formulario.reset();
        botonesModificar.style.display = "none";

    }
    else{
        alert("COMPLETE LOS CAMPOS");
    }
})

function ModificarMascota(id, nuevaMascota){

    for (let index = 0; index < listaMascotas.length; index++) {
        const fila = listaMascotas[index];
        for (const key in fila) {
            const element = fila[key];
            if(key=="id" && element==id){
                listaMascotas[index] = nuevaMascota;
            }
            break;
        }        
    }
}


/**********************************     FILTER      **********************************/
let nuevosDatos = listaMascotas;

let selectAnimal = document.getElementById("selectAnimal");


selectAnimal.addEventListener("change", function(){
    let elegido = selectAnimal.value;
    FiltrarAnimal(elegido);
})

function FiltrarAnimal(animalElegido){
    if(animalElegido!="todos"){
        nuevosDatos = listaMascotas.filter(function(elementActual){
            return elementActual.animal == animalElegido;
        });
        CrearTablaConDatos(nuevosDatos);         
        CalcularPromedio(nuevosDatos);
    }    
    else{
        CrearTablaConDatos(listaMascotas);
        CalcularPromedio(listaMascotas);
    }        
}
CalcularPromedio(listaMascotas);

/**********************************     REDUCE      **********************************/


function CalcularPromedio(datosLista){    
    let tamanio = datosLista.length;
    
    let precios = datosLista.map(function(elemento){
        return elemento.precio;
    });
    
    let sumaTotal = precios.reduce(function(ant,actual){
        let pro = parseInt(ant);
        let sdo = parseInt(actual);
        return pro+sdo;
    });

    let promedio = sumaTotal/tamanio;
    document.getElementById("txtPromedio").value = promedio;
}

/**********************************   *************************************************** */
let opcionesCheck = document.getElementsByName("checkMostrar");

opcionesCheck.forEach(elementCheck => {
    elementCheck.addEventListener("change", function(){
      MapearCheckeados();
    })
  });
  
  function ObtenerCheckeados(){
    let chequeados = [];
    opcionesCheck.forEach(element => {
      if(element.checked){
        chequeados.push(element.value);
      }    
    });
    return chequeados;
  }
  
  function MapearCheckeados(){
    let checkeados = ObtenerCheckeados();
    let nuevaLista = listaMascotas.map(function(elementActual){
      let retorno = {};
      checkeados.forEach(elementCheckeado => {
        retorno["id"] = elementActual.id;
        switch (elementCheckeado) {
          case "titulo":
            retorno["titulo"] = elementActual.titulo;
            break;
          case "transaccion":
              retorno["transaccion"] = elementActual.transaccion;
              break;
          case "descripcion":
            retorno["descripcion"] = elementActual.descripcion;
            break;
          case "precio":
            retorno["precio"] = elementActual.precio;
            break;
          case "animal":
            retorno["animal"] = elementActual.animal;
            break;
        case "raza":
                retorno["raza"] = elementActual.raza;
                break;
        case "fechanacimiento":
                retorno["fechanacimiento"] = elementActual.fecha_nacimiento;
                 break;
         case "vacuna":
                retorno["vacuna"] = elementActual.vacuna;
                 break;                
          default:
            break;
        }
      });
      return retorno;
    });
    CrearTablaConDatos(nuevaLista);    
  }
  
  