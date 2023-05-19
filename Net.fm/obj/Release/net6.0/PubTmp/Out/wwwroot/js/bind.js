"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/Hubs/BindHub").configureLogging(signalR.LogLevel.Debug).build();

//document.addEventListener('DOMContentLoaded',  () => {
    var startButton = document.getElementById("startButton")
    startButton.addEventListener('click', (event) => {
        startConway();
        console.log(event);

    });
//});

startButton.disabled = true;

connection.on("ReceiveMessage", (cellArray) => {
    console.log("receive message processed");
    var domCellGrid = document.getElementById("conwayContainer");
    console.log(domCellGrid);
    var children = domCellGrid.children;
    console.log(children);

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

function startConway() {
    var cellGrid = document.getElementById("conwayContainer");

    var cellArray = [];
    for (var index = 0; index < cellGrid.children.length; index++) {
        cellArray.push(cellGrid.children[index].classList.contains("alive"));
    }
    console.log(cellArray);
    try {
        connection.invoke("setCellGrid", cellArray);
    } catch (error) {
        console.log(error);
    }
    

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