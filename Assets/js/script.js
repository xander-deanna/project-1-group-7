
// ------------------------------ INIT ------------------------------------
//let STKapiKey = 'U65M3D2LOCIOUFEM'
//let STKapiKey = '360MOC21QRQBN4A7'
let STKapiKey = 'TVAWGAIT6NK20HO6'
let STKIntradayURL = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&apikey=${STKapiKey}`
let STKSearchURL = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&apikey=${STKapiKey}`

var renderStockDiv = document.getElementById("render-stock");
var stocksListEl = document.getElementById("stocksList");
var clearCryptoEl = document.getElementById("clearBtnCrypto");
var clearStocksEl = document.getElementById("clearBtnStocks");
var stockfavSearch = document.getElementById("stockFavBtn");

function init() {
  return $('#favsModal').foundation('open')
}

init()


getCrypto()
stockIndex = []
// When user inputs incorrect symbols to search for favs, returns them back to enter again. 
var favTryAgain = document.querySelector("#TryFavAgainBtn");
favTryAgain.addEventListener("click", function () {
  return $('#favsModal').foundation('open')
});



//Variables for search elements
var stocksSearchBtn = document.getElementById("stocksBtn")
var cryptoSearchBtn = document.getElementById("cryptoBtn")

//Stocks search event listener for main (index) page

stocksSearchBtn.addEventListener("click", STKSearchHandler)

//Crypto search event listener for main (index) page
cryptoSearchBtn.addEventListener("click", function () {
  var cryptoListEl = document.querySelector("#cryptoList")
  var featureTitle = document.querySelector("#featureTitle")
  cryptoListEl.textContent = " "
  featureTitle.textContent = "Your Search Results"
  getCryptoSearch()
});

// Only display favorites
displayStocks()

// --------------------------- STOCKs ---------------------------------



function displayStocksFeatured(){
  var stocksymbol=["AMZN", "IBM","DIS"]
  // randomly selects one stock to be displayed
  var symbolIndex = Math.floor(Math.random() * stocksymbol.length);
  
  console.log(stocksymbol[symbolIndex]);
  var requestUrl = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=' + stocksymbol[symbolIndex] + '&apikey=U65M3D2LOCIOUFEM'  
                    // 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=IBM&apikey=demo
  console.log(requestUrl);
  fetch(requestUrl )
    .then(function (response) {
      return response.json();
     })

    .then(function (data) {
      console.log("Stock data ", data)
      var StockFuture=(data['Time Series (Daily)']);
      var objKeys=Object.keys(StockFuture);
      var propOfFirstEntry=objKeys.shift();
      console.log("propOfFirstEntry ",propOfFirstEntry);
      var Stocktorender=StockFuture[propOfFirstEntry];
      console.log("stock object ",Stocktorender);
      var objValOpen=Number(Stocktorender['1. open']).toFixed(2);
      var objValhigh=Number(Stocktorender['2. high']).toFixed(2);
      var objValLow=Number(Stocktorender['3. low']).toFixed(2);
      var objValClose=Number(Stocktorender['4. close']).toFixed(2);
      var featuredstocksRenderEl =document.getElementById("featured-stocks-render");
      var symbolli=document.createElement("li");
        symbolli.classList.add("columns");
        symbolli.textContent=stocksymbol[symbolIndex] + ": " + objValhigh;
        var favIcon=document.createElement("img");
        favIcon.setAttribute("src", ""); 
        symbolli.appendChild(favIcon);
        featuredstocksRenderEl.append(symbolli);

    });

  }
// Called on stock search button clicked
// Populates stock list with results
async function STKSearchHandler(event) {

    let query = document.getElementById('stocksSearch').value
    let matches = await STKgetSymbolSearch(query.replace(' ', ','))
    if (matches['bestMatches'].length == 0) return $('#errorModal').foundation('open')
    console.log(matches)
    let stocks = []
    for (let i in matches['bestMatches'])   {
        stocks.push(
            await STKgetData(matches['bestMatches'][i]['1. symbol'])
        )
    }
    displayStocks(stocks)

}

// Gets stocks that match search query
async function STKgetSymbolSearch(keywords) {

  let results = await (
    await fetch(`${STKSearchURL}&keywords=${keywords}`)
  ).json()
  if (!results['Note']) {
    return results
  } else {
    console.log('API KEY EXPIRED!')
  }


}

// Get data for stock by symbol
async function STKgetData(symbol) {
    let results = await (
        await fetch(`${STKIntradayURL}&symbol=${symbol}`)
    ).json()
    if (!results['Note']) {
      return results
    } else {
      console.log('API KEY EXPIRED!')
    }
}

