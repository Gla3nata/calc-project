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
        screens.forEach(screen => this.addScreenInputsListeners(screen));
        this.updateStartBtnState();
        this.checkRange();

        this.addTitile();
        startBtn.addEventListener('click', this.start.bind(this));
        buttonPlus.addEventListener('click', this.addScreenBlock.bind(this));
    },
    checkRange: function () {
        range.addEventListener('input', (event) => {
            const value = event.target.value;
            rangeValue.textContent = value;
            this.rollback = value;
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
        const isEnabled = this.checkScreens();
        startBtn.disabled = !isEnabled;
        startBtn.style.opacity = isEnabled ? '1' : '0.5';
    },
    addTitile: function () {
        document.title = title.textContent;
    },
    start: function () {
        this.addScreens();
        this.addServices();
        this.addPrices();
        // this.logger();
        this.showResult();
    },
    showResult: function () {
        total.value = this.screenPrice
        totalCountOther.value = this.servicesPricesPercent + this.servicesPricesNumber
        fullTotalCount.value = this.fullPrice
        totalCount.value = this.countScreens
        totalCountRollback.value = this.servicePercentPrice
    },
    addScreens: function () {
        let screens = document.querySelectorAll('.screen');
        this.screens = [];
        screens.forEach((screen, index) => {
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
        otherItemsPercent.forEach(item => {
            const check = item.querySelector('input[type=checkbox]')
            const label = item.querySelector('label')
            const input = item.querySelector('input[type=text]')
            if (check.checked) {
                this.servicesPercent[label.textContent] = +input.value
            }
        })

        otherItemsNumber.forEach(item => {
            const check = item.querySelector('input[type=checkbox]')
            const label = item.querySelector('label')
            const input = item.querySelector('input[type=text]')
            if (check.checked) {
                this.servicesNumber[label.textContent] = +input.value
            }
        })
    },
    addScreenBlock: function () {
        const cloneScreen = screens[0].cloneNode(true);
        screens[screens.length - 1].after(cloneScreen);
        screens = document.querySelectorAll('.screen');
        this.addScreenInputsListeners(cloneScreen);
        this.updateStartBtnState();
    },
    addScreenInputsListeners: function (screen) {
        const select = screen.querySelector('select');
        const input = screen.querySelector('input');

        select.addEventListener('change', this.updateStartBtnState.bind(this));
        input.addEventListener('input', this.updateStartBtnState.bind(this));
    },
    addPrices: function () {
        this.screenPrice = 0;
        this.countScreens = 0;
        for (let screen of this.screens) {
            this.screenPrice += +screen.price;
            this.countScreens += +screen.count;
        }
        for (let key in this.servicesNumber) {
            this.servicesPricesNumber += this.servicesNumber[key]
        }
        for (let key in this.servicesPercent) {
            this.servicesPricesPercent += this.screenPrice * (this.servicesPercent[key] / 100);
        }
        this.fullPrice = +this.screenPrice + this.servicesPricesPercent + this.servicesPricesNumber
        this.servicePercentPrice = this.fullPrice - (this.fullPrice * (this.rollback / 100));
    },
    logger: function () {
        console.log(this.fullPrice)
        console.log(this.servicePercentPrice)
        console.log(this.screens)
    }
}

appData.init()