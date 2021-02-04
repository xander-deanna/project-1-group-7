let newsApiKey = '8b50cf18f1f349ef9cbcfe1da08d1537' // lol

getNews('hi').then(data => console.log(data))

function newsSearchHandler(event) {
    let query = document.getElementById('newsSearch').nodeValue
    getNews(query).then(data => {

    })
}

async function getNews(q) {
    let date = new Date()
    return await (
        await fetch(`http://newsapi.org/v2/everything?q=${q}&from=${date.getFullYear()}-${date.getMonth}-${date.getDay()}&sortBy=publishedAt&apiKey=${newsApiKey}`) 
    ).json()
}