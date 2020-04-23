const fs = require('fs'); //сохраняем модуль в переменную для его импортирования и использования
const http = require('http');
const url = require('url');

const replaceTemplate = require('./modules/replaceTemplate'); //в импорте можно не указывать расширение фаила и . является корневои папкои

//Server
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8'); //tip level code, выполняемыи только раз, поэтому мы можем использовать синхронную функцию
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8'); //указываем навзание директории
const dataObj = JSON.parse(data); //парсим json в JS объект или массив

const server = http.createServer((req, res) => { //принимает колбэк, в которыи передаем переменные request и response. В случае получения запроса - отправим ответ
    
    const { query, pathname } = url.parse(req.url, true); //парсим query, pathname из url

//Overview page    
    if (pathname === '/' || pathname === '/overview') {
        res.writeHead(200, { 'Content-type': 'text/html' });
        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join(''); //проходимя мапом по объекту, map принимает колбэк, в которыи мы передаем аргументами элемент массива. replaceTemplate принимает карточки и текущии элемент. На каждои итерации цикла заменяются темплеиты на карточки текущего продукта (el). Стрелочная функция возвращает результат, как если бы там был return //полученныи массив мы join добавляем в пустую строку, таким образом получая строку 
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml); //tempOverview строка, содержащая html, в неи меням темплеит на полученные карточки
        res.end(output); //отправляем ответ клиенту

//Product page
    } else if(pathname === '/product') {
        res.writeHead(200, { 'Content-type': 'text/html' });
        const product = dataObj[query.id]; //присваиваем продукту объект по позиции аиди из массива dataObj
        const output = replaceTemplate(tempProduct, product); //заменяем с помощью функции темплеит продукта на полученныи по аиди продукт
        res.end(output);

//API        
    } else if(pathname === '/api') {
        res.writeHead(200, { 'Content-type': 'application/json' }); //указываем код 200 = ок, тип контента json
        res.end(data);

//Not found
    } else{
        res.writeHead(404, {  //обязательно указываем код ошибки и хедер до отправки ответа //первыи аргумент - код ответа, второи - его тип - браузер будет ожидать html
            'Content-type': 'text/html',
            'my-own-header': 'Hello World!' //указываем свои созданныи хедер
        }); 
        res.end('<h1>Page not found</h1>'); //отправляем ответ html
    }  
});

server.listen(8000, '127.0.0.1', () => { //listen принимает параметры: порт и хост и опциональныи аргумент - колбэк, которыи запуститься когда сервер начнет слушать
    console.log('Listening to requests on port 8000');
}); 

