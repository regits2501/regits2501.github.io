// pill color control
angular.module('Portfolio.Common')
 .service('PillColorService', function($window){  // sets color of the pill in navbar

      this.pillElement =  angular.element($window.document.querySelector('.pill'))

      this.pillColor = function(add, remove) {

           this.pillElement.addClass(add);   
           this.pillElement.removeClass(remove);    
      }

      this.setColor = function(add, remove){                   // color = 'red'  OR 'blue'
           this.pillColor(add + '-pill', remove + '-pill');  // Add blue-pill, remove red-pill class
      }
    
      return {
        setColor: this.setColor.bind(this)
      }
 })
