const secondsInterval = 10;
var myVar = setInterval(submitTXs, (1000 * secondsInterval));

function submitTXs() {
    submitTempReadingTX();
    //submitForceReadingTX();
}

function submitTempReadingTX() {

    const centigrade =  Math.floor((Math.random() * 16) + 0);
    const relativeHumidity =  Math.floor(Math.random() * 101);
    const barometricPressure = Math.floor((Math.random() * 7) + 26);

    const params = {
        $class: "org.acme.shipping.iot.TakeTemperatureReading",
        shipment: "org.acme.shipping.iot.Shipment#SHIP_001",
        latitude: "999",
        longitude: "999",
        timeStamp: Date.now(),
        centigrade: centigrade,
        relativeHumidity: relativeHumidity,
        barometricPressure: barometricPressure
    }
    
    var request = require('request');
    const jsonParams = JSON.stringify(params);
    request.post({url:'http://localhost:3000/api/TakeTemperatureReading', body: params, json: true, headers: {'contentType': 'application/json'}}, function optionalCallback(err, httpResponse, body) {
        if (err)
            console.log("message:" +  err);
        else
            console.log("message:" + JSON.stringify(body));
    });

    console.log("**************************");
    console.log("centigrade:" + centigrade);
    console.log("relativeHumidity:" + relativeHumidity);
    console.log("barometricPressure:" + barometricPressure);
}

function submitForceReadingTX() {

    const xAxisForce =  Math.floor((Math.random() * 2) + -2);
    const yAxisForce =  Math.floor((Math.random() * 2) + -2);
    const zAxisForce =  Math.floor((Math.random() * 1.5) + .5);

    const params = {
        $class: "org.acme.shipping.iot.TakeForceReading",
        shipment: "org.acme.shipping.iot.Shipment#SHIP_001",
        latitude: "999",
        longitude: "999",
        timeStamp: Date.now(),
        xAxisGForce: xAxisForce,
        yAxisGForce: yAxisForce,
        zAxisGForce: zAxisForce
    }
    
    var request = require('request');
    const jsonParams = JSON.stringify(params);
    request.post({url:'http://localhost:3000/api/TakeForceReading', body: params, json: true, headers: {'contentType': 'application/json'}}, function optionalCallback(err, httpResponse, body) {
        if (err)
            console.log("message:" +  err);
        else
            console.log("message:" + JSON.stringify(body));
    });

    console.log("**************************");
    console.log("X Axis Force:" + xAxisForce);
    console.log("Y Axis Force:" + yAxisForce);
    console.log("Z Axis Force:" + zAxisForce);
}
