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
    } else if (req.method == "DELETE" && req.url.startsWith == "/api/books") {
        const paresedURL = url.parse(req.url, true)
        const bookID = paresedURL.query.id
        const newBooks = db.books.filter(book => book.id != bookID)

        console.log(newBooks.length === db.books.length)
        console.log(db.books.length)
        console.log(newBooks.length)
        if (newBooks.length === db.books.length) {
            res.writeHead(401, { "Content-Type": "application/json" })
            res.write("Book Not Found :(")
            res.end()
        }
        else {
            fs.writeFile(
                "db.json",
                JSON.stringify({ ...db, books: newBooks }),
                (err) => {
                    if (err) {
                        throw err
                    }
                    res.writeHead(200 , {"Content-Type" : "appliaction/json"})
                    res.write(JSON.stringify({ massage: "Booke Removed" }))
                    res.end()
                }
            )

        }
        res.end("Remove Is Resolve")
    }
});

servere.listen(3000, () => {
    console.log("Server Run On Server 3000");
});
