const inputFields = document.querySelectorAll('input');
inputFields.forEach((inputField) => {
    inputField.setAttribute('readonly', 'readonly');
    inputField.addEventListener('click', () => {
        inputField.removeAttribute('readonly');
    });
});

const upiButton = document.getElementById('upi-button');
const cardsButton = document.getElementById('cards-button');
const mobileButton = document.getElementById('mobile-button');

const popup = document.getElementById('popup');
const closePopup = document.getElementById('close-popup');
const paymentForm = document.getElementById('payment-form');
const paymentType = document.getElementById('payment-type');
const upiFields = document.getElementById('upi-fields');
const cardsFields = document.getElementById('cards-fields');
const mobileFields = document.getElementById('mobile-fields');
const payButton = document.getElementById('pay-button');
const paymentStatusMessage = document.getElementById('payment-status-message');
const processingMessage = document.getElementById('processing-message');
const amountInput = document.getElementById('amount');
const upiId = document.getElementById('upi-id');
const nameOnCard = document.getElementById('name-on-card');
const mobileNumber = document.getElementById('mobile-number');
const cardNumber = document.getElementById('card-number');
const successAudio = new Audio('sound.mp3');
const failureAudio = new Audio('fail.mp3'); 

let isProcessing = false;

upiButton.addEventListener('click', () => openPaymentPopup('UPI'));
cardsButton.addEventListener('click', () => openPaymentPopup('Cards'));
mobileButton.addEventListener('click', () => openPaymentPopup('Mobile'));

closePopup.addEventListener('click', () => {
    if (!isProcessing) {
        closePaymentPopup();
    }
});

function openPaymentPopup(paymentMethod) {
    paymentType.textContent = `${paymentMethod} Payment Details`;
    isProcessing = false;
    processingMessage.style.display = 'none';
    paymentStatusMessage.textContent = '';
    paymentStatusMessage.classList.add('hidden');
    closePopup.style.display = 'block';
    popup.style.display = 'block';

    upiFields.style.display = paymentMethod === 'UPI' ? 'block' : 'none';
    cardsFields.style.display = paymentMethod === 'Cards' ? 'block' : 'none';
    mobileFields.style.display = paymentMethod === 'Mobile' ? 'block' : 'none';

    paymentForm.reset();
    payButton.disabled = true;
}

paymentForm.addEventListener('input', () => {
    payButton.disabled = !validatePaymentFields();
});

function closePaymentPopup() {
    closePopup.style.display = 'none';
    popup.style.display = 'none';
}

payButton.addEventListener('click', () => {
    if (validatePaymentFields()) {
        const amount = parseInt(amountInput.value, 10);
        if (amount > 100000) {
            paymentStatusMessage.textContent = 'Payment failed! Amount exceeds INR 1,00,000.';
            paymentStatusMessage.style.color = 'red';
            paymentStatusMessage.classList.remove('hidden');
            failureAudio.play();
        } else {
            isProcessing = true;
            processingMessage.style.display = 'block';
            closePopup.style.display = 'none';

            setTimeout(() => {
                const uniqueTransactionId = generateUniqueTransactionId();
                const referenceNumber = generateReferenceNumber();
                paymentStatusMessage.textContent = `Payment successful! Transaction ID: ${uniqueTransactionId} \n Reference Number: ${referenceNumber}`;
                paymentStatusMessage.style.color = 'green';
                paymentStatusMessage.classList.remove('hidden');
                processingMessage.style.display = 'none';
                isProcessing = false;
                paymentForm.reset();
                closePopup.style.display = 'block';
                successAudio.play();
            }, 2000);
        }
    }
});

function validatePaymentFields() {
    if (upiFields.style.display === 'block') {
        return validateField('upi-id') && validateAmount();
    } else if (cardsFields.style.display === 'block') {
        return (
            validateField('card-number') &&
            validateField('expiry') &&
            validateField('cvv') &&
            validateField('name-on-card') &&
            validateAmount()
        );
    } else if (mobileFields.style.display === 'block') {
        return (
            validateField('mobile-number') &&
            validateField('name') &&
            validateAmount()
        );
    }
    return false;
}


function validateField(fieldId) {
    const field = document.getElementById(fieldId);
    if (field.value.trim() === '') {
        field.setCustomValidity('Field is required');
        field.reportValidity();
        return false;
    }
    field.setCustomValidity('');
    return true;
}

function validateAmount() {
    const amount = parseInt(amountInput.value, 10);
    if (isNaN(amount) || amount <= 0) {
        amountInput.setCustomValidity('Amount must be a positive integer');
        amountInput.reportValidity();
        return false;
    }
    amountInput.setCustomValidity('');
    return true;
}

function generateUniqueTransactionId() {
    return 'TXN' + Math.floor(Math.random() * 1000000);
}

function generateReferenceNumber() {
    return 'REF'+ Math.floor(Math.random() * 1000000);
}
