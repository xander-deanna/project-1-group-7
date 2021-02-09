
// ------------------------------ INIT ------------------------------------

function STKapiKey() {
  let keys  = ['U65M3D2LOCIOUFEM', '360MOC21QRQBN4A7', 'TVAWGAIT6NK20HO6', 'RO6INSI5F8XF24U4', 'VUSZAYEFYIX8EY68']
  return 'VUSZAYEFYIX8EY68'
  return keys[Math.floor(Math.random(keys.length))]
}
let STKIntradayURL = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&apikey=${STKapiKey()}`
let STKSearchURL = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&apikey=${STKapiKey()}`

var renderStockDiv = document.getElementById("render-stock");
var stocksListEl = document.getElementById("stocksList");
var clearCryptoEl = document.getElementById("clearBtnCrypto");
var clearStocksEl = document.getElementById("clearBtnStocks");
var stockfavSearch = document.getElementById("stockFavBtn");

var stockFavTitle = document.querySelector("#stockFavTitle");
var cryptoFavTitle = document.querySelector("#cryptoFavTitle");

var favMenuBtnEL = document.getElementById("favsModalBtn");



favMenuBtnEL.addEventListener("click", function ()  {
  return $('#favsModal').foundation('open')
});

// function init() {
//   return $('#favsModal').foundation('open')
// }


getCrypto()
stockIndex = []
// When user inputs incorrect symbols to search for favs, returns them back to enter again. 
var favTryAgain = document.querySelector("#TryFavAgainBtn");
favTryAgain.addEventListener("click", function () {
  return $('#favsModal').foundation('open')
});

