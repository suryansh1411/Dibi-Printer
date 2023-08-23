const { ipcRenderer } = require('electron');


ipcRenderer.send('message-from-renderer', 'Hello from renderer!');

const form = document.getElementById('inputForm');
const mobileInput = document.getElementById('mobileInput');
const errorMessage = document.getElementById('errorMessage');

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const mobileNumber = mobileInput.value;
    const isValidMobile = validateMobileNumber(mobileNumber);

    if (isValidMobile) {
        errorMessage.textContent = '';
        ipcRenderer.send('submit-form', mobileNumber);
        
    } else {
        errorMessage.textContent = 'Invalid mobile number. Please enter a valid number.';
    }
});

function validateMobileNumber(mobileNumber) {
    // Basic validation: Check if the input is a valid number of a certain length
    const numericRegex = /^[0-9]+$/;
    return numericRegex.test(mobileNumber) && mobileNumber.length === 10;
}
