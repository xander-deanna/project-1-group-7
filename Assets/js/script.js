var stocksListEl = document.getElementById("stocksList");

stockIndex = []
function getStock() {

  var requestUrl = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=AMZN&apikey=U65M3D2LOCIOUFEM'

  console.log(requestUrl);

  fetch(requestUrl)
    .then(function (response) {

      if (response.ok) {
        return response.json()
          .then(function (data) {
            if (data["Error Message"]) {
              return $('#errorModal').foundation('open')
            }
            console.log(data)
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
      if (response.ok) {
        return response.json()
          .then(function (data) {
            if (data["Error Message"]) {
              return $('#errorModal').foundation('open')
            }
            console.log(data)
          })

      }
})
}
getCrypto()


