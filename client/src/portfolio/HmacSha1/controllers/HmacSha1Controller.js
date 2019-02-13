angular.module('Portfolio.HmacSha1')
 .controller('HmacSha1Controller', function(AnimateHashNumbersService, AnimateApstractionService, HideNumbersService){

    let hs1Ctrl= this;
   
    hs1Ctrl.animateHashNumbers = function (){ 
       AnimateApstractionService(); 
       
       setTimeout(function(){
         HideNumbersService();
       }, 460);

       setTimeout(function(){
          AnimateHashNumbersService();
       },750);
   }
 })
