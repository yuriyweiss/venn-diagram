let circlesCanvas = null;
let r1 = 0.0;
let r2 = 0.0;
let x0 = 0.0;
let x1 = 0.0;
let stepsNumber = 100;
let step = 0.0;
let resArray = new Array(stepsNumber);

$(document).ready(function () {
    showStatus('Page loaded');
    circlesCanvas = $('#circles_canvas')[0];
    circlesCanvas.width = window.innerWidth - 60;
    circlesCanvas.height = window.innerHeight - 60;
});

function showStatus(message) {
    $('#status_bar').text(message);
    console.log(message);
}

function runCalculation() {
    let square1 = parseFloat($('#square_1').val());
    let square2 = parseFloat($('#square_2').val());
    let squareIntersect = parseFloat($('#square_intersect').val());
    showStatus('square1: ' + square1 + ', square2: ' + square2 + ', squareIntersect: ' + squareIntersect);

    setupInitialValues(square1, square2);
    fillIntersectionArray();
    let bestFitIndex = findBestFitIndex(squareIntersect);
    let resultDistance = x0 + step * bestFitIndex;
    showStatus('r1: ' + r1 + ', r2: ' + r2 + ', resultDistance: ' + resultDistance);
    drawResult(resultDistance);
}

function setupInitialValues(square1, square2) {
    let r01 = Math.sqrt(square1 / Math.PI);
    let r02 = Math.sqrt(square2 / Math.PI);
    r1 = r01 < r02 ? r01 : r02;
    r2 = r01 < r02 ? r02 : r01;
    x0 = r2 - r1;
    x1 = r2 + r1;
    step = (x1 - x0) / stepsNumber;
    showStatus('r1: ' + r1 + ', r2: ' + r2 + ', x0: ' + x0 + ', x1: ' + x1 + ', step: ' + step);
}

function fillIntersectionArray() {
    // build array of possible intersection squares
    // for each possible centers distance
    // 1. calculate intersection X
    // 2. calculate square in big circle
    // 3. calculate square in small circle
    // 4. sum squares and put to array

    // first point - small circle lays in the big circle
    resArray[0] = Math.PI * r1 * r1;
    for (let i = 1; i < stepsNumber; i++) {
        let centerDistance = x0 + i * step;
        let intersectX = findIntersectionPointX(centerDistance);
        let smallItersectSquare = calcSmallIntersectSquare(intersectX);
        let bigIntersectSquare = calcBigIntersectSquare(intersectX, centerDistance);
        resArray[i] = smallItersectSquare + bigIntersectSquare;
        showStatus('centerDistance: ' + centerDistance + ', intersectX: ' + intersectX);
        showStatus('smallItersectSquare: ' + smallItersectSquare + ', bigIntersectSquare: ' + bigIntersectSquare + ', sumIntersectionSquare: ' + resArray[i]);
    }
}

function findIntersectionPointX(deltaX) {
    return -(r2 * r2 - r1 * r1 - deltaX * deltaX) / 2 / deltaX;
}

function calcSmallIntersectSquare(intersectX) {
    let x = Math.abs(intersectX);
    let sliceSquare = calcSliceSquare(x, r1);
    if (intersectX < 0) {
        return Math.PI * r1 * r1 - sliceSquare;
    }
    return sliceSquare;
}

function calcBigIntersectSquare(intersectX, centerDistance) {
    let x = centerDistance - intersectX;
    return calcSliceSquare(x, r2);
}

function calcSliceSquare(x, r) {
    let y = Math.sqrt(r * r - x * x);
    let angle = Math.acos(x / r);
    // segment square = PI * R^2 / (2*PI) * 2 * angle = angle * R^2
    let segmentSquare = r * r * angle;
    // slice square = segment square - (x*y/2) * 2
    let sliceSquare = segmentSquare - x * y;
    return sliceSquare;
}

function findBestFitIndex(squareIntersect) {
    // find minimum deviation of calculated square and target value
    let minI = 0;
    let minDeviation = Math.abs(squareIntersect - resArray[0]);
    for (let i = 1; i < stepsNumber; i++) {
        let deviation = Math.abs(squareIntersect - resArray[i]);
        if (deviation < minDeviation) {
            minI = i;
            minDeviation = deviation;
        }
    }
    showStatus('bestFitIndex: ' + minI + ', minDeviation: ' + minDeviation);
    return minI;
}

function drawResult(centerDistance) {
    // clear canvas
    let ctx = circlesCanvas.getContext('2d');
    ctx.clearRect(0, 0, circlesCanvas.width, circlesCanvas.height);
    // calculate scaled coords
    let realSize = r1 + centerDistance + r2;
    let canvasSize = 300;
    let scale = canvasSize / realSize;
    let scaledY = Math.round(r2 * scale);
    let scaledX1 = Math.round(r1 * scale);
    let scaledR1 = Math.round(r1 * scale);
    let scaledX2 = Math.round((r1 + centerDistance) * scale);
    let scaledR2 = Math.round(r2 * scale);
    // draw circles
    ctx.strokeStyle = "#FF0000";
    ctx.beginPath();
    ctx.arc(scaledX1, scaledY, scaledR1, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(scaledX2, scaledY, scaledR2, 0, 2 * Math.PI);
    ctx.stroke();
}


