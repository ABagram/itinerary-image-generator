let dayCounter = 0;
let userId;
let enableTimestamp = JSON.parse(localStorage.getItem('enableTimestamp')) || false;
let enableBudget = JSON.parse(localStorage.getItem('enableBudget')) || false;
let selectedCurrency = localStorage.getItem('selectedCurrency') || 'USD';

const currencySymbols = {
  USD: '$', EUR: '€', GBP: '£', JPY: '¥', AUD: '$', CAD: '$', CHF: 'CHF', CNY: '¥', SEK: 'kr', NZD: '$', MXN: '$', SGD: '$', HKD: '$', NOK: 'kr', KRW: '₩', TRY: '₺', RUB: '₽', INR: '₹', BRL: 'R$', ZAR: 'R', PHP: '₱', PLN: 'zł', THB: '฿', IDR: 'Rp', HUF: 'Ft', CZK: 'Kč', ILS: '₪', MYR: 'RM', SAR: 'ر.س', AED: 'د.إ', COP: '$', CLP: '$', PEN: 'S/.', VND: '₫', EGP: '£', NGN: '₦', PKR: '₨', BDT: '৳', LKR: 'Rs', KWD: 'د.ك', QAR: 'ر.ق', OMR: 'ر.ع.', BHD: 'ب.د', JOD: 'د.ا', IQD: 'ع.د', LBP: 'ل.ل', SYP: 'ل.س', YER: '﷼', AFN: '؋', IRR: '﷼', KZT: '₸', UZS: 'сўм', TMT: 'm', AZN: '₼', GEL: '₾', AMD: '֏', BYN: 'Br', MDL: 'L', UAH: '₴', BAM: 'KM', MKD: 'ден', ALL: 'L', RSD: 'дин', HRK: 'kn', BGN: 'лв', RON: 'lei', ISK: 'kr', DKK: 'kr', HNL: 'L', GTQ: 'Q', CRC: '₡', PAB: 'B/.', BZD: '$', HTG: 'G', JMD: '$', TTD: '$', BBD: '$', XCD: '$', KYD: '$', BSD: '$', BMD: '$', FJD: '$', PGK: 'K', SBD: '$', TOP: 'T$', WST: 'WS$', VUV: 'VT', KPW: '₩', MNT: '₮', MMK: 'K', LAK: '₭', KHR: '៛', BND: '$', MOP: 'MOP$', TWD: 'NT$', MVR: 'Rf', SCR: '₨', MUR: '₨', NPR: '₨'
};

function generateUserId() {
  return 'user-' + Math.random().toString(36).substr(2, 9);
}

function getUserId() {
  let id = localStorage.getItem('userId');
  if (!id) {
    id = generateUserId();
    localStorage.setItem('userId', id);
  }
  return id;
}

function toggleTimestamp() {
  enableTimestamp = !enableTimestamp;
  localStorage.setItem('enableTimestamp', enableTimestamp);
  document.querySelectorAll('.timestamp-input').forEach(input => {
    input.style.display = enableTimestamp ? 'inline-block' : 'none';
  });
  updateTimeline();
}

function toggleBudget() {
  enableBudget = !enableBudget;
  localStorage.setItem('enableBudget', enableBudget);
  document.querySelectorAll('.budget-input').forEach(input => {
    input.style.display = enableBudget ? 'inline-block' : 'none';
  });
  updateTimeline();
}

