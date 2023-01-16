const moment = require('moment');

exports.getCategories = (arr) => {
    const categories = []
    for (let i = 0; i < arr.length; i++) {
        const item = arr[i];
        if (!categories.includes(item.category) && item.category != "") {
            categories.push(item.category)
            console.log(item.category)
        }
    }

    return categories
}

exports.expensesSum = (arr) => {
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
        const amount = arr[i].amount;
        sum += amount;
    }
    return sum;
}

exports.getMonth = (arr, userMonth, userYear) => {
    const monthArr = []
    const date = new Date();
    const year = userYear || date.getFullYear();
    const month = userMonth || date.getMonth() + 1;
    let aquw = '';
    let dateNow = '';
    let objDate = '';
    if (month <= 9) {
        dateNow = year + "-0" + month
    }
    else {
        dateNow = year + "-" + month
    }
    for (let i = 0; i < arr.length; i++) {
        const item = arr[i];
        if (item.createdAt) {

            objDate = item.createdAt
        }
        aquw = objDate.substring(0, 7)
        if (aquw==dateNow && item.monthly == "no") {
            monthArr.push(item)
        }
    }
    return monthArr
}

exports.getAll = (arr, userMonth, userYear) => {
    const monthArr = []
    const date = new Date();
    const year = userYear || date.getFullYear();
    const month = userMonth || date.getMonth() + 1;
    let start = '';
    let aquw = '';
    let dateNow = '';
    let objDate = '';
    if (month <= 9) {
        dateNow = year + "-0" + month
    }
    else {
        dateNow = year + "-" + month
    }
    for (let i = 0; i < arr.length; i++) {
        const item = arr[i];
        if (item.createdAt) {
            objDate = item.createdAt
        }
        aquw = objDate.substring(0, 7)
        start = moment(aquw, 'YYYY-MM')
        if (aquw==dateNow) {
            monthArr.push(item)
        }
        else if (item.monthly == "yes" && start.isBefore(dateNow)) {
            monthArr.push(item)
        }
    }
    return monthArr
}

exports.getMonthly = (arr, userMonth, userYear) => {
    const monthArr = []
    const date = new Date();
    const year = userYear || date.getFullYear();
    const month = userMonth || date.getMonth() + 1;
    let start = '';
    let aquw = '';
    let dateNow = '';
    let objDate = '';
    if (month <= 9) {
        dateNow = year + "-0" + month
    }
    else {
        dateNow = year + "-" + month
    }
    for (let i = 0; i < arr.length; i++) {
        const item = arr[i];
        objDate = item.createdAt
        aquw = objDate.substring(0, 7)
        start = moment(aquw, 'YYYY-MM')
        if (start.isBefore(dateNow) || aquw==dateNow) {
            monthArr.push(item)
        }
    }
    return monthArr
}

exports.getDate = (arr, startDate, endDate) => {
    const monthArr = []
    let objDate = '';
    const start = moment(startDate, 'YYYY-MM-DD');
    const end = moment(endDate, 'YYYY-MM-DD');
    for (let date = start; date.isBefore(end); date.add(1, 'days')) {
        for (let i = 0; i < arr.length; i++) {
            const item = arr[i];
            objDate = item.createdAt
            if (objDate == date.format('YYYY-MM-DD')) {
                console.log(date.format('YYYY-MM-DD'))
                if (!monthArr.includes(item)) {
                    monthArr.push(item)
                }
            }
        }
    }
    return monthArr
}


