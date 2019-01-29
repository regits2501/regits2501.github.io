angular.module('Portfolio.QuoteOwlet')
 .service('ConfigureRequestService', function(FormEncodeService){ // sets config object used to fetch a quote
                                                                  // from server

      let crs = this;

      crs.config = {
         method: "GET",    
         url: ""
      } 

      crs.setUrl = function(){
         this.url = 'https://quoteowlet.herokuapp.com/fetch/https://api.forismatic.com/api/1.0/'// Server address
                                                                                               // with endpoint.
                                                                                               // (is proxy serv)
         console.log('this.url:', this.url) 
         this.queryParams = {      // making params object specific to server endpoint we are connnecting to. 
             method: 'getQuote',
             format: 'text',
             key: 0,
             lang: 'en'
         };   
        
         this.setQuoteKey = function(){ // sets random quote key that server is using to generates data.
            let value = Math.round( Math.random() * 100000); 
            this.queryParams.key = value ;

         }
         
            
         this.setQueryString = function(){
            this.queryString = FormEncodeService(this.queryParams);// Service uses form-url-encoded scheme to return
                                                           //  query string
           
            if(this.url.indexOf("?") === -1) this.url+="?"; // if doesnt have query delimiter add it. 
            this.url+= this.queryString; // Adds query string to url 


         };
 
         this.setQuoteKey();   // set random quote number
         this.setQueryString() // add query string to url

         this.config.url = this.url // set config url
      }
  
 
      crs.init = function(){ 
         
         crs.setUrl();
         return crs.config 
      } // return config object for a request; 
 })