// create table of stocks
async function displayStocks(stocks=null) {
    let favsSymbols = JSON.parse(localStorage.getItem('stockFavorites'))
    let favs = []
    for (let i in favsSymbols) {
        favs.push(await STKgetData(favsSymbols[i]))
    }
    displayStockFavs(favs)
    displayStocksFeatured()

    if (!stocks) return
    
    // if stocks have been passed, render search results
    document.getElementById('stock-results-render').style.display = 'block'
    document.getElementById('stock-results-render-list').innerHTML = ''
    for (let i in stocks) {
        let symbol = stocks[i]['Meta Data']['2. Symbol']
        if (!favs.find(fav => fav == symbol)) { // if not a favorite
            let row = document.createElement('ul')

            let currentDayData = stocks[i]['Time Series (Daily)'][
                Object.keys(stocks[i]['Time Series (Daily)'])[0]
            ]
            let previousDayData = stocks[i]['Time Series (Daily)'][
                Object.keys(stocks[i]['Time Series (Daily)'])[1]
            ]

            let price = currentDayData['2. high']
            let changeIcon

            // change since last day
            if (parseFloat(previousDayData['4. close']) < parseFloat(currentDayData['2. high'])) {
                changeIcon = '<i class="fa fa-sort-down"></i>'
            } else {
                changeIcon = '<i class="fa fa-sort-up"></i>'
            }
            row.innerHTML = `${symbol}: ${price} ${changeIcon}`
            document.getElementById('stock-results-render-list').appendChild(row)
        }
    }
  }

async function displayStockFavs(favs) {
  let el = document.getElementById('favorite-stocks-render')
  if (!favs || !favs[0]) {
    el.innerHTML = '<p>There are no favorite stocks selected</p>'
    return
  }
  el.innerHTML = ''
  for (let i in favs) {
    let currentDayData = favs[i]['Time Series (Daily)'][
      Object.keys(favs[i]['Time Series (Daily)'])[0]
    ]
    el.innerHTML = el.innerHTML + `<ul>${favs[i]['Meta Data']['2. Symbol']}: ${currentDayData['2. high']}</ul>`
  }
}
// -------------------------------------------------------------------



var cryptoListEl = document.getElementById("cryptoList");

// Fetch for featured crypto
function getCrypto() {
  var requestUrl = 'https://api.coinbase.com/v2/exchange-rates';

  fetch(requestUrl)
    .then(function (response) {

      if (response.ok) {
        return response.json()
          .then(function (cryptoData) {
            if (cryptoData["Error Message"]) {
              return $('#errorModal').foundation('open')
            }

            displayCrypto(cryptoData)
            return cryptoData
          })

      }
    })


}

// Displays five featured currencies at random and the current Bitcoint (BTC) rate vs 1 USD
function displayCrypto(cryptoData) {

  // pulls current BTC rate
  var bitcoinPrice = cryptoData.data.rates.BTC

  // adds current BTC rate to HTML
  var btcFeature = document.querySelector("#btcfeature")
  btcFeature.textContent = " BTC: " + bitcoinPrice;


  var topCrypto = [];

  // gets list currency abbreviations from rate object keys
  var keys = Object.keys(cryptoData.data.rates)
  // randomly selects five currencies to be displayed, places them in empty topCrypto array to then be pulled
  for (var i = 0; i < 5; i++) {
    var cryptoKeys = Math.floor(Math.random() * keys.length)

    var cryptoRandom = keys[cryptoKeys]
    topCrypto.push(cryptoRandom)

  }

  for (var i = 0; i < topCrypto.length; i++) {
    var featuredCurrency = { [topCrypto[i]]: cryptoData.data.rates[topCrypto[i]] }

    var featuredList = document.querySelector("#cryptoList")
    var featuredEl = document.createElement('li');
    featuredEl.textContent = topCrypto[i] + ":" + " " + featuredCurrency[topCrypto[i]];
    featuredList.appendChild(featuredEl);

  }
  // -------------------------------------------------------------------

  // get fav crypto from local storage
  renderCryptoLocalStorage(cryptoData);
}

// Crypto favorite search 
var cryptofavSearch = document.querySelector("#cryptoFavBtn");
cryptofavSearch.addEventListener('click', function () {
  var favCryptoInput = document.querySelector("#cryptoFav")

  if (favCryptoInput === null) {
    return $('#errorModal').foundation('open')
  }

  getCryptoFav()

})

// let stockfavSearch = document.getElementById('stockFavBtn')
// Stock Favorite Search

stockfavSearch.addEventListener('click', function () {
  var favStockInput = document.querySelector("#stockFav")

  if (favStockInput === null) {
    return $('#errorModal').foundation('open')
  }

  addStockFav()
})


