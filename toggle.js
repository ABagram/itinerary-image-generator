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
