function toggleWeather() {
    // Note: Ensure 'enableWeather' is declared in your config.js
    enableWeather = document.getElementById('weather-toggle').checked;
    localStorage.setItem('enableWeather', JSON.stringify(enableWeather));

    // Support both class names found in your builders
    const weatherSelectors = '.day-weather-editor, .weather-inputs, .weather-desc, .weather-temp, .weather-solar';
    document.querySelectorAll(weatherSelectors).forEach(el => {
        el.style.display = enableWeather ? 'flex' : 'none';
    });
    
    if (typeof updateTimeline === 'function') updateTimeline();
}

function toggleTimestamp() {
    // 1. Update Global State
    enableTimestamp = document.getElementById('timestamp-toggle').checked;
    
    // 2. Persist to Storage
    localStorage.setItem('enableTimestamp', JSON.stringify(enableTimestamp));
    
    // 3. Update Editor UI
    document.querySelectorAll('.timestamp-input').forEach(input => {
        input.style.display = enableTimestamp ? 'inline-block' : 'none';
    });
    
    // 4. Refresh Preview
    if (typeof updateTimeline === 'function') updateTimeline();
}

function toggleBudget() {
    enableBudget = document.getElementById('budget-toggle').checked;
    localStorage.setItem('enableBudget', JSON.stringify(enableBudget));
    
    // Hide in Editor
    document.querySelectorAll('.budget-input').forEach(el => el.style.display = enableBudget ? 'inline-block' : 'none');
    
    // Hide in Timeline (Ensure your timeline tiles use this class)
    document.querySelectorAll('.timeline-budget-amount').forEach(el => el.style.display = enableBudget ? 'block' : 'none');
    
    updateTimeline();
}

function updateCurrency() {
    selectedCurrency = document.getElementById('currency-select').value;
    localStorage.setItem('selectedCurrency', selectedCurrency);
    
    // Safely get symbol
    const symbol = (typeof currencySymbols !== 'undefined' && currencySymbols[selectedCurrency]) || selectedCurrency;
    
    document.querySelectorAll('.budget-input').forEach(input => {
        input.placeholder = `${symbol} 0.00`;
    });
    
    if (typeof updateTimeline === 'function') updateTimeline();
}

function filterCurrencyOptions() {
    const searchField = document.querySelector('.select2-search__field');
    const selectElement = document.getElementById('currency-select');
    if (!searchField || !selectElement) return;
    
    const filter = searchField.value.toUpperCase();
    const options = selectElement.querySelectorAll('option');

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
