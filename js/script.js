'use strict';

const title = document.getElementsByTagName('h1')[0];
const buttonPlus = document.querySelector('.screen-btn');
const otherPercent = document.querySelectorAll('.other-items.percent');
const otherNumber = document.querySelectorAll('.other-items.number');

const handlerBtns = document.getElementsByClassName('handler_btn');
const startBtn = handlerBtns[0];
const resetBtn = handlerBtns[1];

const range = document.querySelector('.rollback input[type=range]');
const rangeValue = document.querySelector('.rollback .range-value');
const totalInput1 = document.getElementsByClassName('total-input')[0];
const totalInput2 = document.getElementsByClassName('total-input')[1];
const totalInput3 = document.getElementsByClassName('total-input')[2];
const totalInput4 = document.getElementsByClassName('total-input')[3];
const totalInput5 = document.getElementsByClassName('total-input')[4];
let screens = document.querySelectorAll('.screen');

const appData = {
    title: '',
    screens: [],
    screenPrice: 0,
    adaptive: true,
    rollback: 10,
    allServicePrices: 0,
    fullPrice: 0,
    servicePercentPrice: 0,
    services: {},
    init: function () {
        appData.addTitile();
        startBtn.addEventListener('click', appData.start)
        buttonPlus.addEventListener('click', appData.addScreenBlock)
    },
    addTitile: function () {
        document.title = title.textContent;
    },
    start: function () {
        appData.addScreens();
        // appData.asking();
        // appData.addPrices();
        // appData.getFullPrice();
        // appData.getServicePercentPrices();
        // appData.getTitle();
        // appData.logger();
    },
    addScreens: function () {
        let screens = document.querySelectorAll('.screen');
        screens.forEach(function(screen, index){
            const select = screen.querySelector('select')
            const input = screen.querySelector('input')
            const selectName = select.options[select.selectedIndex].textContent

            appData.screens.push({ 
                id: index, 
                name: selectName, 
                price: +select.value * +input.value
            })
        })
                console.log( appData.screens);
    },
    addScreenBlock: function(){
        const cloneScreen = screens[0].cloneNode(true)
        screens[screens.length - 1].after(cloneScreen)
    },
    asking: function () {
        for (let i = 0; i < 2; i++) {
            let name;
            do {
                name = prompt("Какой дополнительный тип услуги нужен?");
            } while (!appData.isText(name))

            let price = 0;
            do {
                price = prompt('Сколько это будет стоить? (дополнительная работа)');
            } while (!appData.isNumber(price))

            let uniqueKey = name;
            let counter = 1;
            while (appData.services[uniqueKey] !== undefined) {
                uniqueKey = `${name} (${counter})`;
                counter++;
            }
            appData.services[name] = +price
        }
    },
    addPrices: function () {
        appData.screenPrice = appData.screens.reduce(function (sum, screen) {
            return sum + +screen.price;
        }, 0);
        for (let key in appData.services) {
            appData.allServicePrices += appData.services[key]
        }
    },
    getFullPrice: function () {
        appData.fullPrice = +appData.screenPrice + appData.allServicePrices
    },
    getServicePercentPrices: function () {
        appData.servicePercentPrice = appData.fullPrice - (appData.fullPrice * (appData.rollback / 100));
    },
    getTitle: function () {
        let processedTitle = appData.title.trim().toLowerCase();
        appData.title = processedTitle.charAt(0).toUpperCase() + processedTitle.slice(1);
    },
    getrollbackMessage: function (price) {
        if (price >= 30000) {
            return 'Даем скидку в 10%'
        } else if (price >= 15000 && price < 30000) {
            return 'Даем скидку в 5%'
        } else if (price >= 0 && price < 15000) {
            return 'Скидка не предусмотрена'
        } else {
            return 'Что то пошло не так'
        }
    },
    logger: function () {
        console.log(appData.fullPrice)
        console.log(appData.servicePercentPrice)
        console.log(appData.screens)
    }
}

appData.init()