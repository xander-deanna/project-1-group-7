
// ------------------------------ INIT ------------------------------------
// get random api key
// pretty janky but whatever
function STKapiKey() {
  let keys = ['U65M3D2LOCIOUFEM', '360MOC21QRQBN4A7', 'TVAWGAIT6NK20HO6', 'RO6INSI5F8XF24U4', 'VUSZAYEFYIX8EY68', 'AFGS4TVRDX0GJ7OH']
  return keys[Math.floor(Math.random(keys.length))]
}

function STKIntradayURL() {
  return `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&apikey=${STKapiKey()}`
}

let stocksList = []
fetch('stocks.json').then(r => r.json()).then(d => stocksList = d)

// When user inputs incorrect symbols to search for favs, returns them back to enter again. 
document.querySelector("#TryFavAgainBtn").addEventListener("click", () => $('#favsModal').foundation('open'))

//Stocks search event listener for main (index) page
document.getElementById("stocksBtn").addEventListener("click", STKdisplaySearch)

//Crypto search event listener for main (index) page
document.getElementById("cryptoBtn").addEventListener("click", function () {
  document.querySelector("#cryptoList").textContent = " "
  document.querySelector("#featureTitle").textContent = "Your Search Results"
  getCryptoSearch()
})

// Stock Favorite Search
document.getElementById("stockFavBtn").addEventListener('click', addStockFav)

// Only display favorites
getCrypto()
$('#favsModal').foundation('open')

// --------------------------- STOCKs ---------------------------------
// Called on stock search button clicked
// Populates stock list with results
// Get data for stock by symbol
async function STKgetData(symbol) {
    let results = await (
        await fetch(`${STKIntradayURL()}&symbol=${symbol}`)
    ).json()
    let i = 0
    while (results['Note'] || i == 25) {
      results = await (
        await fetch(`${STKIntradayURL()}&symbol=${symbol}`)
      )
      i++
    }
    if (results['Error Message']) {
      console.log('BAD QUERY')
      console.log(results)
      return false
    }
    return results
}

// display all stocks
async function STKdisplayAll() {
  STKdisplayFavs()
  STKdisplayFeatured()
}

async function STKdisplaySearch() {
  let query = document.getElementById('stocksSearch').value
  if (query == '') return
  let stock = (
    await STKgetData(query)
  )
  console.log(stock)
  if (!stock) {
    return $('#errorModal').foundation('open')
  }

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

async function STKdisplayFavs() {
  let favsSymbols = JSON.parse(localStorage.getItem('stockFavorites'))
  let favs = []
  for (let i in favsSymbols) {
    let res = await STKgetData(favsSymbols[i])
    if (res) favs.push(res)
  }
  let el = document.getElementById('favStocksList')
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

async function STKdisplayFeatured(){
  var featured = ["AMZN", "IBM","DIS", "MSFT", "CVX", "XOM", "TWTR", "FB", "ORCL"]
  // randomly selects one stock to be displayed
  var symbolIndex = Math.floor(Math.random() * featured.length);
  var data = await STKgetData(featured[symbolIndex])
  var featuredstocksRenderEl = document.getElementById("stocksList");

  featuredstocksRenderEl.innerHTML = ''

  // current day values
  var StockFuture=(data['Time Series (Daily)']);
  var objKeys=Object.keys(StockFuture);
  var propOfFirstEntry=objKeys.shift();
  var Stocktorender=StockFuture[propOfFirstEntry];

  var objValhigh=Number(Stocktorender['2. high']).toFixed(2);

  // previous day values
  var StockToenderSecondEntry=(data['Time Series (Daily)'][Object.keys(StockFuture)[1]]);
  var objValpreviousDayClose=Number(StockToenderSecondEntry['4. close']).toFixed(2);

  var symbolli=document.createElement("li");

  symbolli.textContent=featured[symbolIndex] + ": " + objValhigh;
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
}

function addStockFav() {
  var stockFavInput = document.querySelector('#stockFav');
  var stockFavValue = stockFavInput.value;
  var symbolId = stockFavValue.toUpperCase();

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
}
// -------------------------------------------------------------------

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
    for (var i = 0; i < cryptoArray.length; i++) {

      var cryptoFavResult = cryptoArray[i] + ":" + " " + cryptoData.data.rates[cryptoArray[i]]
      var cryptoList = document.querySelector("#favCryptoList")
      var favCryptoLi = document.createElement('li');
      favCryptoLi.textContent = cryptoFavResult
      cryptoList.appendChild(favCryptoLi);

    }
  }
}

document.getElementById("clearBtnCrypto").addEventListener("click", function () {
  var cryptoArray = [];
  var cryptoList = document.querySelector("#favCryptoList");
  localStorage.setItem("cryptoFavorites", JSON.stringify(cryptoArray));
  cryptoList.textContent = "";
})

document.getElementById("clearBtnStocks").addEventListener("click", function () {
  var stockArray = [];
  localStorage.setItem("stockFavorites", JSON.stringify(stockArray));
  var stocksLi = document.querySelector("#favStocksList");
  stocksLi.textContent = "";
})