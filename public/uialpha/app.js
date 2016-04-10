var app = angular.module('routeApp', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider) {
  // For any unmatched url, redirect to /home
  $urlRouterProvider.otherwise("/home");
  // Now set up the states
  $stateProvider
    .state('home', {
      url: "",
      templateUrl: "home.html"
    })
    .state('about', {
      url: "/about",
      templateUrl: "about.html"
    })
    .state('about.contact', {
      url: "/contact",
      templateUrl: "contact.html",
    });
});

                