app.directive("headerElement", function($rootScope, $stateParams) {
  return {
    restrict: "E",
    replace: true,
    templateUrl: "app/components/header/header.view.html",
    scope : true,
    link: function (scope, element, attrs) {
      scope.header;
      scope.params = $stateParams;

      $rootScope.$on("hide-header-elements", function(event, args) {
        scope.header = args;
        console.log("Test", scope.header);
      });

      scope.openModal = function() {
        $rootScope.$broadcast("modal", {
          name: "new-asset",
          state: true
        });
      }

    }
  };
})
