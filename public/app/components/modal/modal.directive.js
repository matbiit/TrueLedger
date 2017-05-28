app.directive('modalElement', function($rootScope){
  return {
    restrict: "E",
    replace: true,
    templateUrl: "app/components/modal/modal.view.html",
    scope: true,
    link: function (scope, element, attrs) {
      scope.modal = {};

      $rootScope.$on("modal", function(event, args) {
        console.log("Modal", args);
        if(args.state) {
          scope.modal.url = "app/components/modal/partials/" + args.name + "/" + args.name + ".partial.html";

          element.removeClass("hidden");
        } else {
          scope.close();
        }

      });

      scope.close = function() {
        scope.modal = {};

        element.addClass("hidden");
      }

    }
  };
});