function formatBudget(value) {
  if (!value) return '';
  const number = parseFloat(value.replace(/,/g, ''));
  if (isNaN(number)) return '';
  return number.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function updateCurrency() {
  selectedCurrency = document.getElementById('currency-select').value;
  localStorage.setItem('selectedCurrency', selectedCurrency);
  const currencySymbol = currencySymbols[selectedCurrency] || selectedCurrency;
  document.querySelectorAll('.budget-input').forEach(input => {
    input.placeholder = `${currencySymbol} 0.00`;
    if (input.value) {
      input.value = formatBudget(input.value);
    }
  });
  updateTimeline();
}

function saveData() {
  const daysData = [];
  const days = document.querySelectorAll('.day-container');

  days.forEach(day => {
    const dayNo = day.dataset.dayNo;
    const date = day.querySelector('.date-input').value;
    const locations = [];

    day.querySelectorAll('.location-row').forEach(locationRow => {
      const location = locationRow.querySelector('.location-input') ? locationRow.querySelector('.location-input').value : null;
      const destination = locationRow.querySelector('.destination-input') ? locationRow.querySelector('.destination-input').value : null;
      const meal = locationRow.querySelector('.meal-input') ? locationRow.querySelector('.meal-input').value : null;
      const restaurant = locationRow.querySelector('.restaurant-input') ? locationRow.querySelector('.restaurant-input').value : null;
      const transportation = locationRow.querySelector('.transportation-input') ? locationRow.querySelector('.transportation-input').value : null;
      const timestamp = locationRow.querySelector('.timestamp-input') ? locationRow.querySelector('.timestamp-input').value : null;
      const transportationType = locationRow.querySelector('.transportation-type-select') ? locationRow.querySelector('.transportation-type-select').value : null;
      const station = locationRow.querySelector('.station-input') ? locationRow.querySelector('.station-input').value : null;
      const accommodation = locationRow.querySelector('.accommodation-input') ? locationRow.querySelector('.accommodation-input').value : null;
      const checkInTime = locationRow.querySelector('.check-in-time-input') ? locationRow.querySelector('.check-in-time-input').value : null;
      const checkOutTime = locationRow.querySelector('.check-out-time-input') ? locationRow.querySelector('.check-out-time-input').value : null;
      const hasError = locationRow.querySelector('.error-text') ? true : false;
      const budget = locationRow.querySelector('.budget-input') ? locationRow.querySelector('.budget-input').value : null;
      locations.push({ location, destination, meal, restaurant, transportation, timestamp, transportationType, station, accommodation, checkInTime, checkOutTime, hasError, budget });
    });

    daysData.push({ dayNo, date, locations });
  });

  localStorage.setItem(`daysData-${userId}`, JSON.stringify(daysData));
}

function loadData() {
  const daysData = JSON.parse(localStorage.getItem(`daysData-${userId}`));

  if (daysData) {
    daysData.forEach(dayData => {
      addDay(dayData);
    });
  } else {
    addDay();
  }

  const enableTimestamp = JSON.parse(localStorage.getItem('enableTimestamp'));
  document.querySelectorAll('.timestamp-input').forEach(input => {
    input.style.display = enableTimestamp ? 'inline-block' : 'none';
  });

  document.getElementById('currency-select').value = selectedCurrency;
  document.querySelectorAll('.budget-input').forEach(input => {
    input.style.display = enableBudget ? 'inline-block' : 'none';
    const currencySymbol = currencySymbols[selectedCurrency] || selectedCurrency;
    input.placeholder = `${currencySymbol} 0.00`;
  });
}

function setActiveDayContainer(dayContainer) {
  document.querySelectorAll('.day-container').forEach(container => {
    container.classList.remove('active');
  });
  if (dayContainer) {
    dayContainer.classList.add('active');
  }
}

document.addEventListener('click', function(event) {
  const dayContainer = event.target.closest('.day-container');
  setActiveDayContainer(dayContainer);
});

function addDay(dayData = null) {
  dayCounter++;

  const dayDiv = document.createElement('div');
  dayDiv.className = 'day-container';
  dayDiv.dataset.dayNo = dayCounter;

  const lastDayDiv = document.querySelector('.day-container:last-of-type');
  let defaultDate;

  if (lastDayDiv) {
    const lastDate = new Date(lastDayDiv.querySelector('.date-input').value);
    defaultDate = new Date(lastDate);
    defaultDate.setDate(lastDate.getDate() + 1);
  } else {
    defaultDate = new Date();
  }

  const today = defaultDate.toISOString().split('T')[0];

  dayDiv.innerHTML = `
    <div class="day-header">
      <span>DAY <span class="day-number">${dayCounter}</span></span>
      <input type="date" value="${dayData ? dayData.date : today}" class="date-input">
      <span class="move-day-button" onclick="moveDayUp(this)" data-hover="Move Up"><i class='fas fa-angle-up'></i></span>
      <span class="move-day-button" onclick="moveDayDown(this)" data-hover="Move Down"><i class="fas fa-angle-down"></i></span>
      <span class="trash-icon" onclick="deleteDay(this)" data-hover="Delete"><i class="fa fa-trash-o"></i></span>
    </div>
    <div class="location-container"></div>
    <button class="add-location" onclick="addLocation(this)">Add Destination</button>
    <button class="add-location" onclick="addMeal(this, null, true)">Add Meal</button>
    <button class="add-location" onclick="addTransportation(this, null, true)">Add Transportation</button>
    <button class="add-location" onclick="addAccommodation(this, null, true)">Add Accommodation</button>
  `;

  document.getElementById('days-container').appendChild(dayDiv);

  if (dayData) {
    dayData.locations.forEach(locationData => {
      if (locationData.transportation) {
        addTransportation(dayDiv.querySelector('.add-location'), locationData);
      } else if (locationData.meal) {
        addMeal(dayDiv.querySelector('.add-location'), locationData);
      } else if (locationData.accommodation) {
        addAccommodation(dayDiv.querySelector('.add-location'), locationData);
      } else {
        addLocation(dayDiv.querySelector('.add-location'), locationData);
      }
    });
  } else {
    addLocation(dayDiv.querySelector('.add-location'));
  }

  updateTimeline();
}

function validateTimestamps(dayContainer) {
  if (!enableTimestamp) return true;

  const locationRows = dayContainer.querySelectorAll('.location-row');
  let previousTimestamp = null;
  let isValid = true;

  locationRows.forEach(row => {
    const timestampInput = row.querySelector('.timestamp-input');
    const errorText = row.querySelector('.error-text');

    if (timestampInput) {
      const timestamp = timestampInput.value;
      if (timestamp) {
        if (previousTimestamp && timestamp <= previousTimestamp) {
          isValid = false;
          if (!errorText) {
            const errorSpan = document.createElement('span');
            errorSpan.className = 'error-text';
            errorSpan.style.color = 'red';
            errorSpan.style.display = 'block';
            errorSpan.style.marginTop = '5px';
            errorSpan.textContent = 'Timestamps must be in chronological order.';
            row.appendChild(errorSpan);
          }
        } else if (errorText) {
          errorText.remove();
        }
        previousTimestamp = timestamp;
      } else if (errorText) {
        errorText.remove();
      }
    }
  });

  updateTimeline(); // Always update timeline
  saveData(); // Save data after validation
  return isValid;
}

function addLocation(button, locationData = null) {
  const locationRow = document.createElement('div');
  locationRow.className = 'location-row';

  const currencySymbol = currencySymbols[selectedCurrency] || selectedCurrency;

  locationRow.innerHTML = `
    <input type="text" placeholder="Location" value="${locationData ? locationData.location : ''}" oninput="updateTimeline()" class="location-input" autocomplete="on">
    <input type="text" placeholder="Destination" value="${locationData ? locationData.destination : ''}" oninput="updateTimeline()" class="destination-input" autocomplete="on">
    <input type="number" placeholder="${currencySymbol} 0.00" value="${locationData ? formatBudget(locationData.budget) : ''}" class="budget-input" style="display: ${enableBudget ? 'inline-block' : 'none'}" oninput="updateTimeline()">
    <span class="delete-location" onclick="deleteLocation(this)" data-hover="Delete">&times;</span>
    <span class="move-button" onclick="moveUp(this)" data-hover="Move Up"><i class='fas fa-angle-up'></i></span>
    <span class="move-button" onclick="moveDown(this)" data-hover="Move Down"><i class='fas fa-angle-down'></i></span>
    <span class="plus-button" onclick="showMenu(this)" data-hover="Insert">+</span>
    <div class="menu">
      <button onclick="addLocationBetween(this)">Add Destination</button>
      <button onclick="addMeal(this)">Add Meal</button>
      <button onclick="addTransportation(this)">Add Transportation</button>
      <button onclick="addAccommodation(this)">Add Accommodation</button>
    </div>
  `;

  const timestampInput = document.createElement('input');
  timestampInput.type = 'time';
  timestampInput.className = 'timestamp-input';
  timestampInput.style.display = enableTimestamp ? 'inline-block' : 'none';
  timestampInput.value = locationData ? locationData.timestamp : '';
  timestampInput.oninput = () => {
    updateTimeline();
    validateTimestamps(button.closest('.day-container'));
  };
  locationRow.insertBefore(timestampInput, locationRow.firstChild);

  button.previousElementSibling.appendChild(locationRow);
  updateTimeline();
  validateTimestamps(button.closest('.day-container'));
}

function addLocationBetween(button) {
  const locationRow = document.createElement('div');
  locationRow.className = 'location-row';

  const currencySymbol = currencySymbols[selectedCurrency] || selectedCurrency;

  locationRow.innerHTML = `
    <input type="text" placeholder="Location" class="location-input" oninput="updateTimeline()">
    <input type="text" placeholder="Destination" class="destination-input" oninput="updateTimeline()">
    <input type="number" placeholder="${currencySymbol} 0.00" class="budget-input" style="display: ${enableBudget ? 'inline-block' : 'none'}" oninput="updateTimeline()">
    <span class="delete-location" onclick="deleteLocation(this)" data-hover="Delete">&times;</span>
    <span class="move-button" onclick="moveUp(this)" data-hover="Move Up"><i class='fas fa-angle-up'></i></span>
    <span class="move-button" onclick="moveDown(this)" data-hover="Move Down"><i class='fas fa-angle-down'></i></span>
    <span class="plus-button" onclick="showMenu(this)" data-hover="Insert">+</span>
    <div class="menu">
      <button onclick="addLocationBetween(this)">Add Destination</button>
      <button onclick="addMeal(this)">Add Meal</button>
      <button onclick="addTransportation(this)">Add Transportation</button>
      <button onclick="addAccommodation(this)">Add Accommodation</button>
    </div>
  `;

  const timestampInput = document.createElement('input');
  timestampInput.type = 'time';
  timestampInput.className = 'timestamp-input';
  timestampInput.style.display = enableTimestamp ? 'inline-block' : 'none';
  timestampInput.oninput = updateTimeline;
  locationRow.insertBefore(timestampInput, locationRow.firstChild);

  button.closest('.location-row').insertAdjacentElement('afterend', locationRow);
  updateTimeline();
}

function addMeal(button, locationData = null, isDirectAdd = false) {
  const locationRow = document.createElement('div');
  locationRow.className = 'location-row';

  const currencySymbol = currencySymbols[selectedCurrency] || selectedCurrency;

  locationRow.innerHTML = `
    <input type="text" placeholder="Location" value="${locationData ? locationData.location : ''}" class="location-input" oninput="updateTimeline()">
    <input type="text" placeholder="Meal of the Day" value="${locationData ? locationData.meal : ''}" class="meal-input" list="meal-options">
    <input type="text" placeholder="Restaurant/ Cafe" value="${locationData ? locationData.restaurant : ''}" class="restaurant-input" oninput="updateTimeline()">
    <input type="number" placeholder="${currencySymbol} 0.00" value="${locationData ? formatBudget(locationData.budget) : ''}" class="budget-input" style="display: ${enableBudget ? 'inline-block' : 'none'}" oninput="updateTimeline()">
    <datalist id="meal-options">
      <option value="Breakfast">
      <option value="Lunch">
      <option value="Dinner">
      <option value="Snack">
    </datalist>
    <span class="delete-location" onclick="deleteLocation(this)" data-hover="Delete">&times;</span>
    <span class="move-button" onclick="moveUp(this)" data-hover="Move Up"><i class='fas fa-angle-up'></i></span>
    <span class="move-button" onclick="moveDown(this)" data-hover="Move Down"><i class='fas fa-angle-down'></i></span>
    <span class="plus-button" onclick="showMenu(this)" data-hover="Insert">+</span>
    <div class="menu">
      <button onclick="addLocationBetween(this)">Add Destination</button>
      <button onclick="addMeal(this)">Add Meal</button>
      <button onclick="addTransportation(this)">Add Transportation</button>
      <button onclick="addAccommodation(this)">Add Accommodation</button>
    </div>
  `;

  const timestampInput = document.createElement('input');
  timestampInput.type = 'time';
  timestampInput.className = 'timestamp-input';
  timestampInput.style.display = enableTimestamp ? 'inline-block' : 'none';
  timestampInput.value = locationData ? locationData.timestamp : '';
  timestampInput.oninput = updateTimeline;
  locationRow.insertBefore(timestampInput, locationRow.firstChild);

  if (isDirectAdd) {
    const locationContainer = button.closest('.day-container').querySelector('.location-container');
    locationContainer.appendChild(locationRow);
  } else {
    button.closest('.location-row').insertAdjacentElement('afterend', locationRow);
  }
  updateTimeline();
}

function addTransportation(button, locationData = null, isDirectAdd = false) {
  const locationRow = document.createElement('div');
  locationRow.className = 'location-row';

  const currencySymbol = currencySymbols[selectedCurrency] || selectedCurrency;

  locationRow.innerHTML = `
    <select class="transportation-type-select">
      <option value="destination" ${locationData && locationData.transportationType === 'destination' ? 'selected' : ''}>In-between Destinations</option>
      <option value="location" ${locationData && locationData.transportationType === 'location' ? 'selected' : ''}>In-between Locations</option>
    </select>
    <input type="text" placeholder="Transportation Type" value="${locationData ? locationData.transportation : ''}" class="transportation-input" list="transportation-options">
    <input type="text" placeholder="Station/ Stop" value="${locationData ? locationData.station : ''}" class="station-input">
    <input type="number" placeholder="${currencySymbol} 0.00" value="${locationData ? formatBudget(locationData.budget) : ''}" class="budget-input" style="display: ${enableBudget ? 'inline-block' : 'none'}" oninput="updateTimeline()">
    <span class="delete-location" onclick="deleteLocation(this)" data-hover="Delete">&times;</span>
    <datalist id="transportation-options">
      <option value="Bicycle">
      <option value="Bus">
      <option value="Car Rental">
      <option value="Flight">
      <option value="Jeepney">
      <option value="Taxi">
      <option value="Train">
    </datalist>
    <span class="move-button" onclick="moveUp(this)" data-hover="Move Up"><i class='fas fa-angle-up'></i></span>
    <span class="move-button" onclick="moveDown(this)" data-hover="Move Down"><i class='fas fa-angle-down'></i></span>
    <span class="plus-button" onclick="showMenu(this)" data-hover="Insert">+</span>
    <div class="menu">
      <button onclick="addLocationBetween(this)">Add Destination</button>
      <button onclick="addMeal(this)">Add Meal</button>
      <button onclick="addTransportation(this)">Add Transportation</button>
      <button onclick="addAccommodation(this)">Add Accommodation</button>
    </div>
  `;

  const timestampInput = document.createElement('input');
  timestampInput.type = 'time';
  timestampInput.className = 'timestamp-input';
  timestampInput.style.display = enableTimestamp ? 'inline-block' : 'none';
  timestampInput.value = locationData ? locationData.timestamp : '';
  timestampInput.oninput = updateTimeline;
  locationRow.insertBefore(timestampInput, locationRow.firstChild);

  if (isDirectAdd) {
    const locationContainer = button.closest('.day-container').querySelector('.location-container');
    locationContainer.appendChild(locationRow);
  } else {
    button.closest('.location-row').insertAdjacentElement('afterend', locationRow);
  }
  updateTimeline();
}

function addAccommodation(button, locationData = null, isDirectAdd = false) {
  const locationRow = document.createElement('div');
  locationRow.className = 'location-row';

  const currencySymbol = currencySymbols[selectedCurrency] || selectedCurrency;

  locationRow.innerHTML = `
    <input type="text" placeholder="Location" value="${locationData ? locationData.location : ''}" class="location-input" oninput="updateTimeline()">
    <input type="text" placeholder="Accommodation" value="${locationData ? locationData.accommodation : ''}" class="accommodation-input" oninput="updateTimeline()">
    <input type="text" placeholder="Check-in Time" value="${locationData ? locationData.checkInTime : ''}" class="check-in-time-input" oninput="updateTimeline()">
    <input type="text" placeholder="Check-out Time" value="${locationData ? locationData.checkOutTime : ''}" class="check-out-time-input" oninput="updateTimeline()">
    <input type="number" placeholder="${currencySymbol} 0.00" value="${locationData ? formatBudget(locationData.budget) : ''}" class="budget-input" style="display: ${enableBudget ? 'inline-block' : 'none'}" oninput="updateTimeline()">
    <span class="delete-location" onclick="deleteLocation(this)" data-hover="Delete">&times;</span>
    <span class="move-button" onclick="moveUp(this)" data-hover="Move Up"><i class='fas fa-angle-up'></i></span>
    <span class="move-button" onclick="moveDown(this)" data-hover="Move Down"><i class='fas fa-angle-down'></i></span>
    <span class="plus-button" onclick="showMenu(this)" data-hover="Insert">+</span>
    <div class="menu">
      <button onclick="addLocationBetween(this)">Add Destination</button>
      <button onclick="addMeal(this)">Add Meal</button>
      <button onclick="addTransportation(this)">Add Transportation</button>
      <button onclick="addAccommodation(this)">Add Accommodation</button>
    </div>
  `;

  const timestampInput = document.createElement('input');
  timestampInput.type = 'time';
  timestampInput.className = 'timestamp-input';
  timestampInput.style.display = enableTimestamp ? 'inline-block' : 'none';
  timestampInput.value = locationData ? locationData.timestamp : '';
  timestampInput.oninput = updateTimeline;
  locationRow.insertBefore(timestampInput, locationRow.firstChild);

  if (isDirectAdd) {
    const locationContainer = button.closest('.day-container').querySelector('.location-container');
    locationContainer.appendChild(locationRow);
  } else {
    button.closest('.location-row').insertAdjacentElement('afterend', locationRow);
  }
  updateTimeline();
}

function showMenu(button) {
  const menu = button.nextElementSibling;
  menu.style.display = 'block';

  document.addEventListener('click', function hideMenu(event) {
    if (!menu.contains(event.target) && event.target !== button) {
      menu.style.display = 'none';
      document.removeEventListener('click', hideMenu);
    }
  });
}

function deleteDay(icon) {
  const dayDiv = icon.closest('.day-container');
  dayDiv.remove();
  updateDayNumbers();
  updateTimeline();
  saveData();
}

function deleteLocation(icon) {
  const locationRow = icon.closest('.location-row');
  locationRow.remove();
  updateTimeline();
  saveData();
}

function updateDayNumbers() {
  const days = document.querySelectorAll('.day-container');
  dayCounter = 0; // Reset counter

  days.forEach((day, index) => {
    dayCounter++;
    const dayNumberSpan = day.querySelector('.day-number');
    dayNumberSpan.textContent = dayCounter;
    day.dataset.dayNo = dayCounter;

    // Update default date based on sequence
    if (index > 0) {
      const prevDayDiv = days[index - 1];
      const prevDate = new Date(prevDayDiv.querySelector('.date-input').value);
      const newDate = new Date(prevDate);
      newDate.setDate(prevDate.getDate() + 1);
      day.querySelector('.date-input').value = newDate.toISOString().split('T')[0];
    }
  });

  saveData();
}

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

function formatDateWithDay(dateString) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  const date = new Date(dateString).toLocaleDateString('en-US', options);
  const day = new Date(dateString).toLocaleDateString('en-US', { weekday: 'short' });
  return { date, day };
}

