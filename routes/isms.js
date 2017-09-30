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
  collection.find({}, 'title author', function(e, docs) {
    res.json(docs);
  });
});


router.get('/ismlist/tag/:id', function(req, res) {
  var db = req.db;
  var collection = db.get('ismlist');
  collection.find({
    'isms.tags': req.params.id}, {}, function(e, docs) {
      for (doc of docs) {
        trimmedIsms = []
        for (ism of doc.isms) {
          if (ism.tags.includes(req.params.id)) {
            trimmedIsms.push(ism);
          }
        }
        doc.isms = trimmedIsms;
      }
      res.json(docs);
    }
  );
});


router.get('/ismlist/source/:id', function(req, res) {
  var db = req.db;
  var collection = db.get('ismlist');
  collection.find({'_id': req.params.id}, {}, function(e, docs) {
    res.json(docs);
  });
});


router.put('/updateism/:id/:ismId', function(req, res) {
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
  // rename tags[] to tags
  req.body.tags = req.body['tags[]']
  delete req.body['tags[]']
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


router.post('/addsource', function(req, res) {
  var db = req.db;
  var collection = db.get('ismlist');
  req.body.isms = [];
  collection.insert(req.body,
    function(err, result) {
      res.send(
        (err === null) ? { msg: '' } : { msg:'error: ' + err }
      );
    }
  );
});


router.put('/addsource/:id', function(req, res) {
  var db = req.db;
  var collection = db.get('ismlist');
  req.body.isms = [];
  collection.update({
    '_id' : req.params.id
  },
  { $set: { "title" : req.body.title, "author" : req.body.author } },
    function(err, result) {
      res.send(
        (err === null) ? { msg: '' } : { msg:'error: ' + err }
      );
    }
  );
});

module.exports = router;
