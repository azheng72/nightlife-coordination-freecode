var app=angular.module('app',['ngResource']);

app.factory('Nightlife', ['$resource', function($resource) {
return $resource('/:directive/:user', null,
    {
        'update': { method:'PUT' }
    });
}]);

app.controller('AppController',['$scope','Nightlife',function($scope,Nightlife){
    $scope.data={};
    
    $scope.loginbtn=true;
    $scope.logoutbtn=false;
    $scope.gohereBtn=false;
    Nightlife.get({directive:'login'})
            .$promise.then(function(user){  // user format: {user:{name:'',id:''}}
                $scope.username=user.user.name;
                $scope.userid=user.user.id;
                $scope.mylocation=user.yelp.name;
                $scope.loginbtn=false;
                $scope.logoutbtn=true;
                $scope.gohereBtn=true;
            });
    
    //when input change, send destination to server
    $scope.change=function (input){
        console.log(input);
        Nightlife.get({directive:'search',user:$scope.userid,destination:input})
            .$promise.then(function(bars){
                $scope.bars=bars.businesses;
                $scope.customers=bars.customers;
            });
        //console.log(result);
        
    };
    //login api
    $scope.login=function(){
        Nightlife.get({directive:'login'})
            .$promise.then(function(user){
                $scope.username=user.user.name;
                $scope.userid=user.user.id;
                $scope.mylocation=user.yelp.name;
                $scope.loginbtn=false;
                $scope.logoutbtn=true;
                $scope.gohereBtn=true;
            },
            function(err){  //response status code !==200
                 window.location = "/auth/facebook";
            });
    };
    $scope.logout=function(){
        Nightlife.get({directive:'logout'});
        window.location.reload();

    };

    //add destination to user
    $scope.gohere=function(barId,barName){
        Nightlife.update({directive:'update',user:$scope.userid},
                            { user:{id:$scope.username,name:$scope.userid},yelp:{id:barId,name:barName}}
                            )
            .$promise.then(function(res){
                
                $scope.change($scope.data.input);
                $scope.mylocation=barName;
                $scope.update=res;
            });
    };
    //remove destination to user
    $scope.leave=function(){
        Nightlife.update({directive:'update',user:$scope.userid},
                            { user:{id:$scope.username,name:$scope.userid},yelp:{id:'',name:''}}
                            )
            .$promise.then(function(res){
                
                $scope.change($scope.data.input);
                $scope.mylocation='';
                $scope.update=res;
            });
    };
}]); 