function updateTimeline() {
  const timelineList = document.getElementById('timeline-list');
  timelineList.innerHTML = '';

  const days = document.querySelectorAll('.day-container');

  if (days.length > 0) {
    const startDate = formatDate(days[0].querySelector('.date-input').value);
    const endDate = formatDate(days[days.length - 1].querySelector('.date-input').value);
    const totalDays = days.length;
    document.getElementById('itinerary-info').innerHTML = `
      <span>${startDate} - ${endDate}</span>
      <span class="trip-dates">${totalDays} Days</span>
    `;
  } else {
    document.getElementById('itinerary-info').textContent = '';
  }

  const today = new Date().setHours(0, 0, 0, 0);

  days.forEach(day => {
    const dayNo = day.dataset.dayNo;
    const { date, day: dayOfWeek } = formatDateWithDay(day.querySelector('.date-input').value);
    const dayDate = new Date(day.querySelector('.date-input').value).setHours(0, 0, 0, 0);
    const isPast = dayDate < today;
    const isCurrentOrFuture = dayDate >= today;

    const daySeparator = document.createElement('li');
    daySeparator.className = 'day-separator';
    daySeparator.innerHTML = `
      <span class="day-no">Day ${dayNo}</span>
      <span class="day-of-week">${dayOfWeek}</span>
      <span class="date">${date}</span>
    `;
    if (isPast) {
      daySeparator.classList.add('past-item');
    }
    timelineList.appendChild(daySeparator);

    const dayContent = document.createElement('li');
    dayContent.className = 'day-content';
    if (isPast) {
      dayContent.classList.add('past-item');
    }
    const dayContentList = document.createElement('ul');
    dayContent.appendChild(dayContentList);
    timelineList.appendChild(dayContent);

    const locations = day.querySelectorAll('.location-row');
    let currentLocation = null;
    let currentLocationItem = null;
    let currentNestedList = null;

    locations.forEach(locationRow => {
      const location = locationRow.querySelector('.location-input') ? locationRow.querySelector('.location-input').value : null;
      const destination = locationRow.querySelector('.destination-input') ? locationRow.querySelector('.destination-input').value : null;
      const meal = locationRow.querySelector('.meal-input') ? locationRow.querySelector('.meal-input').value : null;
      const restaurant = locationRow.querySelector('.restaurant-input') ? locationRow.querySelector('.restaurant-input').value : null;
      const transportation = locationRow.querySelector('.transportation-input') ? locationRow.querySelector('.transportation-input').value : null;
      const timestamp = locationRow.querySelector('.timestamp-input') ? locationRow.querySelector('.timestamp-input').value : null;
      const transportationType = locationRow.querySelector('.transportation-type-select') ? locationRow.querySelector('.transportation-type-select').value : null;
      const station = locationRow.querySelector('.station-input') ? locationRow.querySelector('.station-input').value : null;
      const accommodation = locationRow.querySelector('.accommodation-input') ? locationRow.querySelector('.accommodation-input').value : null;
      const checkInTime = locationRow.querySelector('.check-in-time-input') ? locationRow.querySelector('.check-in-time-input').value : null;
      const checkOutTime = locationRow.querySelector('.check-out-time-input') ? locationRow.querySelector('.check-out-time-input').value : null;
      const budget = locationRow.querySelector('.budget-input') ? locationRow.querySelector('.budget-input').value : null;

      if (location && location !== currentLocation) {
        currentLocation = location;
        currentLocationItem = document.createElement('li');
        currentLocationItem.innerHTML = `<span>${location}</span>`;
        if (isPast) {
          currentLocationItem.classList.add('past-item');
        }
        dayContentList.appendChild(currentLocationItem);
        currentNestedList = document.createElement('ul');
        currentLocationItem.appendChild(currentNestedList);
      }

      if (destination) {
        const destinationItem = document.createElement('li');
        const destinationContent = document.createElement('span');
        if (enableTimestamp) {
          const timestampSpan = document.createElement('span');
          timestampSpan.style.width = '40px'; // Allot 70px for timestampSpan
          timestampSpan.style.display = 'inline-block'; // Ensure it takes up space
          timestampSpan.style.fontSize = '75%'; // Set font size to 75% of list item font size
          timestampSpan.style.verticalAlign = 'middle'; // Vertically center the timestamp
          if (timestamp) {
            timestampSpan.textContent = timestamp;
          }
          destinationContent.appendChild(timestampSpan);
        }
        destinationContent.appendChild(document.createTextNode(destination));
        destinationItem.appendChild(destinationContent);
        if (budget) {
          const budgetSpan = document.createElement('span');
          budgetSpan.className = 'budget-span'; // Add class to budget span
          budgetSpan.style.width = '70px'; // Allot 70px for budgetSpan
          budgetSpan.style.display = 'inline-block'; // Ensure it takes up space
          budgetSpan.style.fontSize = '75%'; // Set font size to 75% of list item font size
          budgetSpan.style.verticalAlign = 'middle'; // Vertically center the budget
          const currencySymbol = currencySymbols[selectedCurrency] || selectedCurrency;
          budgetSpan.textContent = `${currencySymbol}${formatBudget(budget)}`;
          destinationContent.appendChild(budgetSpan);
        }
        currentNestedList.appendChild(destinationItem);
      }

      if (meal && restaurant) {
        const mealItem = document.createElement('li');
        const mealContent = document.createElement('span');
        if (enableTimestamp) {
          const timestampSpan = document.createElement('span');
          timestampSpan.style.width = '70px'; // Allot 70px for timestampSpan
          timestampSpan.style.display = 'inline-block'; // Ensure it takes up space
          timestampSpan.style.fontSize = '75%'; // Set font size to 75% of list item font size
          timestampSpan.style.verticalAlign = 'middle'; // Vertically center the timestamp
          if (timestamp) {
            timestampSpan.textContent = timestamp;
          }
          mealContent.appendChild(timestampSpan);
        }
        mealContent.appendChild(document.createTextNode(`${meal}: ${restaurant}`));
        mealItem.appendChild(mealContent);
        if (budget) {
          const budgetSpan = document.createElement('span');
          budgetSpan.className = 'budget-span'; // Add class to budget span
          budgetSpan.style.width = '70px'; // Allot 70px for budgetSpan
          budgetSpan.style.display = 'inline-block'; // Ensure it takes up space
          budgetSpan.style.fontSize = '75%'; // Set font size to 75% of list item font size
          budgetSpan.style.verticalAlign = 'middle'; // Vertically center the budget
          const currencySymbol = currencySymbols[selectedCurrency] || selectedCurrency;
          budgetSpan.textContent = `${currencySymbol}${formatBudget(budget)}`;
          mealContent.appendChild(budgetSpan);
        }
        currentNestedList.appendChild(mealItem);
      }

      if (transportation) {
        const transportationItem = document.createElement('li');
        const transportationContent = document.createElement('span');
        if (enableTimestamp) {
          const timestampSpan = document.createElement('span');
          timestampSpan.style.width = '70px'; // Allot 70px for timestampSpan
          timestampSpan.style.display = 'inline-block'; // Ensure it takes up space
          timestampSpan.style.fontSize = '75%'; // Set font size to 75% of list item font size
          timestampSpan.style.verticalAlign = 'middle'; // Vertically center the timestamp
          if (timestamp) {
            timestampSpan.textContent = timestamp;
          }
          transportationContent.appendChild(timestampSpan);
        }
        transportationContent.appendChild(document.createTextNode(`Transportation: ${transportation}`));
        if (station) {
          transportationContent.appendChild(document.createTextNode(`, Station/ Stop: ${station}`));
        }
        transportationItem.appendChild(transportationContent);
        if (budget) {
          const budgetSpan = document.createElement('span');
          budgetSpan.className = 'budget-span'; // Add class to budget span
          budgetSpan.style.width = '70px'; // Allot 70px for budgetSpan
          budgetSpan.style.display = 'inline-block'; // Ensure it takes up space
          budgetSpan.style.fontSize = '75%'; // Set font size to 75% of list item font size
          budgetSpan.style.verticalAlign = 'middle'; // Vertically center the budget
          const currencySymbol = currencySymbols[selectedCurrency] || selectedCurrency;
          budgetSpan.textContent = `${currencySymbol}${formatBudget(budget)}`;
          transportationContent.appendChild(budgetSpan);
        }
        if (transportationType === 'destination') {
          currentNestedList.appendChild(transportationItem);
        } else {
          dayContentList.appendChild(transportationItem);
        }
      }

      if (accommodation) {
        const accommodationItem = document.createElement('li');
        const accommodationContent = document.createElement('span');
        if (enableTimestamp) {
          const timestampSpan = document.createElement('span');
          timestampSpan.style.width = '70px'; // Allot 70px for timestampSpan
          timestampSpan.style.display = 'inline-block'; // Ensure it takes up space
          timestampSpan.style.fontSize = '75%'; // Set font size to 75% of list item font size
          timestampSpan.style.verticalAlign = 'middle'; // Vertically center the timestamp
          if (timestamp) {
            timestampSpan.textContent = timestamp;
          }
          accommodationContent.appendChild(timestampSpan);
        }
        let accommodationText = `Accommodation: ${accommodation}`;
        if (checkInTime) {
          accommodationText += `, Check-in: ${checkInTime}`;
        }
        if (checkOutTime) {
          accommodationText += `, Check-out: ${checkOutTime}`;
        }
        accommodationContent.appendChild(document.createTextNode(accommodationText));
        accommodationItem.appendChild(accommodationContent);
        if (budget) {
          const budgetSpan = document.createElement('span');
          budgetSpan.className = 'budget-span'; // Add class to budget span
          budgetSpan.style.width = '70px'; // Allot 70px for budgetSpan
          budgetSpan.style.display = 'inline-block'; // Ensure it takes up space
          budgetSpan.style.fontSize = '75%'; // Set font size to 75% of list item font size
          budgetSpan.style.verticalAlign = 'middle'; // Vertically center the budget
          const currencySymbol = currencySymbols[selectedCurrency] || selectedCurrency;
          budgetSpan.textContent = `${currencySymbol}${formatBudget(budget)}`;
          accommodationContent.appendChild(budgetSpan);
        }
        currentNestedList.appendChild(accommodationItem);
      }
    });

    // Ensure the vertical line is only drawn when there are multiple list items
    if (dayContentList.children.length > 1) {
      dayContentList.querySelectorAll('li').forEach((item, index) => {
        if (index < dayContentList.children.length - 1) {
          item.style.setProperty('--line-height', 'calc(100% - 10px)');
        } else {
          item.style.setProperty('--line-height', '0');
        }
      });
    }
  });

  saveData();
}

