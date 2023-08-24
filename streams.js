const http = require('http');
const fs = require('fs');
const server = http.createServer((req, res)=> {
    //downloading file in bad way.
    const file = fs.readFileSync('smaple.txt');

    // downloadinf file in good way
    const readableStream = fs.createReadStream('sample.txt');
})

server.listen(3001 , function(){
    console.log('Server is running on port 3001');
})