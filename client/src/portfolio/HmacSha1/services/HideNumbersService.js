angular.module('Portfolio.HmacSha1')
 .factory('HideNumbersService', function(){
   

    return function hideNumbers(){
     
      let hashNums = document.querySelectorAll('.hash-num'); 
      let len = hashNums.length;

      if( len === 0) return;
         
      for(let i = 0; i < len; i++){
        
           let num = angular.element(hashNums[i]);
           num.addClass('hash-num-hide');

          
      }
      

    }
 })
