/*
Before your interview, write a program that runs a server that is accessible on http://localhost:4000/. 
When your server receives a request on http://localhost:4000/set?somekey=somevalue it should store the 
passed key and value in memory. When it receives a request on http://localhost:4000/get?key=somekey 
it should return the value stored at somekey.

During your interview, you will pair on saving the data to a file. 
You can start with simply appending each write to the file, 
and work on making it more efficient if you have time.
*/

import http from "http";
let data = new Map();

const server = http.createServer((req, res) => {
  const url = new URL(req.url ?? "", "http://localhost");
  const params = url.searchParams;

  switch (url.pathname) {
    case "/set":
      let keyName = "";
      params.forEach((value, key) => {
        keyName = key;
        data.set(key, value);
      });
      if (data.get(keyName)) {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.write(JSON.stringify("Key and value stored"));
        return res.end();
      } else {
        res.statusCode = 422;
        res.setHeader("Content-Type", "application/json");
        res.write(JSON.stringify("Error: key and value not stored"));
        return res.end();
      }
      break;
    case "/get":
      if (data.get(params.get("key"))) {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.write(JSON.stringify(data.get(params.get("key"))));
        console.log(data.get(params.get("key")));
      } else {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.write(JSON.stringify("Key not found"));
        console.log(data.get(params.get("key")));
      }
      return res.end();
      break;
  }
});

const port = 4000;
server.listen(port, () => console.log("Server is listening on port", port));
