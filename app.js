'use strict';

const bleNusServiceUUID  = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
const bleNusCharRXUUID   = '6e400002-b5a3-f393-e0a9-e50e24dcca9e';
const bleNusCharTXUUID   = '6e400003-b5a3-f393-e0a9-e50e24dcca9e';
const MTU = 20;

var bleDevice;
var bleServer;
var nusService;
var rxCharacteristic;
var txCharacteristic;

var connected = false;

function connectionToggle() {
    if (connected) {
        disconnect();
    } else {
        connect();
    }
    //document.getElementById('terminal').focus();
}

// Sets button to either Connect or Disconnect
function setConnButtonState(enabled) {
    if (enabled) {
        document.getElementById("clientConnectButton").innerHTML = "Disconnect";
    } else {
        document.getElementById("clientConnectButton").innerHTML = "Connect";
    }
}

function connect() {
    if (!navigator.bluetooth) {
        //console.log('WebBluetooth API is not available.\r\n' +
        //            'Please make sure the Web Bluetooth flag is enabled.');
        document.getElementById("BT").textContent = 'Please make sure the Web Bluetooth flag is enabled.';
        //window.term_.io.println('WebBluetooth API is not available on your browser.\r\n' +
        //            'Please make sure the Web Bluetooth flag is enabled.');
        return;
    }
    //console.log('Requesting Bluetooth Device...');
    document.getElementById("BT").textContent = 'Requesting Bluetooth Device...';
    navigator.bluetooth.requestDevice({
        //filters: [{services: []}]
        optionalServices: [bleNusServiceUUID],
        acceptAllDevices: true
    })
    .then(device => {
        bleDevice = device; 
        //console.log('Found ' + device.name);
        //console.log('Connecting to GATT Server...');
        document.getElementById("BT").textContent = 'Found ' + device.name;
        document.getElementById("BT").textContent = 'Connecting to GATT Server...';
        bleDevice.addEventListener('gattserverdisconnected', onDisconnected);
        return device.gatt.connect();
    })
    .then(server => {
        //console.log('Locate NUS service');
        document.getElementById("BT").textContent = 'Locate NUS service';
        return server.getPrimaryService(bleNusServiceUUID);
    }).then(service => {
        nusService = service;
        //console.log('Found NUS service: ' + service.uuid);
        document.getElementById("BT").textContent = 'Found NUS service: ' + service.uuid;
    })
    .then(() => {
        //console.log('Locate RX characteristic');
        document.getElementById("BT").textContent = 'Locate RX characteristic';
        return nusService.getCharacteristic(bleNusCharRXUUID);
    })
    .then(characteristic => {
        rxCharacteristic = characteristic;
        //console.log('Found RX characteristic');
        document.getElementById("BT").textContent = 'Found RX characteristic';
    })
    .then(() => {
        //console.log('Locate TX characteristic');
        document.getElementById("BT").textContent = 'Locate TX characteristic';
        return nusService.getCharacteristic(bleNusCharTXUUID);
    })
    .then(characteristic => {
        txCharacteristic = characteristic;
        //console.log('Found TX characteristic');
        document.getElementById("BT").textContent = 'Found TX characteristic';
    })
    .then(() => {
        //console.log('Enable notifications');
        document.getElementById("BT").textContent = 'Enable notifications';
        return txCharacteristic.startNotifications();
    })
    .then(() => {
        //console.log('Notifications started');
        document.getElementById("BT").textContent = 'Notifications started';
        txCharacteristic.addEventListener('characteristicvaluechanged',
                                          handleNotifications);
        connected = true;
        //window.term_.io.println('\r\n' + bleDevice.name + ' Connected.');
        nusSendString('\r');
        setConnButtonState(true);
    })
    .catch(error => {
        //console.log('' + error);
        document.getElementById("BT").textContent = '' + error;
        //window.term_.io.println('' + error);
        if(bleDevice && bleDevice.gatt.connected)
        {
            bleDevice.gatt.disconnect();
        }
    });
}

