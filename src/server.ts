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
  let response: {
    key?: string;
    value?: string;
    message?: string;
  } = {};

  switch (url.pathname) {
    case "/set":
      let keyName = "";
      params.forEach((value, key) => {
        keyName = key;
        data.set(key, value);
      });

      if (data.has(keyName)) {
        res.statusCode = 200;
        response = {
          message: "Key and value stored",
          key: keyName,
          value: data.get(keyName),
        };
      } else {
        res.statusCode = 422;
        response = { message: "Error: key and value not stored" };
      }
      break;
    case "/get":
      const key = params.get("key") || undefined;
      if (data.has(key)) {
        res.statusCode = 200;
        response = {
          message: "Key and value found",
          key,
          value: data.get(key),
        };
      } else {
        res.statusCode = 400;
        response = { message: "Error: key not found", key };
      }
      break;
  }

  res.setHeader("Content-Type", "application/json");
  res.write(JSON.stringify(response));
  return res.end();
});

const port = 4000;
server.listen(port, () => console.log("Server is listening on port", port));
