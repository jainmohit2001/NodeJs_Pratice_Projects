// require modules
const http = require('http'),
    path = require('path'),
    fs = require('fs'),
    url = require('url');

// array of mime types
const mimeTypes = {
    "html": "text/html",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "png": "image/png",
    "js": "text/javascript",
    "css": "text/css"
};
// Create server
http.createServer((req, res) => {
    let uri = url.parse(req.url).pathname;
    console.log(url.parse(req.url), url.parse(req.url).pathname, req.url)
    let filename = path.join(__dirname, unescape(uri));
    console.log(filename)
    let stats;

    try{
        stats = fs.lstatSync(filename);
    }
    catch (e) {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.write('404 not found');
        res.end();
        return;
    }

    if(stats.isFile()){
        let mimeType = mimeTypes[path.extname(filename).split(".").reverse()[0]];
        res.writeHead(200, {'Content-Type': mimeType})

        let fileStream = fs.createReadStream(filename);
        fileStream.pipe(res);
    } else if(stats.isDirectory()){
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.write('Index of ' + uri +'\n');
        res.end();
        return;
    } else{
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.write('500 Internal Server error\n');
        res.end();
        return;
    }
}).listen(3000);