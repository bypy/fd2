var prompts = {
  country: "Введите страну для добавления в список",
  capital: "Введите столицу введенной вами страны"
};
var confirms = {
  cancel: "Прекратить ввод данных?"
};
var alerts = {
  emptyString: "Не вводите пустую строку или строку только из пробелов",
  nonCyrChar: "Допускаются только буквы русского алфавита, тире и знак апострофа",
  numberFound: "Не принимаются цифры в названиях стран и столиц",
  repeat: "\nПовторите ввод"
};


function makePrompt(promptText) {
  promptText = promptText || "Даже не знаю что и спросить..";
  return prompt(promptText); // может вернуть null
}

function isCancel(promptResult) {
  return promptResult === undefined;
}

function isEmptyString(str) {
  if ( str.trim() === "" )
    return true;
  else 
    return false;
}

function isNumbersInString(str) {
  if ( -1 < str.search(/[0-9]/mg) )
    return true;
  else
    return false;
}

var country, capital;
var validInput;

do { //checklist
  validInput = false;  // всегда сомневаемся в валидности ввода
  country = makePrompt(prompts.country);
  if (country === null) {
    if ( confirm(confirms.cancel) ) {
      break; // отмена-уверен
    } else {
      continue; // отмена-передумал
    }
  }
  
  if (isEmptyString(country)) {
    alert(alerts.emptyString + alerts.repeat);
    continue;
  } else if ( isNumbersInString(country) ) {
    alert(alerts.numberFound + alerts.repeat);
    continue;
  }
} while ( !validInput );

// promptH.promptMess = messages.prompts.capital;

// do {
//   capital = promptAction(promptH);
//   if (!capital) break; // была нажата отмена
// } while ( !valid );







