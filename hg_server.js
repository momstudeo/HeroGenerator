var http = require('http');
var fs = require('fs');
var path = require('path');

var mime = {
  ".html": "text/html",
  ".css" : "text/css",
  ".js" : "text/javascript",
  ".png" : "image/png",
  ".ico" : "image/x-icon"
};


var server = http.createServer();
server.on('request',doRequest);


function doRequest(req, res){
  if(req.url == '/'){
    filePath = '/index.html';
  }else{
    filePath = req.url;
  }

  var fullPath = __dirname + filePath;
  console.log(`path=${filePath}`);
  console.log(`mime-type = ${mime[path.extname(fullPath)]}`);
  res.writeHead(200,{'Content-Type': mime[path.extname(fullPath)] || "text/plain"});
  fs.readFile(fullPath, readText);

  function readText(err, data){
    res.write(data);
    res.end();
  }
}

server.listen(process.env.PORT || 8080, ()=>{
  console.log(`Server running at http://${hostname}:${port}/`);
});
