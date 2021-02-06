var stocksListEl = document.getElementById("stocksList");

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
    // featuredEl.textContent = featuredCurrency.value
    featuredList.appendChild(featuredEl);

  }

  /*// pulls item from topCrypto array
  var topCryptoOneName = topCrypto[0]
  console.log(topCryptoOneName)
  //  pulls the current exchange rate from the data based on the currency abbreviation
  var topCryptoOneRate = cryptoData.data.rates[topCrypto[0]]
  console.log(topCryptoOneRate)

  var topCryptoTwoName = topCrypto[1]
  console.log(topCryptoTwoName)
  var topCryptoTwoRate = cryptoData.data.rates[topCrypto[1]]
  console.log(topCryptoTwoRate)

  var topCryptoThreeName = topCrypto[2]
  console.log(topCryptoThreeName)
  var topCryptoThreeRate = cryptoData.data.rates[topCrypto[2]]
  console.log(topCryptoThreeRate)

  var topCryptoFourName = topCrypto[3]
  console.log(topCryptoFourName)
  var topCryptoFourRate = cryptoData.data.rates[topCrypto[3]]
  console.log(topCryptoFourRate)

  var topCryptoFiveName = topCrypto[4]
  console.log(topCryptoFiveName)
  var topCryptoFiveRate = cryptoData.data.rates[topCrypto[4]]
  console.log(topCryptoFiveRate)


  // combines currency abbreviation and its current exchange rate
  var trendingCryptoOne = [
    topCryptoOneName + ":" + " " + topCryptoOneRate
  ]
  console.log(trendingCryptoOne);
  // adds combined currency and rate to HTML
  var firstFeature = document.querySelector("#featureone")
  firstFeature.textContent = trendingCryptoOne;

  var trendingCryptoTwo = [
    topCryptoTwoName + ":" + " " + topCryptoTwoRate
  ]
  console.log(trendingCryptoTwo);
  var secondFeature = document.querySelector("#featuretwo")
  secondFeature.textContent = trendingCryptoTwo;


  var trendingCryptoThree = [
    topCryptoThreeName + ":" + " " + topCryptoThreeRate
  ]
  console.log(trendingCryptoThree);
  var thirdFeature = document.querySelector("#featurethree")
  thirdFeature.textContent = trendingCryptoThree;


  var trendingCryptoFour = [
    topCryptoFourName + ":" + " " + topCryptoFourRate
  ]
  console.log(trendingCryptoFour);
  var fourthFeature = document.querySelector("#featurefour")
  fourthFeature.textContent = trendingCryptoFour;


  var trendingCryptoFive = [
    topCryptoFiveName + ":" + " " + topCryptoFiveRate
  ]
  console.log(trendingCryptoFive);
  var fifthFeature = document.querySelector("#featurefive")
  fifthFeature.textContent = trendingCryptoFive;*/



}
