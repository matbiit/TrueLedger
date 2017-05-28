app.controller("ClientSectionController", function($scope, $rootScope) {

  var vm = $scope;

  vm.init = function() {
    // console.log("init");

    $rootScope.$broadcast("hide-header-elements", {
      header: true
    });

  }

})
