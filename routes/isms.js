var express = require('express');
var router = express.Router();
var crypto = require('crypto-js');


router.get('/ismlist', function(req, res) {
  var db = req.db;
  var collection = db.get('ismlist');
  collection.find({},{},function(e, docs){
    res.json(docs);
  });
});


router.get('/sourcelist', function(req, res) {
  var db = req.db;
  var collection = db.get('ismlist');
  collection.find({}, 'title', function(e, docs) {
    res.json(docs);
  });
});


router.get('/ismlist/tag/:id', function(req, res) {
  var db = req.db;
  var collection = db.get('ismlist');
  console.log(req.params.id);
  collection.find({'tags[]': req.params.id}, {}, function(e, docs) {
    res.json(docs);
  });
});


router.get('/ismlist/source/:id', function(req, res) {
  var db = req.db;
  var collection = db.get('ismlist');
  console.log(req.params.id);
  collection.find({'title': req.params.id}, {}, function(e, docs) {
    res.json(docs);
  });
});


router.put('/update/:id/:ismId', function(req, res) {
  var db = req.db;
  var collection = db.get('ismlist');
  var sourceToUpdate = req.params.id;
  var ismToUpdate = req.params.ismId;
  collection.update({
    '_id' : sourceToUpdate,
    isms: { $elemMatch: { '_id': ismToUpdate } }
  },
  { $set: { "isms.$" : req.body } },
  function(err) {
    res.send(
      (err === null) ? { msg: '' } : { msg:'error: ' + err }
    );
  });
});


function generateId() {
  var wordArray = crypto.lib.WordArray.random(24);
  var id = crypto.enc.Hex.stringify(wordArray).slice(0, 24);
  return id;
}

router.post('/addism/:id', function(req, res) {
  var db = req.db;
  var collection = db.get('ismlist');
  var sourceToUpdate = req.params.id;
  req.body._id = generateId();
  collection.update(
    { '_id' : sourceToUpdate },
    { $push: { 'isms' : req.body } },
    function(err) {
      res.send(
        (err === null) ? { msg: '' } : { msg:'error: ' + err }
      );
    }
  );
});


router.delete('/deleteism/:id/:ismId', function(req, res) {
  var db = req.db;
  var collection = db.get('ismlist');
  var sourceToUpdate = req.params.id;
  var ismToUpdate = req.params.ismId;
  collection.update(
    { '_id' : sourceToUpdate },
    { $pull: { 'isms' : { '_id': ismToUpdate} } },
    function(err) {
      res.send(
        (err === null) ? { msg: '' } : { msg:'error: ' + err }
      );
    }
  );
});

module.exports = router;
