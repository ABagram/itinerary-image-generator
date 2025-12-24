/**
 * Currency Data and Initialization
 */
const currencies = [
    { code: 'USD', name: '🇺🇸 USD - US Dollar', symbol: '$' },
    { code: 'PHP', name: '🇵🇭 PHP - Philippine Peso', symbol: '₱' },
    { code: 'JPY', name: '🇯🇵 JPY - Japanese Yen', symbol: '¥' },
    { code: 'EUR', name: '🇪🇺 EUR - Euro', symbol: '€' },
    { code: 'GBP', name: '🇬🇧 GBP - British Pound', symbol: '£' },
    { code: 'KRW', name: '🇰🇷 KRW - South Korean Won', symbol: '₩' },
    { code: 'CNY', name: '🇨🇳 CNY - Chinese Yuan', symbol: '¥' },
    { code: 'SGD', name: '🇸🇬 SGD - Singapore Dollar', symbol: '$' },
    { code: 'AUD', name: '🇦🇺 AUD - Australian Dollar', symbol: '$' },
    { code: 'CAD', name: '🇨🇦 CAD - Canadian Dollar', symbol: '$' },
    { code: 'HKD', name: '🇭🇰 HKD - Hong Kong Dollar', symbol: '$' },
    { code: 'THB', name: '🇹🇭 THB - Thai Baht', symbol: '฿' },
    { code: 'TWD', name: '🇹🇼 TWD - Taiwan New Dollar', symbol: 'NT$' },
    { code: 'VND', name: '🇻🇳 VND - Vietnamese Dong', symbol: '₫' }
];

// Populate the Currency Symbols object in global scope (used by timeline-engine)
window.currencySymbols = currencies.reduce((acc, curr) => {
    acc[curr.code] = curr.symbol;
    return acc;
}, {});

/**
 * Populate the Select Element
 */
function populateCurrencyDropdown() {
    const select = document.getElementById('currency-select');
    if (!select) return;

    // Clear existing options
    select.innerHTML = '';

    currencies.forEach(curr => {
        const option = document.createElement('option');
        option.value = curr.code;
        option.textContent = curr.name;
        
        // Auto-select if this is the one stored in settings
        if (curr.code === selectedCurrency) {
            option.selected = true;
        }
        
        select.appendChild(option);
    });
}

// Execute population immediately
populateCurrencyDropdown();