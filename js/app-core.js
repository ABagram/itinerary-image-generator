/**
 * Data Management & App Initialization
 */


/**
 * Data Management & App Initialization
 */

function exportData() {
    // Force a save of current UI state before exporting
    saveData();
    
    const rawDays = localStorage.getItem(`daysData-${userId}`);
    const rawGlobal = localStorage.getItem(`globalChecklists-${userId}`);
    
    const data = {
        days: rawDays ? JSON.parse(rawDays) : [],
        global: rawGlobal ? JSON.parse(rawGlobal) : null
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `itinerary_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

function importData(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const imported = JSON.parse(e.target.result);
            
            // Extract the days array (handles {days:[]} wrapper or flat arrays)
            let daysToSave = [];
            if (imported.days && Array.isArray(imported.days)) {
                daysToSave = imported.days;
            } else if (Array.isArray(imported)) {
                daysToSave = imported;
            } else {
                throw new Error("JSON structure not recognized.");
            }

            // Write to storage
            localStorage.setItem(`daysData-${userId}`, JSON.stringify(daysToSave));
            
            if (imported.global) {
                localStorage.setItem(`globalChecklists-${userId}`, JSON.stringify(imported.global));
            }

            alert(`Success! Imported ${daysToSave.length} days.`);
            location.reload(); 
        } catch (err) {
            console.error("Import failed:", err);
            alert("Import failed: " + err.message);
        }
    };
    reader.readAsText(file);
}

function saveData() {
    const daysData = [];
    const days = document.querySelectorAll('.day-container');

    // Safety: If there are no days in the UI, don't overwrite storage (prevents accidental wipes)
    if (days.length === 0) return;

    days.forEach(day => {
        const dayObj = {
            dayNo: day.dataset.dayNo,
            date: day.querySelector('.date-input').value,
            weatherDesc: day.querySelector('.weather-desc')?.value || '',
            weatherTemp: day.querySelector('.weather-temp')?.value || '',
            locations: []
        };

        day.querySelectorAll('.location-row').forEach(row => {
            const type = row.dataset.type;
            const locObj = {
                type: type,
                rowId: row.dataset.rowId,
                timestamp: row.querySelector('.timestamp-input')?.value || '',
                location: row.querySelector('.location-input')?.value || '',
                budget: row.querySelector('.budget-input')?.value || '',
                checklists: []
            };

            // Capture specific fields based on row type
            if (type === 'destination') {
                locObj.destination = row.querySelector('.destination-input')?.value || '';
                locObj.subtitle = row.querySelector('.subtitle-input')?.value || '';
            } 
            else if (type === 'accommodation') {
                locObj.accommodation = row.querySelector('.accommodation-input')?.value || '';
                locObj.subtitle = row.querySelector('.subtitle-input')?.value || '';
            }
            else if (type === 'meal') {
                locObj.meal = row.querySelector('.meal-input')?.value || '';
                locObj.restaurant = row.querySelector('.restaurant-input')?.value || '';
            } 
            else if (type === 'mealPlan') {
                locObj.b = row.querySelector('.meal-b')?.checked || false;
                locObj.l = row.querySelector('.meal-l')?.checked || false;
                locObj.d = row.querySelector('.meal-d')?.checked || false;
                locObj.subtitle = row.querySelector('.subtitle-input')?.value || '';
            } 
            else if (type === 'transport') {
                locObj.transportGrouping = row.querySelector('.transport-grouping-select')?.value;
                locObj.transportType = row.querySelector('.transport-type-select')?.value;
                locObj.destLocation = row.querySelector('.dest-loc-field')?.value || '';
                locObj.etd = row.querySelector('.etd-input')?.value || '';
                locObj.eta = row.querySelector('.eta-input')?.value || '';
                locObj.station = row.querySelector('.station-input')?.value || '';
                locObj.stationDest = row.querySelector('.station-dest-input')?.value || '';
                locObj.manualDuration = row.querySelector('.manual-duration-input')?.value || '';
                locObj.transport = row.querySelector('.transportation-input')?.value || '';
                locObj.transSubtitle = row.querySelector('.trans-subtitle-input')?.value || '';
            } 
            else if (type === 'flight') {
                locObj.airlines = row.querySelector('.airlines-input')?.value || '';
                locObj.flightNo = row.querySelector('.flightNo-input')?.value || '';
                locObj.etd = row.querySelector('.etd-input')?.value || '';
                locObj.eta = row.querySelector('.eta-input')?.value || '';
                locObj.destLocation = row.querySelector('.dest-loc-field')?.value || '';
                locObj.originCity = row.querySelector('.airport-code-lookup[data-type="origin"]')?.value || '';
                locObj.destCity = row.querySelector('.airport-code-lookup[data-type="dest"]')?.value || '';
                locObj.originName = row.querySelector('.origin-name-lookup')?.value || '';
                locObj.destName = row.querySelector('.dest-name-lookup')?.value || '';
                locObj.originTerminal = row.querySelector('.origin-terminal-input')?.value || '';
                locObj.destTerminal = row.querySelector('.dest-terminal-input')?.value || '';
                locObj.sector = row.querySelector('.sector-radio-group input:checked')?.value || 'International';
            }

            // Checklist Capture
            row.querySelectorAll('.checklist-group').forEach(group => {
                const checklistObj = {
                    title: group.querySelector('.checklist-title')?.value || 'Checklist',
                    items: []
                };
                group.querySelectorAll('.checklist-item-row').forEach(itemRow => {
                    checklistObj.items.push({
                        text: itemRow.querySelector('.item-text')?.value || '',
                        checked: itemRow.querySelector('input[type="checkbox"]')?.checked || false
                    });
                });
                locObj.checklists.push(checklistObj);
            });

            dayObj.locations.push(locObj);
        });
        daysData.push(dayObj);
    });

    localStorage.setItem(`daysData-${userId}`, JSON.stringify(daysData));
}

function loadData() {
    const container = document.getElementById('days-container');
    if (!container) return;

    const rawData = localStorage.getItem(`daysData-${userId}`);
    let daysData = [];

    try {
        if (rawData) {
            const parsed = JSON.parse(rawData);
            daysData = (parsed && parsed.days) ? parsed.days : (Array.isArray(parsed) ? parsed : []);
        }
    } catch (e) {
        console.error("Error reading storage:", e);
    }

    container.innerHTML = '';
    dayCounter = 0; 

    if (daysData.length > 0) {
        daysData.forEach(dayObj => addDay(dayObj));
    } else {
        addDay(); 
    }
    
    setTimeout(() => {
        if (typeof updateTimeline === 'function') updateTimeline();
    }, 200);
}

function clearData() {
    if (confirm('Clear all data? This cannot be undone.')) {
        localStorage.removeItem(`daysData-${userId}`);
        localStorage.removeItem(`globalChecklists-${userId}`);
        location.reload();
    }
}

function showDownloadMenu(event) {
    event.stopPropagation();
    const menu = document.getElementById('download-menu');
    
    // Toggle the display
    if (menu.style.display === 'block') {
        menu.style.display = 'none';
    } else {
        menu.style.display = 'block';
    }
}

function downloadAsPNG() {
    const element = document.getElementById('canvas-container');

    // 1. Create a "Snapshot State" for high readability
    const originalStyle = element.getAttribute('style');

    // Force a specific width so text wraps exactly like a printed page
    element.style.width = "800px";
    element.style.height = "auto";
    element.style.overflow = "visible";
    element.style.padding = "40px";
    element.style.backgroundColor = "#ffffff"; // Clean white background

    // 2. Capture
    html2canvas(element, {
        scale: 2, // Boost resolution for text clarity
        useCORS: true,
        logging: false,
        windowWidth: 800 // Forces the 'viewport' of the capture
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = `Trip_Itinerary_${new Date().toLocaleDateString()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();

        // 3. Restore the adaptive UI style
        if (originalStyle) {
            element.setAttribute('style', originalStyle);
        } else {
            element.removeAttribute('style');
        }
        updateTimeline(); // Refresh to ensure UI is back to normal
    });
}

