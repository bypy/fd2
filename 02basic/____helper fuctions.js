
function isHash(obj) {
	// вернет ответ яявляется ли obj хэшем
	return typeof obj === 'object' && typeof obj.hasOwnProperty === 'function'
}

function isKeyInHash(word, dataHash) {
	// проверяет в хэше dataHash присутствуие ключа word
	if ( isHash(dataHash) ) return dataHash.hasOwnProperty(word);
}





// с хэшем !или массивом образцовых данных
// => массив, содержащий варианты слов из dataSet
// похожие по написанию с word