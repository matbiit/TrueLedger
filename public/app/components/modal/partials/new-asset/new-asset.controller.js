app.controller("NewAssetController", function($scope, DBService) {

  var vm = $scope;

  vm.create = function() {
    DBService.createChain(vm.chain)
    .then(function(response) {

      console.log(response);
      vm.close();
    });
  }

})
