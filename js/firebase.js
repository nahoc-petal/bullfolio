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
const database = firebase.database();
const userId = null;
let myCoins = null;

/**
 * Function that fetches the coins holding of a logged in user
 */
const fetchCoins = function () {
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
writeUserData = (userId, coinSymbol, coinName, coinQuantity) => {
    firebase.database().ref('myCoins/' + userId + '/' + coinSymbol).set({
        quantity: coinQuantity,
        name: coinName,
    });
}

/**
 * Function that prints our top 5 cryptos
 */
const renderTopFive = function (coinObject) {
    console.log(coinObject);
};

/**
 * Function that checks if the user is logged in
 */
const isUserLoggedIn = function () {
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