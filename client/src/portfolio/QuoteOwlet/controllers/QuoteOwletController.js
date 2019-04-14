angular.module('Portfolio.QuoteOwlet')
 .controller('QuoteOwletCtrl', function($scope, GetQuoteModel, AnimationService){ // GetQuote MODEl
    
      let owletCtrl = this;

      owletCtrl.quotes = {
         '1': { 
             text: "Setting an example is not the main means of influencing another, it is the only means.",
             author:'Albert Einstein'
         },
         '2': {
            text:'What lies behind us and what lies before us are small matters compared to what lies within us. ',
            author:'Oliver Holmes'
         },
         '3': {
            text:'I am always doing that which I cannot do, in order that I may learn how to do it.',
            author: 'Pablo Picaso',
         },
         '4': {
            text:'When I let go of what I am, I become what I might be. ',
            author:'Lao Tzu'
         }
      }
     

      owletCtrl.updateQuote = function(num) {
           GetQuoteModel()
           .then(function(quote){
               
                setTimeout(function(){                   // delay model update while post quote animation lasts
                   $scope.$apply(function(){

                      AnimationService.postQuote(num);     // css animation after we get quote data
                      this.quotes[num].text   = quote.text;
                      this.quotes[num].author = quote.author;
                   }.bind(owletCtrl))
                }, 400);
                  
           }.bind(this)
            , function(err){
               console.log('GetQuoteModel error: ', err );
           }) 
                  
           AnimationService.preQuote(num);           // css animation before we get quote data
      } 
 })
