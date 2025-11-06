'use strict';

const title = document.getElementsByTagName('h1')[0];
const buttonPlus = document.querySelector('.screen-btn');
const otherItemsPercent = document.querySelectorAll('.other-items.percent');
const otherItemsNumber = document.querySelectorAll('.other-items.number');

const handlerBtns = document.getElementsByClassName('handler_btn');
const startBtn = handlerBtns[0];
const resetBtn = handlerBtns[1];

let range = document.querySelector('.rollback input[type=range]');
const rangeValue = document.querySelector('.rollback .range-value');

const total = document.getElementsByClassName('total-input')[0];
const totalCount = document.getElementsByClassName('total-input')[1];
const totalCountOther = document.getElementsByClassName('total-input')[2];
const fullTotalCount = document.getElementsByClassName('total-input')[3];
const totalCountRollback = document.getElementsByClassName('total-input')[4];
let screens = document.querySelectorAll('.screen');

const appData = {
    title: '',
    screens: [],
    screenPrice: 0,
    adaptive: true,
    rollback: 10,
    servicesPricesPercent: 0,
    servicesPricesNumber: 0,
    fullPrice: 0,
    servicePercentPrice: 0,
    servicesPercent: {},
    servicesNumber: {},
    init: function () {
        screens.forEach(screen => appData.addScreenInputsListeners(screen));
        appData.updateStartBtnState();
        appData.checkRange();

        appData.addTitile();
        startBtn.addEventListener('click', appData.start)
        buttonPlus.addEventListener('click', appData.addScreenBlock)
    },
    checkRange: function () {
        range.addEventListener('input', function () {
            const value = this.value;
            rangeValue.textContent = value;
            appData.rollback = value;
        });
    },
    checkScreens: function () {
        let screens = document.querySelectorAll('.screen');
        for (let screen of screens) {
            const select = screen.querySelector('select');
            const input = screen.querySelector('input[type="number"], input[type="text"]');
            if (!select.value || +input.value <= 0) {
                return false;
            }
        }
        return true;
    },
    updateStartBtnState: function () {
        const isEnabled = appData.checkScreens();
        startBtn.disabled = !isEnabled;
        startBtn.style.opacity = isEnabled ? '1' : '0.5';
    },
    addTitile: function () {
        document.title = title.textContent;
    },
    start: function () {
        appData.addScreens();
        appData.addServices();
        appData.addPrices();
        // appData.logger();
        appData.showResult();
    },
    showResult: function () {
        total.value = appData.screenPrice
        totalCountOther.value = appData.servicesPricesPercent + appData.servicesPricesNumber
        fullTotalCount.value = appData.fullPrice
        totalCount.value = appData.countScreens
        totalCountRollback.value = appData.servicePercentPrice
    },
    addScreens: function () {
        let screens = document.querySelectorAll('.screen');
        screens.forEach(function (screen, index) {
            const select = screen.querySelector('select')
            const input = screen.querySelector('input')
            const selectName = select.options[select.selectedIndex].textContent

            appData.screens.push({
                id: index,
                name: selectName,
                price: +select.value * +input.value,
                count: input.value
            })
        })
    },
    addServices: function () {
        otherItemsPercent.forEach(function (item) {
            const check = item.querySelector('input[type=checkbox]')
            const label = item.querySelector('label')
            const input = item.querySelector('input[type=text]')
            if (check.checked) {
                appData.servicesPercent[label.textContent] = +input.value
            }
        })

        otherItemsNumber.forEach(function (item) {
            const check = item.querySelector('input[type=checkbox]')
            const label = item.querySelector('label')
            const input = item.querySelector('input[type=text]')
            if (check.checked) {
                appData.servicesNumber[label.textContent] = +input.value
            }
        })
    },
    addScreenBlock: function () {
        const cloneScreen = screens[0].cloneNode(true);
        screens[screens.length - 1].after(cloneScreen);
        appData.addScreenInputsListeners(cloneScreen);
        appData.updateStartBtnState();
    },
    addScreenInputsListeners: function (screen) {
        const select = screen.querySelector('select');
        const input = screen.querySelector('input');

        select.addEventListener('change', appData.updateStartBtnState);
        input.addEventListener('input', appData.updateStartBtnState);
    },
    addPrices: function () {
        appData.screenPrice = 0;
        appData.countScreens = 0;
        for (let screen of appData.screens) {
            appData.screenPrice += +screen.price;
            appData.countScreens += +screen.count;
        }
        for (let key in appData.servicesNumber) {
            appData.servicesPricesNumber += appData.servicesNumber[key]
        }
        for (let key in appData.servicesPercent) {
            appData.servicesPricesPercent += appData.screenPrice * (appData.servicesPercent[key] / 100);
        }
        appData.fullPrice = +appData.screenPrice + appData.servicesPricesPercent + appData.servicesPricesNumber
        appData.servicePercentPrice = appData.fullPrice - (appData.fullPrice * (appData.rollback / 100));
    },
    logger: function () {
        console.log(appData.fullPrice)
        console.log(appData.servicePercentPrice)
        console.log(appData.screens)
    }
}

appData.init()