/**
 * Consolidated Row Builder
 */
/**
 * Consolidated Row Builder
 */
function addRow(target, type, data = null) {
    const row = document.createElement('div');
    row.className = 'location-row';
    row.dataset.type = type;

    // Generate unique ID for radio button groups and tracking
    const rowId = data?.rowId || 'row-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    row.dataset.rowId = rowId;

    const currencySymbol = typeof currencySymbols !== 'undefined' ? (currencySymbols[selectedCurrency] || selectedCurrency) : '$';

    // 1. Timestamp Input
    const ts = document.createElement('input');
    ts.type = 'time';
    ts.className = 'timestamp-input';
    ts.style.display = (typeof enableTimestamp !== 'undefined' && enableTimestamp) ? 'inline-block' : 'none';
    ts.value = data?.timestamp || '';
    ts.oninput = () => {
        updateTimeline();
        if (typeof validateTimestamps === 'function') {
            validateTimestamps(row.closest('.day-container'));
        }
    };

    // 2. Specific Fields Template
    let fields = '';
    if (type === 'destination') {
        fields = `
            <input type="text" placeholder="Location" value="${data?.location || ''}" class="location-input" oninput="updateTimeline()">
            <div class="dest-input-group" style="display:flex; flex-direction:column; flex:1;">
                <input type="text" placeholder="Destination Name" value="${data?.destination || ''}" class="destination-input" oninput="updateTimeline()">
                <input type="text" placeholder="Local Name / Subtitle" value="${data?.subtitle || ''}" class="subtitle-input" style="font-size: 0.8em; border-top:none; opacity:0.7;" oninput="updateTimeline()">
            </div>`;
    } else if (type === 'meal') {
        fields = `
            <input type="text" placeholder="Location" value="${data?.location || ''}" class="location-input" oninput="updateTimeline()">
            <input type="text" placeholder="Meal (e.g. Lunch)" value="${data?.meal || ''}" class="meal-input" oninput="updateTimeline()">
            <input type="text" placeholder="Restaurant" value="${data?.restaurant || ''}" class="restaurant-input" oninput="updateTimeline()">`;
    } else if (type === 'mealPlan') {
        fields = `
            <div class="meal-plan-grid" style="display: flex; gap: 15px; flex: 1; align-items: center;">
                <input type="text" placeholder="Location" value="${data?.location || ''}" class="location-input" oninput="updateTimeline()">
                <label style="display: flex; gap: 5px; align-items: center; font-size: 0.85em;">
                    <input type="checkbox" class="meal-b" ${data?.b ? 'checked' : ''} onchange="updateTimeline()"> <i class="fas fa-coffee"></i> B
                </label>
                <label style="display: flex; gap: 5px; align-items: center; font-size: 0.85em;">
                    <input type="checkbox" class="meal-l" ${data?.l ? 'checked' : ''} onchange="updateTimeline()"> <i class="fas fa-utensils"></i> L
                </label>
                <label style="display: flex; gap: 5px; align-items: center; font-size: 0.85em;">
                    <input type="checkbox" class="meal-d" ${data?.d ? 'checked' : ''} onchange="updateTimeline()"> <i class="fas fa-cloud-moon"></i> D
                </label>
                <input type="text" placeholder="Notes" value="${data?.subtitle || ''}" class="subtitle-input" style="flex: 1;" oninput="updateTimeline()">
            </div>`;
    } else if (type === 'transport') {
        fields = `
            <div class="transport-input-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; flex: 1;">
                <select class="transport-grouping-select" onchange="updateTimeline()" style="font-size: 0.85em;">
                    <option value="destination" ${data?.transportGrouping === 'destination' ? 'selected' : ''}>Nested (Between Dests in City)</option>
                    <option value="location" ${data?.transportGrouping === 'location' ? 'selected' : ''}>Standalone (To New Location)</option>
                </select>
                <select class="transport-type-select" onchange="updateTimeline()" style="font-size: 0.85em;">
                    <option value="Train" ${data?.transportType === 'Train' ? 'selected' : ''}>Train</option>
                    <option value="Subway" ${data?.transportType === 'Subway' ? 'selected' : ''}>Subway/Metro</option>
                    <option value="Bus" ${data?.transportType === 'Bus' ? 'selected' : ''}>Bus</option>
                    <option value="Taxi" ${data?.transportType === 'Taxi' ? 'selected' : ''}>Taxi/Ride-share</option>
                    <option value="Private Car" ${data?.transportType === 'Private Car' ? 'selected' : ''}>Private Car</option>
                    <option value="Motorcycle" ${data?.transportType === 'Motorcycle' ? 'selected' : ''}>Motorcycle</option>
                    <option value="Bicycle" ${data?.transportType === 'Bicycle' ? 'selected' : ''}>Bicycle</option>
                    <option value="Ferry" ${data?.transportType === 'Ferry' ? 'selected' : ''}>Ferry</option>
                    <option value="Walk" ${data?.transportType === 'Walk' ? 'selected' : ''}>Walking</option>
                </select>
                <div style="display: flex; flex-direction: column; gap: 4px;">
                    <input type="text" placeholder="Origin City" class="location-input origin-loc-field" value="${data?.location || ''}" oninput="updateTimeline()">
                    <div style="display: flex; gap: 5px;">
                        <input type="time" value="${data?.etd || ''}" class="etd-input" oninput="updateTimeline()">
                        <input type="text" placeholder="Station" value="${data?.station || ''}" class="station-input" oninput="updateTimeline()">
                    </div>
                </div>
                <div style="display: flex; flex-direction: column; gap: 4px;">
                    <input type="text" placeholder="Dest City" class="dest-loc-field" value="${data?.destLocation || ''}" oninput="updateTimeline()">
                    <div style="display: flex; gap: 5px;">
                        <input type="time" value="${data?.eta || ''}" class="eta-input" oninput="updateTimeline()">
                        <input type="text" placeholder="Station" value="${data?.stationDest || ''}" class="station-dest-input" oninput="updateTimeline()">
                    </div>
                </div>
                <div style="grid-column: span 2; display: flex; gap: 8px;">
                    <input type="text" placeholder="Duration" value="${data?.manualDuration || ''}" class="manual-duration-input" style="flex: 1; font-size: 0.85em;" oninput="updateTimeline()">
                    <input type="text" placeholder="Line/No." value="${data?.transport || ''}" class="transportation-input" style="flex: 1;" oninput="updateTimeline()">
                    <input type="text" placeholder="Seat/Note" value="${data?.transSubtitle || ''}" class="trans-subtitle-input" style="flex: 1;" oninput="updateTimeline()">
                </div>
            </div>`;
    } else if (type === 'accommodation') {
        fields = `
            <input type="text" placeholder="City" value="${data?.location || ''}" class="location-input" oninput="updateTimeline()">
            <input type="text" placeholder="Hotel Name" value="${data?.accommodation || ''}" class="accommodation-input" oninput="updateTimeline()">
            <input type="text" placeholder="Notes" value="${data?.subtitle || ''}" class="subtitle-input" oninput="updateTimeline()">
        `;
    } else if (type === 'flight') {
        fields = `
        <div class="flight-input-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; flex: 1;">
            <div style="display: flex; flex-direction: column; gap: 4px;">
                <input type="text" placeholder="Origin City" class="location-input origin-loc-field" value="${data?.location || ''}" oninput="updateTimeline()">
                <div style="display: flex; gap: 5px;">
                    <input type="time" value="${data?.etd || ''}" class="etd-input" oninput="updateTimeline()">
                    <input type="text" placeholder="IATA" value="${data?.originCity || ''}" class="airport-code-lookup" data-type="origin" oninput="updateTimeline()">
                </div>
                <input type="text" placeholder="Airport Name" value="${data?.originName || ''}" class="origin-name-lookup" data-type="origin" style="font-size: 0.85em;" oninput="updateTimeline()">
                <input type="text" placeholder="Terminal" value="${data?.originTerminal || ''}" class="origin-terminal-input" style="font-size: 0.8em; opacity: 0.7;" oninput="updateTimeline()">
            </div>
            <div style="display: flex; flex-direction: column; gap: 4px;">
                <input type="text" placeholder="Arrival City" class="dest-loc-field" value="${data?.destLocation || ''}" oninput="updateTimeline()">
                <div style="display: flex; gap: 5px;">
                    <input type="time" value="${data?.eta || ''}" class="eta-input" oninput="updateTimeline()">
                    <input type="text" placeholder="IATA" value="${data?.destCity || ''}" class="airport-code-lookup" data-type="dest" oninput="updateTimeline()">
                </div>
                <input type="text" placeholder="Airport Name" value="${data?.destName || ''}" class="dest-name-lookup" data-type="dest" style="font-size: 0.85em;" oninput="updateTimeline()">
                <input type="text" placeholder="Terminal" value="${data?.destTerminal || ''}" class="dest-terminal-input" style="font-size: 0.8em; opacity: 0.7;" oninput="updateTimeline()">
            </div>
            <input type="text" placeholder="Airline" value="${data?.airlines || ''}" class="airlines-input" oninput="updateTimeline()">
            <input type="text" placeholder="Flight No." value="${data?.flightNo || ''}" class="flightNo-input" oninput="updateTimeline()">
            <div class="sector-radio-group" style="grid-column: span 2; display: flex; gap: 15px; font-size: 0.85em; padding: 5px 0;">
                <label><input type="radio" name="sector-${rowId}" value="International" ${data?.sector !== 'Domestic' ? 'checked' : ''} onchange="updateTimeline()"> International</label>
                <label><input type="radio" name="sector-${rowId}" value="Domestic" ${data?.sector === 'Domestic' ? 'checked' : ''} onchange="updateTimeline()"> Domestic</label>
            </div>
        </div>`;
    }

    const controls = `
        <div class="row-controls">
            <input type="number" placeholder="${currencySymbol} 0.00" value="${data?.budget || ''}" class="budget-input" style="display: ${(typeof enableBudget !== 'undefined' && enableBudget) ? 'inline-block' : 'none'}" oninput="updateTimeline()">
            <span class="delete-location" onclick="deleteLocation(this)">&times;</span>
            <span class="move-button" onclick="moveUp(this)"><i class='fas fa-angle-up'></i></span>
            <span class="move-button" onclick="moveDown(this)"><i class='fas fa-angle-down'></i></span>
            <span class="plus-button" onclick="showMenu(this)">+</span>
            <div class="menu">
                <button onclick="addRow(this, 'destination')">Add Destination</button>
                <button onclick="addRow(this, 'meal')">Add Meal</button>
                <button onclick="addRow(this, 'mealPlan')">Add Meal Plan</button>
                <button onclick="addRow(this, 'transport')">Add Transport</button>
                <button onclick="addRow(this, 'accommodation')">Add Stay</button>
                <button onclick="addRow(this, 'flight')">Add Flight</button>
                <button onclick="addChecklist(this)" style="background:#f0f7ff;">+ Add Checklist</button>
            </div>
        </div>
        <div class="row-checklists"></div>
    `;

    row.appendChild(ts);
    row.insertAdjacentHTML('beforeend', fields + controls);

    // TARGET LOGIC
    if (target instanceof HTMLElement && target.classList.contains('location-container')) {
        target.appendChild(row);
    } else if (target instanceof HTMLElement && target.classList.contains('add-location-btn')) {
        target.closest('.day-container').querySelector('.location-container').appendChild(row);
    } else if (target instanceof HTMLElement && target.closest('.menu')) {
        const parentRow = target.closest('.location-row');
        parentRow.insertAdjacentElement('afterend', row);
        target.closest('.menu').style.display = 'none';
    } else {
        const fallback = document.querySelector('.day-container:last-child .location-container');
        if (fallback) fallback.appendChild(row);
    }

    if (data && data.checklists) {
        data.checklists.forEach(cl => addChecklist(row.querySelector('.plus-button'), cl));
    }
    updateTimeline();
}

