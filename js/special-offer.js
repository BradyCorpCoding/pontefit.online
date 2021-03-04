const CREDIT_CARD_PAYMENT_TYPE = 1;
const PAYPAL_PAYMENT_TYPE = 2;
const LANGUAGES = ['pt', 'es', 'it', 'fr', 'ru', 'de', 'ja', 'en']

const paymentReturnUrl = '/payment.html';
const paymentSuccessUrl = '/payment.html';
const paymentFailUrl = '/payment.html';
const paymentPayPalReturnUrl = '/onbording.html';
const paymentPayPalSuccessUrl = '/paypal.html';
const paymentPayPalFailUrl = '/onbording.html';
const thankYouPage = 'thankyoupage.html';

let userData = {};
let lastPaymentType;
let price = 9.99;
let payPalButtonEvent = 'payIframe19PPStep';
let urlParams = new URLSearchParams(window.location.search);
let isSandbox = localStorage.getItem('client-version') === null || urlParams.get('is_sandbox');

/*
* Private method.
* Displays the overlay and blocks the user interface from changes.
* Also blocks the ability to return to the previous step with the browser hardware button.
*/
let showOverlay = function () {
    $('.overlay').css({'display': 'block'});
    $('.overlay').fadeTo("fast", 0.7);
}

/*
* Private method.
* Hides the overlay, unlocks the ability to return to the previous screen with the browser hardware button.
*/
let hideOverlay = function () {
    $('.overlay').fadeTo("fast", 0);
    $('.overlay').css('display', 'none');
}

let handlePayment = function() {
    if (getUserToken()) {
        createPayment();
    }
}

/*
 * Private method.
 * "Get my plan" button click event handler.
 */
let createPaymentPopUpHandler = function (event) {
    price = 9.99;
    lastPaymentType = CREDIT_CARD_PAYMENT_TYPE;

    $('.btn-paypal:visible').attr('data-p', price);
    $('.popup-payment:visible .popup-price').html(price);
    applePayController.init('.apple-pay-button', price);

    fbq('track', 'paymentPopup', {currency: "USD", value: price, release_date: localStorage.getItem('release_date') || null});
    gtag('event', 'page load', {'event_category': 'paymentPopup', 'event_label': price, 'value': 1});

    showOverlay();
    handlePayment();
}

/*
* Private method.
* Pay button click event handler.
*/
let createPaymentBtnHandler = function (event) {
    let $button = $(event.currentTarget);

    $button.attr('disabled', true);

    showOverlay();

    //TODO don't use global variables
    price = parseFloat($button.attr('data-p')) || price;
    lastPaymentType = parseInt($button.attr('data')) || lastPaymentType;
    payPalButtonEvent = $button.attr('data-event');

    handlePayment();
}

let createPayment = function() {
    const hostName = getHostName();
    let paymentData,
        cookie = ("; "+document.cookie).split("; _ga=").pop().split(";").shift(),
        userData = localStorage.getItem('onbording-data') ? JSON.parse(localStorage.getItem('onbording-data')) : {};

    if (parseInt(lastPaymentType) === CREDIT_CARD_PAYMENT_TYPE) {
        paymentData = {
            'payment_method': lastPaymentType,
            'return_url': hostName + paymentReturnUrl,
            'success_url': hostName + paymentSuccessUrl,
            'fail_url': hostName + paymentFailUrl,
            'price': price,
            'order_description': cookie,
            'email': userData['email']
        };
    } else {
        paymentData = {
            'payment_method': lastPaymentType,
            'return_url': hostName + paymentPayPalReturnUrl,
            'success_url': hostName + paymentPayPalSuccessUrl,
            'fail_url': hostName + paymentPayPalFailUrl,
            'price': price,
            'order_description': cookie,
            'email': userData['email']
        };
    }

    showOverlay();

    if (isSandbox) {
        restApiInstance.setHeader('sandbox', true);
    }

    restApiInstance.setLanguage(userData['language'] || 'en');
    restApiInstance.setUserToken(getUserToken());
    restApiInstance.createPayment(paymentData, function (statusCode, responseBody) {
        let payUrl = parseInt(lastPaymentType) === CREDIT_CARD_PAYMENT_TYPE
            ? responseBody['pay_form']['form_url']
            : responseBody['pay_form']['return_url'];

        if (parseInt(lastPaymentType) === PAYPAL_PAYMENT_TYPE) {
            trackPayPalButtonClickEvent();
            $('.payBtn:visible').removeAttr('disabled');
            hideOverlay();
            location.href = payUrl;
            return;
        }

        let iframeContainer = $('.iframe-container:visible');

        iframeContainer.children().remove();
        iframeContainer.append($('<iframe frameBorder="0" style="width: 100%; height: 400px" src="' + payUrl + '"></iframe>'));
    });
}

