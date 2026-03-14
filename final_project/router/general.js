const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Unable to register user." });
  }

  if (!isValid(username)) {
    return res.status(404).json({ message: "User already exists!" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User successfully registered. Now you can login" });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  return res.json(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const booksByAuthor = Object.keys(books)
    .filter((isbn) => books[isbn].author === author)
    .reduce((result, isbn) => {
      result[isbn] = books[isbn];
      return result;
    }, {});

  return res.json(booksByAuthor);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const booksByTitle = Object.keys(books)
    .filter((isbn) => books[isbn].title === title)
    .reduce((result, isbn) => {
      result[isbn] = books[isbn];
      return result;
    }, {});

  return res.json(booksByTitle);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  return res.json(books[isbn].reviews);
});

// Task 10: Get all books using async/await with Axios
public_users.get('/async/books', async function (req, res) {
  try {
    const response = await axios.get(`${req.protocol}://${req.get('host')}/`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Unable to fetch books." });
  }
});

// Task 11: Get book by ISBN using Promises with Axios
public_users.get('/promise/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  axios
    .get(`${req.protocol}://${req.get('host')}/isbn/${encodeURIComponent(isbn)}`)
    .then((response) => res.status(200).json(response.data))
    .catch(() => res.status(500).json({ message: "Unable to fetch book by ISBN." }));
});

// Task 12: Get books by author using Promises with Axios
public_users.get('/promise/author/:author', function (req, res) {
  const author = req.params.author;

  axios
    .get(`${req.protocol}://${req.get('host')}/author/${encodeURIComponent(author)}`)
    .then((response) => res.status(200).json(response.data))
    .catch(() => res.status(500).json({ message: "Unable to fetch books by author." }));
});

// Task 13: Get books by title using Promises with Axios
public_users.get('/promise/title/:title', function (req, res) {
  const title = req.params.title;

  axios
    .get(`${req.protocol}://${req.get('host')}/title/${encodeURIComponent(title)}`)
    .then((response) => res.status(200).json(response.data))
    .catch(() => res.status(500).json({ message: "Unable to fetch books by title." }));
});

module.exports.general = public_users;
