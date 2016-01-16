
app.controller('AuthController', function($scope,$auth,$state,$http, $rootScope,$ionicPopup, $timeout,$ionicBackdrop,$ionicLoading)
{

  var vm = this;



    $ionicBackdrop.retain();
    $timeout(function() {
      $ionicBackdrop.release();
    }, 1000);
  

  if(typeof(Storage) != "undefined") 
  {
     var token = localStorage.getItem('satellizer_token');
     if(token)
     {
          
            $ionicLoading.show({
              template: '<span> <ion-spinner icon="lines" class = "class="spinner-energized""></ion-spinner> Pinapatunayan na ikaw nga yan :D ... </span>'
            });
          
         $http.get('http://technibuddy.myssc.zz.vc/public/api/getUserData?token='+$auth.getToken(), function(data)
          {

          }).error(function(error)
          {
             
                $ionicLoading.hide();
              
            $state.go('login', {});
                  $ionicPopup.alert({
                     title: 'Token Mismatch',
                     template: 'It seems like you have an outdated or invalid cookie <b class = "red"> Please Relogin </b>'
                   });
          }).then(function(status)
          {
            
                if(status != 400)
                {
                  $state.go('home', {});
                }
                else
                {
                  
                }

               
                $ionicLoading.hide();
              
          });
         
       
     }
     else
     {
      console.log("test");
        $state.go('login', {});
     }

  }


  vm.login = function()
  {
 
      var credentials = { username: vm.username , password: vm.password};

      $auth.login(credentials).then(function(data)
      {
        $ionicLoading.show({
              template: '<span> <ion-spinner icon="lines" class = "class="spinner-energized""></ion-spinner> Pinapatunayan na ikaw nga yan :D ... </span>'
            });
         return $http.get('http://technibuddy.myssc.zz.vc/public/api/getUserData?token='+$auth.getToken());
        
       // Handle errors
        }, function(error) {
            vm.loginError = true;
            vm.loginErrorText = error.data.error;
             $ionicLoading.hide();
            console.log('error');
            if(error.status == 401)
            {
             $ionicPopup.alert({
                   title: 'Error',
                   template: '<span class="text-center">Invalid <b> username</b> or <b> password </b></span>'
                 });

                
              
               
              }

              

        // Because we returned the $http.get request in the $auth.login
        // promise, we can chain the next promise to the end here
        }).then(function(response) {

            if(response )
            { $ionicLoading.hide();
              // Stringify the returned data to prepare it
              // to go into local storage
              var user = JSON.stringify(response.data.user);

              // Set the stringified user data into local storage
              localStorage.setItem('user', user);

              // The user's authenticated state gets flipped to
              // true so we can now show parts of the UI that rely
              // on the user being logged in
              $rootScope.authenticated = true;

              // Putting the user's data on $rootScope allows
              // us to access it anywhere across the app
              $rootScope.currentUser = response.data.user;
              console.log( $rootScope.currentUser);
              // Everything worked out so we can now redirect to
              // the users state to view the data
               $state.go('home', {});
            }
           

            
        });;
  }


});

app.controller('UserController', function($http,$auth,$scope)
{
 
  $scope.isAuthenticated = function() {
    console.log( 'test');
  };
    var vm = this;

    vm.users;
    vm.error;
  

    vm.getUsers = function()
    {
       $http.get('http://technibuddy.myssc.zz.vc/public/api/authenticate?token='+$auth.getToken()).success(function(users)
       {
          vm.users = users;
       }).error(function(error)
       {
          vm.error = error;
          console.log(error);
       });

    }
});

app.controller('PictureCtrl', function($scope, $cordovaCamera) {

  var vm = this;
  document.addEventListener("deviceready", function () {

    var options = {
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 100,
      targetHeight: 100,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false,
      correctOrientation:true
    };

   
    $scope.getPicture = function()
    {
      $cordovaCamera.getPicture(options).then(function(imageData,imageURI) 
       {
            
          $scope.imageshot = "data:image/jpeg;base64," + imageData;
          console.log($scope.imageshot);
          }, function(err) {
            // error
        });
    
       } 

        

        }, false);
   
      
   
});