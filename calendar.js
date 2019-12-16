"use strict"

function Calendar () {
	this.startValue;
	this.countWorkDay = 4;
	this.countWeekend = 4;
	this.period = 1;
	this.month = new Date().getMonth(); //храним в переменной значение месяца для функций nextMonth(), previousMonth()
	this.year = new Date().getFullYear(); //храним в переменной значение года для функций nextMonth(), previousMonth()
	this.shedule = []; //в переменной хранится рабочий график

	//привязываем к стрелкам их функции. Делаем это здесь, чтобы не писать onclick в HTML. Как по мне - так красивей
	let previousArrow = document.querySelector('.previous');
	let nextArrow = document.querySelector('.next');

	previousArrow.addEventListener('click', this.previousMonth);
	nextArrow.addEventListener('click', this.nextMonth);
		//Привязываем функцию к кнопке расчета графика
	let key = document.getElementById('btnShedule');
	key.addEventListener('click', this.setShedule);

	//функция, которая рисует календарь. При вызове без параметров возвращает текущий месяц и год
	this.writeCalendar = function(month = new Date().getMonth() ,year = new Date().getFullYear()){
		//this.setShedule();

		if(this.startValue){
			this.shedule = this.calculationShedule(this.startValue);//вычисляем график
		}
		let daysBlock = document.querySelector('.days');//находим блок с днями недели
		daysBlock.innerHTML = this.getMonth(month,year,this.shedule);//заполняем блок готовым графиком

		let header = document.querySelector('.month');
		header.innerText = this.getNameMonth(month) + ' ' + year;
	}

	//функция получает от пользователя первый его рабочий день
	this.setShedule = function() {
		let date = prompt("Укажите первый день рабочей смены в формате \"01.01.2019\"");
		let checkResult = this.checkDate(date);
		if (checkResult) {
			return this.startValue = checkResult;
		} else {
			alert("Вы ввели не правильный формат даты. Пожалуйста, повторите ввод");
			return this.setShedule();
		}
		
	}

	//функция проверяет введонное число на правильность формата ввода
	//возвращает массив формата ['day', 'month', 'year'] или false
	this.checkDate = function(date) {
		if (date){
			let arr = date.split('.');
		} else return false;
		if (arr.length == 3 && arr[0] < 32 && arr[1] < 13) {//проверяем входные данные, полученные от пользователя
			arr[1] = this.convertMonthToJS(arr[1]);//из месяца вычитаем 1, т.к. счет месяцев начинается с 0
			return arr;
		} else {
			return false;
		}
	}

	//функция переводит пользовательский ввод в формат js. Например: 01,01,2019 переведет в 1,0,2019
	this.convertMonthToJS = function(month){
		return +month - 1; //используем унарный плюс, потому что передается строковая переменная
	}

	//функция вычесляет график исходя из указанного значения date
	this.calculationShedule = function(date){
		let period = 100; //количество циклов "рабочие-выходные"
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
		let i = 1, days = '';
		while(i){
			if (i==1){
				days += this.getFirstDayOfWeek(new Date(year, month, i).getDay());
			}
			// получаем дату для каждого дня месяца, пока не перейдем на следующий месяц
			let date = new Date(year, month, i); 
			if (date.getMonth() == month) {//если текущий месяц не равен входному, то выходим из функции
				let day = date.getDate() + '.' + date.getMonth() + '.' + date.getFullYear();
				if (this.checkDayInArray(day, arr)) {
					days += '<div class="day work-day">'+date.getDate()+'</div>';
				} else {
					days += '<div class="day">'+date.getDate()+'</div>';
				}
			}
			else return days;
			i++;
		} 
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
	}

	//функция вычисляет предыдущий месяц на основании текущего
	this.previousMonth = function(){
		this.month = this.month - 1;
		this.checkMonth(this.month);
		this.writeCalendar(this.month, this.year);
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
	this.getSelectList = function (){
		
	}
}

let shedule = new Calendar();
/*shedule.setShedule();*/
shedule.writeCalendar();



