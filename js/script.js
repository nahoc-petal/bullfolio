/**
 * Function that formats big numbers to add a comma in the thousands
 */
const numberWithCommas = (x) => {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

$(document).ready(function () {
    $('.loaderWrapper').hide();

    isPositive = (value) => {
        return (value[0] === '-' ? "negativeValue" : "positiveValue");
    }

    fetch('https://api.coinmarketcap.com/v1/ticker/').then(function (response) {
        return response.json();
    }).then((result) => {
        let coins = [];
        const $coins = $('.coins');
        $.each(result, function (i, item) {
            coins.push(
                `<tr>
                    <td class="coinLogo"><img class="coinLogoImage" src="images/coins/${item.symbol}.svg" width="24" height="24" alt="" /></td>
                    <td class="coinSymbol" data-sort-value="${item.symbol}">${item.symbol}</td>
                    <td class="coinName" data-sort-value="${item.name}">${item.name}</td>
                    <td data-sort-value="${item.percent_change_1h}" class="coinPercentChange1h has-text-right ${isPositive(item.percent_change_1h)}">${item.percent_change_1h}%</td>
                    <td data-sort-value="${item.percent_change_24h}" class="coinPercentChange24h has-text-right ${isPositive(item.percent_change_24h)}">${item.percent_change_24h}%</td>
                    <td data-sort-value="${item.percent_change_7d}" class="coinPercentChange7d has-text-right ${isPositive(item.percent_change_7d)}">${item.percent_change_7d}%</td>
                    <td data-sort-value="${item.price_usd}" class="has-text-right coinPrice">$${numberWithCommas(item.price_usd)}</td>
                    <td class="has-text-right"><input class="input holding-input has-text-right coinQuantity" type="number" /></td>
                </tr>`
            );
        });
        // Add sortability to the results
        $("table").stupidtable();
        $coins.append(coins.join(''));

        // On focus out, update the quantity
        $(".holding-input").focusout(function () {
            let coinSymbol = $(this).parent().prevAll('.coinSymbol').html();
            let coinName = $(this).parent().prevAll('.coinName').html();
            let coinPrice = $(this).parent().prevAll('.coinPrice').html().replace(/[^\d.-]/g, '');
            let coinQuantity = $(this).val().replace(/[^\d.-]/g, '');
            if(coinQuantity !== "") {
                writeUserData(userId, coinSymbol, coinName, coinQuantity, coinPrice);
            }
        });
    });
});