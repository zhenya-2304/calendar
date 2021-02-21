"use strict"

function Calendar () {
	this.startValue;  //array['day','month','year']
	this.countWorkDay;
	this.countWeekend;
	this.month = new Date().getMonth(); //храним в переменной значение месяца для функций nextMonth(), previousMonth()
	this.year = new Date().getFullYear(); //храним в переменной значение года для функций nextMonth(), previousMonth()
	this.shedule = []; //в переменной хранится рабочий график

	let flag = false; /*флаг, который переключается при выборе первого дня, чтобы кнопка "расчитать" запустила функцию,
					   которая выполняет расчет. При false, функция выдает сообщение о необходимости выбрать день*/

	//добавим в прототип даты метод getDayInMonth, который будет возвращать количесво дней в месяце
	// в качестве агрументов принимает месяц и год, по умолчанию текущие месяц и год
	Date.prototype.numberOfDays = function(){
		let i = 0;
		if(!(this instanceof Date)) return "error"; //проверяем this на корректность
		let month = this.getMonth();
		let year = this.getFullYear();
		while(true){
			i++;
			// получаем дату для каждого дня месяца, пока не перейдем на следующий месяц
			let date = new Date(year, month, i); 
			if (date.getMonth() == month) {//если текущий месяц не равен входному, то выходим из функции
				continue;
			} else return i-1;
		}
	}	

	//функция проверяет куки, и если находит нужные, вызывает функцию установки свойств объекта
	this.checkCookie = function(...names){
		let cookies = names.map((item) => this.getCookie(item));//собираем все куки в результирующий массив
		return (cookies.includes(undefined) || cookies.includes(''))? false : cookies; //если рез-щий массив не содержит один из куки, то возвращаем false, иначе возвращаем рез-щий массив
	}

	//функция, которая рисует календарь. При вызове без параметров возвращает текущий месяц и год
	this.writeCalendar = function(month = new Date().getMonth() ,year = new Date().getFullYear()){
		
		let cookies = this.checkCookie('firstDay', 'countWorkDay', 'countWeekend');
		//проверяем, если установлены куки, то тогда сразу составляем график по значению из куки
		if (cookies){
			this.startValue = this.checkDate(cookies[0]);
			this.countWorkDay = +cookies[1];
			this.countWeekend = +cookies[2];
			this.shedule = this.calculationShedule(this.startValue);//вычисляем график

			//прячем все кнопки, кроме "сбросить"
			btnShedule.style.display = 'none';
			btnReset.style.display = 'block';	
		} 
		else if(this.startValue){
			this.shedule = this.calculationShedule(this.startValue);//вычисляем график

			//убираем кнопки "расчитать" и "назад"
			btnNavigation.style.display = 'none';

			// и добавляем кнопки "сохранить" и "сбросить"
			btnSave.style.display = 'block';
			btnReset.style.display = 'block';
		}
		let daysBlock = document.querySelector('.days');//находим блок с днями недели
		daysBlock.innerHTML = this.getMonth(month,year,this.shedule);//заполняем блок готовым графиком

		let header = document.querySelector('.month');
		header.innerText = this.getNameMonth(month) + ' ' + year;
	}

	//функция получает от пользователя первый его рабочий день
	this.setShedule = function() {
	
		//инициализируем наши кнопки
		let btnNext = document.getElementById('nextWindow');
		let windowSet = document.getElementById('window-settings');

		windowSet.style.top = 0;
		btnNext.addEventListener('click', ()=>{
			this.setSheduleData();
			this.transitions(); //выполняет перемещение окон и появление кнопок
			btnCalculate.style.display = 'block';
			btnBack.style.display = 'block';
		});
		
	}

	//функция устанавливает значения countWorkDay и countWeekend
	this.setSheduleData = function(){
		this.countWorkDay = +document.getElementsByName('count-work-day')[0].value;
		this.countWeekend = +document.getElementsByName('count-weekend')[0].value;
		return this.chooseFirstWorkDay();
	}

	//функция предоставляет пользователю возможность выбрать свой первый рабочий день на календаре
	this.chooseFirstWorkDay = function(){
		
		let days = document.querySelectorAll('.day');
		for (let day of days){
			day.addEventListener('click', this.choose);//подвязываем обработчик клика к каждому дню
			day.addEventListener('touchstart', this.choose);//подвязываем обработчик касаний
		}
	}

	//функция позволяет выбрать первый день цикла смен. Именно сам процесс выбора!!!
	this.choose = function(context) { //попробую передать контекст Календаря в код функции, где this=day
		let days = document.querySelectorAll('.day');
		for (let day of days) {//не позволяет подсветить несколько дней
			if (day.classList.contains('ligth-day')) {
				day.classList.remove('ligth-day');
			}
		}
		this.classList.toggle('ligth-day', true);

		//меняем флаг
		flag = true;
	}

	//перемещение окна выбора выбора кол-ва смен и появление кнопок
	this.transitions = function() {
		
		//let btnNavigation = document.getElementById('btnNavigation');
		windowSet.style.top = '-500px';

		this.showMessage("<span>Выберите на календаре первый рабочий день смены</span>");

		btnShedule.style.display = "none";
		btnNavigation.style.display = 'block';
	}

	//сделаем функцию, которая выводит сообщение пользователю
	this.showMessage = function(message){

		let alert = document.createElement('div');
		alert.innerHTML = message;
		alert.className = "alert";

		document.body.append(alert);

		setTimeout(() => alert.style.top = '100px', 500);
		setTimeout(() => alert.remove(), 2000);
	}

	//отправка данных о выбраном рабочем дне в this.startValue и запуск функции отрисовки
	this.setStartValue = function() {
		let elem = document.querySelector('.ligth-day');
		let checkResult = this.checkDate(elem.id);
		if (checkResult) {
			this.startValue = checkResult;
			return this.writeCalendar(+checkResult[1], +checkResult[2]);
		}
	}

	//функция проверяет введонное число на правильность формата ввода
	//возвращает массив формата ['day', 'month', 'year'] или false
	this.checkDate = function(date) {
		let arr;
		if (date){
			 arr = date.split('.');
		} else return false;
		if (arr.length == 3 && arr[0] < 32 && arr[1] < 13) {//проверяем входные данные, полученные от пользователя
			//из месяца вычитаем 1, т.к. счет месяцев начинается с 0
			return arr;
		} else {
			return false;
		}
	}

	//функция вычесляет график исходя из указанного значения date
	this.calculationShedule = function(date){
		let period = 100;
		let dates = [];
		let workDay = [];
		let firstDay = new Date(+date[2], +date[1], +date[0]);//из месяца вычитаем 1, т.к. счет месяцев начинается с 0
		while (period) {
			for (let i = 0; i <this.countWorkDay; i++) { //формируем даты рабочих дней
				workDay[0] = firstDay.getDate();
				workDay[1] = firstDay.getMonth();
				workDay[2] = firstDay.getFullYear();
				dates.push(workDay.join('.'));
				firstDay.setDate(firstDay.getDate()+1);
			}
			firstDay.setDate(firstDay.getDate()+this.countWeekend);// добавляем выходные
			period--;
		}
		return dates;
	}

	//функция отрисовывает дни недели календаря. Получает номер месяца и возвращает строку с html-кодом
	this.getMonth = function(month,year = new Date().getFullYear(),arr){ 
		let days = '';
			for (let i = 1; i <= new Date(year, month, 1).numberOfDays(); i++ ) {
				if (i==1){
					days += this.getFirstDayOfWeek(new Date(year, month, i).getDay());
				}	

				// получаем дату для каждого дня месяца, пока не перейдем на следующий месяц
				let date = new Date(year, month, i);

				//формируем строку для проверки даты в массиве
				let day = i + '.' + month + '.' + year;

				if (this.checkDayInArray(day, arr)) {
					days += '<div class="day work-day" id='+`${i}.${month}.${year}`+'>'+i+'</div>';
				} else {
					days += '<div class="day" id='+`${i}.${month}.${year}`+'>'+i+'</div>';
				}
			}
		return days;
	}

	//функция проверяет, входит ли день в рабочий график
	this.checkDayInArray = function (day,arr){
		if (arr.includes(day)) {
			return true; 
		} else {
			return false;	
		}
	}

	//функция превращает численное значение месяца в строковое
	this.getNameMonth = function (month){
		const nameMonth = new Map([
			[0,"Январь"],
			[1,"Февраль"],
			[2,"Март"],
			[3,"Апрель"],
			[4,"Май"],
			[5,"Июнь"],
			[6,"Июль"],
			[7,"Август"],
			[8,"Сентябрь"],
			[9,"Октябрь"],
			[10, "Ноябрь"],
			[11, "Декабрь"],
		]);

		return nameMonth.get(month);
	}

	//функция вычисляет следующий месяц на основании текущего
	this.nextMonth = function(){
		this.month = this.month + 1;
		this.checkMonth(this.month);
		this.writeCalendar(this.month, this.year);
		if (btnCalculate.style.display == 'block'){
			this.chooseFirstWorkDay();
		}
	}

	//функция вычисляет предыдущий месяц на основании текущего
	this.previousMonth = function(){
		this.month = this.month - 1;
		this.checkMonth(this.month);
		this.writeCalendar(this.month, this.year);
		if (btnCalculate.style.display == 'block'){
			this.chooseFirstWorkDay();
		}
	}

	//функция проверяет значение месяца. Если месяц больше 11 или меньше 0, то запускается функция changeMonth()
	this.checkMonth = function(month){
		switch (month) {
			case -1: this.changeMonth(0);break;
			case 12: this.changeMonth(1);break;
			default: return;
		}
	}

	//функция изменяет значения месяца и года в соответствии с входящим параметром: если 0 - уменьшает, если 1 -увеличивает
	this.changeMonth = function(f){
		if (f) {
			this.month = 0;
			this.year = this.year + 1;
		} else {
			this.month = 11;
			this.year = this.year - 1;	
		}
	}

	//функция возвращает пустые дни недели, если первый день месяца не понедельник
/*	нужно сделать еще функцию, которая будет выводить дни последней недели и будет заполнять днями след. месяца
пустые дни в этом (как это реализовано в обычных календарях)*/
	this.getFirstDayOfWeek = function(day){//в качестве аргумента получает номер дня недели date.getDay()
		let result = '';
		switch (day){
			case 0:             //если первый день - воскресенье, то запускае цикл 6 раз (добавляем 6 пустых дней)
				let i = 6;
				while (i){
					result += '<div class="empty-day day"></div>';
					i--;
				} break;

			default:           //во всех остальных случаях - запускаем этот цикл
				while(day-1){
					result += '<div class="empty-day day"></div>';
					day--;
				} break;
		}
		return result;
	}

	//функция формирует списки в select для выбора первого рабочего дня
	this.getSelectListDay = function (){
		let days = document.getElementById('setDay');
		//берем значения года и месяца для вычесления и вывода количества дней в select
		let month = document.getElementById('setMonth') || new Date().getMonth();
		let year = document.getElementById('setYear') || new Date().getFullYear();
		let date = new Date(year, month);
		let date1 = date.numberOfDays();
		for (var i = 1; i <= date; i++) {
			if (i == new Date().getDate()) {
				days.innerHTML += `<option selected>${i}</option>`;
			} else {
				days.innerHTML += `<option>${i}</option>`;
			}
		}
	}

	//записываем в куки первый рабочий день, чтобы не запрашивать каждый раз у пользователя
	this.setCookie = function(name, value, options = {}){
		options = {
		  path: '/',
		  domain: 'mobifishka.com.ua',
		  expires: new Date(2035,0,1),
		};

		if (options.expires.toUTCString) {
		  options.expires = options.expires.toUTCString();
		}

		let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

		for (let optionKey in options) {
		  updatedCookie += "; " + optionKey;
		  let optionValue = options[optionKey];
		  if (optionValue !== true) {
		    updatedCookie += "=" + optionValue;
		  }
		}

		document.cookie = updatedCookie;
	}


	//получение куки,если они есть 
	this.getCookie = function(name){
		let matches = document.cookie.match(new RegExp(
		  "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
		));
		return matches ? decodeURIComponent(matches[1]) : undefined;
	}

	//удаление куки при сбросе графика
	this.deleteCookie = function(name){
		this.setCookie(name,"", {
			'max-age': -1,
		});
	}

	//функция очищает календарь 
	this.clear = function(){
		let days = document.querySelectorAll('.day');
		for (let day of days) {//очищает каждый рабочий день от класса work-day
			if (day.classList.contains('work-day')) {
				day.classList.remove('work-day');
			}
		}
	}

	//привязываем к стрелкам их функции. Делаем это здесь, чтобы не писать onclick в HTML. Как по мне - так красивей
	let previousArrow = document.querySelector('.previous');
	let nextArrow = document.querySelector('.next');

	//окно выбора кол-ва смен
	let windowSet = document.getElementById('window-settings');

	previousArrow.addEventListener('click', ()=>this.previousMonth());
	nextArrow.addEventListener('click', ()=>this.nextMonth());
		//Привязываем функцию к кнопке расчета графика
	//let btnShedule = document.getElementById('btnShedule');
	btnShedule.addEventListener('click', () => this.setShedule());

	//вешаем обработчики на кнопки "расчитать" и "назад"
	//let btnCalculate = document.getElementById('btnCalculate');
	//let btnBack = document.getElementById('btnBack');

	btnCalculate.onclick = () => {
		if (flag){
			this.setStartValue();
		} else {
			this.showMessage("<span>Выберите на календаре первый рабочий день смены</span>");
		}

	};
	btnBack.addEventListener('click', function(){
		windowSet.style.top = 0;
	});

	//вешаем обработчики на кнопки "сохранить" и "сбросить"
	//let btnSave = document.getElementById('btnSave');
	//let btnReset = document.getElementById('btnReset');

	btnSave.addEventListener('click', ()=>{
			this.setCookie('firstDay', this.startValue.join('.'));
			this.setCookie('countWorkDay', this.countWorkDay);
			this.setCookie('countWeekend', this.countWeekend);
			btnSave.style.display = 'none';
		});
	btnReset.addEventListener('click', () => {
		this.deleteCookie('firstDay');
		this.clear();
		this.startValue = null;
		btnSave.style.display = 'none'; //скрываем кнопки "сохранить" и "сбросить"
		btnReset.style.display = 'none';
		btnShedule.style.display = 'block'; //снова показываем кнопку "составить график"
		flag = false; //обнуляем флаг
		this.shedule = []; //обнуляем массив рабочих дней
	});

	//вешаем обработчик на крестик "close"
	document.querySelector('.close').addEventListener('click', function(){
		windowSet.style.top = "-500px";
		btnCalculate.style.display = 'none'; //скрываем кнопки "сохранить" и "сбросить"
		btnBack.style.display = 'none';
		btnShedule.style.display = 'block';
	});
}

let shedule = new Calendar();

shedule.writeCalendar();




//функция вычисления разницы дат
function getDiffDate(date1, date2){

	let diff = date1.getTime() - date2.getTime();
	let year = diff/3.154e10;
	let month = (year - Math.floor(year))*3.154e10/2.628e9;
	let day = (month - Math.floor(month))*2.628e9/8.64e7;
	alert(`${Math.floor(year)} лет ${Math.floor(month)} месяца ${Math.floor(day)} дней`);
}