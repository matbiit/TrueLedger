app.controller("MainController", function($scope, $stateParams) {

  var vm = $scope;

  console.log("asdasdas");

  vm.click = function() {
    console.log("asas");
  }

  vm.mainInit = function() {
    console.log("FGOI", $stateParams);
    $scope.params = $stateParams;
  }

})
