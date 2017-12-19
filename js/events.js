/**
 * Function to show more cryptos on click of the 'show more' button
 */
let opened = false;

showMore = () => {
    //$('.restOfTheCoins').slideToggle();
    $('.restOfTheCoins').animate({
        height: "toggle",
        opacity: "toggle"
    });
}

/**
 * Function that logs out a connected user
 */
logout = () => {
    firebase.auth().signOut();
}