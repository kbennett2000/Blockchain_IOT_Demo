cd ~/fabric-dev-servers/
./stopFabric.sh
./teardownFabric.sh
./teardownAllDocker.sh
./startFabric.sh
./createPeerAdminCard.sh
cd ~/shipping-network/

composer network install --card PeerAdmin@hlfv1 --archiveFile shipping-network.bna

composer network start --networkName shipping-network --networkVersion 0.2.6-deploy.17 --networkAdmin admin --networkAdminEnrollSecret adminpw --card PeerAdmin@hlfv1 --file networkadmin.card

composer card import --file networkadmin.card

composer network ping --card admin@shipping-network

composer-rest-server
