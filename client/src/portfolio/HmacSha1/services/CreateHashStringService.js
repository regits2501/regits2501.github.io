angular.module('Portfolio.HmacSha1')
 .factory('CreateHashStringService', function(){

     return function createHashString(){
         
        let alphaNums = '5ab1cd4e2f0g3h7ij4kl6mn2o8pqr9stu0vwxy1z';
        let length = alphaNums.length -1 ;
        let hash = '';
        let k; // index

        for (let i = 0; i < 35; i++){
            k = Math.round( Math.random() * length); // Make index number random, goes up to aplhanum.length
            hash += alphaNums[k];                    // Take char from k-th place in alphaNums and put in hash
        }
      
        return hash;
     }

     
 })