/* ...existing code... */

function moveUp(button) {
  const row = button.closest('.location-row');
  const previousRow = row.previousElementSibling;
  if (previousRow && previousRow.classList.contains('location-row')) {
    row.parentNode.insertBefore(row, previousRow);
    updateTimeline();
    validateTimestamps(button.closest('.day-container'));
    saveData(); // Save data after moving up
  }
}

function moveDown(button) {
  const row = button.closest('.location-row');
  const nextRow = row.nextElementSibling;
  if (nextRow && nextRow.classList.contains('location-row')) {
    row.parentNode.insertBefore(nextRow, row);
    updateTimeline();
    validateTimestamps(button.closest('.day-container'));
    saveData(); // Save data after moving down
  }
}

function moveDayUp(button) {
  const dayDiv = button.closest('.day-container');
  const previousDayDiv = dayDiv.previousElementSibling;
  if (previousDayDiv && previousDayDiv.classList.contains('day-container')) {
    dayDiv.parentNode.insertBefore(dayDiv, previousDayDiv);
    updateDayNumbers();
  }
}

function moveDayDown(button) {
  const dayDiv = button.closest('.day-container');
  const nextDayDiv = dayDiv.nextElementSibling;
  if (nextDayDiv && nextDayDiv.classList.contains('day-container')) {
    dayDiv.parentNode.insertBefore(nextDayDiv, dayDiv);
    updateDayNumbers();
  }
}

