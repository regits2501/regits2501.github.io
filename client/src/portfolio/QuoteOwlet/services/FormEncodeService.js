angular.module('Portfolio.QuoteOwlet')
 .factory('FormEncodeService', function($window){

     function formEncode(dataObj, spaces){
        var pairs = [];
        var value;
        var key;
        var type;

        for(var name in dataObj){
            type = typeof dataObj[name];

             if(dataObj.hasOwnProperty(name) && type !== "function" && dataObj[name] !== "null"){ // only props 
                                                                                                 // in dataObj 

                  let encodeURIComponent = $window.encodeURIComponent

                  key = encodeURIComponent(name);   // encode property name

                  if(type === 'object'){                         
                     value = formEncode(dataObj[name], spaces); // form encode object
                     value = encodeURIComponent(value)          // since return value is string, uri encode it
                  }                      
                  else value = encodeURIComponent(dataObj[name]) // property is not object, just uri encode it
                  
                  if(!spaces){
                     key = key.replace(/%20/g, "+") 
                     value = value.replace(/%20/g, "+"); // substitute space encoding for +
                  }
                 
                  pairs.push(key + "=" + value)                 
             }
         }

         return pairs.join("&");
     }

     return formEncode;
})
