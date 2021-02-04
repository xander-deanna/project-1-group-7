var stocksListEl=document.getElementById("stocksList");

stockIndex=[]
// get top 5 news
function getStock(){
    
    var requestUrl =  'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=AMZN&apikey=U65M3D2LOCIOUFEM'
       

    console.log(requestUrl
    
);
    fetch(requestUrl )
      .then(function (response) {
        return response.json();
       })
       
      .then(function (data) {
        console.log("Stock data ", data)
      });

}

getStock();

