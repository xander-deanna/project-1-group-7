
// ------------------------------ INIT ------------------------------------
let STKapiKey = 'U65M3D2LOCIOUFEM'
let STKIntradayURL = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&apikey=${STKapiKey}`
let STKSearchURL = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&apikey=${STKapiKey}`

var renderStockDiv=document.getElementById("render-stock");
var stocksListEl = document.getElementById("stocksList");

function init(){
  return $('#favsModal').foundation('open')
}

init()
getCrypto()
stockIndex = []

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
function displayStocks(stocks) {
    console.log(stocks)
    for (let i in stocks) {
        let row = document.createElement('tr')
        row.appendChild(
            document.createElement('td').appendChild(
                document.createTextNode(stocks[i]['Meta Data']['2. Symbol'])
            )
        )
        let currentDayData = stocks[i]['Time Series (Daily)'][
            Object.keys(stocks[i]['Time Series (Daily)'])[0]
        ]
        for (let field in currentDayData) {
            row.appendChild(
                document.createElement('td').appendChild(
                    document.createTextNode(parseFloat(currentDayData[field]).toFixed(2))
                )
            )
        }
        document.getElementById('stock-render').appendChild(row)
    }
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

// -------------------------------------------------------------------

}


var cryptoFavSearch = document.querySelector("#cryptofav");

cryptoFavSearch.addEventListener('click', function(){
  var cryptoList = document.querySelector("#cryptoList")
  var favCryptoLi = document.createElement('li');
  var favCryptoiEl = document.createElement('i')
  // favCryptoiEl.setAttribute("id", "favCrypto")
  favCryptoiEl.className ='fa fa-star'
  favCryptoiEl.textContent = cryptoList.value
  favCryptoLi.appendChild(favCryptoiEl)
  cryptoList.appendChild(favCryptoLi)
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
      console.log(stockArray[i].symbol);
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
            displayCryptoSearch(cryptoData)
            return cryptoData
          })

      }
    })
}

function displayCryptoSearch(cryptoData) {
  var cryptoSearch = document.querySelector('#cryptoSearch')

  var cryptoSearchValue = cryptoSearch.value
  console.log(cryptoSearchValue)

  var cryptoResult = cryptoSearchValue + ":" + " " + cryptoData.data.rates[cryptoSearchValue]
  console.log(cryptoResult);

  var featuredList = document.querySelector("#cryptoList")
  var featuredEl = document.createElement('li');

  featuredEl.textContent = cryptoResult;

  featuredList.appendChild(featuredEl);
}

