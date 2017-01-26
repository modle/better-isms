var express = require('express');
var router = express.Router();

/*
 * GET ismlist.
 */
router.get('/ismlist', function(req, res) {
    var db = req.db;
    var collection = db.get('ismlist');
    collection.find({},{},function(e,docs){
        res.json(docs);
    });
});

/*
 * POST to addism.
 */
router.post('/addism', function(req, res) {
    var db = req.db;
    var collection = db.get('ismlist');
    collection.insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/*
 * PUT to updateism.
 */
router.put('/updateism/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('ismlist');
    var ismToUpdate = req.params.id;
    collection.update({ '_id' : ismToUpdate }, req.body, function(err) {
        res.send(
            (err === null) ? { msg: '' } : { msg:'error: ' + err }
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
