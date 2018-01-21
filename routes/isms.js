var express = require("express");
var router = express.Router();
var crypto = require("crypto-js");
var YAML = require("yamljs");

router.get("/sourcelist", function(req, res) {
  var db = req.db;
  var collection = db.get("ismlist");
  collection.find({}, "title author", function(e, docs) {
    res.json(docs);
  });
});

router.get("/ismlist", function(req, res) {
  var db = req.db;
  var collection = db.get("ismlist");
  collection.find({}, {}, function(e, docs) {
    res.json(docs);
  });
});

router.get("/ismlist/source/:id", function(req, res) {
  var db = req.db;
  var collection = db.get("ismlist");
  collection.find({ _id: req.params.id }, {}, function(e, docs) {
    res.json(docs);
  });
});

router.get("/ismlist/tag/:id", function(req, res) {
  var db = req.db;
  var collection = db.get("ismlist");
  collection.find(
    {
      "isms.tags": req.params.id
    },
    {},
    function(e, docs) {
      for (doc of docs) {
        trimmedIsms = [];
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

router.post("/addsource", function(req, res) {
  var db = req.db;
  var collection = db.get("ismlist");
  req.body.isms = [];
  collection.insert(req.body, function(err, result) {
    res.send(err === null ? { msg: "" } : { msg: "error: " + err });
  });
});

router.put("/addsource/:id", function(req, res) {
  var db = req.db;
  var collection = db.get("ismlist");
  req.body.isms = [];
  collection.update(
    {
      _id: req.params.id
    },
    { $set: { title: req.body.title, author: req.body.author } },
    function(err, result) {
      res.send(err === null ? { msg: "" } : { msg: "error: " + err });
    }
  );
});

function generateId() {
  var wordArray = crypto.lib.WordArray.random(24);
  var id = crypto.enc.Hex.stringify(wordArray).slice(0, 24);
  return id;
}

function renameTagsElement(body) {
  // rename tags[] to tags
  body.tags = body["tags[]"];
  delete body["tags[]"];
  return body;
}

router.post("/addism/:id", function(req, res) {
  var err = null;
  var body = req.body;
  body = renameTagsElement(body);
  try {
    addTheIsm(body, req);
  } catch (e) {
    err = "problem adding ism";
  }
  res.send(err === null ? { msg: "" } : { msg: "error: " + err });
});

function convertToJson(body) {
  try {
    var o = JSON.parse(body);
    if (o && typeof o === "object") {
      return o;
    }
  } catch (e) {}
  return false;
}

function convertToYaml(body) {
  try {
    var o = YAML.parse(body);
    if (o && typeof o === "object") {
      return o;
    }
  } catch (e) {}
  return false;
}

function convertBodyToObject(body) {
  nativeObject = convertToYaml(body);
  if (nativeObject) {
    return nativeObject;
  }
  nativeObject = convertToJson(body);
  if (nativeObject) {
    return nativeObject;
  }
  return false;
}

requiredKeys = ["number", "quote"];
allKeys = ["tags", "comments"].concat(requiredKeys);

function isValidTagsField(tags) {
  if (!Array.isArray(tags)) {
    return false;
  }
  return true;
}

function validateIsmFields(ism) {
  var ismValidationResults = []
  currentIsmKeys = Array.from(Object.keys(ism));
  // check for invalid field names
  for (field of currentIsmKeys) {
    if (!allKeys.includes(field)) {
      ismValidationResults.push("\ninvalid field: " + field);
    }
  }
  // validate required fields
  for (key of requiredKeys) {
    if (!currentIsmKeys.includes(key)) {
      ismValidationResults.push("\nrequired field missing: " + key);
    }
  }
  // validate the tags
  if ("tags" in currentIsmKeys) {
    if (!isValidTagsField(ism["tags"])) {
      ismValidationResults.push("\nismtags must be an array or a single item: " + ism["tags"]);
    }
  } else {
    ism.tags = "tagme";
  }
  return ismValidationResults;
}

function validateIsms(isms) {
  var ismsArray = [];
  if (!Array.isArray(isms)) {
    ismsArray.push(isms);
  } else {
    ismsArray = isms.concat();
  }
  var allValidationResults = []
  for (ism of ismsArray) {
    allValidationResults.push(validateIsmFields(ism));
  }
  return allValidationResults;
}

router.post("/bulkadd/:id", function(req, res) {
  var err;
  nativeObject = convertBodyToObject(req.body.isms);
  if (!nativeObject) {
    err = "invalid format";
  }
  var validationErrors = validateIsms(nativeObject)
  if (validationErrors.length > 0) {
    err = "there are field errors: " + validationErrors.join() + "\n\nrequired fields: " + requiredKeys.join() + "\navailable fields: " + allKeys.join();
  } else {
    err = addAllIsms(nativeObject, req);
  }
  res.send(err ? { msg: err } : { msg: "" });
});

function addTheIsm(ism, req) {
  var db = req.db;
  var collection = db.get("ismlist");
  var sourceToUpdate = req.params.id;
  ism._id = generateId();
  if (!ism.comments) {
    ism.comments = "";
  }
  if (!ism.tags) {
    ism.tags = "tagme";
  }
  collection.update({ _id: sourceToUpdate }, { $push: { isms: ism } }, function(
    err
  ) {
    if (err !== null) {
      throw "problem adding ism";
    }
  });
}

function addAllIsms(nativeObject, req) {
  if (Array.isArray(nativeObject)) {
    for (entry of nativeObject) {
      try {
        addTheIsm(entry, req);
      } catch (e) {
        return "problem adding ism";
      }
    }
  } else {
    try {
      addTheIsm(nativeObject, req);
    } catch (e) {
      return "problem adding ism";
    }
  }
  return ""
}



router.put("/updateism/:id/:ismId", function(req, res) {
  var db = req.db;
  var collection = db.get("ismlist");
  var sourceToUpdate = req.params.id;
  var ismToUpdate = req.params.ismId;
  var body = req.body;
  body = renameTagsElement(body);
  collection.update(
    {
      _id: sourceToUpdate,
      isms: { $elemMatch: { _id: ismToUpdate } }
    },
    { $set: { "isms.$": body } },
    function(err) {
      res.send(err === null ? { msg: "" } : { msg: "error: " + err });
    }
  );
});

router.delete("/deleteism/:id/:ismId", function(req, res) {
  var db = req.db;
  var collection = db.get("ismlist");
  var sourceToUpdate = req.params.id;
  var ismToUpdate = req.params.ismId;
  collection.update(
    { _id: sourceToUpdate },
    { $pull: { isms: { _id: ismToUpdate } } },
    function(err) {
      res.send(err === null ? { msg: "" } : { msg: "error: " + err });
    }
  );
});

module.exports = router;
