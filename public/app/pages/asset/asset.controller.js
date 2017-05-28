app.controller("AssetController", function($scope, $stateParams, DBService, MainService) {

  var vm = $scope;

  vm.init = function() {
    $scope.params = $stateParams;
    vm.data = {};

    DBService.getMyAssets(MainService.id)
    .then(function(response) {

      console.log(response);

      vm.data = response.data[0];

    })

  }

  vm.transferAsset = function() {

    console.log(vm.data._id)

    DBService.transferAsset(vm.data._id)
    .then(function(response) {

      console.log(response);

    })

  }


})
