"use strict";

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

function getById(id) {
    return document.getElementById(id);
}
