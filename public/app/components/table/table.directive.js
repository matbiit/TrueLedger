app.directive("tableElement", function($location, $stateParams) {
  return {
    restrict: "E",
    replace: true,
    templateUrl: "app/components/table/table.view.html",
    scope: true,
    link: function (scope, element, attrs) {

      scope.openRow = function() {
        $location.url("app/lote/" + scope.data._id + "/" + $stateParams.user);
      }

    }
  };
});
