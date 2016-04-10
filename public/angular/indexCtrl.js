//controller for the very first page

angular.module('angularApp')

.controller('indexCtrl',function($scope,$http,$location,$window,$rootScope,$state,userService){
    console.log('Start of indexCtrl');
        // $state.go('login');

    $scope.logindata = {
      username: '',
      password: ''  
    };
    $scope.message = '';
    $scope.SignupMessage = '';
    $scope.login=1;
    $scope.serverResponse;
    console.log("yo"+$scope.login);
     $scope.setEvent = function(value){
        $scope.login = value ; 
        console.log("set value called");
    }
    $scope.getEvent = function(val){
        return $scope.login == val;
    }
    $scope.getMessage = function() {
        // console.log($scope.message.length);
        if($scope.message.length != 0)
        return true;return false;
    }
    $scope.getSignupMessage = function() {
        if($scope.SignupMessage.length != 0)
        return true;return false;
    }
    //ajax call after signup
    $scope.AjaxSignup = function() {
        console.log('Ajax signup method called');
        console.log($scope.signupdata);
        $http.post('/signup',{
            username:$scope.signupdata.username,
            password:$scope.signupdata.confirmpassword})
             .success(function(data){
                 console.log(data);
                 $scope.SignupMessage = data.SignupMessage;
             })
             .error(function(data){
                 console.log(data);
             })
    }
    //ajax calll after login
    $scope.Ajaxlogin = function() {
        // console.log('inside AJaxLogin');
        console.log(this.logindata);
        $scope.message = '';

        $http.post('/login',
        {username:$scope.logindata.username,password:$scope.logindata.password})
            .success(function(user){
                // user id for failure message
                // data is for status code
                // console.log(user);
                // console.log(data.status);
                $scope.message = user.message;
                $rootScope.user = user;
                userService.setUser(user);
                if(user.status == 203)
                 {  
                    //   $window.location.href='/home'
                    $state.go('dashboard');
                }
                })
            .error(function(data){console.log(data);});
            // $scope.serverResponse=data;

        // $http.get('/sendgrid')
        //     .success(function(data){console.log(data);})
        //     .error(function(data){console.log(data);})

        // now this will interact with serve and let us know
        // wether it's success of failer in form of response
        // if this failure then we will simply send a flash message
        // or else we will redirect to Dashboard page using sendFile
        // method of NodeJS
    }//end of ajaxLogin
    
    
})

.controller('DashboardCtrl',function($http,$scope,$location,$window){

    console.log('Start of DashboardCtrl'); 
    $scope.message = 'This is Home Controller';
    $scope.hello = "Hello World";
    $scope.activeTab= 1;
    $scope.getActiveTab = function(val) {
        if(val == $scope.activeTab)return true;return false;
    }
    $scope.logout = function(){
        $http.get('/logout')
            .success(function(data){
                // $location.path('/');
                $window.location.href='/' 
            })
            .error(function(data){console.log()});
    }
})//----------------------------------------------------------------------------------------------------------------------------------------------

//About Controller Start-------------------------------------------------------------------------------------------------
.controller('aboutCtrl',function($scope,$http,$location,$window){
   console.log('Start of AboutCtrl'); 
    $scope.message = 'This is About Page';
    $scope.us = $window.user;
})
//Home Ctrl--------------------------------------------------------------------------------------------------------------
.controller('homeCtrl',function($scope,$http,$location,$window){
   console.log('Start of HomeCtrl');
    $scope.message = 'This is DbHome Ctrl Controller'; 
})
.controller('wodCtrl',function($scope,$http,$location,$window){
   console.log('Start of HomeCtrl');
    $scope.message = 'This is wodCtrl Ctrl Controller'; 
})
.controller('wodCtrl1',function($scope,$http,$location,$window){
   console.log('Start of HomeCtrl');
    $scope.message = 'This is wodCtrl Ctrl Controller'; 
})


.controller('predictCtrl',function($scope,$http,$location,$window){
    console.log('Hello word in winpredict Ctrl');
    $scope.hi = 1;
    $scope.teamaColor = "md-raised";
    $scope.teambColor="btn-success";
    $scope.changeColor = function(){
        $scope.temp = $scope.teamaColor;
        $scope.teamaColor = $scope.teambColor;
        $scope.teambColor=$scope.temp;
    }
    $scope.teams1 = ["Mumbai","Chennai","Punjab","Kolkata","Delhi","Gujraat","Pune","Hyderabad"];
    $scope.saveMatchDetail = function(putValue){
    if(putValue != "undefined")
    console.log(putValue);
             $http.post('/saveMatchService',{data:putValue})
            .success(function(data){
                if(data.status == 200)
                    $scope.message = data.message;
            })
            .error(function(data){
                console.log(data)
            })
    }
    $scope.getMatchList = function(){
        $http.get('/getMatchService')
        .success(function(response){
            $scope.teams = response;
            console.log($scope.teams[0]);                        
        })
        .error(function(error){
            console.log(error);
        })
    }
    $scope.submitPoll = function(userPoll){
        var pollServiceData = {};
        pollServiceData.userPoll = userPoll;
        if($scope.teamaColor == "btn-success"){
            pollServiceData.teamName = "A"
        }pollServiceData.teamName = "B"        
        $http.post('/saveUserPollService',{data:pollServiceData})
            .success(function(data){
                if(data.status == 200)
                    $scope.resMessage = data.message;
            })
            .error(function(data){
                console.log(data)
            })
        
    }
    $scope.sendMatchPrediction = function(matchValue){
        //service will call hear
    }
    
})
;