async function downloadAsPDF() {
    const { jsPDF } = window.jspdf;
    const element = document.getElementById('canvas-container');

    // 1. Prepare element for high-quality capture
    const originalStyle = element.getAttribute('style');
    element.style.width = "800px";
    element.style.height = "auto";
    element.style.overflow = "visible";
    element.style.backgroundColor = "#ffffff";

    try {
        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            logging: false
        });

        const imgData = canvas.toDataURL('image/png');

        // A4 dimensions in mm
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        // Calculate dimensions to maintain aspect ratio
        const imgProps = pdf.getImageProperties(imgData);
        const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

        let heightLeft = imgHeight;
        let position = 0;

        // Add first page
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;

        // Add extra pages if content is longer than one A4
        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
            heightLeft -= pdfHeight;
        }

        pdf.save(`Itinerary_${new Date().toLocaleDateString()}.pdf`);

    } catch (error) {
        console.error("PDF Generation failed:", error);
        alert("Failed to generate PDF. Please try PNG download.");
    } finally {
        // Restore UI
        if (originalStyle) {
            element.setAttribute('style', originalStyle);
        } else {
            element.removeAttribute('style');
        }
        updateTimeline();
    }
}

function addDay(dayData = null) {
    dayCounter++;
    const dayDiv = document.createElement('div');
    dayDiv.className = 'day-container';
    dayDiv.dataset.dayNo = dayCounter;

    // Date logic
    let dateValue = dayData?.date || '';
    if (!dateValue) {
        const existingDays = document.querySelectorAll('.day-container');
        if (existingDays.length > 0) {
            const lastDate = new Date(existingDays[existingDays.length - 1].querySelector('.date-input').value);
            lastDate.setDate(lastDate.getDate() + 1);
            dateValue = lastDate.toISOString().split('T')[0];
        } else {
            dateValue = new Date().toISOString().split('T')[0];
        }
    }

    const weatherOptions = [
        { val: '', label: 'No Weather' },
        { val: 'sunny', label: 'Sunny' },
        { val: 'cloudy', label: 'Cloudy' },
        { val: 'rainy', label: 'Rainy' },
        { val: 'snowy', label: 'Snowy' },
        { val: 'stormy', label: 'Stormy' },
        { val: 'windy', label: 'Windy' }
    ];

    dayDiv.innerHTML = `
        <div class="day-header">
            <span>DAY <span class="day-number">${dayCounter}</span></span>
            <input type="date" value="${dateValue}" class="date-input" onchange="syncDates(this)">
            <div class="day-controls">
                <span class="move-day-button" onclick="moveDayUp(this)"><i class='fas fa-angle-up'></i></span>
                <span class="move-day-button" onclick="moveDayDown(this)"><i class="fas fa-angle-down"></i></span>
                <span class="trash-icon" onclick="deleteDay(this)"><i class="fa fa-trash-o"></i></span>
            </div>
        </div>

        <div class="day-weather-editor" style="display: flex; gap: 10px; padding: 10px; background: #f9f9f9; border-radius: 4px; margin-bottom: 10px;">
            <select class="weather-desc" onchange="updateTimeline()" style="flex: 1; padding: 5px; border-radius: 4px; border: 1px solid #ddd;">
                ${weatherOptions.map(opt => `<option value="${opt.val}" ${dayData?.weatherDesc === opt.val ? 'selected' : ''}>${opt.label}</option>`).join('')}
            </select>
            <input type="text" placeholder="Temp" class="weather-temp" value="${dayData?.weatherTemp || ''}" oninput="updateTimeline()" style="width: 100px; padding: 5px; border-radius: 4px; border: 1px solid #ddd;">
        </div>

        <div class="location-container"></div>
        
        <div class="add-buttons-container">
            <button class="add-location-btn" onclick="addRow(this, 'destination')">+ Destination</button>
            <button class="add-location-btn" onclick="addRow(this, 'meal')">+ Meal</button>
            <button class="add-location-btn" onclick="addRow(this, 'transport')">+ Transport</button>
            <button class="add-location-btn" onclick="addRow(this, 'accommodation')">+ Stay</button>
            <button class="add-location-btn" onclick="addRow(this, 'flight')">+ Flight</button>
        </div>
    `;

    document.getElementById('days-container').appendChild(dayDiv);

    const locContainer = dayDiv.querySelector('.location-container');
    if (dayData && dayData.locations && dayData.locations.length > 0) {
        dayData.locations.forEach(loc => {
            addRow(locContainer, loc.type, loc);
        });
    } else {
        addRow(locContainer, 'destination');
    }
}

