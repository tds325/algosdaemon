"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/bindHub").build();

document.getElementById("startButton").disabled = true;

connection.on("ReceiveMessage", function (cellGrid) {
    document.getElementById("conwayContainer").
})