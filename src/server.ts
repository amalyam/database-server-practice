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
