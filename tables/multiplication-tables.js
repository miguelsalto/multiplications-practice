"use strict";
const RENGLONES = 12;
const MULTIPLICACIONES_POR_RENGLON = 9;
const MAXIMO_NUMERO_EN_MULTIPLICACION = 12;
const TOTAL_MULTIPLICACIONES = MULTIPLICACIONES_POR_RENGLON * RENGLONES;

let timer;
let tabla = [];
let multiplicaciones;
let tiempo;

function preparar() {
    crearTablaDeMultiplicaciones();
    agregarListeners();
}

function crearTablaDeMultiplicaciones() {
    for (let n1 = 1; n1 <= MAXIMO_NUMERO_EN_MULTIPLICACION; n1++) {
        for (let n2 = 1; n2 <= MAXIMO_NUMERO_EN_MULTIPLICACION; n2++) {
            tabla.push(new Multiplicacion(n1, n2));
        }
    }
}

function agregarListeners() {
    getById('btnGenerar').addEventListener('click', generarTest);
    getById("btnCalificar").addEventListener('click', calificar);
}

function generarTest() {
    generarMultiplicaciones();
    generarTablaDeMultiplicacionesHtml();
    asignarTiempoInicial();
    mostrarTiempo();
    empezarTimer();
    situarFocoPrimeraOperacion();
}

function generarMultiplicaciones() {
    multiplicaciones = tabla.slice();
    for (let i = 0; i < TOTAL_MULTIPLICACIONES; i++) {
        let indiceDeIntercambio = i + generarNumeroAleatorio(multiplicaciones.length - i);
        intercambiar(multiplicaciones, i, indiceDeIntercambio);
    }
}

function generarTablaDeMultiplicacionesHtml() {
    getById('content').innerHTML = `<table border="1"><tr>${generarRenglonesHtml()}</tr></table>`;
    agregarListenerTestTerminado();
}

function agregarListenerTestTerminado() {
    document.addEventListener('keyup', verificarTestTerminado);
}

function verificarTestTerminado() {
    if (getById("m0")) {
        let respondidas = 0;
        for (let i = 0; i < TOTAL_MULTIPLICACIONES; i++) {
            let txt = getById(`m${i}`);
            let resp = parseInt(txt.value);
            respondidas += isNaN(resp) ? 0 : 1;
        }
        if (respondidas === TOTAL_MULTIPLICACIONES) {
            show("btnCalificar");
        } else {
            hide("btnCalificar");
        }
    }
}

function asignarTiempoInicial() {
    tiempo = new Tiempo(3, 0);
}

function mostrarTiempo() {
    let lblTiempo = getById('lblTiempo');
    let prefijo = tiempo.segundos < 10 ? '0' : '';
    lblTiempo.innerHTML = `${tiempo.minutos}:${prefijo}${tiempo.segundos}`;
}

function empezarTimer() {
    if (timer) {
        clearInterval(timer);
    }
    timer = setInterval(actualizarTiempo, 1000);
}

function situarFocoPrimeraOperacion() {
    getById("m0").focus();
}

function actualizarTiempo() {
    tiempo.restarSegundo();
    mostrarTiempo();
    mostrarAciertosSiTiempoTerminado();
}

function generarNumeroAleatorio(numeroMaximo) {
    return Math.floor(Math.random() * numeroMaximo);
}

function intercambiar(array, i, j) {
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;
}

function generarRenglonesHtml() {
    let renglonesHtml = '';
    for (let renglon = 0; renglon < RENGLONES; renglon++) {
        renglonesHtml += generarRenglonHtml(renglon);
    }
    return renglonesHtml;
}

function generarRenglonHtml(indiceRenglon) {
    let indice = indiceRenglon * MULTIPLICACIONES_POR_RENGLON;
    let reglonHtml = '';
    for (let i = 0; i < MULTIPLICACIONES_POR_RENGLON; i++) {
        reglonHtml += generarMultiplicacionHtml(indice++);
    }
    return `<tr>${reglonHtml}<tr>`;
}

function generarMultiplicacionHtml(indice) {
    let multiplicacion = multiplicaciones[indice];
    let celdaOperacion = `<td id="tdOperacion${indice}">${multiplicacion.num1} x ${multiplicacion.num2} = </td>`;
    let celdaCaja = `<td id="tdCaja${indice}"><input type="text" id="m${indice}" size="5"></td>`;
    return `${celdaOperacion}${celdaCaja}`;
}

function mostrarAciertosSiTiempoTerminado() {
    if (tiempo.estaFinalizado()) {
        calificar();
    }
}

function calificar() {
    clearInterval(timer);
    hide("btnCalificar");
    mostrarResultado();
}

function mostrarResultado() {
    let resultado = obtenResultado();
    colorearCeldasMedianteCalificacion(resultado);
    alert(creaResumen(resultado));
}

function obtenResultado() {
    let correctas = [];
    let errores = [];
    let faltantes = [];
    for (let i = 0; i < TOTAL_MULTIPLICACIONES; i++) {
        const resp = getRespuestaUsuario(i);
        if (resp >= 0) {
            const indices = multiplicaciones[i].esRespuestaCorrecta(resp) ? correctas : errores;
            indices.push(i);
        } else {
            faltantes.push(i);
        }
    }
    return {correctas: correctas, errores: errores, faltantes: faltantes};
}

function getRespuestaUsuario(indice) {
    let txt = getById(`m${indice}`);
    let resp = parseInt(txt.value);
    return isNaN(resp) ? -1 : resp;
}

function colorearCeldasMedianteCalificacion(resultado) {
    colorearCeldaMultiplicaciones(resultado.errores, 'red');
    colorearCeldaMultiplicaciones(resultado.correctas, 'green');
    colorearCeldaMultiplicaciones(resultado.faltantes, 'yellow');
}

function colorearCeldaMultiplicaciones(celdas, color) {
    for (let celda of celdas) {
        coloreaCeldaMultiplicacion(celda, color);
    }
}

function coloreaCeldaMultiplicacion(indice, color) {
    getById(`tdOperacion${indice}`).style.backgroundColor = color;
    getById(`tdCaja${indice}`).style.backgroundColor = color;
}

function creaResumen(resultado) {
    return `${resultado.correctas.length}/${TOTAL_MULTIPLICACIONES} 
        con ${resultado.errores.length} errores 
        y ${resultado.faltantes.length} no contestadas`;
}
