"use strict";
    
function countCyrVowelsA(str){
    // Вариант А. Через поиск вхождения символа в строку
    if (typeof str !== "string") return 0;
    var vowCounter = 0;
    var cyrVowels = "аеёиоуыэюя";
    for (var i = 0; i < str.length; i++) {
        if ( cyrVowels.indexOf(str[i].toLowerCase()) !== -1) vowCounter++; 
    }
    return vowCounter;
}

function countCyrVowelsB(str){
    // Вариант Б. Через поиск ключа в хэше
    var vowCounter = 0;
    if ( typeof str !== "string" ) return 0;
    str = str.toLowerCase();
    // Хэш гласных русских букв.
    // Ключи - гласные в нижнем регистре, значения - не задействуются.
    var cyrVowels = {
        а: "",
        е: "",
        ё: "",
        и: "",
        о: "",
        у: "",
        ы: "",
        э: "",
        ю: "",
        я: "" 
    };
    for (var i = 0; i < str.length; i++) {
        if ( str[i] in cyrVowels ) vowCounter++; 
    }
    return vowCounter;
}