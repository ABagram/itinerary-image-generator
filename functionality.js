let dayCounter = 0;
let userId;

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
      locations.push({ location, destination, meal, restaurant, transportation });
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
}

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
      <span>DAY <input type="number" class="day-number" value="${dayCounter}" onchange="updateDayNumbers()"></span>
      <input type="date" value="${dayData ? dayData.date : today}" class="date-input">
      <span class="move-day-button" onclick="moveDayUp(this)" data-hover="Move Up"><i class='fas fa-angle-up'></i></span>
      <span class="move-day-button" onclick="moveDayDown(this)" data-hover="Move Down"><i class="fas fa-angle-down"></i></span>
      <span class="trash-icon" onclick="deleteDay(this)" data-hover="Delete"><i class="fas fa-trash"></i></span>
    </div>
    <div class="location-container"></div>
    <button class="add-location" onclick="addLocation(this)">Add Location</button>
    <button class="add-location" onclick="addMeal(this)">Add Meal</button>
    <button class="add-location" onclick="addTransportation(this)">Add Transportation</button>
  `;

  document.getElementById('days-container').appendChild(dayDiv);

  if (dayData) {
    dayData.locations.forEach(locationData => {
      if (locationData.transportation) {
        addTransportation(dayDiv.querySelector('.add-location'), locationData);
      } else if (locationData.meal) {
        addMeal(dayDiv.querySelector('.add-location'), locationData);
      } else {
        addLocation(dayDiv.querySelector('.add-location'), locationData);
      }
    });
  } else {
    addLocation(dayDiv.querySelector('.add-location'));
  }

  updateTimeline();
}

function addLocation(button, locationData = null) {
  const locationRow = document.createElement('div');
  locationRow.className = 'location-row';

  locationRow.innerHTML = `
    <input type="text" placeholder="Location" value="${locationData ? locationData.location : ''}" oninput="updateTimeline()" class="location-input">
    <input type="text" placeholder="Destination" value="${locationData ? locationData.destination : ''}" oninput="updateTimeline()" class="destination-input">
    <span class="delete-location" onclick="deleteLocation(this)" data-hover="Delete">&times;</span>
    <span class="move-button" onclick="moveUp(this)" data-hover="Move Up"><i class='fas fa-angle-up'></i></span>
    <span class="move-button" onclick="moveDown(this)" data-hover="Move Down"><i class="fas fa-angle-down"></i></span>
    <span class="plus-button" onclick="showMenu(this)" data-hover="Insert">+</span>
    <div class="menu">
      <button onclick="addLocationBetween(this)">Add Location</button>
      <button onclick="addMeal(this)">Add Meal</button>
      <button onclick="addTransportation(this)">Add Transportation</button>
    </div>
  `;

  button.previousElementSibling.appendChild(locationRow);
  updateTimeline();
}

function addLocationBetween(button) {
  const locationRow = document.createElement('div');
  locationRow.className = 'location-row';

  locationRow.innerHTML = `
    <input type="text" placeholder="Location" class="location-input" oninput="updateTimeline()">
    <input type="text" placeholder="Destination" class="destination-input" oninput="updateTimeline()">
    <span class="delete-location" onclick="deleteLocation(this)" data-hover="Delete">&times;</span>
    <span class="move-button" onclick="moveUp(this)" data-hover="Move Up"><i class='fas fa-angle-up'></i></span>
    <span class="move-button" onclick="moveDown(this)" data-hover="Move Down"><i class="fas fa-angle-down"></i></span>
    <span class="plus-button" onclick="showMenu(this)" data-hover="Insert">+</span>
    <div class="menu">
      <button onclick="addLocationBetween(this)">Add Location</button>
      <button onclick="addMeal(this)">Add Meal</button>
      <button onclick="addTransportation(this)">Add Transportation</button>
    </div>
  `;

  button.closest('.location-row').insertAdjacentElement('afterend', locationRow);
  updateTimeline();
}

function addMeal(button, locationData = null) {
  const locationRow = document.createElement('div');
  locationRow.className = 'location-row';

  locationRow.innerHTML = `
    <input type="text" placeholder="Location" class="location-input" oninput="updateTimeline()">
    <input type="text" placeholder="Meal of the Day" value="${locationData ? locationData.meal : ''}" class="meal-input" list="meal-options">
    <input type="text" placeholder="Restaurant/ Cafe" class="restaurant-input" oninput="updateTimeline()">
    <datalist id="meal-options">
      <option value="Breakfast">
      <option value="Lunch">
      <option value="Dinner">
      <option value="Snack">
    </datalist>
    <span class="delete-location" onclick="deleteLocation(this)" data-hover="Delete">&times;</span>
    <span class="move-button" onclick="moveUp(this)" data-hover="Move Up"><i class='fas fa-angle-up'></i></span>
    <span class="move-button" onclick="moveDown(this)" data-hover="Move Down"><i class="fas fa-angle-down"></i></span>
    <span class="plus-button" onclick="showMenu(this)" data-hover="Insert">+</span>
    <div class="menu">
      <button onclick="addLocationBetween(this)">Add Location</button>
      <button onclick="addMeal(this)">Add Meal</button>
      <button onclick="addTransportation(this)">Add Transportation</button>
    </div>
  `;

  button.closest('.location-row').insertAdjacentElement('afterend', locationRow);
  updateTimeline();
}

function addTransportation(button, locationData = null) {
  const locationRow = document.createElement('div');
  locationRow.className = 'location-row';

  locationRow.innerHTML = `
    <input type="text" placeholder="Transportation Type" value="${locationData ? locationData.transportation : ''}" class="transportation-input" list="transportation-options">
    <span class="delete-location" onclick="deleteLocation(this)" data-hover="Delete">&times;</span>
    <datalist id="transportation-options">
      <option value="Bus">
      <option value="Train">
      <option value="Flight">
      <option value="Car Rental">
      <option value="Bicycle">
    </datalist>
    <span class="move-button" onclick="moveUp(this)" data-hover="Move Up"><i class='fas fa-angle-up'></i></span>
    <span class="move-button" onclick="moveDown(this)" data-hover="Move Down"><i class="fas fa-angle-down"></i></span>
    <span class="plus-button" onclick="showMenu(this)" data-hover="Insert">+</span>
    <div class="menu">
      <button onclick="addLocationBetween(this)">Add Location</button>
      <button onclick="addMeal(this)">Add Meal</button>
      <button onclick="addTransportation(this)">Add Transportation</button>
    </div>
  `;

  button.closest('.location-row').insertAdjacentElement('afterend', locationRow);
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
    const dayNumberInput = day.querySelector('.day-number');
    dayNumberInput.value = dayCounter;
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
  return `${date} (${day})`;
}

function updateTimeline() {
  const timelineList = document.getElementById('timeline-list');
  timelineList.innerHTML = '';

  const days = document.querySelectorAll('.day-container');

  if (days.length > 0) {
    const startDate = formatDate(days[0].querySelector('.date-input').value);
    const endDate = formatDate(days[days.length - 1].querySelector('.date-input').value);
    const totalDays = days.length;
    document.getElementById('itinerary-info').textContent = `${startDate} - ${endDate} (${totalDays} Days)`;
  } else {
    document.getElementById('itinerary-info').textContent = '';
  }

  const today = new Date().setHours(0, 0, 0, 0);

  days.forEach(day => {
    const dayNo = day.dataset.dayNo;
    const date = formatDateWithDay(day.querySelector('.date-input').value);
    const dayDate = new Date(day.querySelector('.date-input').value).setHours(0, 0, 0, 0);
    const isPast = dayDate < today;

    const daySeparator = document.createElement('li');
    daySeparator.className = 'day-separator';
    daySeparator.innerHTML = `<span>Day ${dayNo} - ${date}</span>`;
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
        destinationItem.textContent = destination;
        if (isPast) {
          destinationItem.classList.add('past-item');
        }
        currentNestedList.appendChild(destinationItem);
      }

      if (meal && restaurant) {
        const mealItem = document.createElement('li');
        mealItem.textContent = `${meal}: ${restaurant}`;
        if (isPast) {
          mealItem.classList.add('past-item');
        }
        currentNestedList.appendChild(mealItem);
      }

      if (transportation) {
        const transportationItem = document.createElement('li');
        transportationItem.textContent = `Transportation: ${transportation}`;
        if (isPast) {
          transportationItem.classList.add('past-item');
        }
        dayContentList.appendChild(transportationItem);
      }
    });
  });

  saveData();
}

function moveUp(button) {
  const row = button.closest('.location-row');
  const previousRow = row.previousElementSibling;
  if (previousRow && previousRow.classList.contains('location-row')) {
    row.parentNode.insertBefore(row, previousRow);
    updateTimeline();
  }
}

function moveDown(button) {
  const row = button.closest('.location-row');
  const nextRow = row.nextElementSibling;
  if (nextRow && nextRow.classList.contains('location-row')) {
    row.parentNode.insertBefore(nextRow, row);
    updateTimeline();
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
  downloadButton.style.visibility = 'hidden';

  const canvasContainer = document.getElementById('canvas-container');
  const scale = 2; // Increase the scale for better quality

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
  });
}

function downloadAsPDF() {
  const downloadButton = document.getElementById('download-button');
  downloadButton.style.visibility = 'hidden';

  const canvasContainer = document.getElementById('canvas-container');
  const scale = 2; // Increase the scale for better quality

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
};