/**
 * Utility Functions (Move/Delete)
 */
function deleteLocation(icon) {
    icon.closest('.location-row').remove();
    updateTimeline();
}

function moveUp(button) {
    const row = button.closest('.location-row');
    if (row.previousElementSibling) {
        row.parentNode.insertBefore(row, row.previousElementSibling);
        updateTimeline();
    }
}

function moveDown(button) {
    const row = button.closest('.location-row');
    if (row.nextElementSibling && row.nextElementSibling.classList.contains('location-row')) {
        row.parentNode.insertBefore(row.nextElementSibling, row);
        updateTimeline();
    }
}

function showMenu(button) {
    event.stopPropagation(); // Stop the click from closing the menu immediately
    const menu = button.nextElementSibling;

    // Close all other open menus first
    document.querySelectorAll('.menu').forEach(m => {
        if (m !== menu) m.style.display = 'none';
    });

    menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
}

document.addEventListener('click', (e) => {
    // Close the + plus menus
    if (!e.target.classList.contains('plus-button')) {
        document.querySelectorAll('.menu').forEach(m => m.style.display = 'none');
    }
    
    // Close the download menu if clicking outside
    const downloadMenu = document.getElementById('download-menu');
    if (downloadMenu && !e.target.closest('.download-container')) {
        downloadMenu.style.display = 'none';
    }
});

