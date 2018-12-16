"use strict";
const RENGLONES = 5;
const MULTIPLICACIONES_POR_RENGLON = 2;
const TOTAL_MULTIPLICACIONES = MULTIPLICACIONES_POR_RENGLON * RENGLONES;

let multiplicaciones = [];

function preparar() {
    agregarListeners();
}

function generarTest() {
    crearMultiplicaciones();
    generarMultiplicacionesHtml();
    getById("btnCalificar").style.display = 'block';
}

function agregarListeners() {
    getById('btnGenerar').addEventListener('click', generarTest);
    getById('btnCalificar').addEventListener('click', calificar);
}

function crearMultiplicaciones() {
    multiplicaciones = [];
    for (let i = 0; i < TOTAL_MULTIPLICACIONES; i++) {
        let num1 = generaNumeroConDecimales(10, 2);
        let num2 = generaNumeroConDecimales(10, 2);
        multiplicaciones.push(new Multiplicacion(num1, num2));
    }
}

function calificar() {
    let resultado = obtenResultado();
    colorearCeldasMedianteCalificacion(resultado);
    alert(creaResumen(resultado));
}

function obtenResultado() {
    let correctas = [];
    let errores = [];
    for (let i = 0; i < multiplicaciones.length; i++) {
        if (multiplicaciones[i].esRespuestaCorrecta(getRespuestaUsuario(i))) {
            correctas.push(i);
        } else {
            errores.push(i);
        }
    }
    return {correctas: correctas, errores: errores};
}

function colorearCeldasMedianteCalificacion(resultado) {
    colorearCeldaMultiplicaciones(resultado.errores, 'red');
    colorearCeldaMultiplicaciones(resultado.correctas, 'green');
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
        con ${resultado.errores.length} errores`;
}

function getRespuestaUsuario(indice) {
    let txt = getById(`m${indice}`);
    let resp = parseFloat(txt.value);
    return isNaN(resp) ? -1 : resp;
}

function generaNumeroConDecimales(maximoEntero, numeroDecimales) {
    let factor = Math.pow(10, numeroDecimales);
    let entero = generaAleatorio(0, maximoEntero);
    let decimales = generaAleatorio(0, factor - 1);
    let result = entero + (decimales / factor);
    return parseFloat(Number(result).toFixed(numeroDecimales));
}

function generarMultiplicacionesHtml() {
    getById('content').innerHTML = `<table border="1"><tr>${generarRenglonesHtml()}</tr></table>`;
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
    return `<td id="tdOperacion${indice}">${generarCeldaMultiplicacion(indice, multiplicacion)}</td>`;
}

function generarCeldaMultiplicacion(indice, multiplicacion) {
    return `<table>
        <tr><td></td><td style="text-align: right">${multiplicacion.num1}</td></tr>
        <tr><td>x</td><td style="text-align: right">${multiplicacion.num2}</td></tr>
        <tr><td>=</td><td id="tdCaja${indice}"><input type="text" id="m${indice}" size="10"></td></tr>
    </table>`;
}
