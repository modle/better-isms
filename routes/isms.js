var express = require('express');
var router = express.Router();

/*
 * GET ismlist.
 */
router.get('/ismlist', function(req, res) {
  var db = req.db;
  var collection = db.get('ismlist');
  collection.find({},{},function(e, docs){
    res.json(docs);
  });
});

/*
 * GET sourcelist.
 */
router.get('/sourcelist', function(req, res) {
  var db = req.db;
  var collection = db.get('ismlist');
  collection.find({}, 'title', function(e, docs) {
    res.json(docs);
  });
});

/*
 * GET ismlist with tag filter.
 */
router.get('/ismlist/tag/:id', function(req, res) {
  var db = req.db;
  var collection = db.get('ismlist');
  console.log(req.params.id);
  collection.find({'tags[]': req.params.id}, {}, function(e, docs) {
    res.json(docs);
  });
});

/*
 * GET ismlist with source filter.
 */
router.get('/ismlist/source/:id', function(req, res) {
  var db = req.db;
  var collection = db.get('ismlist');
  console.log(req.params.id);
  collection.find({'title': req.params.id}, {}, function(e, docs) {
    res.json(docs);
  });
});

/*
 * PUT to updateism.
 */
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

/*
 * POST to addism.
 */
router.post('/addorupdateism', function(req, res) {
  var db = req.db;
  var collection = db.get('ismlist');
  collection.insert(req.body, function(err, result){
    res.send(
      (err === null) ? { msg: '' } : { msg: err }
    );
  });
});

/*
 * DELETE to deleteism.
 */
router.delete('/deleteism/:id', function(req, res) {
  var db = req.db;
  var collection = db.get('ismlist');
  var ismToDelete = req.params.id;
  collection.remove({ '_id' : ismToDelete }, function(err) {
    res.send(
      (err === null) ? { msg: '' } : { msg:'error: ' + err }
    );
  });
});

module.exports = router;
