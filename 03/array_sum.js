function countArraySum(obj) {
	var sum = 0;
	if ( !Array.isArray(obj) ) {
		return 0;
	}
	for (var i=0; i<obj.length; i++) {
		var currEl = obj[i];
		if ( !Array.isArray(currEl) && isFinite(currEl) && !isNaN(currEl) ) {
			// элемент массива - число
			sum += Number(currEl);
		} else if ( Array.isArray(currEl) ) {
			// элемент массива - вложенный массив
			sum += countArraySum(currEl); // рекурсия
		}
	}
	return sum;
}