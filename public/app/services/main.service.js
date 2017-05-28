app.service("MainService", function($stateParams) {

  var self = this;

  self.id = "";

  switch ($stateParams.user) {
    case "fabrica":
      self.id = "f5d535fda863561e448cd355bdbd9154";
      break;

    case "cetificador":
      self.id = "297f3bb906b4b1e90d86a0169e606790";
      break;

    case "transportadora":
      self.id = "da2c0b9125e4ad379a2769c3dc139541";
      break;

    case "loja":
      self.id = "eac1d9c859e606cbceea7ebd8c33fe8e";
      break;

    default:

  }

})
