// Initialize Firebase
let config = {
    apiKey: "AIzaSyDOm4jKsWwOWCcfNQD63DD3JL0mmSGd8h4",
    authDomain: "cryptoboard2.firebaseapp.com",
    databaseURL: "https://cryptoboard2.firebaseio.com",
    projectId: "cryptoboard2",
    storageBucket: "",
    messagingSenderId: "650100096146"
};
firebase.initializeApp(config);
let database = firebase.database();
let userId = null;
let myCoins = null;

/**
 * Function that returns a negativeValue class if the number is negative and
 * positiveValue class if it's positive
 */
const isPositive = (value) => {
    return (value[0] === '-' ? "negativeValue" : "positiveValue");
}

/**
 * Function that formats big numbers to add a comma in the thousands
 */
const numberWithCommas = (x) => {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

/**
 * Function that fetches the coins holding of a logged in user
 */
const fetchCoins = () => {
    const promise = new Promise(function (resolve, reject) {
        firebase.database().ref('myCoins/' + userId).once('value').then((snapshot) => {
            // Fetch completed
            (snapshot) ? myCoins = snapshot.val(): null;
            resolve(snapshot.val());
        });
    });
    return promise;
};

/**
 * Function that writes the coins holding to the database
 */
const writeUserData = (userId, coinSymbol, coinName, coinQuantity, coinPrice) => {
    const promise = new Promise(function (resolve, reject) {
        firebase.database().ref('myCoins/' + userId + '/' + coinSymbol).set({
            quantity: coinQuantity,
            name: coinName,
            price: coinPrice,
        })
    });
    return promise;
};

/**
 * Function that prints our top 5 cryptos
 */
const renderTopFive = (coinObject) => {
    const promise = new Promise(function (resolve, reject) {
        let i = 0;
        $.each(coinObject, function (index, value) {
            if (i < 6) {
                $('#myTopFive').append(
                    `<div class="top-five-coin column has-text-centered">
                        <h3 class="subtitle has-text-white coin-holding">${value.name}</h3>
                        <div class="spacer ${index.toLowerCase()}-color"></div>
                        <h4 class="holding-value has-no-margin subtitle has-text-white">$${(value.price * value.quantity).toFixed(2)}</h4>
                        <h4 class="holding-quantity has-no-margin subtitle has-text-white">${value.quantity} ${index}</h4>
                    </div>`
                );
            }
            i++;
        });
        // Hiding top five coins quantity on load
        $('.holding-quantity').hide();

        // If we click on a top five coin, toggle the value and show the quantity
        $('.top-five-coin').click(() => {
            $('.holding-value').toggle();
            $('.holding-quantity').toggle();
        });

        // Resolve the promise
        resolve(coinObject);
    });
    return promise;
};

/**
 * Function that fetchs all coins from CoinMarketCap
 */
const fetchAllCoinsFromAPI = () => {
    const promise = new Promise(function (resolve, reject) {
        fetch('https://api.coinmarketcap.com/v1/ticker/').then(function (response) {
            resolve(response.json());
        })
    });
    return promise;
};

/**
 * Function that logs out a connected user
 */
const logout = () => {
    firebase.auth().signOut();
}

/**
 * Function that removes the loader icon
 */
const removeLoader = () => {
    $('.loaderWrapper').fadeOut();
};

/**
 * Function that renders the coins table
 */
const renderCoinsTable = (allCoinsObject) => {
    let coins = [];
    const $coins = $('.coins');
    $.each(allCoinsObject, function (i, item) {
        let coinQuantity = "";
        if (item.symbol in myCoins) {
            coinQuantity = myCoins[item.symbol].quantity;
        }
        coins.push(
            `<tr>
                <td class="coinLogo"><img class="coinLogoImage" src="images/coins/${item.symbol}.svg" width="24" height="24" alt="" /></td>
                <td class="coinSymbol" data-sort-value="${item.symbol}">${item.symbol}</td>
                <td class="coinName" data-sort-value="${item.name}">${item.name}</td>
                <td data-sort-value="${item.percent_change_1h}" class="coinPercentChange1h has-text-right ${isPositive(item.percent_change_1h)}">${item.percent_change_1h}%</td>
                <td data-sort-value="${item.percent_change_24h}" class="coinPercentChange24h has-text-right ${isPositive(item.percent_change_24h)}">${item.percent_change_24h}%</td>
                <td data-sort-value="${item.percent_change_7d}" class="coinPercentChange7d has-text-right ${isPositive(item.percent_change_7d)}">${item.percent_change_7d}%</td>
                <td data-sort-value="${item.price_usd}" class="has-text-right coinPrice">$${numberWithCommas(item.price_usd)}</td>
                <td data-sort-value="${coinQuantity}" class="quantity-cell control has-icons-left">
                    <input value="${coinQuantity}" placeholder="0" class="input holding-input has-text-right coinQuantity" type="number"/>
                </td>
            </tr>`
        );
    });
    // Add sortability to the results
    $("table").stupidtable();
    $coins.append(coins.join(''));

    // On focus out, update the quantity
    $(".holding-input").focusout(function () {
        if ($(this).val() !== "") {
            $(this).parent().addClass('is-loading');
            let coinSymbol = $(this).parent().prevAll('.coinSymbol').html();
            let coinName = $(this).parent().prevAll('.coinName').html();
            let coinPrice = $(this).parent().prevAll('.coinPrice').html().replace(/[^\d.-]/g, '');
            let coinQuantity = $(this).val().replace(/[^\d.-]/g, '');
            writeUserData(userId, coinSymbol, coinName, coinQuantity, coinPrice).then(
                $(this).parent().removeClass('is-loading')
            );
        }
    });

    removeLoader();
};

/**
 * Function that fills the holding inputs
 */
const fillHoldingInputs = (coinObject) => {
    console.log('in');
    console.log(coinObject);
};

/**
 * Function that checks if the user is logged in
 */
const isUserLoggedIn = () => {
    const promise = new Promise(function (resolve, reject) {
        firebase.auth().onAuthStateChanged((user) => {
            (user) ? userId = user.uid: window.location.replace('index.html');
            resolve(userId);
        })
    });
    return promise;
};

/**
 * Function that initializes our app on startup
 */
init = () => {
    isUserLoggedIn()
        .then(fetchCoins)
        .then(renderTopFive)
        .then(fetchAllCoinsFromAPI)
        .then(renderCoinsTable);
}

// Init
init();