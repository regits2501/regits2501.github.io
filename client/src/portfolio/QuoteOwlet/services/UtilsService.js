angular.module('Portfolio.QuoteOwlet')
 .service('UtilsService', function(){
    
     let utils = this;

     utils.parseQuote = function(response){      // Parses quote text and quote author from string 
       if(response.data.length !== 0){
         let q = response.data             // Take string that server has sent
                                            // Server response is in text format like bellow:
                                            // This is the quote string. (Here goes the author)  
         
         let quoteEnd = (q.indexOf("(") === -1) ? q.length : (q.indexOf("(") - 1); // Get index of the "(" - 1. 
                                                                                   // Emty space before "(" .
         var quoteText = q.substring(0,quoteEnd);   // Get quote string up to dot(including).
        
         let authorEnd = q.indexOf(")");
         var quoteAuthor = "";

         if(authorEnd !== -1) quoteAuthor = q.substring(quoteEnd+2, authorEnd);// Get author string, 
                                                                               // up to ")" . If there is one.
       }
       else{
           console.log('There is no quote string from server ...');
           return;  
       }
        
       return { 'text': quoteText , 'author': quoteAuthor}; // return quote text and quote author
     }
     
 })