function disconnect() {
    if (!bleDevice) {
        //console.log('No Bluetooth Device connected...');
        document.getElementById("BT").textContent = 'No Bluetooth Device connected...';
        return;
    }
    //console.log('Disconnecting from Bluetooth Device...');
    document.getElementById("BT").textContent = 'Disconnecting from Bluetooth Device...';
    if (bleDevice.gatt.connected) {
        bleDevice.gatt.disconnect();
        connected = false;
        setConnButtonState(false);
        //console.log('Bluetooth Device connected: ' + bleDevice.gatt.connected);
        document.getElementById("BT").textContent = 'Bluetooth Device connected: ' + bleDevice.gatt.connected;
    } else {
        //console.log('> Bluetooth Device is already disconnected');
        document.getElementById("BT").textContent = '> Bluetooth Device is already disconnected';
    }
}

function onDisconnected() {
    connected = false;
    window.term_.io.println('\r\n' + bleDevice.name + ' Disconnected.');
    setConnButtonState(false);
}


var start = 0;
var end = 0;
var toSend = {};
var raw = [];

function handleNotifications(event) {
    //console.log('notification');
    document.getElementById("BT").textContent = 'notification';
    let value = event.target.data;
    // Convert raw data bytes to character values and use these to 
    // construct a string.
    
    let str = "";
    for (let i = 0; i < value.byteLength; i++) {
        str += String.fromCharCode(value.getUint8(i));
    }
    
    //window.term_.io.print(str);
    //console.log(str);
    document.getElementById("BT").textContent = str;
    
    for(var i=0;i < str.length;i=i+1){
        //console.log('Data: ', str[i]);
        document.getElementById("QTN").textContent = str[i];
        raw.push(str[i]);
        
        if(str[i].charCodeAt(0) === '{'.charCodeAt(0)){
            start = 1;
            //console.log("STARTED");
            document.getElementById("QTN").textContent = "STARTED";
        }
        
        if(str[i].charCodeAt(0) === '}'.charCodeAt(0)){
            end = 1;
            //console.log("ENDED");
            document.getElementById("QTN").textContent = "ENDED";
        }
        
        if(start === 1 && end === 1){
            start = 0;
            end = 0;
            var msg = JSON.parse(raw.join(""));
            
            toSend = {
                type: "message",
                n: msg.n,
                ex: msg.ex,
                ey: msg.ey,
                ez: msg.ez,
                date: Date.now()
            };
            
            document.getElementById("QTN").textContent = JSON.stringify(toSend);
            
            raw = [];
        }
        
    }
    
}

function nusSendString(s) {
    if(bleDevice && bleDevice.gatt.connected) {
        //console.log("send: " + s);
        document.getElementById("BT").textContent = "send: " + s;
        let val_arr = new Uint8Array(s.length)
        for (let i = 0; i < s.length; i++) {
            let val = s[i].charCodeAt(0);
            val_arr[i] = val;
        }
        sendNextChunk(val_arr);
    } else {
        //window.term_.io.println('Not connected to a device yet.');
    }
}

function sendNextChunk(a) {
    let chunk = a.slice(0, MTU);
    rxCharacteristic.writeValue(chunk)
      .then(function() {
          if (a.length > MTU) {
              sendNextChunk(a.slice(MTU));
          }
      });
}

/*
function initContent(io) {
    io.println("\r\n\
Welcome to Web Device CLI V0.1.0 (03/19/2019)\r\n\
Copyright (C) 2019  makerdiary.\r\n\
\r\n\
This is a Web Command Line Interface via NUS (Nordic UART Service) using Web Bluetooth.\r\n\
\r\n\
  * Source: https://github.com/makerdiary/web-device-cli\r\n\
  * Live:   https://makerdiary.github.io/web-device-cli\r\n\
");
}
*/

/*
function setupHterm() {
    const term = new hterm.Terminal();

    term.onTerminalReady = function() {
        const io = this.io.push();
        io.onVTKeystroke = (string) => {
            nusSendString(string);
        };
        io.sendString = nusSendString;
        initContent(io);
        this.setCursorVisible(true);
        this.keyboard.characterEncoding = 'raw';
    };
    term.decorate(document.querySelector('#terminal'));
    term.installKeyboard();

    term.contextMenu.setItems([
        ['Terminal Reset', () => {term.reset(); initContent(window.term_.io);}],
        ['Terminal Clear', () => {term.clearHome();}],
        [hterm.ContextMenu.SEPARATOR],
        ['GitHub', function() {
            lib.f.openWindow('https://github.com/makerdiary/web-device-cli', '_blank');
        }],
    ]);

    // Useful for console debugging.
    window.term_ = term;
}
*/

/*
window.onload = function() {
    lib.init(setupHterm);
};
*/