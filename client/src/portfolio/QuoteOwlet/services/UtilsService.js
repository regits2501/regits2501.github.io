angular.module('Portfolio.QuoteOwlet')
  .service('UtilsService', function () {

    let utils = this;

    utils.parseQuote = function (response) {      // Parses quote text and quote author from string 

      let quoteText = '',
        quoteAuthor = '',
        quotes = response.data;

      if (quotes.length !== 0) {

        let quote = quotes[0];
        quoteText = quote.q;
        quoteAuthor = quote.a;
      }
      else {
        console.log('There is no quote string from server ...');
        return;
      }

      return { 'text': quoteText, 'author': quoteAuthor }; // return quote text and quote author
    }

  })
