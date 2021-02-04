// var newsListEl=document.getElementById("newsList");

// var newsAPIKey='8b50cf18f1f349ef9cbcfe1da08d1537'
// // get top 5 news
// function getNews(){
//     console.log(newsAPIKey);
//     var requestUrl ='http://newsapi.org/v2/top-headlines?' + 
//          'country=us&' + 'apiKey=8b50cf18f1f349ef9cbcfe1da08d1537';
//     console.log(requestUrl);
//     fetch(requestUrl)
//       .then(function (response) {
//         return response.json();
//        })
       
//       .then(function (data) {
//         console.log("News data ", data)
//       });
// }
// getNews();

fetch('http://api.datanews.io/v1/news?q=SpaceX&from=2020-07-01&to=2020-09-10&language=en&apiKey=0aszfc72ctgxr4e947mg1sr67', {
    method: 'get',
    headers: {
        'Access-Control-Allow-Origin': '*'    
    }
}).then(response => response.json()).then(data =>console.log(data))

// var cryptoListEl=document.getElementById("cryptoList");
// // var for Coinbase API incase we need it later
// var newsAPIKey='67bmTZaUz/0Nsah+bpGJI1MdycNvhwkI9n8Al60/0Cm0m0usl58LHNcstFwFwwGeefj8UjbB299FywcC2zJk/w=='

// // Fetch for Crypto
// function getCrypto(){
//     var requestUrl ='https://api.coinbase.com/v2/exchange-rates';
//     console.log(requestUrl);
//     fetch(requestUrl)
//       .then(function (response) {
//         return response.json();
//        })
       
//       .then(function (data) {
//         console.log("Crypto data", data)
//       });
// }
// getCrypto();
