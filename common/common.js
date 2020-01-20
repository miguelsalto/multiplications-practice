"use strict";

class Multiplicacion {
    constructor(num1, num2) {
        this.num1 = num1;
        this.num2 = num2;
    }

    esRespuestaCorrecta(respuesta) {
        return Math.abs((this.num1 * this.num2) - respuesta) < 1e-6;
    }
}

class Term {
    constructor(number, positive) {
        this.number = number;
        this.sign = positive ? '' : '-';
    }

    getText() {
        return `${this.sign}${this.number}`
    }

    setNumber(number) {
        this.number = number;
    }

    getValue() {
        return this.sign === '-' ? -this.number : this.number;
    }

}

function sum(x, y) {
    return x + y;
}

function subtract(x, y) {
    return x - y;
}

function multiply(x, y) {
    return x * y;
}

function divide(x, y) {
    return x / y;
}

const _SIGN_TO_OPERATION = {
    '+': sum,
    '-': subtract,
    '*': multiply,
    '/': divide
};

class Operation {
    constructor(term1, term2, sign) {
        this.term1 = term1;
        this.term2 = term2;
        this.sign = sign;
    }

    getText() {
        return `(${this.term1.getText()}) ${this.sign} (${this.term2.getText()})`
    }

    getResult() {
        const val1 = this.term1.getValue();
        const val2 = this.term2.getValue();
        return _SIGN_TO_OPERATION[this.sign](val1, val2);
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

    incrementarSegundo() {
        if (this.segundos === 59) {
            this._cambiarAlMinutoSiguiente();
        } else {
            this.segundos++;
        }
    }

    _cambiarAlMinutoAnterior() {
        this.minutos--;
        this.segundos = 59;
    }

    _cambiarAlMinutoSiguiente() {
        this.minutos++;
        this.segundos = 0;
    }

    estaFinalizado() {
        return this.minutos === 0 && this.segundos === 0;
    }
}

function getById(id) {
    return document.getElementById(id);
}

function show(id) {
    let style = getById(id).style;
    style.display = 'block';
    style.visibility = "visible";
}

function hide(id) {
    let style = getById(id).style;
    style.display = 'none';
    style.visibility = "hidden";
}
