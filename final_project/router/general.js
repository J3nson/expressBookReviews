const axios = require('axios');
const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({message: "Unable to register user. Username or password missing."});
    }

    let userExists = false;
    for (let i = 0; i < users.length; i++) {
        if (users[i].username === username) {
            userExists = true;
        }
    }

    if (userExists) {
        return res.status(404).json({message: "User already exists!"});
    }

    users.push({"username": username, "password": password});
    return res.status(200).json({message: "User successfully registered. Now you can login"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    return res.status(200).send(JSON.stringify(books[isbn], null, 4));
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    const isbns = Object.keys(books);
    let result = [];

    for (let i = 0; i < isbns.length; i++) {
        let isbn = isbns[i];
        if (books[isbn].author === author) {
            result.push(books[isbn]);
        }
    }

    return res.status(200).send(JSON.stringify(result, null, 4));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const isbns = Object.keys(books);
    let result = [];

    for (let i = 0; i < isbns.length; i++) {
        let isbn = isbns[i];
        if (books[isbn].title === title) {
            result.push(books[isbn]);
        }
    }

    return res.status(200).send(JSON.stringify(result, null, 4));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
});


async function getAllBooks() {
    try {
        const response = await axios.get('http://localhost:5000/');
        console.log(JSON.stringify(response.data, null, 4));
        return response.data;
    } catch (error) {
        console.log("Error fetching books: " + error.message);
    }
}

getAllBooks();
module.exports.general = public_users;
