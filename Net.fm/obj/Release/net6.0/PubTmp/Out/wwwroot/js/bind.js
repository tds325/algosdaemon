"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/Hubs/BindHub").configureLogging(signalR.LogLevel.Debug).build();

var conwayInterval;
var safeToClear;
var timeInterval;
var startButton;
var pauseButton;

document.addEventListener("DOMContentLoaded", () => {
    timeInterval = document.getElementById("timeInterval");
    timeInterval.addEventListener("mouseup", updateOutputTimeIntervalHtml);

    startButton = document.getElementById("startButton");
    startButton.addEventListener('click', (event) => {
        startConway(event);
    });

    pauseButton = document.getElementById("pauseButton");
    pauseButton.addEventListener('click', (event) => {
        pauseConway();
    });

    resetButton = document.getElementById("resetButton");
    resetButton.addEventListener('click', (event) => {
        await pauseConway();
        let arrayLen = document.getElementById("conwayContainer").children.length;
        var array = [];
        for (var index = 0; index < arrayLen; index++) {
            array.push(false);
        }
        await connection.invoke("conwayStep", array);
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
    safeToClear = false;
    conwayInterval = getTimeout(conwayInterval);
}

async function stepConway() {
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
    return timeInterval;
}

async function getTimeout(interval) {
    clearTimeout(interval);

     return setTimeout(async function run() {
        safeToClear = false;
        var startTime = new Date();
        var endTime;

        await stepConway().then((timeInterval) => {
            conwayInterval = setTimeout(async (timeInterval) => {
                endTime = new Date();
                var timeDiff = endTime - startTime;
                if (timeDiff <= parseInt(timeInterval.value)) {
                    sleep(parseInt(timeInterval.value) - timeDiff);
                }
                await run();
            }, (1000 - parseInt(timeInterval.value)), timeInterval);
        }, (error) => {
            console.log(error);
        });
        safeToClear = true;
    }, (1000 - parseInt(timeInterval.value)), timeInterval);
}

async function pauseConway() {
    if (safeToClear) {
        clearTimeout(conwayInterval);
        startButton.disabled = false;
    }
    else {
        setTimeout(pauseConway, 100);
    }
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