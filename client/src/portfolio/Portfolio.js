var portfolio = angular.module('Portfolio', [
    'ngAnimate',
    'ngRoute',
    'ngMessages',
    'Portfolio.Common',
    'Portfolio.QuoteOwlet',
    'Portfolio.HmacSha1'
])

portfolio.config(function($routeProvider){
   
      $routeProvider
        .when('/', {    // root will point to page with full page cude animation

           templateUrl:  'client/src/portfolio/Common/tmpl/main.html',
           controller:   'MainCtrl',
           controllerAs: 'main'
        })
})
