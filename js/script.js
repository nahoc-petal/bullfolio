$(document).ready(() => {
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
    let allCoins = null;
    let rates = null;
    let balance = null;
    $btcColor = '#F0933A';
    $ethColor = '#8B92AF';
    $btcColor: '#F0933A';
    $ethColor = '#8B92AF';
    $dashColor = '#3775B7';
    $ltcColor = '#BEBEBE';
    $xrpColor = '#3C8EC3';
    $neoColor = '#74BC38';
    $omgColor = '#2657E7';
    $dogeColor = '#BEA649';
    $bcnColor = '#DB5384';
    $steemColor = '#60A1EC';
    $saltColor = '# 56B8BC';
    $gbyteColor = '#212121';
    $qtumColor = '#5CA7D5';
    $adaCoin = '#ffffff';
    $xlmColor = '#D5F1F8';
    $zecColor = '#F5C053';
    $btsColor = '#5EB8E6';
    $stratColor = '#4DA1DF';
    $nxtColor = '#3D8DB7';
    $btmColor = '#767676';
    $xzcColor = '#58B45E';
    $miotaColor = '#ffffff';
    $bchColor = '#E38F39';
    $batColor = '#EA5C29';
    $icnColor = '#4E6F8D';
    $etcColor = '#6F8F75';
    $pptColor = '#383B5D';
    $bccColor = '#FE8D00';
    $trxColor = '#ffffff';
    $wavesColor = '#3F95D6';
    $hsrColor = '#5C3F93';
    $monaColor = '#F4E7C9';
    $veriColor = '#FE9300';
    $usdtColor = '#4F9E7D';
    $btgColor = '#F3A300';
    $ardrColor = '#0062A6';
    $arkColor = '#DE0000';
    $dcrColor = '#00DC9F';
    $sntColor = '#4953B3';
    $payColor = '#363233';
    $vtcColor = '#305A33';
    $bnbColor = '#FCB700';
    $scColor = '#00CBA0';
    $xemColor = '#F7A800';
    $qashColor = '#0044EF';
    $aeColor = '#DE3F6B';
    $kncColor = '#77CFA3';
    $pppColor = '#348F8D';
    $navColor = '#C42FB2';
    $bntColor = '#000D2B';
    $funColor = '#F1385B';
    $subColor = '#EE4037';

    /**
     * Function that renders the total balance
     */
    const renderTotalBalance = (totalBalance) => {
        $('.balance').html('$' + numberWithCommas(totalBalance.toFixed(2)));
    }

    /**
     * Function that calculates the total balance
     */
    const calcultateTotalBalance = () => {
        // Reset the balance in case of an update
        balance = 0;
        $.each(myCoins, function (index, value) {
            balance += value.quantity * value.price;
        });
        renderTotalBalance(balance);
    }

    const lightenDarkenColor = (col, amt) => {
        var usePound = false;
        if (col[0] == "#") {
            col = col.slice(1);
            usePound = true;
        }
        var num = parseInt(col, 16);
        var r = (num >> 16) + amt;
        if (r > 255) r = 255;
        else if (r < 0) r = 0;
        var b = ((num >> 8) & 0x00FF) + amt;
        if (b > 255) b = 255;
        else if (b < 0) b = 0;
        var g = (num & 0x0000FF) + amt;
        if (g > 255) g = 255;
        else if (g < 0) g = 0;
        return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
    }

    /**
     * Function that returns a negativeValue class if the number is negative and
     * positiveValue class if it's positive
     */
    const isPositive = (value) => {
        return (value[0] === '-' ? "negativeValue" : "positiveValue");
    }

    /**
     * Function that logs rates
     */
    const logRates = (ratesObject) => {
        console.log(ratesObject);
    }

    /**
     * Function that renders the pie chart
     */
    const renderPieChart = () => {
        let pieChartValues = [];
        let darkerPieChartValues = [];
        $.each(myCoins, function (index, value) {
            let colorString = '$' + index.toLowerCase() + 'Color';
            let colorVariable = eval(colorString);
            pieChartValues.push({
                y: value.quantity * value.price,
                color: colorVariable,
            });
            darkerPieChartValues.push({
                y: value.quantity * value.price,
                color: lightenDarkenColor(colorVariable, -20),
            });
        });
        const promise = new Promise(function (resolve, reject) {
            let chart = new CanvasJS.Chart("chartContainer", {
                backgroundColor: "transparent",
                interactivityEnabled: false,
                legend: {
                    display: false,
                    labels: {
                        display: false
                    }
                },
                credits: false,
                data: [{
                    type: "doughnut",
                    innerRadius: 154,
                    dataPoints: pieChartValues,
                }]
            });
            let darkerChart = new CanvasJS.Chart("darkerChartContainer", {
                backgroundColor: "transparent",
                interactivityEnabled: false,
                legend: {
                    display: false,
                    labels: {
                        display: false
                    }
                },
                credits: false,
                data: [{
                    type: "doughnut",
                    innerRadius: 154,
                    dataPoints: darkerPieChartValues,
                }]
            });
            darkerChart.render();
            chart.render();
            resolve(true);
        });
        return promise;
    };

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
            resolve(true);
        });
        return promise;
    };

    /**
     * Function that renders our top cryptos
     */
    const renderTopCoins = () => {
        // We delete the top cryptos in case it's an update
        $('#myTopFive').html("");
        $('#restOfTheCoins').html("");
        const promise = new Promise(function (resolve, reject) {
            let i = 0;
            $.each(myCoins, function (index, value) {
                if (i < 6) {
                    $('#myTopFive').append(
                        `<div class="top-five-coin column is-2 has-text-centered" data-value="${(value.price * value.quantity).toFixed(2)}">
                        <h3 class="subtitle has-text-white coin-holding">${value.name}</h3>
                        <div class="spacer ${index.toLowerCase()}-color"></div>
                        <h4 class="holding-value has-no-margin subtitle has-text-white">$${(value.price * value.quantity).toFixed(2)}</h4>
                        <h4 class="holding-quantity has-no-margin subtitle has-text-white">${value.quantity} ${index}</h4>
                    </div>`
                    );
                } else {
                    $('.show-more').show();
                    $('#restOfTheCoins').append(
                        `<div class="top-five-coin column is-2 has-text-centered">
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
            $('.restOfTheCoins').hide();

            // If we click on a top five coin, toggle the value and show the quantity
            $('.top-five-coin').click(() => {
                $('.holding-value').toggle();
                $('.holding-quantity').toggle();
            });

            // Resolve the promise
            resolve(myCoins);
        });
        return promise;
    };

    /**
     * Function that fetches all coins from CoinMarketCap
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
     * Function that fetches all rates from fixer.io
     */
    const fetchRatesFromAPI = () => {
        const promise = new Promise(function (resolve, reject) {
            fetch('https://api.fixer.io/latest?base=USD').then(function (response) {
                resolve(response.json());
            })
        });
        return promise;
    };

    /**
     * Function that removes the loader icon
     */
    const removeLoader = () => {
        $('.main').show();
        $('.loaderWrapper').fadeOut();
    };

    /**
     * Function that renders the coins table
     */
    const renderCoinsTable = (allCoinsObject) => {
        allCoins = allCoinsObject;
        let coinsArray = [];
        const $coins = $('.coins');
        $.each(allCoins, function (i, item) {
            let coinQuantity = "";
            if (myCoins) {
                if (item.symbol in myCoins) {
                    coinQuantity = myCoins[item.symbol].quantity;
                }
            }
            coinsArray.push(
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
        $coins.append(coinsArray.join(''));

        // On focus out, update the quantity
        $(".holding-input").focusout(function () {
            $(this).parent().addClass('is-loading');
            let coinSymbol = $(this).parent().prevAll('.coinSymbol').html();
            let coinName = $(this).parent().prevAll('.coinName').html();
            let coinPrice = $(this).parent().prevAll('.coinPrice').html().replace(/[^\d.-]/g, '');
            let coinQuantity = $(this).val().replace(/[^\d.-]/g, '');
            (coinQuantity === '') ? coinQuantity = 0: null;
            writeUserData(userId, coinSymbol, coinName, coinQuantity, coinPrice)
                .then(fetchCoins)
                .then(renderTopCoins)
                .then(calcultateTotalBalance);

            $(this).parent().removeClass('is-loading');
        });
        removeLoader();
    };

    /**
     * Function that hides extra cryptos from the top 5
     */
    const hideExtraTopCryptos = () => {
        //$('.myTopFive').css('height', 200);
    }

    /**
     * Function that checks if the user is logged in
     */
    const isUserLoggedIn = () => {
        const promise = new Promise(function (resolve, reject) {
            firebase.auth().onAuthStateChanged((user) => {
                (user) ? userId = user.uid: window.location.replace('login.html');
                resolve(userId);
            })
        });
        return promise;
    };

    /**
     * Function that initializes our app on startup
     */
    init = () => {
        fetchRatesFromAPI()
            .then(logRates);
        isUserLoggedIn()
            .then(loadComponents)
            .then(fetchCoins)
            .then(renderTopCoins)
            .then(fetchAllCoinsFromAPI)
            .then(renderCoinsTable)
            .then(calcultateTotalBalance)
            .then(renderPieChart);
    }

    // Init
    init();
    hideExtraTopCryptos();
});