
const fs = require('fs')
const http = require('http')
const { text } = require('stream/consumers')
const url = require('url')
const replaceTemplate = require('./modules/replaceTemplate');
const { default: slugify } = require('slugify');

//////////////////////////////////////////////////////////////////////////////////////////////


//                   LECTURE-8,9,10   FILES


//BLOCKING, SYNCHRONOUS WAY
// const textIn = fs.readFileSync('./text/input.txt','utf-8')
// // console.log(textfile)
// const textOut = `This is what we know about Javascript ${textIn}. \nCreated on ${Date.now()}`
// fs.writeFileSync('./text/output.txt', textOut);

// NON-BLOCKING, ASYNCHRONOUS WAY

// fs.readFile('./text/start.txt', 'utf-8', (err, data1) => {
//     fs.readFile(`./text/${data1}.txt`, 'utf-8', (err, data2) => {
//         console.log(data2);
//         fs.readFile('./text/append.txt', 'utf-8', (err, data3) => {
//             console.log(data3);
//             fs.writeFile('./text/final.txt', `${data2}\n${data3}`, 'utf-8', (err) => {
//                 console.log("Your file has been written!!")
//             })
//         });
//     });
// });
// console.log("Wow!!")
///////////////////////////////////////////////////////////////////


//LECTURE-11,12,13  Server


const tempOverview = fs.readFileSync('./templates/template-overview.html', 'utf-8')
const tempCard = fs.readFileSync('./templates/template-card.html', 'utf-8')
const tempProduct = fs.readFileSync('./templates/template-product.html', 'utf-8')
const data = fs.readFileSync('./dev-data/data.json', 'utf-8') //hum . ki jagah ${__dirname} bi likh sakte ha 
const dataObj = JSON.parse(data)
const slugs = dataObj.map((el) => (slugify(el.productName, {lower: true})))
console.log(slugs)
// console.log(slugify("Fresh Avocados", {lower: true}))

const server = http.createServer((req, res) => {
    // const {query, pathName} = url.parse(req.url, true) //learn and use chatGpt...wrong SYNTAX-->isme n bada nahi hona chaiye niche wala syntax sahi ha 
    // console.log(req.url)
    const { query, pathname } = (url.parse(req.url, true));//learn and use chatGpt
    // const pathName = req.url


    //Overview Page

    if (pathname === '/' || pathname === '/overview') {
        res.writeHead(200, { 'Content-type': 'text/html' });

        const cardsHtml = dataObj.map((el) => (replaceTemplate(tempCard, el))).join('');//Adding .join('') at the end of the code converts the array of HTML strings into a single string by concatenating all the elements together without any separator.
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);

        res.end(output)
        // res.end(tempOverview);
        // console.log(cardsHtml);

    }

    //Product Page
    
    else if (pathname === '/product') {
        res.writeHead(200, { 'Content-type': "text/html" });
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product);

        res.end(output);
    }

    //API
    else if (pathname === '/api') {


        res.writeHead(200, { 'content-type': 'application/json' })
        res.end(data);


    }

    //Not Found
    else {
        res.writeHead(404, { //response Headers->isko hum inspect me network me jake Headers me bi dekh sakte ha 
            'Content-type': 'text/html',
            'my-own-header': 'hello-world'
        });
        res.end("<h1>Page not found</h1>");
    }

});
server.listen(8000, '127.0.0.1', () => {
    console.log("Listening to request on port 8000")
});



