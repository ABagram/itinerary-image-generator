/**
 * Timeline Engine
 * Responsible for rendering the preview and handling location grouping
 */

function updateTimeline() {
    const timelineList = document.getElementById('timeline-list');
    if (!timelineList) return;

    timelineList.innerHTML = '';
    let totalTripBudget = 0;

    const days = document.querySelectorAll('.day-container');

    // Weather Icon Mapping
    const weatherIcons = {
        'sunny': 'fa-sun',
        'cloudy': 'fa-cloud',
        'rainy': 'fa-cloud-showers-heavy',
        'snowy': 'fa-snowflake',
        'stormy': 'fa-bolt',
        'windy': 'fa-wind'
    };

    // 1. Update Header Info
    if (days.length > 0) {
        const firstDateInput = days[0].querySelector('.date-input').value;
        const lastDateInput = days[days.length - 1].querySelector('.date-input').value;
        const startDate = formatDate(firstDateInput);
        const endDate = formatDate(lastDateInput);

        document.getElementById('itinerary-info').innerHTML = `
            <div style="display: flex; flex-direction: column; gap: 4px;">
                <span style="font-weight: bold; font-size: 1.1em;">${startDate} — ${endDate}</span>
                <span style="font-size: 0.9em; opacity: 0.8;">${days.length} Day Trip</span>
                <div id="total-budget-display" style="color: #2ecc71; font-weight: bold; margin-top: 4px;"></div>
            </div>
        `;
    }

    const today = new Date().setHours(0, 0, 0, 0);

    // 2. Iterate through Days
    days.forEach(day => {
        const dayNo = day.dataset.dayNo;
        const dateVal = day.querySelector('.date-input').value;
        const { date, day: dayOfWeek } = formatDateWithDay(dateVal);
        const isPast = new Date(dateVal).setHours(0, 0, 0, 0) < today;

        // Capture Weather Data from the Dropdown/Inputs
        const wDescValue = day.querySelector('.weather-desc')?.value || '';
        const wTemp = day.querySelector('.weather-temp')?.value || '';
        const iconClass = weatherIcons[wDescValue];

        // Day Separator
        const daySeparator = document.createElement('li');
        daySeparator.className = `day-separator ${isPast ? 'past-item' : ''}`;

        let weatherHTML = "";
        if (iconClass || wTemp) {
            weatherHTML = `
                <span style="margin-left:15px; font-weight:normal; font-size:0.85em; color:#576574; display: inline-flex; align-items: center; gap: 6px;">
                    ${iconClass ? `<i class="fas ${iconClass}"></i>` : ''}
                    ${wTemp ? `<span>${wTemp}</span>` : ''}
                </span>`;
        }

        daySeparator.innerHTML = `
            <span class="day-no">Day ${dayNo}</span>
            <span class="day-of-week">${dayOfWeek}</span>
            <span class="date">${date}</span>
            ${weatherHTML}
        `;
        timelineList.appendChild(daySeparator);

        const dayContent = document.createElement('li');
        dayContent.className = `day-content ${isPast ? 'past-item' : ''}`;
        const dayContentList = document.createElement('ul');
        dayContent.appendChild(dayContentList);
        timelineList.appendChild(dayContent);

        let currentLocation = null;
        let currentNestedList = null;

        // 3. Iterate through Rows in a Day
        day.querySelectorAll('.location-row').forEach(row => {
            const type = row.dataset.type;
            const data = {
                location: row.querySelector('.location-input')?.value || '',
                destLocation: row.querySelector('.dest-loc-field')?.value || '',
                destination: row.querySelector('.destination-input')?.value || '',
                subtitle: row.querySelector('.subtitle-input')?.value || '',
                meal: row.querySelector('.meal-input')?.value || '',
                restaurant: row.querySelector('.restaurant-input')?.value || '',
                transport: row.querySelector('.transportation-input')?.value || '',
                station: row.querySelector('.station-input')?.value || '',
                stationDest: row.querySelector('.station-dest-input')?.value || '',
                transportType: row.querySelector('.transportation-type-select')?.value || 'destination',
                accommodation: row.querySelector('.accommodation-input')?.value || '',
                timestamp: row.querySelector('.timestamp-input')?.value || '',
                budget: parseFloat(row.querySelector('.budget-input')?.value.replace(/,/g, '')) || 0,
                airlines: row.querySelector('.airlines-input')?.value || '',
                flightNo: row.querySelector('.flightNo-input')?.value || '',
                etd: row.querySelector('.etd-input')?.value || '',
                eta: row.querySelector('.eta-input')?.value || '',
                originCity: row.querySelector('.airport-code-lookup[data-type="origin"]')?.value || '',
                originName: row.querySelector('.origin-name-lookup')?.value || '',
                originTerminal: row.querySelector('.origin-terminal-input')?.value || '',
                destCity: row.querySelector('.airport-code-lookup[data-type="dest"]')?.value || '',
                destName: row.querySelector('.dest-name-lookup')?.value || '',
                destTerminal: row.querySelector('.dest-terminal-input')?.value || '',
                sector: row.querySelector('.sector-radio-group input:checked')?.value || 'International',
            };

            if (enableBudget) totalTripBudget += data.budget;

            // Location Grouping Logic (Non-Flight)
            if (data.location && data.location !== currentLocation && type !== 'flight') {
                currentLocation = data.location;
                const locItem = document.createElement('li');
                locItem.style = "list-style: none; margin-top: 15px; margin-bottom: 10px;";
                locItem.innerHTML = `<i class="fas fa-map-marker-alt" style="margin-right: 8px; color: #e74c3c;"></i><strong>${data.location}</strong>`;
                dayContentList.appendChild(locItem);

                currentNestedList = document.createElement('ul');
                currentNestedList.style = "list-style: none; padding-left: 0; margin-top: 10px;";
                locItem.appendChild(currentNestedList);
            }

            let icon = "fas fa-circle";
            let mainText = "";
            let itemLi;

            if (type === 'destination') {
                icon = "fas fa-thumbtack";
                mainText = `Visit <strong>${data.destination}</strong>`;
                itemLi = renderTimelineItem(data, icon, mainText, data.subtitle);
            } else if (type === 'meal') {
                icon = "fas fa-utensils";
                mainText = `${data.meal}: ${data.restaurant}`;
                itemLi = renderTimelineItem(data, icon, mainText, data.subtitle);
            } else if (type === 'mealPlan') {
                const b = row.querySelector('.meal-b')?.checked;
                const l = row.querySelector('.meal-l')?.checked;
                const d = row.querySelector('.meal-d')?.checked;
                const mealIcons = [];
                if (b) mealIcons.push('<i class="fas fa-coffee"></i> <strong>B</strong>');
                if (l) mealIcons.push('<i class="fas fa-utensils"></i> <strong>L</strong>');
                if (d) mealIcons.push('<i class="fas fa-cloud-moon"></i> <strong>D</strong>');
                if (mealIcons.length > 0) {
                    mainText = `Meal Plan: ${mealIcons.join(' — ')}`;
                    itemLi = renderTimelineItem(data, "fas fa-concierge-bell", mainText, data.subtitle);
                }
            } else if (type === 'transport') {
                // Correctly capture the specific transport type (Bus, Train, etc.)
                const transportTypeField = row.querySelector('.transport-type-select');
                data.transportType = transportTypeField ? transportTypeField.value : 'Transport';

                // Capture the grouping preference
                data.transportGrouping = row.querySelector('.transport-grouping-select')?.value;

                // Determine the icon based on the type
                const iconClass = getTransportIcon(data.transportType);

                // Render the card
                itemLi = renderTransportTimelineItem(data);

                // Handle the "Sandwich" vs "Nested" logic
                if (data.transportGrouping === 'location' && data.destLocation && data.destLocation !== currentLocation) {
                    // INTER-CITY: Render card THEN new location header
                    dayContentList.appendChild(itemLi);

                    currentLocation = data.destLocation;
                    const arrivalHeader = document.createElement('li');
                    arrivalHeader.style = "list-style: none; margin-top: 25px; margin-bottom: 10px;";
                    arrivalHeader.innerHTML = `<i class="fas fa-map-marker-alt" style="color: #e74c3c; margin-right: 8px;"></i><strong>${currentLocation}</strong>`;
                    dayContentList.appendChild(arrivalHeader);

                    currentNestedList = document.createElement('ul');
                    currentNestedList.style = "list-style: none; padding-left: 0; margin-top: 10px;";
                    arrivalHeader.appendChild(currentNestedList);
                } else {
                    // NESTED: Keep it inside the current city list
                    if (currentNestedList) {
                        currentNestedList.appendChild(itemLi);
                    } else {
                        dayContentList.appendChild(itemLi);
                    }
                }
                return;
            } else if (type === 'accommodation') {
                icon = "fas fa-bed";
                const hotelName = row.querySelector('.accommodation-input')?.value || 'Accommodation';
                mainText = `Stay at <strong>${hotelName}</strong>`;

                // Call the helper specifically for accommodation
                itemLi = renderAccommodationTimelineItem(data, icon, mainText);
            } else if (type === 'flight') {
                // 1. ORIGIN CITY HEADER (The top slice of the sandwich)
                const originCity = data.location || data.originCity;
                if (originCity && originCity !== currentLocation) {
                    currentLocation = originCity;
                    const originLocHeader = document.createElement('li');
                    originLocHeader.style = "list-style: none; margin-top: 25px; margin-bottom: 10px;";
                    originLocHeader.innerHTML = `<i class="fas fa-map-marker-alt" style="margin-right: 8px; color: #e74c3c;"></i><strong>${originCity}</strong>`;
                    dayContentList.appendChild(originLocHeader);

                    // Reset nested list for items under this new origin
                    currentNestedList = document.createElement('ul');
                    currentNestedList.style = "list-style: none; padding-left: 0; margin-top: 10px;";
                    originLocHeader.appendChild(currentNestedList);
                }

                // 2. THE FLIGHT CARD (The middle of the sandwich)
                const duration = (typeof calculateDuration === 'function') ? calculateDuration(data.etd, data.eta) : "";
                itemLi = renderFlightTimelineItem({ ...data, durationText: duration }, "fas fa-plane-departure");

                // We append the flight card directly to dayContentList so it sits 
                // between the two location headers, not inside them.
                dayContentList.appendChild(itemLi);

                // 3. ARRIVAL CITY HEADER (The bottom slice of the sandwich)
                const arrivalCity = data.destLocation || data.destCity;
                if (arrivalCity && arrivalCity !== currentLocation) {
                    currentLocation = arrivalCity;
                    const arrivalLocHeader = document.createElement('li');
                    arrivalLocHeader.style = "list-style: none; margin-top: 25px; margin-bottom: 10px;";
                    arrivalLocHeader.innerHTML = `<i class="fas fa-map-marker-alt" style="margin-right: 8px; color: #e74c3c;"></i><strong>${arrivalCity}</strong>`;
                    dayContentList.appendChild(arrivalLocHeader);

                    // This ensures that any "Visit" or "Meal" rows after the flight 
                    // correctly nest under the new Arrival City.
                    currentNestedList = document.createElement('ul');
                    currentNestedList.style = "list-style: none; padding-left: 0; margin-top: 10px;";
                    arrivalLocHeader.appendChild(currentNestedList);
                }
            }

            // Checklist Rendering
            const checklists = row.querySelectorAll('.checklist-group');
            if (itemLi && checklists.length > 0) {
                const checklistUl = document.createElement('ul');
                checklistUl.style = "list-style: none; padding-left: 15px; margin-top: 10px; display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 5px;";
                checklists.forEach(group => {
                    const title = group.querySelector('.checklist-title')?.value;
                    if (title) {
                        const titleLi = document.createElement('li');
                        titleLi.style = "font-size: 0.8em; font-weight: bold; text-transform: uppercase; margin-top: 8px; opacity: 0.6; grid-column: 1 / -1;";
                        titleLi.textContent = title;
                        checklistUl.appendChild(titleLi);
                    }
                    group.querySelectorAll('.checklist-item-row').forEach(item => {
                        const text = item.querySelector('.item-text')?.value;
                        const isChecked = item.querySelector('input[type="checkbox"]')?.checked;
                        if (text) {
                            const li = document.createElement('li');
                            li.style = `font-size: 0.85em; margin: 2px 0; color: ${isChecked ? '#aaa' : '#333'}; text-decoration: ${isChecked ? 'line-through' : 'none'};`;
                            li.innerHTML = `<i class="${isChecked ? 'fas fa-check-square' : 'far fa-square'}" style="margin-right: 6px;"></i> ${text}`;
                            checklistUl.appendChild(li);
                        }
                    });
                });
                itemLi.appendChild(checklistUl);
            }

            // Append Standard Items
            if (itemLi && type !== 'flight' && type !== 'transport') {
                if (currentNestedList) {
                    currentNestedList.appendChild(itemLi);
                } else {
                    dayContentList.appendChild(itemLi);
                }
            }
        });
    });

    if (enableBudget) {
        const symbol = (typeof currencySymbols !== 'undefined' && currencySymbols[selectedCurrency]) || selectedCurrency;
        const display = document.getElementById('total-budget-display');
        if (display) display.textContent = `Total Estimated: ${symbol}${totalTripBudget.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
    }

    if (typeof saveData === 'function') saveData();
}

function renderTimelineItem(data, iconClass, mainText, subText) {
    const li = document.createElement('li');
    li.style = "margin-bottom: 12px; list-style: none;";

    const container = document.createElement('div');
    container.style = "display: flex; align-items: flex-start; gap: 12px; width: 100%;";

    if (enableTimestamp) {
        const ts = document.createElement('span');
        ts.style = "flex: 0 0 50px; font-size: 0.75em; font-weight: bold; color: #888; padding-top: 3px;";
        // If timestamp is empty, render empty string so alignment stays but text disappears
        ts.textContent = data.timestamp ? data.timestamp : '';
        container.appendChild(ts);
    }

    const icon = document.createElement('i');
    icon.className = iconClass;
    icon.style = "flex: 0 0 20px; color: #555; padding-top: 4px; text-align: center;";
    container.appendChild(icon);

    const textDiv = document.createElement('div');
    textDiv.style = "flex: 1; min-width: 0; overflow-wrap: break-word;";
    textDiv.innerHTML = `<div style="font-weight: 500; font-size: 0.95em; line-height: 1.3; color: #2c3e50;">${mainText}</div>`;

    if (subText) {
        const sub = document.createElement('div');
        sub.style = "font-size: 0.8em; color: #7f8c8d; font-style: italic; margin-top: 2px;";
        sub.textContent = subText;
        textDiv.appendChild(sub);
    }

    container.appendChild(textDiv);

    if (enableBudget && data.budget > 0) {
        const symbol = (typeof currencySymbols !== 'undefined' && currencySymbols[selectedCurrency]) || selectedCurrency;
        const b = document.createElement('span');
        b.style = "flex: 0 0 auto; font-size: 0.8em; font-weight: bold; color: #27ae60; margin-left: 10px; padding-top: 2px;";
        b.textContent = `${symbol}${data.budget.toLocaleString()}`;
        container.appendChild(b);
    }

    li.appendChild(container);
    return li;
}

function getTransportIcon(type) {
    const icons = {
        'Train': 'fa-train',
        'Subway': 'fa-subway',
        'Bus': 'fa-bus',
        'Taxi': 'fa-taxi',
        'Private Car': 'fa-car-side', // Slightly different icon than Taxi
        'Motorcycle': 'fa-motorcycle',
        'Bicycle': 'fa-bicycle',
        'Ferry': 'fa-ship',
        'Walk': 'fa-walking'
    };
    return icons[type] || 'fa-route';
}

function renderTransportTimelineItem(data) {
    const iconClass = getTransportIcon(data.transportType);
    const duration = data.manualDuration || calculateDuration(data.etd, data.eta);

    const li = document.createElement('li');
    li.className = 'timeline-item transport-item';
    li.style = "margin-top: 10px; margin-bottom: 20px; list-style: none; padding: 15px; background: #fffcf5; border-radius: 8px; border-left: 4px solid #f39c12; position: relative;";

    li.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 10px;">
            <div style="display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #fdebd0; padding-bottom: 8px;">
                <i class="fas ${iconClass}" style="color: #f39c12;"></i>
                <span style="font-weight: bold; color: #784e06;">${data.transportType} ${data.transport ? `— ${data.transport}` : ''}</span>
                ${duration ? `<span style="margin-left: auto; font-size: 0.75em; color: #f39c12; font-weight: 600; background: #fff8e1; padding: 2px 8px; border-radius: 10px;">${duration}</span>` : ''}
            </div>
            
            <div style="display: flex; gap: 12px; font-size: 0.9em;">
                <div style="flex: 0 0 50px; font-weight: bold; color: #2c3e50;">${data.etd || '--:--'}</div>
                <div style="font-weight: 600;">${data.station || 'Departure Point'}</div>
            </div>

            <div style="display: flex; gap: 12px; font-size: 0.9em;">
                <div style="flex: 0 0 50px; font-weight: bold; color: #2c3e50;">${data.eta || '--:--'}</div>
                <div style="font-weight: 600;">${data.stationDest || 'Arrival Point'}</div>
            </div>
        </div>
    `;
    return li;
}

function renderFlightTimelineItem(data, iconClass) {
    const li = document.createElement('li');
    // We add a class here so the toggleBudget() function can find it
    li.className = 'timeline-item flight-item';
    li.style = "margin-top: 25px; margin-bottom: 25px; list-style: none; padding: 15px; background: #f8fbff; border-radius: 8px; border-left: 4px solid #0070F2; position: relative;";

    // Calculate duration if durationText is missing
    const duration = data.durationText || calculateDuration(data.etd, data.eta) || '';

    li.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 12px;">
            <div style="display: flex; align-items: flex-start; gap: 10px; border-bottom: 1px solid #e0e6ed; padding-bottom: 8px;">
                <i class="fas fa-plane" style="color: #0070F2; margin-top: 4px;"></i>
                <div style="display: flex; flex-direction: column;">
                    <span style="font-weight: bold; color: #2c3e50;">${data.airlines || 'Airline'} — ${data.flightNo || '---'}</span>
                    <span style="font-size: 0.75em; color: #95a5a6; font-weight: bold;">${data.sector || 'International'}</span>
                </div>
                
                <div style="margin-left: auto; text-align: right; display: flex; flex-direction: column; align-items: flex-end; gap: 4px;">
                    <span style="font-size: 0.75em; color: #0070F2; font-weight: 600; background: #eef5ff; padding: 2px 8px; border-radius: 10px;"> Duration: ${duration}</span>
                    <div class="timeline-budget-amount" style="display: ${enableBudget ? 'block' : 'none'}; color: #27ae60; font-weight: bold; font-size: 0.85em;">
                        ${selectedCurrency} ${data.budget || '0.00'}
                    </div>
                </div>
            </div>
            <div style="display: flex; gap: 12px;">
                <div style="flex: 0 0 50px; font-weight: bold; font-size: 0.9em; color: #2c3e50;">${data.etd || '--:--'}</div>
                <div style="flex: 1;">
                    <div style="font-weight: 600; font-size: 0.95em;">${data.originName || 'Departure Airport'}</div>
                    <div style="font-size: 0.8em; color: #7f8c8d;">Terminal ${data.originTerminal || 'N/A'}</div>
                </div>
            </div>

            <div style="display: flex; gap: 12px;">
                <div style="flex: 0 0 50px; font-weight: bold; font-size: 0.9em; color: #2c3e50;">${data.eta || '--:--'}</div>
                <div style="flex: 1;">
                    <div style="font-weight: 600; font-size: 0.95em;">${data.destName || 'Arrival Airport'}</div>
                    <div style="font-size: 0.8em; color: #7f8c8d;">Terminal ${data.destTerminal || 'N/A'}</div>
                </div>
            </div>
                    </div>
    `;
    return li;
}

function calculateDuration(etd, eta) {
    if (!etd || !eta) return "";
    const [h1, m1] = etd.split(':').map(Number);
    const [h2, m2] = eta.split(':').map(Number);

    let diff = (h2 * 60 + m2) - (h1 * 60 + m1);
    if (diff < 0) diff += 1440;

    const hours = Math.floor(diff / 60);
    const mins = diff % 60;
    return `${hours}h ${mins}m`;
}

function renderAccommodationTimelineItem(data, icon, mainText) {
    const li = document.createElement('li');
    li.style = "margin-bottom: 15px; position: relative;";

    li.innerHTML = `
        <div style="display: flex; align-items: flex-start; gap: 10px;">
            <div style="min-width: 50px; font-size: 0.85em; color: #7f8c8d; padding-top: 2px;">
                ${data.timestamp || '--:--'}
            </div>
            <div style="color: #34495e; flex-grow: 1;">
                <i class="${icon}" style="margin-right: 8px; color: #9b59b6;"></i>
                <span>${mainText}</span>
                ${data.subtitle ? `<div style="font-size: 0.85em; color: #7f8c8d; margin-left: 24px;">${data.subtitle}</div>` : ''}
            </div>
        </div>
    `;
    return li;
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatDateWithDay(dateString) {
    if (!dateString) return { date: '', day: '' };
    const dateObj = new Date(dateString);
    return {
        date: dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        day: dateObj.toLocaleDateString('en-US', { weekday: 'short' })
    };
}
