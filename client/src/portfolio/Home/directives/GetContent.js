angular.module('Portfolio.Home')             // move it to Portfolio.Common it beleongs there,
                                                                     // since  its generic tmpl pull
 .directive('getcontent', function(CalculateOffsetService){
     
     let scope_ ; 
      console.log('GET CONTENT directive') 
     
     let linker = function(scope, elem, attrs, ctrl){
     
         scope_ = scope;
         console.log('GetContent side: ', scope.side.name)
     }

     return {
    
       restrict: 'A',
        link: linker,
        templateUrl: function(elem, attrs){
           
           console.log('getcontent elem **: ', elem)
           console.log('scope_ :', scope_); 
           return 'client/src/portfolio/Home/tmpl/home.html'
        }
     }
 })