function showDownloadMenu() {
  const downloadMenu = document.getElementById('download-menu');
  downloadMenu.style.display = 'block';

  document.addEventListener('click', function hideMenu(event) {
    if (!downloadMenu.contains(event.target) && event.target !== document.getElementById('download-button')) {
      downloadMenu.style.display = 'none';
      document.removeEventListener('click', hideMenu);
    }
  });
}

function downloadAsPNG() {
  const downloadButton = document.getElementById('download-button');
  const downloadMenu = document.getElementById('download-menu');
  const canvasContainer = document.getElementById('canvas-container');
  const scale = 2; // Increase the scale for better quality

  downloadButton.style.visibility = 'hidden';
  downloadMenu.style.visibility = 'hidden';

  html2canvas(canvasContainer, {
    scale: scale,
    useCORS: true,
    logging: true,
    width: canvasContainer.scrollWidth,
    height: canvasContainer.scrollHeight
  }).then(canvas => {
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'timeline.png';
    link.click();

    downloadButton.style.visibility = 'visible';
    downloadMenu.style.visibility = 'visible';
  });
}

function downloadAsPDF() {
  const downloadButton = document.getElementById('download-button');
  const downloadMenu = document.getElementById('download-menu');
  const canvasContainer = document.getElementById('canvas-container');
  const scale = 2; // Increase the scale for better quality

  downloadButton.style.visibility = 'hidden';
  downloadMenu.style.visibility = 'hidden';

  html2canvas(canvasContainer, {
    scale: scale,
    useCORS: true,
    logging: true,
    width: canvasContainer.scrollWidth,
    height: canvasContainer.scrollHeight
  }).then(canvas => {
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jspdf.jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('timeline.pdf');

    downloadButton.style.visibility = 'visible';
    downloadMenu.style.visibility = 'visible';
  });
}

