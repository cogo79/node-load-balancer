"use strict";
module.exports = function(array) {
	var _currentIndex = 0;
	var previous = null;
	function getNext() {
		var i = _currentIndex;
		if (_currentIndex <= array.length - 2) {
			_currentIndex++;
		} else {
			_currentIndex = 0;
		}
		previous = array[i];
		return array[i];
	}
	function getPrevious() {
		if (previous)
			return previous;
		else
			return null;
	}
	function arrayLength() {
		return array.length;
	}
	function setIndex(i) {
		if (i >= 0 && i <= array.length-1 && typeof i === "number") {
			_currentIndex = i;
		}
	}
	function getCurrentIndex() {
		return _currentIndex;
	}
	return {
		getNext: getNext,
		getPrevious: getPrevious,
		arrayLength: arrayLength,
		setIndex: setIndex,
		getCurrentIndex: getCurrentIndex
	};
}