function addChecklist(button, data = null) {
    let container;
    if (button && button.closest && button.closest('.location-row')) {
        container = button.closest('.location-row').querySelector('.row-checklists');
    } else {
        container = document.getElementById('global-checklists-container');
    }
    if (!container) return;

    const group = document.createElement('div');
    group.className = 'checklist-group';
    group.innerHTML = `
        <div class="checklist-header">
            <input type="text" placeholder="Checklist Title" class="checklist-title" value="${data?.title || ''}" oninput="updateTimeline()">
            <span class="delete-icon" onclick="this.parentElement.parentElement.remove(); updateTimeline();">×</span>
        </div>
        <div class="checklist-items"></div>
        <button class="add-item-btn" onclick="addChecklistItem(this)">+ Item</button>
    `;
    container.appendChild(group);
    if (data?.items) {
        data.items.forEach(item => addChecklistItem(group.querySelector('.add-item-btn'), item));
    }
}

function addChecklistItem(button, itemData = null) {
    const itemsContainer = button.previousElementSibling;
    const itemRow = document.createElement('div');
    itemRow.className = 'checklist-item-row';
    itemRow.innerHTML = `
        <input type="checkbox" ${itemData?.checked ? 'checked' : ''} onchange="updateTimeline()">
        <input type="text" placeholder="Detail..." class="item-text" value="${itemData?.text || (typeof itemData === 'string' ? itemData : '')}" oninput="updateTimeline()">
        <span class="remove-item" onclick="this.parentElement.remove(); updateTimeline();">−</span>
    `;
    itemsContainer.appendChild(itemRow);
}

