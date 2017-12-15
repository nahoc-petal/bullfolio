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
                    <td data-sort-value="${item.rank}">${item.rank}</td>
                    <td data-sort-value="${item.symbol}">${item.symbol}</td>
                    <td data-sort-value="${item.name}">${item.name}</td>
                    <td data-sort-value="${item.percent_change_1h}" class="has-text-right ${isPositive(item.percent_change_1h)}">${item.percent_change_1h}%</td>
                    <td data-sort-value="${item.percent_change_24h}" class="has-text-right ${isPositive(item.percent_change_24h)}">${item.percent_change_24h}%</td>
                    <td data-sort-value="${item.percent_change_7d}" class="has-text-right ${isPositive(item.percent_change_7d)}">${item.percent_change_7d}%</td>
                    <td data-sort-value="${item.price_usd}" class="has-text-right">$${item.price_usd}</td>
                </tr>`
            );
        });
        // Add sortability to the results
        $("table").stupidtable();
        $coins.append(coins.join(''));
    });
});