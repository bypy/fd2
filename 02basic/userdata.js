;;	var vld  = {};

// вкл-выкл
vld.alerts = true;
vld.confirms = true;

/*
** все проверки возвращают true при непрохождении
*/

// проверка и логирование ошибки типа данных при передаче функции
vld.checkWrongType = function(data, targetDataType, fname) {
	if ( typeof(data) !== targetDataType ) {
		console.log("[ОШИБКА] Функция " + fname + 
					" модуля vld принимает тип данных " + targetDataType +
					", а получен: " + typeof data, data);
		return true;
	} else {
		return false;
	}
};


// проверка на нажатие отмены в prompt окне
vld.checkCancel = function(input) {
	if ( input === null ) 
		if ( vld.confirms && confirm("Прекратить ввод данных?") ) 
			return true; // отмена-подтверждение
		else
			return undefined; // отмена-передумал
	else
		return false;
};


// проверка на пустую/пробельную строку
vld.checkEmptyString = function(inputS) {
	if ( vld.checkWrongType(inputS, "string", "isEmptyString") ) return;
	if ( inputS.trim() === "" ) {
		if ( vld.alerts ) alert("Не вводите пустую строку или строку только из пробелов. \nПовторите ввод.");
		return true;
	} else {
		return false;
	}
};


// проверка на присутсвие цифр в строке
vld.checkNumber = function(inputS) {
	if ( vld.checkWrongType(inputS, "string", "numberFound") ) return;
	if ( -1 < inputS.search(/[0-9]/mg) ) {
		if ( vld.alerts ) alert("Не принимаются цифры. \nПовторите ввод.");
		return true;
	} else {
		return false;
	}
};


// проверка состоит ли строка только из символов кириллицы  
vld.checkNonCyrChar = function(inputS) {
	if ( vld.checkWrongType(inputS, "string", "allCyr") ) return;
	function isCyrChar(char) {
		var codePoint = char.charCodeAt();
		return  (1040 <= codePoint && codePoint <= 1103) ||  
                (codePoint == 1025 || codePoint == 1105 || codePoint == 39);
	}
	var chars = inputS.split("");
	if (chars.every(isCyrChar)) {
		return false;
	} else {
		if ( vld.alerts ) alert("Допускаются только буквы русского алфавита, тире, пробел и знак апострофа."
								+ "\nПовторите ввод.");
		return true;
	}
};


// Принимает строку для отображения в prompt и массив с проверками через которые пройдет ответ
// Возвращает undefined, если была нажата отмена, либо провалидированный по чек-листу ответ
vld.performAndCheckPrompt = function(promptString, checkList) {
	promptString = promptString || "введите здесь какой-нибудь текст";
	checkList = checkList || [vld.checkEmptyString, vld.checkNumber, vld.checkNonCyrChar];
	var isCancel = false;
	var isValidInput;
	var currCheckFn;
	var promptAnswer;
	do {
		promptAnswer = prompt(promptString);
		isCancel = vld.checkCancel(promptAnswer);
		if ( isCancel === undefined ) continue; // нажал отмену и передумал отменять ввод
		else if	( isCancel ) {
			promptAnswer = undefined;
			break;
		}
		isValidInput = false;  // всегда сомневаемся
		// далее по чеклисту
		for (var i = 0; i < checkList.length; i++) {
			currCheckFn = checkList[i];
			if ( !(typeof currCheckFn === "function") ) continue; // не проверка это
			else if ( currCheckFn(promptAnswer) )  {
				isValidInput = false; // да - проверка не пройдена
				break; // покинуть цикл и повторить ввод
			} else {
				isValidInput = true; // эта проверка пройдена
				continue; // перейти к следующей проверке
			}
		}
	} while (!isValidInput);
	return promptAnswer;
};