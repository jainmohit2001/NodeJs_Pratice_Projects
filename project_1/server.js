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
    let uri = url.parse(req.url).pathname; //the file
    console.log(url.parse(req.url), url.parse(req.url).pathname, req.url)
    let filename = path.join(__dirname, unescape(uri)); //path to file
    console.log(filename)
    let stats;

    try{
        stats = fs.lstatSync(filename); // it will create an fs.lstat object that will help us to determine if it is a file or a directory
    }
    catch (e) { //if it is neither file nor directory than catch the error
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.write('404 not found');
        res.end();
        return;
    }

    if(stats.isFile()){ //if the object is file
        let mimeType = mimeTypes[path.extname(filename).split(".").reverse()[0]]; //find out the the extension/ mimetype of the file
        res.writeHead(200, {'Content-Type': mimeType}) //the output will be set to handle the language of the file

        let fileStream = fs.createReadStream(filename); //reads the file
        fileStream.pipe(res); //pipe the file into output
    } else if(stats.isDirectory()){ //if the object is a directory
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.write('Index of ' + uri +'\n');
        res.end();
        return;
    } else{ // other error
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.write('500 Internal Server error\n');
        res.end();
        return;
    }
}).listen(3000); //listen at the port 3000