var express = require('express');
var router = express.Router();


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


router.put('/addorupdateism/:id/:ismId', function(req, res) {
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


router.post('/addorupdateism', function(req, res) {
  var db = req.db;
  var collection = db.get('ismlist');
  collection.insert(req.body, function(err, result){
    res.send(
      (err === null) ? { msg: '' } : { msg: err }
    );
  });
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
