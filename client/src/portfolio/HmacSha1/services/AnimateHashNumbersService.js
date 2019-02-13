angular.module('Portfolio.HmacSha1')
 .factory('AnimateHashNumbersService', function($window, CreateHashStringService){

     // take element that will contain numbers 
     // produce hash string of 40 chars
     // add numbers one by one to container
     // add css classes to numbers
    return function animateHashNumbers(){

       let windowSize = angular.element($window).innerWidth();
       let hash_El = angular.element(document.querySelector('.hash')) // get reference of container
       let hash    = CreateHashStringService();                       // generate hash numbers

       if(windowSize < 414) hash = hash.slice(0,-5);           // cut off last 5 numbers (so string can fit
                                                                // screen without having to decrese font size)
       hash_El.empty();    // remove eny previous hash numbers

       let interval = 0;  // 
       
       for(let i in hash){

              hash_El.append('<span class="hash-num" id="h_'+i +'">'+ hash[i] +'</span>'); // append a number
              let span = angular.element(document.querySelector('#h_'+i));                 
              
             setTimeout(function() {
                 span.addClass('drop-number');
              }, interval +=60 )               // every 60 ms drop a number

       }
    }
  
 })
