"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/Hubs/BindHub").configureLogging(signalR.LogLevel.Debug).build();

var conwayInterval;

document.addEventListener("DOMContentLoaded", () => {
    var timeInterval = document.getElementById("timeInterval");
    timeInterval.addEventListener("mouseup", updateOutputTimeIntervalHtml);

    var startButton = document.getElementById("startButton");
    startButton.addEventListener('click', (event) => {
        startConway(event);
        console.log(event);
    });

    var pauseButton = document.getElementById("pauseButton");
    pauseButton.addEventListener('click', (event) => {
        pauseConway();
        console.log(event);
    });

    startButton.disabled = true;
});

connection.on("ReceiveMessage", (cellArray) => {
    var domCellGrid = document.getElementById("conwayContainer");
    var children = domCellGrid.children;

    var cellType;
    for (var index = 0; index < children.length; index++) {
        children[index].classList.remove('dead', 'alive');
        cellArray[index] ? cellType = 'alive' : cellType = 'dead';
        children[index].classList.add(cellType);
    }
});

function toggleCellStatus(id) {
    var cell = document.getElementById(id);
    var isDead = cell.classList.contains("dead");
    if (isDead) {
        cell.classList.remove("dead");
        cell.classList.add("alive");
    }
    else {
        cell.classList.remove("alive");
        cell.classList.add("dead");
    }
}

function updateOutputTimeIntervalHtml() {
    document.getElementById("intervalOutput").textContent = (1000 - parseInt(timeInterval.value)) / 1000;
    timeInterval = document.getElementById("timeInterval");
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function startConway(event) {
    startButton.disabled = true;
    console.log(event);
    conwayInterval = getInterval();
}

async function stepConway(event) {
    console.log(timeInterval.value);
    var cellGrid = document.getElementById("conwayContainer");
    var cellArray = [];
    for (var index = 0; index < cellGrid.children.length; index++) {
        cellArray.push(cellGrid.children[index].classList.contains("alive"));
    }
    try {
        await connection.invoke("conwayStep", cellArray);

    } catch (error) {
        console.log(error);
    }

    conwayInterval = getInterval(conwayInterval);
}

function getInterval(interval) {
    clearInterval(interval);
    return setInterval(async (event) => { await stepConway(event); }, 1000 - parseInt(timeInterval.value));
}

async function pauseConway() {
    startButton.disabled = false;
    clearInterval(conwayInterval);
}

function failureCallBack(error) {
    console.log(error);
}

function messageSentToClient() {
    connection.send("ReceiveMessage");
}

function fulfilled() {
    console.log("Connection to user hub successful");
    startButton.disabled = false;

}

function rejected() {
    console.log("Connection to user hub failed");
}

connection.start().then(fulfilled, rejected);