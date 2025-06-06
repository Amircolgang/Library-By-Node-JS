const http = require("node:http");
const fs = require("fs");
const url = require("url")
const db = require("./db.json")
const servere = http.createServer((req, res) => {
    if (req.url == "/api/users" && req.method == "GET") {
        fs.readFile("db.json", (err, db) => {
            if (err) {
                throw err
            }
            const data = JSON.parse(db);
            console.log(data)
            res.writeHead(200, { "Content-Type": "application/json" });
            res.write(JSON.stringify(data.users));
            res.end();
        });
    } else if (req.method == "DELETE") {
        const paresedURL = url.parse(req.url, true)
        const bookID = paresedURL.query.id
        const newBooks = db.books.filter(book => book.id != bookID
        )
        fs.writeFile(
            "db.json",
            JSON.stringify({ ...db, books: newBooks }),
            (err) => {
                if (err) {
                    throw err
                }
                res.write(JSON.stringify({ massage: "Booke Removed" }))
            }
        )
        res.end("Test")
    }
});

servere.listen(3000, () => {
    console.log("Server Run On Server 3000");
});
