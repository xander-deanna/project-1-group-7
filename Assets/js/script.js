var stocksListEl = document.getElementById("stocksList");






init()
stockIndex = []
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



getStock();


var cryptoListEl = document.getElementById("cryptoList");
// var for Coinbase API incase we need it
var newsAPIKey = '67bmTZaUz/0Nsah+bpGJI1MdycNvhwkI9n8Al60/0Cm0m0usl58LHNcstFwFwwGeefj8UjbB299FywcC2zJk/w=='


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


var cryptoFavSearch = document.querySelector("#cryptofav");

cryptoFavSearch.addEventListener('click', function(){
  var cryptoList = document.querySelector("#cryptoList")
  var favCryptoLi = document.createElement('li');
  var favCryptoiEl = document.createElement('i')
  // favCryptoiEl.setAttribute("id", "favCrypto")
  favCryptoiEl.className ='far fa-star'
  favCryptoiEl.textContent = cryptoList.value
  favCryptoLi.appendChild(favCryptoiEl)
  cryptoList.appendChild(favCryptoLi)
})

function init(){
  return $('#favsModal').foundation('open')


}