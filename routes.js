var express = require('express'),
  app = express(),
  login = require('./login.js')
  request = require('request-promise'),
  Cloudant = require('cloudant');

var block = {
  hash : "",
  steps : [
    {
      level : "fabric",
      hash : "LIAUSDGIASD-0001",
      prev : [],
      product : {
        type : "Shirt",
        color : "Green",
        size : "M",
        parts : [
          {
            name : "Contton",
            certs : ["ISO:14001 - Produto Sustentável"],
            checked : false,
            country : "China",
            region : "Guangzhou",
            map : [23.128994,113.253250]
          }]
      }
    },
    {
      level : "certifier",
      hash : "LIAUSDGIASD-0002",
      prev : ["LIAUSDGIASD-0001"],
      product : {
        type : "Shirt",
        color : "Green",
        size : "M",
        parts : [
          {
            name : "Contton",
            certs : ["ISO:14001 - Produto Sustentável"],
            checked : true,
            country : "China",
            region : "Guangzhou",
            map : [23.128994,113.253250]
          }
        ]
      }
    },
    {
      level : "transporter",
      hash : "LIAUSDGIASD-0003",
      prev : ["LIAUSDGIASD-0002", "LIAUSDGIASD-0001"],
      product : {
        type : "Shirt",
        color : "Green",
        size : "M",
        parts : [
          {
            name : "Contton",
            certs : ["ISO:14001 - Produto Sustentável"],
            checked : true,
            country : "China",
            region : "Guangzhou",
            map : [23.128994,113.253250]
          }
        ]
      }
    },
    {
      level : "retail",
      hash : "LIAUSDGIASD-0004",
      prev : ["LIAUSDGIASD-0003","LIAUSDGIASD-0002", "LIAUSDGIASD-0001"],
      product : {
        type : "Shirt",
        color : "Green",
        size : "M",
        parts : [
          {
            name : "Contton",
            certs : ["ISO:14001 - Produto Sustentável"],
            checked : true,
            country : "China",
            region : "Guangzhou",
            map : [23.128994,113.253250]
          }
        ]
      }
    }
  ]

};


var cloudant = Cloudant({url: "https://e955963d-6ade-42ee-a7a5-a634168e40c9-bluemix:3ed27615db6661c1246743a548a248b53aa957ac1f4881a8cd7601fe220e11da@e955963d-6ade-42ee-a7a5-a634168e40c9-bluemix.cloudant.com"});
cloudant.db.list(function(err, allDbs) {
  console.log('All my databases: %s', allDbs.join(', '))
});

var db = cloudant.db.use('true-ledger');

// db.list(function(err, allDbs) {
//   console.log(allDbs);
// });
//


routes = function(){};

routes.prototype.doLogin = (req,res) => {
  res.json(login.getUser.validate(req.query.email));
};

// MOCKADO
routes.prototype.register = (req,res) => {
  console.log( req.body.userID);
  request({
    method : "POST",
    uri : 'https://3b755f76f6bf4e17875e757a28edc5a2-vp0.us.blockchain.ibm.com:5001/registrar',
    body : {
      enrollId : req.body.userID,
      enrollSecret : req.body.userPass
    },
    json: true
  })
    .then(function (response) {
        res.json(response);
    })
    .catch(function (err) {
        console.log(err);
    });
}

routes.prototype.initChain = (req,res) => {
  var query = {
  "jsonrpc": "2.0",
  "method": "deploy",
  "params": {
    "type": 1,
    "chaincodeID": {
      "path": "string"
    },
    "ctorMsg": {
      "function": "string",
      "args": [
        "string"
      ]
    },
    "secureContext": "string"
  },
  "id": 0
};

};

routes.prototype.getAssetbyCode =  (req,res) => {
    block.hash = req.query.id;
    // do query
    res.json(block);
};

routes.prototype.confirmTransaction = (req,res) => {
    var id = req.body.id,
    option = req.body.option;
    if(option){
      // do approve
      res.json({message : "Operation approved", sucess : true});
    }else{
      // negate
      res.json({message : "Operation rejected" , success : false});
    }
};

routes.prototype.getStep = (req,res) => {
  var id = req.query.id;
  // query
  res.json({
    hash : id,
    step : block.steps[0]
  });
}

routes.prototype.getCurrent = (req,res) => {
  var id = req.query.id;
  // do query
  res.json({
    hash : id,
    step : block.steps[block.steps.length - 1]
  });
}

// chain methods
routes.prototype.createChain = (req,res) => {
  var firstNode;

  db.find({selector:{doc_type : "fabric"}}, function(err, result){
    firstNode = result.docs[0];

    var chain = {
      doc_type: "clothes",
      blocks : [firstNode],
      info: {
        clothesType: req.body.type,
        status: firstNode._id,
        color: req.body.color,
        size: req.body.size,
        feedstock: req.body.feedstock,
        suppName: req.body.suppName,
        suppCity: req.body.suppCity,
        suppCountry: req.body.suppCountry,
        suppProdDate: req.body.suppProdDate
      }
    };

    db.insert(chain, function(err, body){
      if(err) reject(err);
      else res.json(body);
    });


  });
}

routes.prototype.passIt = (req,res) => {
  var hash = req.body.hash;
  var myId = req.body.myId;
  var next = req.body.next;
  db.find({selector:{_id : hash}}, function(err, result){
    var chain = result.docs[0];
    if(chain.blocks[chain.blocks.length -1]._id == myId){
      db.find({selector:{_id : next}}, function(err, result){
        chain.blocks.push(result.docs[0]);
        chain.info.status = result.docs[0]._id;
          db.insert(chain, function(err, result){
            if(err) res.json({message : "Falha ao repassar ativo."})
            else res.json(result);
          });
      });
    }
  });

}

routes.prototype.myAssets = (req,res) => {
  var myId = req.query.myId;
    console.log(myId);
    db.find({selector:{"info.status" : myId}}, function(err, result){
      if(err) res.json({message : "Nâo existe nenhum ativo atualmente sob seus cuidados."});
      else res.json(result.docs);
    });
};

routes.prototype.getHistory = (req,res) => {
  var myId = req.query.myId;
  var query = {
    "selector": {
      "_id": {
        "$gt": 0
      },
      "blocks" : {
        "$elemMatch" : {
         "_id" :  {
         "$eq" : myId
         }
        }
      }
    },

    "sort": [
      {
        "_id": "asc"
      }
    ]
  };
  db.find(query, function(err, result){
    if(err) res.json({message : "Não foi encontrado nenhum ativo no seu histórico atual."});
    else res.json(result.docs);
  });
}

module.exports = new routes();
