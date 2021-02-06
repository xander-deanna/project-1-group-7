
// ------------------------------ INIT ------------------------------------
//let STKapiKey = 'U65M3D2LOCIOUFEM'
let STKapiKey = '360MOC21QRQBN4A7'
let STKIntradayURL = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&apikey=${STKapiKey}`
let STKSearchURL = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&apikey=${STKapiKey}`

var renderStockDiv=document.getElementById("render-stock");
var stocksListEl = document.getElementById("stocksList");
var clearCryptoEl =document.getElementById("clearBtnCrypto");
function init(){
  return $('#favsModal').foundation('open')
}

init()
getCrypto()
stockIndex = []

var tryAgain = document.querySelector("#TryFavAgainBtn");
tryAgain.addEventListener("click", function(){
  return $('#favsModal').foundation('open')
});

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
  var featureTitle = document.querySelector("#featureTitle")
  cryptoListEl.textContent = " "
  featureTitle.textContent = "Your Search Results"
  getCryptoSearch()
});


renderDefaultStocks();


// --------------------------- STOCKs ---------------------------------
async function renderDefaultStocks(){
    // display default / favorite stocks
    var stocksymbol=["AMZN", "IBM","DIS"]
    var stocks = []
    for (var i in stocksymbol){
        stocks.push(await STKgetData(stocksymbol[i]))
    }
    displayStocks(stocks)
}

// Called on stock search button clicked
// Populates stock list with results
async function STKSearchHandler(event) {
    let query = document.getElementById('stocksSearch').value
    let matches = await STKgetSymbolSearch(query.replace(' ', ','))
    console.log(matches)
    let stocks = []
    for (let i in matches['bestMatches'])   {
        stocks.push(
            await STKgetData(matches['bestMatches'][i]['symbol'])
        )
    }
    displayStocks(stocks)
}

// Gets stocks that match search query
async function STKgetSymbolSearch(keywords) {
    return await (
        await fetch(`${STKSearchURL}&keywords=${keywords}`)
    ).json()

}

// Get data for stock by symbol
async function STKgetData(symbol) {
    return await (
        await fetch(`${STKIntradayURL}&symbol=${symbol}`)
    ).json()
}

// create table of stocks
async function displayStocks(stocks) {
    let favsSymbols = JSON.parse(localStorage.getItem('stockFavorites'))
    let favs = []
    for (let i in favsSymbols) {
        favs.push(await STKgetData(favsSymbols[i]))
    }
    displayStockFavs(favs)

    for (let i in stocks) {
        let symbol = stocks[i]['Meta Data']['2. Symbol']
        if (!favs.find(fav => fav == symbol)) { // if not a favorite
            let row = document.createElement('tr')

            row.appendChild(td(symbol))

            let currentDayData = stocks[i]['Time Series (Daily)'][
                Object.keys(stocks[i]['Time Series (Daily)'])[0]
            ]
            let previousDayData = stocks[i]['Time Series (Daily)'][
                Object.keys(stocks[i]['Time Series (Daily)'])[1]
            ]

            // high, low, open, close
            for (let field in currentDayData) {
                row.appendChild(
                    td(parseFloat(currentDayData[field]).toFixed(2))
                )
            }

            // change since last day
            if (parseFloat(previousDayData['close']) < parseFloat(currentDayData['high'])) {
                row.appendChild(
                    td('<i class="fa sort-down"></i>')
                )
            } else {
                row.appendChild(
                    td('<i class="fa sort-up"></i>')
                )
            }

            // favorites
            row.appendChild(
                td(
                    favoriteIcon('far fa-star', symbol)
                )
            )

            document.getElementById('stock-render').appendChild(row)
        }
    }
}

function updateStockFavs(event, symbol) {
    let favs = JSON.parse(localStorage.getItem('stockFavorites'))
    if (favs.find(fav => fav == symbol)) {
        favs.push(symbol)
        event.target.className = 'fa fa-star'
    } else {
        favs.splice(
            favs.indexOf(symbol),
            1
        )
        event.target.className = 'fa fa-star'
    }
}

async function displayStockFavs(favs) {
    
}

function td(content, className='') {
    let td = document.createElement('td')
    if (typeof content == 'string') {
        td.innerHTML = `<td>${content}</td>`
    } else {
        td.appendChild(content)
    }
    td.className = className
    return td
}

function favoriteIcon(className, symbol) {
    let i = document.createElement('i')
    i.className = className
    i.addEventListener('click', (event) => updateStockFavs(event, symbol))
    return i
}
// -------------------------------------------------------------------



//       if (response.ok) {
//         return response.json()
//           .then(function (stockData) {
//             if (stockData["Error Message"]) {
//               return $('#errorModal').foundation('open')
//             }
//             console.log("stock data:", stockData)
//           })

//       }



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


var favSearch = document.querySelector("#favBtn");

favSearch.addEventListener('click', function(){
  var favCryptoInput = document.querySelector("#cryptoFav")
  var favStockInput = document.querySelector("#stockFav")
  if (favCryptoInput !== null){
    getCryptoFav()
  }
  if (favStockInput !== null){
    // get fav Stock function
  }

  return $('#errorModal').foundation('open')
  
  
})

  
function saveStocks(symbolId){
  var found=false;
  var stockArray=[];

  if (JSON.parse(localStorage.getItem("stockFavorites"))) {
    stockArray = JSON.parse(localStorage.getItem("stockFavorites"))
  }

  // check for duplicate symbol name
  for(var i=0; i < stockArray.length; i++){
    if(stockArray[i] === symbolId){
        found=true;
    }
  }

  if(!found){
    stockArray.push(symbolId);
    localStorage.setItem("stockFavorites", JSON.stringify(stockArray));
  }  
}

function saveCrypto(cryptoId){
  var found=false;
  var cryptoArray=[];

  if (localStorage.getItem("cryptoFavorites")) cryptoArray = JSON.parse(localStorage.getItem("cryptoFavorites"))

  // check for duplicate city name
  for(var i=0; i < cryptoArray.length; i++){
    
    if(cryptoArray[i] === cryptoId){
        found=true;
    }
  }         

  if(!found){
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


  if(cryptoData.data.rates[cryptoSearchValueCaps] === undefined){
    return $('#errorModal').foundation('open')
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

  
  if(cryptoData.data.rates[cryptoFavValueCaps] === undefined){
    return $('#errorModal').foundation('open')
  }

  var cryptoList = document.querySelector("#favCryptoList")
  var favCryptoLi = document.createElement('li');
  favCryptoLi.textContent = cryptoFavResult
  cryptoList.appendChild(favCryptoLi);

  saveCrypto(cryptoFavValueCaps);

}

function renderCryptoLocalStorage(cryptoData){
  var cryptoArray=[];
    if (localStorage.cryptoFavorites){
      
      var cryptoArray = JSON.parse(localStorage.getItem("cryptoFavorites"));
      console.log(cryptoArray.length);
      for(var i=0; i < cryptoArray.length; i++){
      
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

clearCryptoEl.addEventListener("click", function(){
  var cryptoArray=[];
  var cryptoList = document.querySelector("#favCryptoList");
  localStorage.setItem("cryptoFavorites", JSON.stringify(cryptoArray));
  cryptoList.textContent="";
})
