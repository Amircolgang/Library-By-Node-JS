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
    } else if (req.method == "GET" && req.url.startsWith("/api/books")) {
        fs.readFile("db.json", (err, db) => {
            if (err) {
                throw err
            }

            let data = JSON.parse(db)
            res.writeHead(200, { "Content-Type": "application/json" });
            res.write(JSON.stringify(data.books))
            res.end()
            console.log(JSON.stringify(data))
            console.log(data)

        })
    } else if (req.method == "DELETE" && req.url.startsWith("/api/books")) {
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
                    res.writeHead(200, { "Content-Type": "appliaction/json" })
                    res.write(JSON.stringify({ massage: "Booke Removed" }))
                    res.end()
                }
            )

        }
        res.end("Remove Is Resolve")
    } else if (req.method == "POST" && req.url.startsWith("/api/books")) {
        let clientBook = ""

        req.on("data", (data) => {
            clientBook = clientBook + data.toString()
        })

        req.on("end", () => {
            const parsClientBooks = JSON.parse(clientBook)

            const newBook = {
                id: global.crypto.randomUUID(), ...parsClientBooks, free: 1
            }

            db.books.push(newBook)

            console.log(newBook)
            fs.writeFile("db.json", JSON.stringify(db), (err) => {
                if (err) {
                    throw err
                }

                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify({ message: "New Book Is succes Fully :)" }));
                res.end();
            })


        })
    } else if (req.method == "PUT" && req.url.startsWith("/api/books")) {
        const paresedURL = url.parse(req.url, true)
        const bookID = paresedURL.query.id
        let putBooks = ""
        req.on("data", (data) => {
            putBooks = putBooks + data.toString()
        })

        req.on("end", () => {
            let reqBody = JSON.parse(putBooks)
            db.books.forEach(book => {
                if (book.id == Number(bookID)) {
                    book.title = reqBody.title,
                        book.author = reqBody.author,
                        book.title = reqBody.title
                }
            })

            fs.writeFile("db.json", JSON.stringify(db), (err) => {
                if (err) {
                    throw err
                }

                res.writeHead(200, { "Content-Type": "application/json" })
                res.write(JSON.stringify({ meesage: "Updata Is Succes Fully :)" }))
                res.end()
            })
        })

    } else if (req.method == "PUT" && req.url.startsWith("/api/users/upgrad")) {
        let parsedUrl = url.parse(req.url, true)
        let parsedId = parsedUrl.query.id
        let roleDataUser = "";
        req.on("data", (data) => {
            roleDataUser += data.toString()
        })

        req.on("end", (err) => {
            if (err) {
                throw err
            }
            const { role } = JSON.parse(roleDataUser)
            console.log(parsedId)
            db.users.forEach(user => {
                if (user.id === Number(parsedId)) {
                    user.role = role
                }
            })

            fs.writeFile("db.json", JSON.stringify(db), (err) => {
                if (err) {
                    throw err
                }

                res.writeHead(201, { "Content-Type": "application/json" })
                res.write(JSON.stringify({ message: "The youser Role Upgareded :)" }))
                res.end()
            })
        })
    } else if (req.method == "POST" && req.url.startsWith("/api/users")) {
        let userClientPost = ""
        req.on("data", (data) => {
            userClientPost = userClientPost + data.toString()
        })
        req.on("end", () => {
            const { name, username, email } = JSON.parse(userClientPost)
            const existUSer = db.users.find(user => user.name === name || user.username === username || user.email === email)
            if (existUSer) {
                res.writeHead(409, { "Content-Type": "application/json" })
                res.write(JSON.stringify({ message: "User Alredy eited :(" }))
                res.end()
            }
            else if (name == " " || username == " " || email == " ") {
                res.writeHead(401, { "Content-Type": "application/json" })
                res.write(JSON.stringify({ message: "USer Created Note Succes Fully email or username is empty " }))
                res.end()
            } else {
                const newUser = {
                    id: global.crypto.randomUUID()
                    , name,
                    username,
                    email,
                    crime: 0
                }
                const newUserData = db.users.push(newUser)
                fs.writeFile("db.json", JSON.stringify(newUserData), (err) => {
                    if (err) {
                        throw err
                    }
                })
                res.writeHead(422, { "Content-Type": "application/json" })
                res.write(JSON.stringify({ message: "USer Created Succes Fully" }))
                res.end()
            }

        })
    } else if (req.method == "PUT" && req.url.startsWith("/api/users")) {
        const parsedURL = url.parse(req.url, true)
        const idUsers = parsedURL.query.id
        let dataUSer = ""
        req.on("data", (data) => {
            dataUSer += data.toString()
        })

        req.on("end", (err) => {
            if (err) {
                throw err
            }
            const { crime } = JSON.parse(dataUSer)
            db.users.forEach(user => {
                if (user.id === Number(idUsers)) {
                    user.crime = crime
                }
            })

            fs.writeFile("db.json", JSON.stringify(db), (err) => {
                if (err) {
                    throw err
                }

                res.writeHead(200, { "Content-Type": "application/json" })
                res.write(JSON.stringify({ message: "Put The User is Succes Fully User Updata :) " }))
                res.end()
            })
        })

    }
});

servere.listen(3000, () => {
    console.log("Server Run On Server 3000");
});
