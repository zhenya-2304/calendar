"use strict"
//checkDate()
/*describe('проверяем правильность формата даты в функции checkDate()', function(){
	it("формат 01.01.2019 возвращает массив ['01','01','2019']",function(){
		assert.deepEqual(checkDate('01.01.2019'), ['01','01','2019']);
	});
	it("формат 01-01-2019 возвращает false",function(){
		assert.isFalse(checkDate('01-01-2019'));
	});
});
*/

//calculationShedule()
/*describe('проверяем вычисление рабочих дат', function () {
	it('первый рабочий день 26.11.2019 даст массив ["26.10.2019","27.10.2019","28.10.2019","29.10.2019","4.11.2019","5.11.2019","6.11.2019","7.11.2019"]', function(){
		assert.deepEqual(calculationShedule(['26','10','2019']),["26.10.2019","27.10.2019","28.10.2019","29.10.2019",
			"4.11.2019","5.11.2019","6.11.2019","7.11.2019"]);
	});
});

//convertMonthToJS()
describe('функция конвертирует "человеческое" исчисление месяцев в js вид', function(){
	function test(x){
		let result = x-1;
		it(`${x} месяц в js-формате будет ${result}`, function(){
			assert.equal(convertMonthToJS(x), result);
		});
	}

	for (let i = 1; i <= 12; i++){
		test(i);
	}
});*/


//getMonth()
/*describe('функция получает на вход номер месяца и должна возвращать дни этого месяца пока они не закончатся. В случает окончания месяца должен происходить выход из цикла и возвращаться массив значений', function(){
	it('функция работает до тех пор, пока не закончатся дни месяца', function(){
		assert.equal(getMonth(11, 2019), 31);
	});
});*/


//checkDayInArray(день, массив рабочих дней)
/*describe('функция проверяет вхождение дня в массив рабочих дней', function(){
	it('04.11.2019 входит в массив',function(){
		assert.isTrue(checkDayInArray('4.11.2019',["4.11.2019","5.11.2019","6.11.2019","7.11.2019"])) ;
	});
	it('03.11.2019 не входит в массив',function(){
		assert.isFalse(checkDayInArray('3.11.2019',["4.11.2019","5.11.2019","6.11.2019","7.11.2019"]));
	});
});*/

//getFirstDayOfWeek(day)
/*function makeTest(argument) {
	let result = '';
	while(argument){
		result += '<div class="empty-day day"></div>';
		argument--;
	}	
	return result;
}

describe('getFirstDayOfWeek',function(){
	it('первый день месяца - воскресенье', function(){
		assert.equal(getFirstDayOfWeek(0),makeTest(6));
	});
	it('первый день месяца - понедельник', function(){
		assert.equal(getFirstDayOfWeek(1),makeTest(0));
	});
	it('первый день месяца - среда', function(){
		assert.equal(getFirstDayOfWeek(3),makeTest(2));
	});
	it('первый день месяца - четверг', function(){
		assert.equal(getFirstDayOfWeek(4),makeTest(3));
	});
	it('первый день месяца - суббота', function(){
		assert.equal(getFirstDayOfWeek(6),makeTest(5));
	});
});*/

//расширение прототипа Date функцией getDayInMonth()
describe('получаем количество дней в месяце', function(){
	it('в декабре 31 день',function(){
		assert.equal(new Date(2019, 11, 1).numberOfDays(), 31);
	});
	it('в январе 31 день',function(){
		assert.equal(new Date(2020, 0, 1).numberOfDays(), 31);
	});
	it('в феврале 29 день',function(){
		assert.equal(new Date(2020, 1, 1).numberOfDays(), 29);
	});
	it('в марте 31 день',function(){
		assert.equal(new Date(2020,2, 1).numberOfDays(), 31);
	});
});