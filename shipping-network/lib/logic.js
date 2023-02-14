/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* global getParticipantRegistry getAssetRegistry getFactory */

/**
 * A shipment has been received by an importer
 * @param {org.acme.shipping.iot.ShipmentReceived} shipmentReceived - the ShipmentReceived transaction
 * @transaction
 */
async function payOut(shipmentReceived) {  // eslint-disable-line no-unused-vars

    const contract = shipmentReceived.shipment.contract;
    const shipment = shipmentReceived.shipment;

    console.log('Received at: ' + shipmentReceived.timestamp);
    console.log('Contract arrivalDateTime: ' + contract.arrivalDateTime);


    // if the shipment did not arrive on time the payout is zero
    if (shipmentReceived.timestamp > contract.arrivalDateTime) {
        console.log('Late shipment');
      shipment.status = 'LATE';
    } else {
	    // set the status of the shipment
    	shipment.status = 'ARRIVED';
    }

    // update the state of the shipment
    const shipmentRegistry = await getAssetRegistry('org.acme.shipping.iot.Shipment');
    await shipmentRegistry.update(shipment);
}

/**
 * A temperature reading has been received for a shipment
 * @param {org.acme.shipping.iot.TakeTemperatureReading} takeTemperatureReading - the TemperatureReading transaction
 * @transaction
 */
async function takeTemperatureReading(takeTemperatureReading) {  // eslint-disable-line no-unused-vars

    const shipment = takeTemperatureReading.shipment;

    takeTemperatureReading.exceedsBounds = false;
    takeTemperatureReading.exceedsMinTemperatureBounds = false;
    takeTemperatureReading.exceedsMaxTemperatureBounds = false;
    takeTemperatureReading.exceedsMinRelativeHumidityBounds = false;
    takeTemperatureReading.exceedsMaxRelativeHumidityBounds = false;
    takeTemperatureReading.exceedsMinBarometricPressureBounds = false;
    takeTemperatureReading.exceedsMaxBarometricPressureBounds = false;

    if  (takeTemperatureReading.centigrade < shipment.contract.minTemperature) {
        takeTemperatureReading.exceedsBounds = true;
        takeTemperatureReading.exceedsMinTemperatureBounds = true;
    }
    if  (takeTemperatureReading.centigrade > shipment.contract.maxTemperature) {
        takeTemperatureReading.exceedsBounds = true;
        takeTemperatureReading.exceedsMaxTemperatureBounds = true;
    }

    if  (takeTemperatureReading.relativeHumidity < shipment.contract.minRelativeHumidity) {
        takeTemperatureReading.exceedsBounds = true;
        takeTemperatureReading.exceedsMinRelativeHumidityBounds = true;
    }    
    if  (takeTemperatureReading.relativeHumidity > shipment.contract.maxRelativeHumidity) {
        takeTemperatureReading.exceedsBounds = true;
        takeTemperatureReading.exceedsMaxRelativeHumidityBounds = true;
    }

    if  (takeTemperatureReading.barometricPressure < shipment.contract.minBarometricPressure) {
        takeTemperatureReading.exceedsBounds = true;
        takeTemperatureReading.exceedsMinBarometricPressureBounds = true;
    }    
    if  (takeTemperatureReading.barometricPressure > shipment.contract.maxBarometricPressure) {
        takeTemperatureReading.exceedsBounds = true;
        takeTemperatureReading.exceedsMaxBarometricPressureBounds = true;
    }

    console.log('Adding temperature ' + takeTemperatureReading.centigrade + ' to shipment ' + shipment.$identifier);

    if (shipment.takeTemperatureReadings) {
        shipment.takeTemperatureReadings.push(takeTemperatureReading);
    } else {
        shipment.takeTemperatureReadings = [takeTemperatureReading];
    }

    // create new Temperature Reading asset
    const factory = getFactory();
    const NS = 'org.acme.shipping.iot';

    const readingId = takeTemperatureReading.shipment.shipmentId + '_TEMP_' + Date.now();
    const temperatureReading = factory.newResource(NS, 'TemperatureReading', readingId);
    temperatureReading.exceedsBounds = takeTemperatureReading.exceedsBounds;
    temperatureReading.shipment = factory.newRelationship(NS, 'Shipment', takeTemperatureReading.shipment.shipmentId);    
    temperatureReading.centigrade = takeTemperatureReading.centigrade;
    temperatureReading.relativeHumidity = takeTemperatureReading.relativeHumidity;
    temperatureReading.barometricPressure = takeTemperatureReading.barometricPressure;
    temperatureReading.exceedsMinTemperatureBounds = takeTemperatureReading.exceedsMinTemperatureBounds;
    temperatureReading.exceedsMaxTemperatureBounds = takeTemperatureReading.exceedsMaxTemperatureBounds;
    temperatureReading.exceedsMinRelativeHumidityBounds = takeTemperatureReading.exceedsMinRelativeHumidityBounds;
    temperatureReading.exceedsMaxRelativeHumidityBounds = takeTemperatureReading.exceedsMaxRelativeHumidityBounds;
    temperatureReading.exceedsMinBarometricPressureBounds = takeTemperatureReading.exceedsMinBarometricPressureBounds;
    temperatureReading.exceedsMaxBarometricPressureBounds = takeTemperatureReading.exceedsMaxBarometricPressureBounds;

    // add the reading
    const temperatureReadingRegistry = await getAssetRegistry(NS + '.TemperatureReading');
    await temperatureReadingRegistry.add(temperatureReading);
  
    // add the temp reading to the shipment
    const shipmentRegistry = await getAssetRegistry('org.acme.shipping.iot.Shipment');
    await shipmentRegistry.update(shipment);
}

