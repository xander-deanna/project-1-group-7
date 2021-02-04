var newsListEl=document.getElementById("newsList");

var newsAPIKey='8b50cf18f1f349ef9cbcfe1da08d1537'
// get top 5 news
function getNews(){
    console.log(newsAPIKey);
    var requestUrl ='http://newsapi.org/v2/top-headlines?' + 
         'country=us&' + 'apiKey=8b50cf18f1f349ef9cbcfe1da08d1537';
    console.log(requestUrl);
    fetch(requestUrl)
      .then(function (response) {
        return response.json();
       })
       
      .then(function (data) {
        console.log("News data ", data)
      });
}
getNews();


var cryptoListEl=document.getElementById("cryptoList");
// var for Coinbase API incase we need it
var newsAPIKey='67bmTZaUz/0Nsah+bpGJI1MdycNvhwkI9n8Al60/0Cm0m0usl58LHNcstFwFwwGeefj8UjbB299FywcC2zJk/w=='

// Fetch for Crypto
function getCrypto(){
    var requestUrl ='https://api.coinbase.com/v2/exchange-rates';
    console.log(requestUrl);
    fetch(requestUrl)
      .then(function (response) {
        return response.json();
       })
       
      .then(function (data) {
        console.log("Crypto data", data)
      });
}
getCrypto();


