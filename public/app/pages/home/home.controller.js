app.controller("HomeController", function($scope, $stateParams, MainService, DBService) {

  var vm = $scope;

  vm.init = function() {
    $scope.params = $stateParams;
    vm.data = {};

    DBService.getMyAssets(MainService.id)
    .then(function(response) {

      console.log(response);

      vm.data = response.data;

    })

  }

})
