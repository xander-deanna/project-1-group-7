let STKapiKey = 'U65M3D2LOCIOUFEM'
let STKIntradayURL = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&apikey=${STKapiKey}`
let STKSearchURL = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&apikey=${STKapiKey}`
let STKlst


fetch('stocks.json').then(response => response.json()).then(data => STKlst = data)

async function stockSearchHandler(event) {
    let query = document.getElementById('newsSearch').nodeValue
    let matches = STKgetSymbolSearch(query.replace(' ', ','))
    console.log(matches)
}

async function STKgetSymbolSearch(keywords) {
    return await (
        await fetch(`${STKSearchURL}&keywords=${keywords}`)
    ).json()
}

async function STKgetData(symbol, interval) {
    return await (
        await fetch(`${STKIntradayURL}&symbol=${symbol}&interval=${interval}`)
    ).json()
}