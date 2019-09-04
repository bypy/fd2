// вспомогательные объекты для обработки пользовательских данных

var worldCountriesH = {}; // для загрузки всех стран мира и их столиц

(function(){
	// записываем в переменную worldCountriesH
	// хэш всех стран мира с их столицами из файла countries.json

	getJSONData("countries.json", processXhrResponse);

	function getJSONData(fileName, callback) {
		// получает с сервера содержимое файла fileName (ожидается json) 
		var xhr = new XMLHttpRequest();
		xhr.open("GET", fileName, true);
		xhr.send();
		xhr.onreadystatechange = function() {
			if (xhr.readyState != 4) return;
			if (xhr.status != 200) {
				console.log(xhr.status + ": " + xhr.statusText);
			} else {
				callback(xhr.responseText);
			}
		};
	}
})();

function done() {
	console.log(worldCountriesH);
	return worldCountriesH;
}

function processXhrResponse(responseText) {
	var worldCountriesS = responseText;
	if (typeof worldCountriesS == "string") {
		worldCountriesH = makeHash(worldCountriesS);
		done();
	}
}

function makeHash(str) {
	// Создает и возвращет хэш из строкового представления хэша 
	var myHash = {};
	var kvPairs;
	str = str.slice(1, str.length-2).replace(/"/mg, ""); // убирает фигурные скобки и кавычки
	kvPairs = str.split(",");
	var k,v;
	for (var arrInd=0; arrInd<kvPairs.length; arrInd++) {
		var keyValueArray = kvPairs[arrInd].split(":");
		if ( keyValueArray.length == 2 ) {
			k=keyValueArray[0].trim();
			v=keyValueArray[1].trim();
			myHash[k] = v;
		} else {
			console.log("[WARN] Функция makeHash не смогла обработать строку: " + kvPairs[arrInd]);
		}
	}
	return myHash;
}









function makeHelperList(hash) {
	var propList; // список "свойств названий стран",
	// получаемый на базе worldCountriesH
	// например, [8,3,["е","а","у"],"беларусь","Беларусь"] , где
	// 8 - количество символов в названии, 3-количество гласных букв,
	// ["е","а","у"] - список гласных букв 
	// написание страны в нижнем регистре
	// корректное название из глобального хэша стран мира
	var allRecords = [];
	var singleRecord;
	var normKey;
	var vowels;
	for (var key in hash) {
		singleRecord = [];
		normKey = simplifyWord(key);
		vowels = getVowels(normKey);
		singleRecord.push(key.length);
		singleRecord.push(vowels.length);
		singleRecord.push(vowels);
		singleRecord.push(normKey);
		singleRecord.push(key);
		allRecords.push(singleRecord);
	}

	function simplifyWord(word) {
		word = word.replace(" и ", "");
		return word.replace(/[\s-]/mg, "").toLowerCase();
	}
		
	function getVowels(word) {
		var allVowels = "АаЕеЁёИиОоУуЫыЭэЮюЯя";
		var vowelsList = [];
		var matchPos;
	
		for (var i = 0; i < word.length; i++) {
			matchPos = allVowels.indexOf(word[i]);
			if (matchPos !== -1) {
				vowelsList.push(word[i]);
			}
		}
		return vowelsList;
	}
	
	
	function sortNumeric(a, b) {
		return a[0]-b[0];
	}
	
	propList = allRecords.sort(sortNumeric);
	return propList;
}
	
	
// function getCountry() {
// 	// запрашивает у пользователя название страны, валидирует и возвращает ответ
// 	// будет переиспользована отдельно без запроса столицы
// 	var inputCountry = prompt("Введите название страны на русском языке");
	
		
// 	while (!isValid(inputCountry) || !checkCyr(inputCountry)) {
// 		promptS = (!isValid(inputCountry))
// 			? "ОШИБКА!\nПовторите ввод названия страны и не вводите цифры!"
// 			: "ОШИБКА!\nНе вводите латинские буквы (допускается только одиночная кавычка <'>)";
// 		inputCountry = prompt(promptS);
// 	} 
// 	return inputCountry;
// }
	
	
// function getCapital() {
// 	// запрашивает у пользователя название столицы, валидирует и возвращает ответ
// 	var inputCapital = prompt("Введите название столицы на русском языке.");
// 	while (!isValid(inputCapital)) {
// 		inputCapital = prompt("Ошибка. Повторите ввод названия столицы.");
// 	}
// 	return inputCapital;
// }
	
	
// function isValid(inputS) {
// 	// Возвращает признак невалидного ответа на запрос из формы -
// 	// если пользователь не ввёл вообще ничего Number(inputS) === 0,
// 	// ввёл число или ввёл строку с цифрой в начале parseInt(inputS)
// 	var valid =  Number(inputS) !== 0 && isNaN(parseInt(inputS));
// 	return valid;
// }
	
	
// function checkCyr(inputS) {
// 	var chars = inputS.split("");
	
// 	function isCyrrChar(char) {
// 		var codePoint = char.charCodeAt();
// 		return  (1040 <= codePoint && codePoint <= 1103) ||  
// 				(codePoint == 1025 || codePoint == 1105 || codePoint == 39);
// 	}
	
// 	if (chars.every(isCyrrChar)) {
// 		return true
// 	} else {
// 		return false
// 	}
// }
	
	
// function isCancelled(promptResult) {
// 	return !Boolean(promptResult)
// }
	
	
// function makeTitle(word) {
// 	return word[0].toUpperCase().concat(word.slice(1).toLowerCase());
// }
	
	
// function isExistsInHash(newCountry, hash) {
// 	for (var el in hash) {
// 		if (el === newCountry) return true
// 	}
// 	return false;
// }
	
	
// function isCorrectData(newCountry, newCountryCapital, hash) {
// 	// Получили название реальной страны без орфографических ошибок
// 	// и столица указана верно
// 	if ( isExistsInHash(newCountry, hash)
// 		&& (hash[newCountry].startsWith(newCountryCapital)) ) {
// 		return true
// 	} else {
// 		return false
// 	}
// }
	
	
// function doCorrection(newCountry, helperList) {
// 	// привести страну к "упрощенному виду"
// 	var needle = simplifyWord(newCountry);
// 	var correctName = newCountry; // вернем то что получили в случае неудачи
// 	for (var rec = 0; rec < helperList.length; rec++) {
// 		if ( needle === helperList[rec][-1] ) {
// 			console.log(helperList[rec][-1].concat(" ", helperList[rec][helperList.length]));
// 			correctName = helperList[rec][-1];
// 			return; 
// 		}
			
// 	}
// }
	
	
// function findMatches(arr, needle) {
// 	var start,
// 		end;
// 	alert(arr[0]);
// 	for (var c=0; c<arr.length; c++) {
// 		//console.log(arr[c] + "..." + arr[c][depth]);
// 		if ( arr[c][0] < needle) {
// 			continue;
// 		}
// 		if ( start === undefined ) {
// 			start = c;
// 		}
// 		if ( arr[c][0] === needle ) {
// 			continue;
// 		}
// 		end = c;
// 		break;
// 	}
// 	var rs = arr.slice(start, end);
		
// 	//console.log(rs);
// 	return rs;