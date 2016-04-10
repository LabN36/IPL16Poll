var angularApp = angular.module('angularApp',['ngMaterial','ngMessages','ui.router','ui.gravatar']);

angularApp.config(function($stateProvider,$urlRouterProvider,$locationProvider){
   
//    $urlRouterProvider.otherwise('/om');
$urlRouterProvider.otherwise("/");
   $stateProvider
//    .state('home',{
//        url : "",
//        templateUrl : 'html/test-alpha.html',
//        controller : 'angular/indexCtrl.js'
//    }) 
   .state('home',{
       url : "/",
       templateUrl : 'html/main.html',
       controller : 'indexCtrl' 
   })
   .state('home.login',{
       templateUrl : 'html/template/login.html',
       url : "login",
       controller : 'indexCtrl' 
   })
   .state('home.signup',{
       url : "signup",
       templateUrl : 'html/template/signup.html',
       controller : 'indexCtrl' 
   })
   .state('home.aboutme',{
       url : "aboutme",
       templateUrl : 'html/template/aboutme.html',
       controller : 'indexCtrl' 
   })
   
   //--------------------DASHBOARD--------------------------------------------------------
   .state('dashboard',{
       url : "/dashboard",
       templateUrl : 'html/dashboard.html',
       controller : 'DashboardCtrl'
   })
   .state('dashboard.home',{
       url : "/home",
       templateUrl : 'html/template/home.html',
       controller : 'wodCtrl'
   })
   .state('dashboard.winPredict',{
       url : "/winPredict",
       templateUrl : 'html/template/winPredict.html',
       controller : 'winpredictCtrl'
   })
   .state('dashboard.home1',{
       url : "/home1",
       templateUrl : 'html/template/home1.html',
       controller : 'wodCtrl1'
   })
   .state('dashboard.predict',{
       url : "/predict",
       templateUrl : 'html/template/winPredict.html',
       controller : 'predictCtrl'
   })
   $locationProvider.html5Mode(true);
})
.service('userService',function(){
    var user = {};
    return {
    setUser : function(value) {
        user = value;
    },
    getUser : function() {
      return user;  
    }
    }
})
.directive("compareTo", function() {
  return {
        require: "ngModel",
        scope: {
            otherModelValue: "=compareTo"
        },
        link: function(scope, element, attributes, ngModel) {
             
            ngModel.$validators.compareTo = function(modelValue) {
                return modelValue == scope.otherModelValue;
            }; 
            scope.$watch("otherModelValue", function() {
                ngModel.$validate();
            });
        }
    };  
});