"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/Hubs/BindHub").configureLogging(signalR.LogLevel.Debug).build();

var conwayInterval;
var safeToClear;
var timeInterval;
var startButton;
var pauseButton;
var mouseIsDown;

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

    waitForElement("resetButton").then(fulfilled => {
        try {
            resetButton = document.getElementById("resetButton");
        }
        catch {

        }
    }, onrejected => {});
    resetButton.addEventListener('click', async (event) => {
        await pauseConway();
        let arrayLen = document.getElementById("conwayContainer").children.length;
        var array = [];
        for (var index = 0; index < arrayLen; index++) {
            array.push(false);
        }
        connection.invoke("conwayStep", array);
    });

    document.addEventListener('mousedown', (e) => { mouseIsDown = true; });
    document.addEventListener('mouseup', (e) => { mouseIsDown = false; });

    startButton.disabled = true;

    var sideLen = document.getElementById("sideLen");
    
    sideLen.addEventListener('input', (event) => {
        var selectedOption = event.target.value;
        resizeGrid(selectedOption);
    });

    try {
        var selection = document.getElementById("sideLen");
        var side = getQueryVariable("side");
        side === undefined ? selection.value = 35 : selection.value = side;

        document.getElementById("intervalOutput").value = (1000 - parseInt(document.getElementById("timeInterval").value)) / 1000;
    }
    catch (error) {
        console.log(error)
    }
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

function dragStart(event) {
    event.preventDefault();
}

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var index = 0; index < vars.length; index++) {
        var pair = vars[index].split("=");
        if (pair[0] === variable) {
            return pair[1];
        }
    }
}

function resizeGrid(num) {
    console.log("changed");
    window.location.href = window.location.pathname + "?side=" + num;
}

function waitForElement(id) {
    return new Promise(resolve => {
        if (document.getElementById(id) !== null) {
            return resolve(document.getElementById(id));
        }
        const observer = new MutationObserver(mutations => {
            if (document.getElementById(id)) {
                resolve(document.getElementById(id));
                observer.disconnect;
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

function toggleCellStatus(id, bool) {
    if (mouseIsDown || bool) {
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
                    //sleep((parseInt(timeInterval.value) - timeDiff)/2);
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