let onIframeSendMessageHandler = function(event) {
    hideOverlay();

    if (event.data.type == 'orderStatus' && event.data['response'] != undefined) {
        if (event.data['response']['error']) {
            $('div.paymentError')
                .html(getErrorMessage(event))
                .css('display', 'block');

            const paymentData = {
                'order_id': event.data['response']['order']['order_id'],
                'payment_method': lastPaymentType
            }

            restApiInstance.validatePayment(paymentData);
            createPayment();
        }

        if (event.data['response']['order'] && event.data['response']['order']['status'] == 'approved') {
            const orderId = event.data['response']['order']['order_id'];
            const paymentData = {order_id: orderId, payment_method: lastPaymentType};

            if (isSandbox) {
                restApiInstance.setHeader('sandbox', true);
            }

            AwsAnalyticTracker.trackEvent('purchase', {price: price, payment_type: "Bank_Card", "transaction_id": orderId});
            restApiInstance.validatePayment(paymentData, function(statusCode, responseBody) {
                if (responseBody['result'] == true) {
                    setIsPayed();

                    fbq('track', 'Purchase', {
                        currency: "USD",
                        value: price,
                        content_id: "Product - Price " + price,
                        payment_type: "Bank_Card",
                        ab_test_name: Testania.getABtestName(),
                        release_date: localStorage.getItem('release_date') || null
                    });
                    gtag('event', 'purchase', {
                        "transaction_id": orderId,
                        "value": price,
                        "currency": "USD",
                        "items": [{
                            "id": "item1",
                            "name": "Purchase for " + price,
                            "category": "Bank_Card",
                            "quantity": 1,
                            "price": price
                        }],
                        "ab_test_name": Testania.getABtestName()
                    });
                    snaptr('track', 'PURCHASE', {'currency':'USD', 'price': price, 'transaction_id': orderId});
                    twq('track','Purchase', {value: price, currency: 'USD', num_items: '1'});
                    pintrk('track', 'checkout', {value: price, order_quantity: 1, currency: 'USD'});

                    setTimeout(function () {
                        window.location.href = thankYouPage;
                    }, 3000)
                } else {
                    $('div.paymentError').html(getErrorMessage(event)).css('display', 'block');
                    createPayment();
                }
            });
        }

        if (event.data['response']['order'] && event.data['response']['order']['status'] === 'processing') {
            fbq('trackCustom', 'popUpClickCard', {
                release_date: localStorage.getItem('release_date') || null,
                currency: "USD",
                value: price
            });
            gtag('event', 'popUpClickCard', {'event_category': 'paymentPopup', 'event_label': price, 'value': price});
        }
    }
}

/*
* Private method.
* The method returns the current host name.
*/
let getHostName = function () {
    return location.protocol + '//' + window.location.hostname;
}

let getUserToken = function() {
    return localStorage.getItem('user');
}

let setIsPayed = function() {
    localStorage.setItem('userState', 'yes');
}

let getIsPayed = function() {
    if (getUserToken() != undefined) {
        const value = localStorage.getItem('userState');

        if (value == 'yes') {
            return true;
        }
    }

    return false;
}

let getErrorMessage = function(event) {
    if (event.data['response']['error']) {
        let errorCode = event.data['response']['error']['code']

        switch (errorCode) {
            case '0.02': return "Order expired"
            case '0.03': return "Illegal operation"
            case '2.06' || '7.01': return "Invalid CVV2 Code. Please try again or use another card"
            case '2.08': return "Invalid card number. Please try again or use another card"
            case '2.09': return "Invalid expiration date. Please try again or use another card"
            case '3.01': return "Card is blocked"
            case '3.02': return "Insufficient funds"
            case '3.03': return "Payment amount limit excess"
            case '3.04': return "Transaction is declined by issuer. Please try again or use another card"
            case '3.06': return "Debit card not supported. Please use another card"
            case '5.08': return "Invalid transaction"
            default: return "Card is blocked for the Internet payments. Contact support of your bank  or use another card"
        }
    }

    return "Please try again or use another card."
}

let trackPayPalButtonClickEvent = function () {
    gtag('event', 'page load', {'event_category': payPalButtonEvent, 'event_label': 'pay', 'value': price});
    pintrk('track', 'addtocart', {value: price, order_quantity: 1, currency: 'USD'});
    snaptr('track', 'PAGE_VIEW', {'description': payPalButtonEvent});
}

if (getIsPayed()) {
    window.location.href = thankYouPage;
}

window.addEventListener("message", onIframeSendMessageHandler);

$('.btn-payment-popup').bind('click', createPaymentPopUpHandler);
$('.payBtn').bind('click', createPaymentBtnHandler);

let [language] = window.location.hostname.split(".");
let payPalDisabled = localStorage.getItem('client-version') === null;

if (payPalDisabled) {
    $('.btn-paypal').next().remove();
    $('.btn-paypal').remove();
}

language = LANGUAGES.includes(language) ? language : 'en';
userData['language'] = language;
restApiInstance.setLanguage(language);