const airportDatabase = {
    "MNL": { name: "Ninoy Aquino International Airport", location: "Manila, Philippines" },
    "CAN": { name: "Guangzhou Baiyun International Airport", location: "Guangzhou, China" },
    "URC": { name: "Ürümqi Diwopu International Airport", location: "Urumqi, China" }
};

const airlineQuickHits = {
    "PR": "Philippine Airlines",
    "5J": "Cebu Pacific",
    "CZ": "China Southern Airlines"
};

let extendedAirports = {};
let extendedAirlines = {};

// Single initialization for all external data
async function initializeData() {
    try {
        // Fetch Airlines
        const airlineResp = await fetch('https://raw.githubusercontent.com/jpatokal/openflights/master/data/airlines.dat');
        const airlineText = await airlineResp.text();
        airlineText.split('\n').forEach(line => {
            const parts = line.split(',');
            if (parts.length > 3) {
                const name = parts[1].replace(/"/g, '');
                const iata = parts[3].replace(/"/g, '');
                if (iata && iata.length === 2) extendedAirlines[iata] = name;
            }
        });

        const airportResp = await fetch('https://raw.githubusercontent.com/jpatokal/openflights/master/data/airports.dat');
        const airportText = await airportResp.text();

        airportText.split('\n').forEach(line => {
            // Split by comma, but ignore commas inside quotes
            const parts = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);

            if (parts && parts.length > 4) {
                const name = parts[1].replace(/"/g, '');     // 2nd Element: Name
                const city = parts[2].replace(/"/g, '');     // 3rd Element: City
                const country = parts[3].replace(/"/g, '');  // 4th Element: Country
                const iata = parts[4].replace(/"/g, '');    // 5th Element: IATA

                if (iata && iata.length === 3 && iata !== "\\N") {
                    airportDatabase[iata] = {
                        name: name,
                        location: `${city}, ${country}`
                    };
                }
            }
        });
    } catch (e) {
        console.warn("External airport data fetch failed.");
    }
}

document.addEventListener('input', (e) => {
    const val = e.target.value.toUpperCase();
    const row = e.target.closest('.location-row');
    if (!row) return;

    // 1. IATA Code Lookup (Triggered when 3 letters are typed)
    if (e.target.classList.contains('airport-code-lookup') && val.length === 3) {
        const type = e.target.dataset.type; // 'origin' or 'dest'
        const entry = airportDatabase[val];
        if (entry) {
            // Find fields within the same row and update them
            const locField = row.querySelector(type === 'origin' ? '.origin-loc-field' : '.dest-loc-field');
            const nameField = row.querySelector(type === 'origin' ? '.origin-name-lookup' : '.dest-name-lookup');

            if (locField) locField.value = entry.location;
            if (nameField) nameField.value = entry.name;

            updateTimeline();
        }
    }

    // 2. Airline Prefix Lookup (Triggered when 2 letters are typed)
    if (e.target.classList.contains('airlines-input') && val.length === 2) {
        // Checks local quick hits first, then the extended database if available
        const found = airlineQuickHits[val] || (typeof extendedAirlines !== 'undefined' ? extendedAirlines[val] : null);
        if (found) {
            e.target.value = found;
            updateTimeline();
        }
    }
});

initializeData();