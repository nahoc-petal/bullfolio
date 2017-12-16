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
    console.log('in write');
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
    let i = 0;
    console.log(coinObject);
    $.each(coinObject, function (index, value) {
        if (i < 6) {
            console.log(index);
            $('#myTopFive').append(
                `<div class="column has-text-centered">
                    <h3 class="subtitle has-text-white coin-holding">${value.name}</h3>
                    <div class="spacer ${index.toLowerCase()}-color"></div>
                    <h4 class="holding subtitle has-text-white">$${(value.price * value.quantity).toFixed(2)}</h4>
                </div>`
            );
        }
        i++;
    });
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
        .then(renderTopFive);
}

// Init
init();