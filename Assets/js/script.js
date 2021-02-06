
var renderStockDiv=document.getElementById("render-stock");
var stocksListEl = document.getElementById("stocksList");

//Variables for search elements
var stocksSearchBtn = document.getElementById("stocksBtn")
var cryptoSearchBtn = document.getElementById("cryptoBtn")

//Stocks search event listener for main (index) page
stocksSearchBtn.addEventListener("click", function(){
  var stocksListEl = document.querySelector("#stocksList")
  stocksListEl = ""
  STKSearchHandler()
});

//Crypto search event listener for main (index) page
cryptoSearchBtn.addEventListener("click", function(){
  var cryptoListEl = document.querySelector("#cryptoList")
  cryptoListEl = ""
  cryptoSearchHandler()
});

renderStockList();


function renderStockList(){
  var stocksymbol=["AMZN", "IBM","DIS"]
  
  // randomly selects one stock to be displayed
 
  var symbolIndex = Math.floor(Math.random() * stocksymbol.length)
  console.log(symbolIndex);
  getStocks(stocksymbol[symbolIndex]);
  console.log(stocksymbol[symbolIndex]);
  
}

function getStocks(symbol){
    console.log(symbol);
    var requestUrl =  'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=' + symbol + '&apikey=U65M3D2LOCIOUFEM'  
       

    console.log(requestUrl);
    

    fetch(requestUrl )
      .then(function (response) {
        return response.json();
       })
       
      .then(function (data) {
        console.log("Stock data ", data)
        
        var lastStock=(data['Time Series (Daily)']);
        
         console.log("last stock id :", lastStock);
        
         console.log("key ",Object.keys(lastStock));
         var objKeys=Object.keys(lastStock);
        var propOfLastEntry=objKeys.shift();
        
          console.log("propofLastEntry ",propOfLastEntry);
        var lastStocktorender=lastStock[propOfLastEntry];
          console.log("Last stock object ",lastStocktorender);
        var rowEl=document.createElement("div");
        rowEl.classList.add("row");
        
        
        
        var symbolEl=document.createElement("div");
        symbolEl.classList.add("columns");
        
        symbolEl.classList.add("small-2");
        symbolEl.textContent=symbol;
        
        rowEl.append(symbolEl);
        var symbolE2=document.createElement("div");
        symbolE2.classList.add("columns");
        var objValOpen=Number(lastStocktorender['1. open']);
        symbolE2.textContent=objValOpen.toFixed(2);
        symbolE2.classList.add("small-2");
        rowEl.append(symbolE2);
        var symbolE3=document.createElement("div");
        symbolE3.classList.add("columns");
        var objValhigh=Number(lastStocktorender['2. high']);
        symbolE3.textContent=objValhigh;
        symbolE3.classList.add("small-2");
        rowEl.append(symbolE3);
        var symbolE4=document.createElement("div");
        symbolE4.classList.add("columns");
        var objValLow=Number(lastStocktorender['3. low']);
        symbolE4.textContent=objValLow;
        symbolE4.classList.add("small-2");
        rowEl.append(symbolE4);
        var symbolE5=document.createElement("div");
        symbolE5.classList.add("columns");
        var objValClose=Number(lastStocktorender['4. close']);
        symbolE5.textContent=objValClose;
        symbolE5.classList.add("small-2");
        rowEl.append(symbolE5);
        var symbolE6=document.createElement("div");
        symbolE6.classList.add("columns");
        var objValVolume=Number(lastStocktorender['5. volume']);
        symbolE6.textContent=objValVolume;
        symbolE6.classList.add("small-2");
        rowEl.append(symbolE6);
        renderStockDiv.append(rowEl);
      });
}



function getStock() {

  var requestUrl = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=AMZN&apikey=U65M3D2LOCIOUFEM'

  console.log(requestUrl);

  fetch(requestUrl)
    .then(function (response) {

      if (response.ok) {
        return response.json()
          .then(function (stockData) {
            if (stockData["Error Message"]) {
              return $('#errorModal').foundation('open')
            }
            console.log("stock data:", stockData)
          })

      }

    })
}



var cryptoListEl = document.getElementById("cryptoList");

// Fetch for Crypto
function getCrypto() {
  var requestUrl = 'https://api.coinbase.com/v2/exchange-rates';
  console.log(requestUrl);
  fetch(requestUrl)
    .then(function (response) {
      console.log(response)
      if (response.ok) {
        return response.json()
          .then(function (cryptoData) {
            if (cryptoData["Error Message"]) {
              return $('#errorModal').foundation('open')
            }
            console.log("crypto data: ", cryptoData)
            displayCrypto(cryptoData)
            return cryptoData
          })

      }
    })


}
getCrypto()
// Displays five featured currencies at random and the current Bitcoint (BTC) rate vs 1 USD
function displayCrypto(cryptoData) {
  
  // pulls current BTC rate
  var bitcoinPrice = cryptoData.data.rates.BTC
  console.log(bitcoinPrice)
  // adds current BTC rate to HTML
  var btcFeature = document.querySelector("#btcfeature")
  btcFeature.textContent = "BTC: " + bitcoinPrice;


  var topCrypto = [];
  console.log("crpto Data: ", cryptoData)
  // gets list currency abbreviations from rate object keys
  var keys = Object.keys(cryptoData.data.rates)
  // randomly selects five currencies to be displayed, places them in empty topCrypto array to then be pulled
  for (var i = 0; i < 5; i++) {
    var cryptoKeys = Math.floor(Math.random() * keys.length)
    console.log(cryptoKeys)
    var cryptoRandom = keys[cryptoKeys]
    topCrypto.push(cryptoRandom)
    console.log(topCrypto)
  }

  for (var i = 0; i < topCrypto.length; i++) {
    var featuredCurrency = { [topCrypto[i]]: cryptoData.data.rates[topCrypto[i]] }
    console.log(featuredCurrency)
    var featuredList = document.querySelector("#cryptoList")
    var featuredEl = document.createElement('li');
    featuredEl.textContent = topCrypto[i] + ":" + " " + featuredCurrency[topCrypto[i]];
    featuredList.appendChild(featuredEl);

  }


}
