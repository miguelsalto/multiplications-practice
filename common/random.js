const SIGNS = ['+', '-', '*', '/'];

function generaAleatorio(min, max) {
    return parseInt((Math.random() * (max - min + 1)) + min);
}

function generateTrueOrFalse() {
    return Math.random() >= 0.5;
}

function generateTerm() {
    const value = generaAleatorio(1, 99);
    return new Term(value, generateTrueOrFalse());
}

function generateOperation() {
    const sign = SIGNS[generaAleatorio(0, 3)];
    const term1 = generateTerm();
    const term2 = generateTerm();
    if (sign === '/') {
        const factor = generaAleatorio(2, 9);
        const newValue = Math.abs(term2.number * factor);
        term1.setNumber(parseInt(newValue));
    }
    return new Operation(term1, term2, sign);
}