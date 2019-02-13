angular.module('Portfolio.QuoteOwlet')
 .service('AnimationService', function(){
     
     let  animation = this;

     animation.preQuote = function(num){  // adds css class to a given quote elements specified with 'num'
        this[num] = {};
  
        this[num].quote  = angular.element(document.querySelector('#_'+ num));           // Get quote element
        this[num].text   = angular.element(document.querySelector('#_'+ num + " .text"));// Text of quote in 'num'
        this[num].author = angular.element(document.querySelector('#_'+ num + " .author")); // Author of quote ..
        // console.log('quote Animation ::: ', quote);
        // add on click animations
       
        this[num].quote.addClass('quote-on-click') 
        this[num].text.addClass('text-on-click');
        this[num].author.addClass('author-on-click')
     };

 
     animation.postQuote = function(num){
        this[num].quote.removeClass('quote-on-click');
        this[num].text.removeClass('text-on-click');
        this[num].author.removeClass('author-on-click');
     };
         
     
 })
