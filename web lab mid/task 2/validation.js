$(document).ready(function () {
    const form = $('#checkout-form');
    if (form.length === 0) return; // Exit if not on checkout page

    // --- HELPER FUNCTIONS ---
    const showError = (input, message) => {
        const feedback = input.next('.invalid-feedback');
        input.removeClass('is-valid').addClass('is-invalid');
        feedback.text(message);
    };

    const showSuccess = (input) => {
        input.removeClass('is-invalid').addClass('is-valid');
        input.next('.invalid-feedback').text('');
    };

    // --- INDIVIDUAL VALIDATION FUNCTIONS ---
    const validateFullName = () => {
        const field = $('#fullName');
        if (field.val().trim().length < 3) {
            showError(field, 'Full name must be at least 3 characters.');
            return false;
        }
        showSuccess(field);
        return true;
    };

    const validateEmail = () => {
        const field = $('#email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (field.val().trim() === '') {
            showError(field, 'Email is required.');
            return false;
        } else if (!emailRegex.test(field.val().trim())) {
            showError(field, 'Please enter a valid email format.');
            return false;
        }
        showSuccess(field);
        return true;
    };

    const validatePhone = () => {
        const field = $('#phone');
        const phoneRegex = /^\d{10,}$/;
        if (field.val().trim() === '') {
            showError(field, 'Phone number is required.');
            return false;
        } else if (!phoneRegex.test(field.val().trim())) {
            showError(field, 'Please enter at least 10 digits.');
            return false;
        }
        showSuccess(field);
        return true;
    };

    const validateRequired = (fieldId, message) => {
        const field = $(`#${fieldId}`);
        if (field.val().trim() === '') {
            showError(field, message);
            return false;
        }
        showSuccess(field);
        return true;
    };

    const validateCountry = () => {
        const field = $('#country');
        if (field.val() === '') {
            showError(field, 'Please select a country.');
            return false;
        }
        showSuccess(field);
        return true;
    };

    const validateZip = () => {
        const field = $('#zip');
        const zipRegex = /^\d{4,6}$/;
        if (field.val().trim() === '') {
            showError(field, 'Postcode is required.');
            return false;
        } else if (!zipRegex.test(field.val().trim())) {
            showError(field, 'Please enter a 4-6 digit postal code.');
            return false;
        }
        showSuccess(field);
        return true;
    };

    const validateTerms = () => {
        const field = $('#terms-check');
        const feedback = field.closest('.form-check').find('.invalid-feedback');
        if (!field.is(':checked')) {
            field.addClass('is-invalid');
            feedback.text('You must agree to the terms and conditions.');
            return false;
        }
        field.removeClass('is-invalid').addClass('is-valid');
        feedback.text('');
        return true;
    };

    const validateCreditCardFields = () => {
        let isCardValid = true;
        if ($('#credit').is(':checked')) {
            const ccName = $('#cc-name'), ccNumber = $('#cc-number'), ccExpiration = $('#cc-expiration'), ccCvv = $('#cc-cvv');
            if (ccName.val().trim() === '') { showError(ccName, 'Name on card is required.'); isCardValid = false; } else { showSuccess(ccName); }
            if (!/^\d{13,16}$/.test(ccNumber.val().replace(/\s/g, ''))) { showError(ccNumber, 'Enter a valid 13-16 digit card number.'); isCardValid = false; } else { showSuccess(ccNumber); }
            if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(ccExpiration.val().trim())) { showError(ccExpiration, 'Enter a valid MM/YY date.'); isCardValid = false; } else { showSuccess(ccExpiration); }
            if (!/^\d{3,4}$/.test(ccCvv.val().trim())) { showError(ccCvv, 'Enter a valid 3 or 4 digit CVV.'); isCardValid = false; } else { showSuccess(ccCvv); }
        }
        return isCardValid;
    };

    // --- EVENT BINDING FOR REAL-TIME VALIDATION ---
    $('#fullName').on('keyup blur', validateFullName);
    $('#email').on('keyup blur', validateEmail);
    $('#phone').on('keyup blur', validatePhone);
    $('#address').on('keyup blur', () => validateRequired('address', 'Address is required.'));
    $('#city').on('keyup blur', () => validateRequired('city', 'City is required.'));
    $('#country').on('change', validateCountry);
    $('#zip').on('keyup blur', validateZip);
    $('#terms-check').on('change', validateTerms);
    $('#credit-card-info input').on('keyup blur', validateCreditCardFields);
    $('input[name="paymentMethod"]').on('change', validateCreditCardFields);


    // --- MAIN FORM SUBMISSION LOGIC ---
    const validateForm = () => {
        // Run all validation functions once to get a final status
        const isNameValid = validateFullName();
        const isEmailValid = validateEmail();
        const isPhoneValid = validatePhone();
        const isAddressValid = validateRequired('address', 'Address is required.');
        const isCityValid = validateRequired('city', 'City is required.');
        const isCountryValid = validateCountry();
        const isZipValid = validateZip();
        const isTermsValid = validateTerms();
        const isCardValid = validateCreditCardFields();

        return isNameValid && isEmailValid && isPhoneValid && isAddressValid && isCityValid && isCountryValid && isZipValid && isTermsValid && isCardValid;
    };

    form.on('submit', function (e) {
        e.preventDefault();
        if (validateForm()) {
            // If validation is successful
            alert('Order placed successfully! (This is a demo)');
            localStorage.removeItem('beShopCart'); // Clear cart
            window.location.href = 'index.html';
        } else {
            // Find the first element with an error and scroll to it
            const firstError = $('.is-invalid').first();
            if (firstError.length) {
                $('html, body').animate({
                    scrollTop: firstError.offset().top - 120 // 120px offset for sticky header
                }, 500);
            }
        }
    });

    // --- INITIAL UI SETUP ---
    $('#terms-check').on('change', function () {
        $('#place-order-btn').prop('disabled', !$(this).is(':checked'));
    });

    $('input[name="paymentMethod"]').on('change', function () {
        if ($('#credit').is(':checked')) {
            $('#credit-card-info').slideDown();
        } else {
            $('#credit-card-info').slideUp();
        }
    }).trigger('change');
});