function exportData() {
  const data = localStorage.getItem(`daysData-${userId}`);
  const blob = new Blob([data], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'itinerary.json';
  link.click();
}

function importData(event) {
  const daysContainer = document.getElementById('days-container');
  const hasInput = Array.from(daysContainer.querySelectorAll('.location-input, .destination-input, .meal-input, .restaurant-input, .transportation-input'))
    .some(input => input.value.trim() !== '');

  if (hasInput) {
    const proceed = confirm("Importing without clearing will add to the current itinerary. Do you want to proceed?");
    if (!proceed) {
      event.target.value = ''; // Clear the file input
      return;
    }
  }

  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const data = e.target.result;
      localStorage.setItem(`daysData-${userId}`, data);
      loadData();
    };
    reader.readAsText(file);
  }
}

function clearData() {
  localStorage.removeItem(`daysData-${userId}`);
  document.getElementById('days-container').innerHTML = '';
  addDay();
}

// Load data on page load
window.onload = () => {
  userId = getUserId();
  loadData();
  document.querySelectorAll('.timestamp-input').forEach(input => {
    input.style.display = enableTimestamp ? 'inline-block' : 'none';
  });
  document.getElementById('timestamp-toggle').checked = enableTimestamp;
  document.getElementById('budget-toggle').checked = enableBudget;
  document.getElementById('currency-select').value = selectedCurrency;
};

function filterCurrencyOptions() {
  const input = document.querySelector('.select2-search__field');
  const filter = input.value.toUpperCase();
  const options = document.querySelectorAll('#currency-select option');

  options.forEach(option => {
    const txtValue = option.textContent || option.innerText;
    const currencyCode = option.value.toUpperCase();
    if (txtValue.toUpperCase().indexOf(filter) > -1 || currencyCode.indexOf(filter) > -1) {
      option.style.display = '';
    } else {
      option.style.display = 'none';
    }
  });
}

// ...existing code...