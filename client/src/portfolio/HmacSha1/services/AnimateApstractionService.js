angular.module('Portfolio.HmacSha1')
 .factory('AnimateApstractionService', function(){

     // get all 3 dotted border elements
     // add css classes 
     let rows = []
     rows.push(angular.element('#r1'));
     rows.push(angular.element('#r2'));
     rows.push(angular.element('#r3'));
     
     function jqClass(action){           // uses jquery addClass or removeClass
        let command = action + 'Class';  // make jquery function name
        for (let i in rows){
          let k = Number(i);
             rows[i][command]('border-color-'+ (++k)) // adds or removes css class
        }

     }

     return function animateApstraction(){
       
      
            jqClass('add');

        let interval = 700;
        setTimeout(function(){
            jqClass('remove');
        }, interval += 120)
     }

 })
