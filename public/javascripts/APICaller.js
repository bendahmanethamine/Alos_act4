let today = new Date();
let currentDateSelected = today
let currentCitySelected = 'mostaganem'
let currentDatePrayers = getTodaysPrayers();
let nextPrayerTime = null
let availableCities = ['mostaganem', 'oran', 'algiers']


// function to get today's date as a string like Saturday 07 May 2022
function getToday() {
    let day = currentDateSelected.getDay()
    let dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    let dayName = dayNames[day]
    let dayNumber = currentDateSelected.getDate()
    let month = currentDateSelected.getMonth()
    let monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    let monthName = monthNames[month]
    let year = currentDateSelected.getFullYear()
    return dayName + ' ' + dayNumber + ' ' + monthName + ' ' + year
}

// function to set the p tag with id todays_date to the current date
function setToday() {
    document.getElementById('today_date').innerHTML = getToday();
}

function setPrayerName(prayername) {
    document.getElementById('prayer_name').innerHTML = prayername;
}

function setCurrentCity(city) {
    currentCitySelected = city
    // set tag with id current_city to the current city capitalized
    document.getElementById('current_city').innerHTML = city.charAt(0).toUpperCase() + city.slice(1)
    getTodaysPrayers().then(() => fillPrayerTimes());


}

function fillModalWithCities() {
    // in div with id city_list create a select tag with id city_select and class="form-select" aria-label="Default select example"
    let citySelect = document.createElement('select')
    citySelect.setAttribute('id', 'city_select')
    citySelect.setAttribute('class', 'form-select')
    citySelect.setAttribute('aria-label', 'Default select example')
    // for each city in availableCities create an option tag with the city as the value and the city capitalized as the text
    for (let i = 0; i < availableCities.length; i++) {
        let option = document.createElement('option')
        option.setAttribute('value', availableCities[i])
        option.innerHTML = availableCities[i].charAt(0).toUpperCase() + availableCities[i].slice(1)
        citySelect.appendChild(option)
    }
    // append the select tag to the div with id city_list
    document.getElementById('city_list').appendChild(citySelect)
    // add an event listener to the select tag with id city_select
    // document.getElementById('city_select').addEventListener('change', function () {
    //     // set the currentCitySelected to the value of the selected option
    //     currentCitySelected = document.getElementById('city_select').value
    // })
    // event listener to the select tag with id city_select
    document.getElementById('save_city').addEventListener('click', function () {
        // set the currentCitySelected to the value of the selected option
        currentCitySelected = document.getElementById('city_select').value
        setCurrentCity(currentCitySelected);
    })
}

function countdownTimer() {
    const difference = +nextPrayerTime - +new Date();
    let remaining = "Time's up!";

    if (difference > 0) {
        const parts = {
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
        };
        remaining = Object.keys(parts).map(part => {
            return `${parts[part]} ${part}`;
        }).join(" ");
    }

    document.getElementById("countdown").innerHTML = remaining;
}

// function to set background image of id main_section
function setBackground() {
    let background = document.getElementById('main_section')
    background.style.backgroundImage = "linear-gradient(\n" +
        "      rgba(0, 0, 0, 0.5),\n" +
        "      rgba(0, 0, 0, 0.5)\n" +
        "    ),url('images/ishaa.jpg')"
    // fit image to the size of the background 100%
    background.style.backgroundSize = "cover"
}

// function to call the API and get the prayers for the selected date
// api is localhost:3000/prayertime/v1/mostaganem/2023/01/25 for example is for 25 january 2023
async function getTodaysPrayers() {
    let url = 'prayertime/v1/' + currentCitySelected + '/' + currentDateSelected.getFullYear() + '/' + (currentDateSelected.getMonth() + 1) + '/' + currentDateSelected.getDate()
    // fetch the data from the api get first index of the array assigned to the global variable currentDatePrayers then echo it
    currentDatePrayers = fetch(url)
        .then(response => response.json())
        .then(data => {
            return data[0]
        })
        .catch(error => console.error(error))
    console.log(await currentDatePrayers);
}

function getTomorrowsPrayers() {
    let url = 'prayertime/v1/' + currentCitySelected + '/' + (currentDateSelected.getFullYear()) + '/' + (currentDateSelected.getMonth() + 1) + '/' + (currentDateSelected.getDate() + 1)
    fetch(url)
        .then(response => {
            return response.json()
        })
}

