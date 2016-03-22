var singleton = function singleton(){
    //defining a var instead of this (works for variable & function) will create a private definition
    var request = require("request-json");
    var defaultIndex = 0;
	var defaultVideoServerClients = [];
	
	defaultVideoServerClients.push(request.createClient('http://case1-1.neti.systems:3000/'));
	defaultVideoServerClients.push(request.createClient('http://case1-2.neti.systems:3000/'));
	defaultVideoServerClients.push(request.createClient('http://case1-3.neti.systems:3000/'));

	var testIndex = 0;
	var testVideoServerClients = [];
	testVideoServerClients.push(request.createClient('http://localhost:3000/test/case1-1.neti.systems/'));
	testVideoServerClients.push(request.createClient('http://localhost:3000/test/case1-2.neti.systems/'));
	testVideoServerClients.push(request.createClient('http://localhost:3000/test/case1-3.neti.systems/'));

	var clients = defaultVideoServerClients;
	var currentClientIndex = defaultIndex;

	var lastUsedClientLocal = null;
	function nextClient() {
		var i = currentClientIndex;
		if (currentClientIndex <= 1) {
			currentClientIndex++;
		} else {
			currentClientIndex = 0;
		}
		console.log("Will make request to server " + clients[i].host);
		lastUsedClientLocal = clients[i];
		return clients[i];
	}

	function lastUsedClient() { // Intended for testing only
		return lastUsedClientLocal.host;
	}

	function whatsGoingOn() {
		console.log(clients[0].host);
		console.log(clients[1].host);
		console.log(clients[2].host);
	}

	function setToTestMode() {
		currentClientIndex = testIndex;
		clients = testVideoServerClients;
	}

	function setSharpMode() {
		currentClientIndex = defaultIndex;
		testIndex = 0;
		clients = defaultVideoServerClients;
	}

	this.nextClient = nextClient;
	this.setToTestMode = setToTestMode;
	this.setSharpMode = setSharpMode;
	this.whatsGoingOn = whatsGoingOn;
	this.lastUsedClient = lastUsedClient;

    if(singleton.caller != singleton.getInstance){
        throw new Error("This object cannot be instanciated");
    }
}
 
/* ************************************************************************
SINGLETON CLASS DEFINITION
************************************************************************ */
singleton.instance = null;
 
/**
 * Singleton getInstance definition
 * @return singleton class
 */
singleton.getInstance = function(){
    if(this.instance === null){
        this.instance = new singleton();
    }
    return this.instance;
}
 
module.exports = singleton.getInstance();

