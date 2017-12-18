const loadComponents = () => {
    const promise = new Promise(function (resolve, reject) {
        // We remove the noScriptWrapper
        $('.noScriptWrapper').hide();
        // We then load every other components
        $("#loaderComponent").load("components/loader.html");
        $("#navbarComponent").load("components/navbar.html");
        $("#balanceComponent").load("components/balance.html");
        $("#searchComponent").load("components/search.html");
        $("#coinTableComponent").load("components/coinTable.html");
        resolve(true);
    });
    return promise;
};