// function to see which prayer is next
function getNextPrayer() {
    // check if the prayers are already fetched


    // check which prayer is next
    let nextPrayer = null
    let currentTime = new Date()
    let currentHour = currentTime.getHours()
    let currentMinute = currentTime.getMinutes()
    // iterate todays prayers attributes to find the next prayer
    // if
    //             fajr
    //             dhuhr
    //             asr
    //             maghrib
    //             isha
    // the values of the strings are the hours and minutes of the prayer in 24 hour format (eg: fajr is at 4:24)
    let prayertoday = true
    //console.log(currentDatePrayers)
    // currentDatePrayers  is a promise extract the data from the promise
    currentDatePrayers.then(data => {
        currentDatePrayers = data
        let fajrHour = currentDatePrayers['fajr'].split(':')[0]
        let fajrMinute = currentDatePrayers['fajr'].split(':')[1]
        let dhuhrHour = currentDatePrayers['dhuhr'].split(':')[0]
        let dhuhrMinute = currentDatePrayers['dhuhr'].split(':')[1]
        let asrHour = currentDatePrayers['asr'].split(':')[0]
        let asrMinute = currentDatePrayers['asr'].split(':')[1]
        let maghribHour = currentDatePrayers['maghrib'].split(':')[0]
        let maghribMinute = currentDatePrayers['maghrib'].split(':')[1]
        let ishaHour = currentDatePrayers['isha'].split(':')[0]
        let ishaMinute = currentDatePrayers['isha'].split(':')[1]

        // if the current time is before fajr
        if (currentHour < fajrHour || (currentHour === fajrHour && currentMinute < fajrMinute)) {
            nextPrayer = 'fajr'
        } else if (currentHour < dhuhrHour || (currentHour === dhuhrHour && currentMinute < dhuhrMinute)) {
            nextPrayer = 'dhuhr'
        } else if (currentHour < asrHour || (currentHour === asrHour && currentMinute < asrMinute)) {
            nextPrayer = 'asr'
        } else if (currentHour < maghribHour || (currentHour === maghribHour && currentMinute < maghribMinute)) {
            nextPrayer = 'maghrib'
        } else if (currentHour < ishaHour || (currentHour === ishaHour && currentMinute < ishaMinute)) {
            nextPrayer = 'isha'
        } else {
            // next prayer is tomorrow's fajr
            nextPrayer = 'fajr'
            prayertoday = false
        }
        // date object to get the next prayer time
        let _nextPrayerTime = new Date()
        // if the next prayer is today
        if (prayertoday) {
            // set the time of the next prayer
            _nextPrayerTime.setHours(currentDatePrayers[nextPrayer].split(':')[0])
            _nextPrayerTime.setMinutes(currentDatePrayers[nextPrayer].split(':')[1])
            _nextPrayerTime.setSeconds(0)
        } else {
            // set the time of the next prayer
            _nextPrayerTime.setHours(currentDatePrayers[nextPrayer].split(':')[0])
            _nextPrayerTime.setMinutes(currentDatePrayers[nextPrayer].split(':')[1])
            _nextPrayerTime.setSeconds(0)
            // add one day to the date object
            _nextPrayerTime.setDate(_nextPrayerTime.getDate() + 1)
        }
        // set the next prayer and the time of the next prayer
        nextPrayer = nextPrayer.charAt(0).toUpperCase() + nextPrayer.slice(1)
        setPrayerName(nextPrayer);
        nextPrayerTime = _nextPrayerTime
    })

}

// function to fill prayer times
function fillPrayerTimes() {
    // set the prayer times on the page
    // the elements to be set are fajr_time, dhuhr_time, asr_time, maghrib_time, isha_time
    currentDatePrayers.then(data => {
        // select the elements to be set
        let fajr_time = document.getElementById('fajr_time')
        let dhuhr_time = document.getElementById('dhuhr_time')
        let asr_time = document.getElementById('asr_time')
        let maghrib_time = document.getElementById('maghrib_time')
        let isha_time = document.getElementById('isha_time')
        // set the prayer times
        fajr_time.innerHTML = data['fajr']
        dhuhr_time.innerHTML = data['dhuhr']
        asr_time.innerHTML = data['asr']
        maghrib_time.innerHTML = data['maghrib']
        isha_time.innerHTML = data['isha']
    })

}

// function to change currentdate to the next day
function nextDay() {
    // add one day to the current date
    currentDateSelected.setDate(currentDateSelected.getDate() + 1)
    // set the date on the page
    console.log("next day")
    setToday()
    getTodaysPrayers().then(() => {fillPrayerTimes()})

    // add event listener to the next day button
    // select button element id next_day

}

function previousDay() {
    // subtract one day from the current date
    currentDateSelected.setDate(currentDateSelected.getDate() - 1)
    // set the date on the page
    console.log("previous day")
    setToday()
    getTodaysPrayers().then(() => {fillPrayerTimes()})

}

// add event listener to the next day button
window.onload=function(){
    document.getElementById('next_day').addEventListener('click', () => { nextDay();})
    document.getElementById('previous_day').addEventListener('click', () => { previousDay();})
}

//TODO make the prayer times size bigger more obvious
//TODO make daily hadith update daily

