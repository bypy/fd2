/*jshint strict:false */
    /* ЗАДАНИЕ 
     * Требуется спросить у пользователя:
     * 
     *     фамилию, имя, отчество РАЗДЕЛЬНО (тремя операторами prompt)
     *     возраст в годах (оператором prompt)
     *     пол (оператором confirm, например, "ваш пол - мужской?")
     * 
     * и вывести оператором alert анкету пользователя по примеру:
     * 
     * ваше ФИО: Иванов Иван Иванович
     * ваш возраст в годах: 20
     * ваш возраст в днях: 7300
     * через 5 лет вам будет: 25
     * ваш пол: мужской
     * вы на пенсии: нет
     * 
     * реализовать задание
     * c использованием условной операции (?:), без условного оператора (if).
     * 
     * */

    /* КОММЕНТАРИИ К РЕШЕНИЮ
     * 
     * - Для валидации ответов не всегда по назначению использовались функции isNaN и parseInt.
     *   !isNan не разрешает отправку строки ответа, начинающейся с пробела или пробелов
     *	 !isNan(parseInt()) не принимает слова, начинающиеся с цифры
     *
     * - В этой реализации нажатие кнопки "Отмена" во всплывающем окне
     *   трактуется только как нежелание отвечать на текущий вопрос.
     *   Вместо ответа в переменную записывается строка "отказ".
     *   При отказе ввода возраст принимается равным 16 годам.   
     *   
     * - Сделан отдельный вывод возраста в днях для детей до года
     *  
     * - Кажется, стала более "понятна" логика валидации
     * 
     * - Понравилась использовать тернарную условную операцию
     * 
     * - Написание заняло немало времени
     */

    var lastName,
      firstName,
      middleName,
      age,
      sex; // данные, запрашиваемые у пользователя

    var nonValid = false, // флаг валидности ответа пользователя
      isCancel = false, // флаг отказа отвечать на вопрос
      strAge, // строковое представление введенного возраста
      ageInDays, // выраженный в днях возраст
      isMale, // гендерное равенство
      isFemale, // гендерное равенство
      pensionStatus, // флаг для пенсионеров
      resultMessage; // сообщение с расчетами, выводимое пользователю

    lastName = prompt("Ваша фамилия");
    do { // Показываем вопрос до получения валидного ответа
      isCancel = (lastName === null) ? true : false;
      if (isCancel && confirm("Пропустить вопрос?")) { // Обработка отказа вводить данные
        lastName = "отказ"; // автозаполнение
        break;
      }
      nonValid = !isNaN(lastName) || !isNaN(parseInt(lastName)); // критерии валидности ответа
      // повтор вопроса с подсказкой
      lastName = (nonValid) ? prompt("Не используйте пробелы или цифры. Ваша фамилия") : lastName;
    } while (nonValid);


    firstName = prompt("Ваше имя");
    do { // Показываем вопрос до получения валидного ответа
      isCancel = (firstName === null) ? true : false;
      if (isCancel && confirm("Пропустить вопрос?")) { // Обработка отказа вводить данные
        firstName = "отказ"; // автозаполнение
        break;
      }
      nonValid = !isNaN(firstName) || !isNaN(parseInt(firstName)); // критерии валидности ответа
      // повтор вопроса с подсказкой
      firstName = (nonValid) ? prompt("Не используйте пробелы или цифры. Ваше имя") : firstName;
    } while (nonValid);


    middleName = prompt("Ваше отчество");
    do { // Показываем вопрос до получения валидного ответа
      isCancel = (middleName === null) ? true : false;
      if (isCancel && confirm("Пропустить вопрос?")) { // Обработка отказа вводить данные
        middleName = "отказ"; // автозаполнение
        break;
      }
      nonValid = !isNaN(middleName) || !isNaN(parseInt(middleName)); // критерии валидности ответа
      // повтор вопроса с подсказкой
      middleName = (nonValid) ? prompt("Не используйте пробелы или цифры. Ваше отчество") : middleName;
    } while (nonValid);


    strAge = prompt("Число ваших полных лет");
    do { // Показываем вопрос до получения валидного ответа
      isCancel = (strAge === null) ? true : false;
      if (isCancel && confirm("Пропустить вопрос?")) { // Обработка отказа вводить данные
        alert("Сохраним в секрете ваш возраст и предположим, что вам 16");
        age = 16; // возраст необходим для вычислений и предоставления ответа
        break;
      }
      age = parseInt(strAge);
      // isNaN не разрешает отправку строк
      // диапазон чисел ограничен допустимыми для возраста человека 
      nonValid = isNaN(age) || age < 0 || age > 120; // критерии валидности ответа
      age = (nonValid) ? prompt("ОШИБКА! Введите число своих полных лет от 0 до 120") : age;
      strAge = age; // пользователь (тестировщик?) отказался вводить возраст, затем передумал, но отправляет пустую строку
    } while (nonValid);

    // Выяснили пол, установили флаги в переменные 
    isMale = (confirm("Если ваш пол женский, нажмите кнопку \"Отмена\". Если мужской - кнопку \"OK\"")) ?
      true // кнопка "OK"
      :
      false; // кнопка "Отмена"

    isFemale = (isMale) ? false : true;


    // Формируем ответ
    var resultMessage;
    resultMessage = "ваше ФИО: " + lastName + " " + firstName + " " + middleName;
    resultMessage += "\nваш возраст в годах: " + age;


    // расчет возраста в днях
    var boyOrGirl = (isMale) ? "малышу?" : "малышке?";
    var newbornDays = (age === 0) ? prompt("Вы указали возраст 0 лет, а сколько дней " + boyOrGirl) : 0;
    if (newbornDays !== 0) { // если еще нет года, хотим узнать сколько дней
      do { // Показываем вопрос до получения валидного ответа
        nonValid = newbornDays < 1 || ageInDays > newbornDays; // критерии валидности ответа
        // повтор вопроса с подсказкой
        newbornDays = (nonValid) ? prompt("С вами сложно. В году от 1 до 365 дней. 365 дней - это 1 год.") : newbornDays;
      } while (nonValid);
    }
    ageInDays = age * 365 + parseInt(newbornDays); // newbornDays будет равно 0 если возраст 1 год и более
    // прицепим строку с возрастом в днях
    resultMessage += "\nваш возраст в днях: " + ageInDays;

    // строка с возрастом через 5 лет
    resultMessage += "\nчерез 5 лет вам будет: " + (age + 5);

    // строка с указанием пола
    sex = (isMale) ? "мужской" : "женский";
    resultMessage += "\nваш пол: " + sex;

    /* Пенсионеры
     * В 2018 году пенсионерами стали мужчины с датами рождения
     * с 1 июля по 31 декабря 1957 года,
     * и женщины – с 1 июля по 31 декабря 1962 года.
     * Соответственно, их возраст – 61 и 56 лет.
     * Период выхода на пенсию 01.07-31.12.2018
     */
    pensionStatus = (isFemale) ? age > 56 : age > 61;

    // switch (isFemale) {
    //   case "женский":
    //     pensionStatus = age > 56;
    //     break;
    //   case "мужской":
    //     pensionStatus = age > 61;
    //     break;
    // }

    var pensionStatusStr = (pensionStatus) ? "да" : "нет";
    // строка с пенсионным статусом
    resultMessage += "\nвы на пенсии: " + pensionStatusStr;

    //показываем пользователю результат вычислений
    if (resultMessage !== "")
      alert(resultMessage);
    else
      alert("Неизвестная Ошибка. Обновите страницу и повторите ввод данных");