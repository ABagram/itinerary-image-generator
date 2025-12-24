// Global State
let dayCounter = 0;
let userId = getUserId();
let enableWeather = JSON.parse(localStorage.getItem('enableWeather')) || false;
let enableTimestamp = JSON.parse(localStorage.getItem('enableTimestamp')) || false;
let enableBudget = JSON.parse(localStorage.getItem('enableBudget')) || false;
let selectedCurrency = localStorage.getItem('selectedCurrency') || 'USD';

const currencySymbols = {
    USD: '$', EUR: '€', GBP: '£', JPY: '¥', AUD: '$', CAD: '$', PHP: '₱',
};

// Identity Helpers
function generateUserId() { return 'user-' + Math.random().toString(36).substr(2, 9); }
function getUserId() {
    let id = localStorage.getItem('userId');
    if (!id) {
        id = generateUserId();
        localStorage.setItem('userId', id);
    }
    return id;
}