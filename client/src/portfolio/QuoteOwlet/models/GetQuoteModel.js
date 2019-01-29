angular.module('Portfolio.QuoteOwlet')
 .factory('GetQuoteModel', function($http, ConfigureRequestService, UtilsService){

     function getQuote(){
       return $http(ConfigureRequestService.init())
                .then(function success(data){
                                
                    return UtilsService.parseQuote(data);
                }
                 , function failure(err){
                     console.log('error --> :', err)
                }) 

     }

     return getQuote;
 })