/**
 * A force reading has been received for a shipment
 * @param {org.acme.shipping.iot.TakeForceReading} takeForceReading - the takeForceReading transaction
 * @transaction
 */
async function takeForceReading(takeForceReading) {  // eslint-disable-line no-unused-vars

    const shipment = takeForceReading.shipment;

    takeForceReading.exceedsMinXAxisGForceBounds = false;
    takeForceReading.exceedsMaxXAxisGForceBounds = false;
    takeForceReading.exceedsMinYAxisGForceBounds = false;
    takeForceReading.exceedsMaxYAxisGForceBounds = false;
    takeForceReading.exceedsMinZAxisGForceBounds = false;
    takeForceReading.exceedsMaxZAxisGForceBounds = false;
    takeForceReading.exceedsBounds = false;

    if  (takeForceReading.xAxisGForce < shipment.contract.minXAxisGForce) {
        takeForceReading.exceedsBounds = true;
        takeForceReading.exceedsMinXAxisGForceBounds = true;
    }
    if  (takeForceReading.xAxisGForce > shipment.contract.maxXAxisGForce) {
        takeForceReading.exceedsBounds = true;
        takeForceReading.exceedsMaxXAxisGForceBounds = true;
    }

    if  (takeForceReading.yAxisGForce < shipment.contract.minYAxisGForce) {
        takeForceReading.exceedsBounds = true;
        takeForceReading.exceedsMinYAxisGForceBounds = true;
    }
    if  (takeForceReading.yAxisGForce > shipment.contract.maxYAxisGForce) {
        takeForceReading.exceedsBounds = true;
        takeForceReading.exceedsMaxYAxisGForceBounds = true;
    }

    if  (takeForceReading.zAxisGForce < shipment.contract.minZAxisGForce) {
        takeForceReading.exceedsBounds = true;
        takeForceReading.exceedsMinZAxisGForceBounds = true;
    }
    if  (takeForceReading.zAxisGForce > shipment.contract.maxZAxisGForce) {
        takeForceReading.exceedsBounds = true;
        takeForceReading.exceedsMaxZAxisGForceBounds = true;
    }

    console.log('Adding X Axis G Force ' + takeForceReading.xAxisGForce + ' to shipment ' + shipment.$identifier);
    console.log('Adding Y Axis G Force ' + takeForceReading.yAxisGForce + ' to shipment ' + shipment.$identifier);
    console.log('Adding Z Axis G Force ' + takeForceReading.zAxisGForce + ' to shipment ' + shipment.$identifier);

    if (shipment.takeForceReadings) {
        shipment.takeForceReadings.push(takeForceReading);
    } else {
        shipment.takeForceReadings = [takeForceReading];
    }
    // create new Temperature Reading asset
    const factory = getFactory();
    const NS = 'org.acme.shipping.iot';

    const readingId = takeForceReading.shipment.shipmentId + '_FORCE_' + Date.now();
    const forceReading = factory.newResource(NS, 'ForceReading', readingId);
    forceReading.exceedsBounds = takeForceReading.exceedsBounds;
    forceReading.shipment = factory.newRelationship(NS, 'Shipment', takeForceReading.shipment.shipmentId);    

    forceReading.xAxisGForce = takeForceReading.xAxisGForce;
    forceReading.yAxisGForce = takeForceReading.yAxisGForce;
    forceReading.zAxisGForce = takeForceReading.zAxisGForce;
    forceReading.exceedsMinXAxisGForceBounds = takeForceReading.exceedsMinXAxisGForceBounds;
    forceReading.exceedsMaxXAxisGForceBounds = takeForceReading.exceedsMaxXAxisGForceBounds;
    forceReading.exceedsMinYAxisGForceBounds = takeForceReading.exceedsMinYAxisGForceBounds;
    forceReading.exceedsMaxYAxisGForceBounds = takeForceReading.exceedsMaxYAxisGForceBounds;
    forceReading.exceedsMinZAxisGForceBounds = takeForceReading.exceedsMinZAxisGForceBounds;
    forceReading.exceedsMaxZAxisGForceBounds  = takeForceReading.exceedsMaxZAxisGForceBounds;

    // add the reading
    const forceReadingRegistry = await getAssetRegistry(NS + '.ForceReading');
    await forceReadingRegistry.add(forceReading);
  
    // add the force reading to the shipment
    const shipmentRegistry = await getAssetRegistry('org.acme.shipping.iot.Shipment');
    await shipmentRegistry.update(shipment);
}

