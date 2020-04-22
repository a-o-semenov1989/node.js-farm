const fs = require('fs'); //сохраняем модуль в переменную для его импортирования и использования
const http = require('http');
const url = require('url');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8'); //указываем навзание директории
const dataObj = JSON.parse(data); //парсим json в JS объект или массив


const server = http.createServer((req, res) => { //принимает колбэк, в которыи передаем переменные request и response. В случае получения запроса - отправим ответ
    const pathName = req.url;
    
    if (pathName === '/' || pathName === '/overview') {
        res.end('This is the overview'); //отправляем ответ клиенту
    } else if(pathName === '/product') {
        res.end('This is the product');
    } else if(pathName === '/api') {
        res.writeHead(200, { 'Content-type': 'application/json' }); //указываем код 200 = ок, тип контента json
        res.end(data);
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