function saveStocks(symbolId) {
  var found = false;
  var stockArray = [];

  if (JSON.parse(localStorage.getItem("stockFavorites"))) {
    stockArray = JSON.parse(localStorage.getItem("stockFavorites"))
  }

  // check for duplicate symbol name
  for (var i = 0; i < stockArray.length; i++) {
    if (stockArray[i] === symbolId) {
      found = true;
    }
  }

  if (!found) {
    console.log("stocklocal", symbolId);
    stockArray.push(symbolId);
    localStorage.setItem("stockFavorites", JSON.stringify(stockArray));
  }
}

function saveCrypto(cryptoId) {
  var found = false;
  var cryptoArray = [];

  if (localStorage.getItem("cryptoFavorites")) cryptoArray = JSON.parse(localStorage.getItem("cryptoFavorites"))

  // check for duplicate city name
  for (var i = 0; i < cryptoArray.length; i++) {

    if (cryptoArray[i] === cryptoId) {
      found = true;
    }
  }

  if (!found) {
    cryptoArray.push(cryptoId);
    localStorage.setItem("cryptoFavorites", JSON.stringify(cryptoArray));
  }
}


// Fetch for User Search Crypto
function getCryptoSearch() {
  var requestUrl = 'https://api.coinbase.com/v2/exchange-rates';

  fetch(requestUrl)
    .then(function (response) {

      if (response.ok) {
        return response.json()
          .then(function (cryptoData) {
            if (cryptoData["Error Message"]) {
              return $('#errorModal').foundation('open')
            }
            displayCryptoSearch(cryptoData)
            return cryptoData
          })

      }
    })
}

function displayCryptoSearch(cryptoData) {
  var cryptoSearch = document.querySelector('#cryptoSearch')

  var cryptoSearchValue = cryptoSearch.value

  var cryptoSearchValueCaps = cryptoSearchValue.toUpperCase()

  var cryptoResult = cryptoSearchValueCaps + ":" + " " + cryptoData.data.rates[cryptoSearchValueCaps]


  if (cryptoData.data.rates[cryptoSearchValueCaps] === undefined) {
    return $('#schErrorModal').foundation('open')
  }

  var featuredList = document.querySelector("#cryptoList")
  var featuredEl = document.createElement('li');

  featuredEl.textContent = cryptoResult;

  featuredList.appendChild(featuredEl);
}


function getCryptoFav() {
  var requestUrl = 'https://api.coinbase.com/v2/exchange-rates';

  fetch(requestUrl)
    .then(function (response) {

      if (response.ok) {
        return response.json()
          .then(function (cryptoData) {
            if (cryptoData["Error Message"]) {
              return $('#errorModal').foundation('open')
            }

            displayCryptoFav(cryptoData)

            return cryptoData
          })

      }
    })
}

function displayCryptoFav(cryptoData) {
  var cryptoFavInput = document.querySelector('#cryptoFav')

  var cryptoFavValue = cryptoFavInput.value
  var cryptoFavValueCaps = cryptoFavValue.toUpperCase()

  var cryptoFavResult = cryptoFavValueCaps + ":" + " " + cryptoData.data.rates[cryptoFavValueCaps]


  if (cryptoData.data.rates[cryptoFavValueCaps] === undefined) {
    return $('#errorModal').foundation('open')
  }

  var cryptoList = document.querySelector("#favCryptoList")
  var favCryptoLi = document.createElement('li');
  favCryptoLi.textContent = cryptoFavResult
  cryptoList.appendChild(favCryptoLi);

  saveCrypto(cryptoFavValueCaps);

}

function renderCryptoLocalStorage(cryptoData) {
  var cryptoArray = [];
  if (localStorage.cryptoFavorites) {

    var cryptoArray = JSON.parse(localStorage.getItem("cryptoFavorites"));
    console.log(cryptoArray.length);
    for (var i = 0; i < cryptoArray.length; i++) {

      console.log(cryptoArray[i]);
      var cryptoFavResult = cryptoArray[i] + ":" + " " + cryptoData.data.rates[cryptoArray[i]]
      console.log(cryptoFavResult);
      var cryptoList = document.querySelector("#favCryptoList")
      var favCryptoLi = document.createElement('li');
      favCryptoLi.textContent = cryptoFavResult
      cryptoList.appendChild(favCryptoLi);

    }
  }
}

clearCryptoEl.addEventListener("click", function () {
  var cryptoArray = [];
  var cryptoList = document.querySelector("#favCryptoList");
  localStorage.setItem("cryptoFavorites", JSON.stringify(cryptoArray));
  cryptoList.textContent = "";
})


function addStockFav() {
  var stockFavInput = document.querySelector('#stockFav');

  var stockFavValue = stockFavInput.value;
  console.log(stockFavValue);
  var stockFavValueeCaps = stockFavValue.toUpperCase();
  console.log(stockFavValueeCaps);
  saveStocks(stockFavValueeCaps);


}
clearStocksEl.addEventListener("click", function () {
  var stockArray = [];
  localStorage.setItem("stockFavorites", JSON.stringify(stockArray));

})