/**
 * Initialize some test assets and participants useful for running a demo.
 * @param {org.acme.shipping.iot.SetupDemo} setupDemo - the SetupDemo transaction
 * @transaction
 */
async function setupDemo(setupDemo) {  // eslint-disable-line no-unused-vars

    const factory = getFactory();
    const NS = 'org.acme.shipping.iot';

    // create the grower
    const grower = factory.newResource(NS, 'Grower', 'farmer@email.com');
    const growerAddress = factory.newConcept(NS, 'Address');
    growerAddress.country = 'USA';
    grower.address = growerAddress;
    grower.pointOfContact = 'Joe DatFarmer';
    grower.phoneNumber = '+0015554443322';

    // create the importer
    const importer = factory.newResource(NS, 'Importer', 'supermarket@email.com');
    const importerAddress = factory.newConcept(NS, 'Address');
    importerAddress.country = 'UK';
    importer.address = importerAddress;
    importer.pointOfContact = 'Johnny The Importer';
    importer.phoneNumber = '+0015551112222';

    // create the shipper
    const shipper = factory.newResource(NS, 'Shipper', 'shipper@email.com');
    const shipperAddress = factory.newConcept(NS, 'Address');
    shipperAddress.country = 'Panama';
    shipper.address = shipperAddress;
    shipper.pointOfContact = 'Alice Shippley Shipperson';
    shipper.phoneNumber = '+0015559876655';

    // create the contract
    const contract = factory.newResource(NS, 'Contract', 'CON_001');
    contract.grower = factory.newRelationship(NS, 'Grower', 'farmer@email.com');
    contract.importer = factory.newRelationship(NS, 'Importer', 'supermarket@email.com');
    contract.shipper = factory.newRelationship(NS, 'Shipper', 'shipper@email.com');
    const tomorrow = setupDemo.timestamp;
    tomorrow.setDate(tomorrow.getDate() + 1);
    contract.arrivalDateTime = tomorrow; // the shipment has to arrive tomorrow
    contract.unitPrice = 0.5; // pay 50 cents per unit
    contract.minTemperature = 5; // min temperature for the cargo
    contract.maxTemperature = 10; // max temperature for the cargo

    contract.minRelativeHumidity = 5;
    contract.maxRelativeHumidity = 10;
    contract.minBarometricPressure = 5;
    contract.maxBarometricPressure = 10;
    contract.minXAxisGForce = 5;
    contract.maxXAxisGForce = 10;
    contract.minYAxisGForce = 5;
    contract.maxYAxisGForce = 10;
    contract.minZAxisGForce = 5;
    contract.maxZAxisGForce = 10;

    // create the shipment
    const shipment = factory.newResource(NS, 'Shipment', 'SHIP_001');
    shipment.type = 'BANANAS';
    shipment.status = 'IN_TRANSIT';
    shipment.unitCount = 5000;
    shipment.contract = factory.newRelationship(NS, 'Contract', 'CON_001');

    // add the growers
    const growerRegistry = await getParticipantRegistry(NS + '.Grower');
    await growerRegistry.addAll([grower]);

    // add the importers
    const importerRegistry = await getParticipantRegistry(NS + '.Importer');
    await importerRegistry.addAll([importer]);

    // add the shippers
    const shipperRegistry = await getParticipantRegistry(NS + '.Shipper');
    await shipperRegistry.addAll([shipper]);

    // add the contracts
    const contractRegistry = await getAssetRegistry(NS + '.Contract');
    await contractRegistry.addAll([contract]);

    // add the shipments
    const shipmentRegistry = await getAssetRegistry(NS + '.Shipment');
    await shipmentRegistry.addAll([shipment]);
}