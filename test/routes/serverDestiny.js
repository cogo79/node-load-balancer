var singleton = function singleton(){
    //defining a var instead of this (works for variable & function) will create a private definition

 	var destiny = [];
	function happened() {
		var happenedResult;
		if (destiny.length > 0) {
			happenedResult = destiny.pop();
			if (typeof happenedResult === 'number') {
				if (happenedResult === 200 || happenedResult === 418 || happenedResult === 500) {
					return happenedResult;
				} else {
					return random();
				}
			} else {
				return random();
			}
		} else {
			return random();
		}
		function random() {
			var happenedResult = Math.random();
			if (happenedResult < 0.333) return 200;
			else if (happenedResult > 0.666) return 500;
			else return 418;
		}
	};

	function willHappen(array) {
		if (Array.isArray(array)) {
			destiny = array;
			return true;
		} else {
			return false;
		}
	};

	this.happened = happened;
	this.willHappen = willHappen;

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