document.querySelector('[data-close="favsModal"]').addEventListener('click', displayStocks)

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
  var stocksymbol=["AMZN", "IBM","DIS", "MSFT", "CVX", "XOM", "TWTR", "FB", "ORCL"]
  // randomly selects one stock to be displayed
  var symbolIndex = Math.floor(Math.random() * stocksymbol.length);
  
  var requestUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=` + stocksymbol[symbolIndex] + `&apikey=${STKapiKey()}`  
  var featuredstocksRenderEl =document.getElementById("stocksList");
  featuredstocksRenderEl.innerHTML = ''
  fetch(requestUrl )
    .then(function (response) {
      return response.json();
     })
    .then(function (data) {
      if (!data || data['Note'] || data['Error Message']) {
        console.log('bad return')
        return
      }
      var StockFuture=(data['Time Series (Daily)']);
      var objKeys=Object.keys(StockFuture);
      var propOfFirstEntry=objKeys.shift();
      var Stocktorender=StockFuture[propOfFirstEntry];
      var objValOpen=Number(Stocktorender['1. open']).toFixed(2);
      var objValhigh=Number(Stocktorender['2. high']).toFixed(2);
      var objValLow=Number(Stocktorender['3. low']).toFixed(2);
      var objValClose=Number(Stocktorender['4. close']).toFixed(2)
      // get previous day stock
      var StockToenderSecondEntry=(data['Time Series (Daily)'][Object.keys(StockFuture)[1]]);
      var objValpreviousDayClose=Number(StockToenderSecondEntry['4. close']).toFixed(2);
      var symbolli=document.createElement("li");

          symbolli.textContent=stocksymbol[symbolIndex] + ": " + objValhigh;
      // add icon based on the change in price
      var iconEl=document.createElement("a");
      // change since last day
      if (parseFloat(objValpreviousDayClose) < parseFloat(objValhigh)) {
        iconEl.classList.add("fa", "fa-sort-down");
        
      } else {
        iconEl.classList.add("fa", "fa-sort-up");
        
      }

        symbolli.appendChild(iconEl);
        featuredstocksRenderEl.append(symbolli);

    });

  }
// Called on stock search button clicked
// Populates stock list with results
async function STKSearchHandler(event) {
    let query = document.getElementById('stocksSearch').value
    if (query == '') return
    let stock = (
      await STKgetData(query)
    )
    console.log(stock)
    if (!stock) {
      return $('#errorModal').foundation('open')
    }
    displayStocks(stock)

}

// Get data for stock by symbol
async function STKgetData(symbol) {
    let results = await (
        await fetch(`${STKIntradayURL}&symbol=${symbol}`)
    ).json()
    if (results['Note']) {
      console.log('API KEY EXPIRED!')
    }
    if (results['Error Message']) {
      console.log('BAD QUERY')
      return false
    }
    console.log('something else')
    console.log(results)
    return results
}

// create table of stocks
async function displayStocks(searchStock=null) {
    let favsSymbols = JSON.parse(localStorage.getItem('stockFavorites'))
    let favs = []
    for (let i in favsSymbols) {
        favs.push(await STKgetData(favsSymbols[i]))
    }
    displayStockFavs(favs)
    displayStocksFeatured()

    if (!searchStock || (searchStock instanceof MouseEvent)) return
    
    // if searchStock have been passed, render search results
    document.getElementById('stock-results-render').style.display = 'block'
    document.getElementById('stock-results-render-list').innerHTML = ''

    let symbol = searchStock['Meta Data']['2. Symbol']
    if (!favs.find(fav => fav == symbol)) { // if not a favorite
        let row = document.createElement('ul')

        let currentDayData = searchStock['Time Series (Daily)'][
            Object.keys(searchStock['Time Series (Daily)'])[0]
        ]
        let previousDayData = searchStock['Time Series (Daily)'][
            Object.keys(searchStock['Time Series (Daily)'])[1]
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

async function displayStockFavs(favs) {
  let el = document.getElementById('favStocksList')
  if (!favs || !favs[0]) {
    el.innerHTML = '<p>There are no favorite stocks selected</p>'
    clearStocksEl.style.display = "none";
  
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
  var favAddedConfirm = document.querySelector('#favConfirm');
  favAddedConfirm.textContent=""
  favAddedConfirm.textContent = "Added to Favorites!"
  getCryptoFav()

})

// Stock Favorite Search
stockfavSearch.addEventListener('click', function () {
  var favStockInput = document.querySelector("#stockFav")

  if (favStockInput === null) {
    return $('#errorModal').foundation('open')
  }
  var favAddedConfirm = document.querySelector('#favConfirm');
  favAddedConfirm.textContent=""
  favAddedConfirm.textContent = "Added to Favorites!"

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
    stockArray.push(symbolId);
    localStorage.setItem("stockFavorites", JSON.stringify(stockArray));
  }
  clearStocksEl.style.display = "block";
  stockFavTitle.textContent="Favorite Stocks";
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
  clearCryptoEl.style.display = "block";
  // cryptoFavTitle.textContent="Favorite Stocks"
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
  // if (!localStorage.cryptoFavorites) {
  // var favTitle = document.querySelector("#favTitle")
  // favTitle.textContent = "Favorite Currencies"}
  
  var cryptoList = document.querySelector("#favCryptoList")
  var favCryptoLi = document.createElement('li');
  favCryptoLi.textContent = cryptoFavResult
  cryptoList.appendChild(favCryptoLi);

  saveCrypto(cryptoFavValueCaps);

}

function renderCryptoLocalStorage(cryptoData) {
  var cryptoArray = [];
  if (localStorage.cryptoFavorites) {
    var cryptoFavTitle = document.querySelector("#cryptoFavTitle");
    cryptoFavTitle.textContent = "Favorite Currencies";
    var cryptoArray = JSON.parse(localStorage.getItem("cryptoFavorites"));
    for (var i = 0; i < cryptoArray.length; i++) {

      var cryptoFavResult = cryptoArray[i] + ":" + " " + cryptoData.data.rates[cryptoArray[i]]
      var cryptoList = document.querySelector("#favCryptoList")
      var favCryptoLi = document.createElement('li');
      favCryptoLi.textContent = cryptoFavResult
      cryptoList.appendChild(favCryptoLi);
      
    }

  } 
  
  if (!cryptoArray || !cryptoArray[0]){
     let el = document.getElementById('favCryptoList')
     el.innerHTML = '<p>There are no favorite crypto Currencies selected</p>'
     clearCryptoEl.style.display = "none";
  }
     
  
}

clearCryptoEl.addEventListener("click", function () {
  var cryptoArray = [];
  var cryptoList = document.querySelector("#favCryptoList");
  localStorage.setItem("cryptoFavorites", JSON.stringify(cryptoArray));
  cryptoList.textContent = "";
  this.style.display = "none";
  let el = document.getElementById('favCryptoList')
  el.innerHTML = '<p>There are no favorite crypto Currencies selected</p>'
  
  
})


function addStockFav() {
  var stockFavInput = document.querySelector('#stockFav');

  var stockFavValue = stockFavInput.value;
  var stockFavValueeCaps = stockFavValue.toUpperCase();
  saveStocks(stockFavValueeCaps);
  displayStocks();

}
clearStocksEl.addEventListener("click", function () {
  var stockArray = [];
  localStorage.setItem("stockFavorites", JSON.stringify(stockArray));
  var stocksLi = document.querySelector("#favStocksList");
  stocksLi.textContent = "";
  this.style.display = "none";
  
  let el = document.getElementById('favStocksList')
  el.innerHTML = '<p>There are no favorite stocks selected</p>'
  clearStocksEl.style.display = "none";
  
  
})