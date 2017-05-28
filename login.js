var login = function(){};

login.prototype.getUser = {
  validate : email => {
    if(email === "shipping") return    {
      url : "https://3b755f76f6bf4e17875e757a28edc5a2-vp1.us.blockchain.ibm.com:5001/",
      name: "user_type1_0",
      pass : "1c450b5ea3"
    }
  }
};

module.exports = new login();
