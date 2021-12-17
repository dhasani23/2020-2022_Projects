const express = require("express");
const cors = require("cors");
const PORT = 8080;
const app = express();
const db = require("./firebase");
const axios = require("axios")
app.use(express.json());
app.use(cors({
    origin:true
}));

app.get('/', (req, res) => {
  res.send("testing get request")
})

app.post('/', (req, res) => {
  res.send("testing post request")
})

// https://www.googleapis.com/books/v1/volumes

app.get('/search/:title', (req, res) => {
    title = req.params.title
    const url = new URL("https://www.googleapis.com/books/v1/volumes");
    url.searchParams.append("q", title)
    axios.get(url.toString())
    .then( (response) => {
        res.send(response.data.items)
    })
})

app.get('/library', async function (req, res) {
    const booksArray = [];
    const allBooks = db.collection('books');
    const snapshot = await allBooks.get();
    snapshot.forEach(doc => {
        booksArray.push({...doc.data(), firestoreID: doc.id});
    })
    res.send(booksArray);
})

app.post('/add-book', async function (req, res) {
    const book = await db.collection("books").add(req.body.book);
    res.send("testing add book post request");
})

app.delete('/delete/:id', async function (req, res) {
    const result = await db.collection('books').doc(req.params.id).delete();
    res.send("Book with id = " + req.params.id + " has been deleted!");
})

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`)
});

