const http = require("node:http");
const fs = require("fs");
const servere = http.createServer((req, res) => {
  if (req.url == "/api/users" && req.method == "GET") {
    fs.readFile("db.json", (err, db) => {
        if(err){
            throw err
        }
        const data = JSON.parse(db);
        console.log(data)

      res.writeHead(200, { "Content-Type": "application/json" });
      res.write(JSON.stringify(data.users));
      res.end();
    });
  }
});

servere.listen(3000, () => {
  console.log("Server Run On Server 3000");
});
