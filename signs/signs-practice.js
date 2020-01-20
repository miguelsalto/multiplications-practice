"use strict";

const _MAX = 20;
const _operations = [];
let timer;
let tiempo;

function generateTable() {
    let table = document.createElement('table');
    table.setAttribute('class', 'center');
    generateRows(table);
    getById('operations').appendChild(table);
    show('btnScore');
    startClock();
}

function generateRows(table) {
    for (let i = 0; i < _MAX; i++) {
        let operation = generateOperation();
        _operations.push(operation);
        let row = createRow(operation.getText(), i);
        table.appendChild(row);
    }
}

function createRow(operation, idx) {
    let row = document.createElement('tr');
    row.setAttribute('id', `tdRow${idx}`);
    let operationCol = document.createElement('td');
    operationCol.textContent = operation;
    let inputCol = document.createElement('td');
    let input = document.createElement('input');
    input.setAttribute('id', `ans${idx}`);
    inputCol.appendChild(input);
    row.appendChild(operationCol);
    row.appendChild(inputCol);
    return row;
}

function calculateScore() {
    let correct = 0;
    let mistakes = 0;
    for (let i = 0; i < _MAX; i++) {
        let color;
        if (getAnswer(i) === _operations[i].getResult()) {
            correct++;
            color = '#56A804';
        } else {
            mistakes++;
            color = '#FE380D';
        }
        markInputColor(i, color);
    }
    const score = correct * 10 / _MAX;
    getById('score').innerHTML = `Score: ${score}`;
}

function markInputColor(idx, color) {
    getById(`ans${idx}`).style.backgroundColor = color;
}

function getAnswer(idx) {
    return parseInt(getById(`ans${idx}`).value);
}

function startClock() {
    tiempo = new Tiempo(0, 0);
    if (timer) {
        clearInterval(timer);
    }
    timer = setInterval(updateClock, 1000);
}

function updateClock() {
    tiempo.incrementarSegundo();
    showClock();
}

function showClock() {
    let lblTiempo = getById('lblTiempo');
    let prefix = tiempo.segundos < 10 ? '0' : '';
    lblTiempo.innerHTML = `${tiempo.minutos}:${prefix}${tiempo.segundos}`;
}

function addListeners() {
    getById('btnGenerar').addEventListener('click', generateTable);
    getById('btnScore').addEventListener('click', calculateScore);
}