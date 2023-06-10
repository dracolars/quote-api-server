const express = require("express");
const app = express();

const { quotes } = require("./data");
const { getRandomElement } = require("./utils");

const PORT = process.env.PORT || 4001;

app.use(express.static("public"));

app.get("/api/quotes/random", (req, res, next) => {
  let randomQuote = getRandomElement(quotes);
  res.send({ quote: randomQuote });
});

//  '/api/quotes'   or    '/api/quotes?person="Some Name'
app.get("/api/quotes", (req, res, next) => {
  let authorQuery = req.query.person;

  // if no author
  if (!authorQuery) {
    res.send({ quotes: quotes });
  }
  // if author typed
  else {
    let quotesByAuthor = quotes.filter((quote) => {
      if (quote.person == authorQuery) {
        return quote;
      }
    });
    if (quotesByAuthor) {
      res.send({ quotes: quotesByAuthor });
    } else {
      // if author not found
      res.status(404).send([]);
    }
  }
});

// '/api/quotes?quote="Some Quote"&author="Author's Name"
app.post("/api/quotes", (req, res, next) => {
  let quote = req.query.quote;
  let person = req.query.person;
  if (quote && person) {
    let quoteObject = { quote: quote, person: person };
    quotes.push(quoteObject);
    res.status(201).send({ quote: quoteObject });
  } else {
    res.status(400).send();
  }
});

// start express server
app.listen(PORT, () => {
  console.log("Listening on:" + " http://localhost:" + PORT);
});