function moveDayUp(button) {
    const day = button.closest('.day-container');
    if (day.previousElementSibling) {
        day.parentNode.insertBefore(day, day.previousElementSibling);
        reorderDayNumbers();
        updateTimeline();
    }
}

function moveDayDown(button) {
    const day = button.closest('.day-container');
    if (day.nextElementSibling) {
        day.parentNode.insertBefore(day.nextElementSibling, day);
        reorderDayNumbers();
        updateTimeline();
    }
}

function reorderDayNumbers() {
    document.querySelectorAll('.day-container').forEach((day, index) => {
        const num = index + 1;
        day.dataset.dayNo = num;
        day.querySelector('.day-number').textContent = num;
    });
}

function syncDates(changedInput) {
    const allDays = Array.from(document.querySelectorAll('.day-container'));
    const startIndex = allDays.indexOf(changedInput.closest('.day-container'));
    
    let currentDate = new Date(changedInput.value);

    // Loop through all days starting from the one after the changed day
    for (let i = startIndex + 1; i < allDays.length; i++) {
        currentDate.setDate(currentDate.getDate() + 1);
        const nextDateStr = currentDate.toISOString().split('T')[0];
        
        const dateInput = allDays[i].querySelector('.date-input');
        if (dateInput) {
            dateInput.value = nextDateStr;
        }
    }
    
    // Refresh the timeline to show new dates
    updateTimeline();
}

function deleteDay(btn) {
    if (confirm('Delete this entire day?')) {
        btn.closest('.day-container').remove();
        reorderDayNumbers();
        updateTimeline();
    }
}

window.onload = () => {
    loadData();
    if (document.getElementById('weather-toggle')) document.getElementById('weather-toggle').checked = enableWeather;
    if (document.getElementById('timestamp-toggle')) document.getElementById('timestamp-toggle').checked = enableTimestamp;
    if (document.getElementById('budget-toggle')) document.getElementById('budget-toggle').checked = enableBudget;
};