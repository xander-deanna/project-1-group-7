var renderStockDiv=document.getElementById("render-stock");

renderStockList();


function renderStockList(){
  var stocksymbol=["AMZN", "IBM","DIS"]
  for (var i=0; i < 2; i++){
    var symbol=stocksymbol[i];
    getStocks(symbol, i);
  }
}

function getStocks(symbol, i){
    console.log(symbol);
    var requestUrl =  'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=' + symbol + '&apikey=U65M3D2LOCIOUFEM'  
       

    console.log(requestUrl);
    

    fetch(requestUrl )
      .then(function (response) {
        return response.json();
       })
       
      .then(function (data) {
        console.log("Stock data ", data)
        
        var lastStock=(data['Time Series (Daily)']);
        
         console.log("last stock id :", lastStock);
         console.log("last stock at index 1",lastStock[1] );
         console.log("key ",Object.keys(lastStock));
         var objKeys=Object.keys(lastStock);
        var propOfLastEntry=objKeys.shift();
        
          console.log("propofLastEntry ",propOfLastEntry);
        var lastStocktorender=lastStock[propOfLastEntry];
          console.log("Last stock object ",lastStocktorender);
        var rowEl=document.createElement("div");
        rowEl.classList.add("row");
        
        
        
        var symbolEl=document.createElement("div");
        symbolEl.classList.add("columns");
        
        symbolEl.classList.add("small-2");
        symbolEl.textContent=symbol;
        
        rowEl.append(symbolEl);
        var symbolE2=document.createElement("div");
        symbolE2.classList.add("columns");
        var objValOpen=Number(lastStocktorender['1. open']);
        symbolE2.textContent=objValOpen.toFixed(2);
        symbolE2.classList.add("small-2");
        rowEl.append(symbolE2);
        var symbolE3=document.createElement("div");
        symbolE3.classList.add("columns");
        var objValhigh=Number(lastStocktorender['2. high']);
        symbolE3.textContent=objValhigh;
        symbolE3.classList.add("small-2");
        rowEl.append(symbolE3);
        var symbolE4=document.createElement("div");
        symbolE4.classList.add("columns");
        var objValLow=Number(lastStocktorender['3. low']);
        symbolE4.textContent=objValLow;
        symbolE4.classList.add("small-2");
        rowEl.append(symbolE4);
        var symbolE5=document.createElement("div");
        symbolE5.classList.add("columns");
        var objValClose=Number(lastStocktorender['4. close']);
        symbolE5.textContent=objValClose;
        symbolE5.classList.add("small-2");
        rowEl.append(symbolE5);
        var symbolE6=document.createElement("div");
        symbolE6.classList.add("columns");
        var objValVolume=Number(lastStocktorender['5. volume']);
        symbolE6.textContent=objValVolume;
        symbolE6.classList.add("small-2");
        rowEl.append(symbolE6);
        renderStockDiv.append(rowEl);
      });
}



var cryptoListEl=document.getElementById("cryptoList");
// var for Coinbase API incase we need it
var newsAPIKey='67bmTZaUz/0Nsah+bpGJI1MdycNvhwkI9n8Al60/0Cm0m0usl58LHNcstFwFwwGeefj8UjbB299FywcC2zJk/w=='


// Fetch for Crypto
function getCrypto(){
    var requestUrl ='https://api.coinbase.com/v2/exchange-rates';
    // console.log(requestUrl);
    fetch(requestUrl)
      .then(function (response) {
        return response.json();
       })
       
      .then(function (data) {
        // console.log("Crypto data", data)
      });
}
getCrypto();


