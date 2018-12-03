const RENGLONES = 12;
const MULTIPLICACIONES_POR_RENGLON = 9;
const MAXIMO_NUMERO_EN_MULTIPLICACION = 12;
const TOTAL_MULTIPLICACIONES = MULTIPLICACIONES_POR_RENGLON * RENGLONES;

class Multiplicacion {
    constructor(num1, num2) {
        this.num1 = num1;
        this.num2 = num2;
    }

    esRespuestaCorrecta(respuesta) {
        return (this.num1 * this.num2) === respuesta;
    }
}

class Tiempo {
    constructor(minutos, segundos) {
        this.minutos = minutos;
        this.segundos = segundos;
    }

    restarSegundo() {
        if (this.segundos === 0) {
            this._cambiarAlMinutoAnterior();
        } else {
            this.segundos--;
        }
    }

    _cambiarAlMinutoAnterior() {
        this.minutos--;
        this.segundos = 59;
    }

    estaFinalizado() {
        return this.minutos === 0 && this.segundos === 0;
    }
}

let TIMER;
let TABLA = [];
let MULTIPLICACIONES;
let TIEMPO;

function preparar() {
    crearTablaDeMultiplicaciones();
    agregarListeners();
}

function crearTablaDeMultiplicaciones() {
    for (let n1 = 1; n1 <= MAXIMO_NUMERO_EN_MULTIPLICACION; n1++) {
        for (let n2 = 1; n2 <= MAXIMO_NUMERO_EN_MULTIPLICACION; n2++) {
            TABLA.push(new Multiplicacion(n1, n2));
        }
    }
}

function agregarListeners() {
    let btnGenerar = getById('btnGenerar');
    btnGenerar.addEventListener('click', generarTest);
}

function generarTest() {
    generarMultiplicaciones();
    generarTablaDeMultiplicacionesHtml();
    asignarTiempoInicial();
    mostrarTiempo();
    empezarTimer();
}

function generarMultiplicaciones() {
    MULTIPLICACIONES = TABLA.slice();
    let maxMultiplicaciones = RENGLONES * MULTIPLICACIONES_POR_RENGLON;
    for (let i = 0; i < maxMultiplicaciones; i++) {
        let indiceDeIntercambio = i + generarNumeroAleatorio(MULTIPLICACIONES.length - i);
        intercambiar(MULTIPLICACIONES, i, indiceDeIntercambio);
    }
}

function generarTablaDeMultiplicacionesHtml() {
    getById('content').innerHTML = `<table border="1"><tr>${generarRenglonesHtml()}</tr></table>`;
}

function asignarTiempoInicial() {
    TIEMPO = new Tiempo(2, 0);
}

function mostrarTiempo() {
    let lblTiempo = getById('lblTiempo');
    let prefijo = TIEMPO.segundos < 10 ? '0' : '';
    lblTiempo.innerHTML = `${TIEMPO.minutos}:${prefijo}${TIEMPO.segundos}`;
}

function empezarTimer() {
    TIMER = setInterval(actualizarTiempo, 1000);
}

function actualizarTiempo() {
    TIEMPO.restarSegundo();
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
    let multiplicacion = MULTIPLICACIONES[indice];
    let celdaOperacion = `<td id="tdOperacion${indice}">${multiplicacion.num1} x ${multiplicacion.num2} = </td>`;
    let celdaCaja = `<td id="tdCaja${indice}"><input type="text" id="m${indice}" size="5"></td>`;
    return `${celdaOperacion}${celdaCaja}`;
}

function mostrarAciertosSiTiempoTerminado() {
    if (TIEMPO.estaFinalizado()) {
        clearInterval(TIMER);
        mostrarResultado();
    }
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
            const indices = MULTIPLICACIONES[i].esRespuestaCorrecta(resp) ? correctas : errores;
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

function getById(id) {
    return document.getElementById(id);
}