var database = {
  determineIsmQueryUrl : function() {
    url = "/isms/ismlist/";
    if (globals.filterType) {
      url += globals.filterType + "/" + globals.filterId;
    }
    return url;
  },
  upsertIsm : function(event) {
    auth.handleLogin();
    event.preventDefault();
    log.enter(getName());
    var optionalIsmFields = ["inputComments", "inputTags"];
    if (!forms.validate("upsertIsmForm", optionalIsmFields)) {
      log.exit(getName());
      return;
    }

    var ism = {};
    ism.number = $("#upsertIsmForm fieldset input#inputNumber").val();
    ism.tags = database.buildTags($("#upsertIsmForm fieldset input#inputTags").val());
    ism.quote = $("#upsertIsmForm fieldset textarea#inputQuote").val();
    ism.comments = $("#upsertIsmForm fieldset textarea#inputComments").val();

    var buttonValue = $("#upsertIsmForm fieldset button#btnUpsertIsm").val();
    if (buttonValue.includes(":")) {
      var type = "PUT";
      ism._id = buttonValue.split(":")[1];
      url = "/isms/updateism/" + buttonValue.replace(":", "/");
    } else {
      var type = "POST";
      url = "/isms/addism/" + buttonValue;
    }
    console.log(type, "to", url);
    $.ajax({
      type: type,
      data: ism,
      url: url,
      dataType: "JSON"
    }).done(function(response) {
      if (response.msg === "") {
        ismForm.clearFields();
        contentControl.generate(null);
        modals.hide();
      } else {
        alert("Error: " + response.msg);
      }
    });
    log.exit(getName());
  },
  buildTags : function(tags) {
    if (Array.isArray(tags)) {
      return tags;
    }
    return Array.from(
      tags
      .trim()
      .toLowerCase()
      .split(/\s*,\s*/)
    );
  },
  bulkUpsertIsms : function(event) {
    auth.handleLogin();
    event.preventDefault();
    log.enter(getName());
    if (!forms.validate("bulkAddIsmForm")) {
      log.exit(getName());
      return;
    }
    var sourceId = $(this).attr("value");
    var content = {};
    content["isms"] = $("#bulkAddIsmForm fieldset textarea#inputBulkIsms").val();
    console.log(content);
    $.ajax({
      type: "POST",
      data: content,
      url: "/isms/bulkadd/" + sourceId,
      dataType: "JSON"
    }).done(function(response) {
      if (response.msg === "") {
        console.log("no problems here, jim");
        contentControl.generate(null);
      } else {
        alert("Error: " + response.msg);
      }
    });
    modals.hide();
    log.exit(getName());
  },
  updateIsmSingleField : function(event) {
    log.enter(getName());
    let ids = forms.getIdsFromButton();
    let ism = database.getIsm(ids);
    let url = "/isms/updateism/" + ids.sourceId + "/" + ids.ismId;
    $.ajax({
      type: "PUT",
      data: ism,
      url: url,
      dataType: "JSON"
    }).done(function(response) {
      if (response.msg === "") {
        sources.isms.removeFromList(ids.sourceId, ids.ismId);
        forms.kickOffUpdateForm(ids.type);
      } else {
        alert("Error: " + response.msg);
        forms.resetUpdateTracker();
      }
    });
    log.exit(getName());
  },
  getIsm : function(ids) {
    let ism = database.getIsmFromSource(ids);
    if (forms.currentlyUpdating === 'untagged') {
      ism.tags = database.getTagsFromForm();
    } else if (forms.currentlyUpdating === 'uncommented') {
      ism.comments = database.getCommentFromForm();
      // this is needed because the post expects an array, but the object stores a string for single tags
      ism.tags = database.buildTags(ism.tags);
    }
    return ism;
  },
  getIsmFromSource : function(ids) {
    let source = contentControl.props.targetIsms.find(aSource => aSource._id === ids.sourceId);
    return source.isms.find(anIsm => anIsm._id === ids.ismId);
  },
  getTagsFromForm : function() {
    return database.buildTags($("#updateTagmeForm fieldset input#newTags").val());
  },
  getCommentFromForm : function() {
    return $("#updateUncommentedForm fieldset textarea#newComments").val();
  },
  upsertSource : function(event) {
    event.preventDefault();
    log.enter(getName());
    auth.handleLogin();
    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $("#upsertSourceForm input").each(function(index, val) {
      if (this.value === "") {
        errorCount++;
      }
    });
    if (errorCount > 0) {
      alert("Please fill in all required fields");
      log.exit(getName());
      return false;
    }

    var source = {};
    source.title = $("#upsertSourceForm fieldset input#inputTitle").val();
    source.author = $("#upsertSourceForm fieldset input#inputAuthor").val();

    url = "/isms/addsource/";
    type = "POST";
    upsertedToastString = "";
    var sourceId = $(this).attr("value");
    if (sourceId) {
      url = "/isms/updatesource/" + sourceId;
      type = "PUT";
      upsertedToastString =
        "Source<br>" +
        sources.getDisplayString(sourceId) +
        " updated.<br><br>New value:<br>" +
        source.title +
        "(" +
        source.author +
        ")<br><br>Clear filter or refresh page to update source cloud";
    }

    $.ajax({
      type: type,
      data: source,
      url: url,
      dataType: "JSON"
    }).done(function(response) {
      if (response.msg === "") {
        database.clearSourceFormFields();
        contentControl.generate(null);
      } else {
        alert("Error: " + response.msg);
      }
    });
    modals.hide();
    database.showSourceUpsertedToast(upsertedToastString);
    log.exit(getName());
  },
  showSourceUpsertedToast : function(toastString) {
    if (!toastString) {
      return;
    }
    $("#sourceUpsertedHeader").html(toastString);
    modals.show(sourceUpsertedModal);
    modals.hideAfterALongWhile(sourceUpsertedModal);
  },
  clearSourceFormFields : function() {
    $("#upsertSourceForm fieldset input").val("");
  },
  addSource : function(event) {
    contentControl.clearFilter();
    contentControl.hideFooter();
    database.openUpsertSourceForm();
  },
  openUpsertSourceForm : function() {
    auth.handleLogin();
    modals.show(upsertSourceModal);
    $("#sourceFormTitle").html("Add source");
    $("#upsertSourceModal fieldset button#btnSubmitUpsertSource").val("");
    $("#upsertSourceModal fieldset button#btnSubmitUpsertSource").html("Add");
    if (globals.filterId) {
      source = globals.sourceCloudDict[globals.filterId];
      $("#sourceFormTitle").html("Update source");
      $("#upsertSourceModal fieldset input#inputTitle").val(source["title"]);
      $("#upsertSourceModal fieldset input#inputAuthor").val(source["author"]);
      $("#upsertSourceModal fieldset button#btnSubmitUpsertSource").val(globals.filterId);
      $("#upsertSourceModal fieldset button#btnSubmitUpsertSource").html(
        "Update"
      );
    }
    $("#inputTitle").focus();
  },
  deleteIsm : function(event) {
    auth.handleLogin();
    event.preventDefault();
    console.log("delete ism clicked!");

    auth.handleLogin();

    var confirmation = confirm("Are you sure you want to delete this ism?");
    var thisSource = $(this).attr("rel");
    if (confirmation === true) {
      $.ajax({
        type: "DELETE",
        url:
          "/isms/deleteism/" +
          $(this)
            .attr("rel")
            .replace(":", "/")
      }).done(function(response) {
        if (response.msg === "") {
        } else {
          alert("Error: " + response.msg);
        }
        contentControl.generate();
        // clear the update fields if the id matches
        if ($("#upsertIsmForm fieldset button#upsertIsm").val() === thisSource) {
          $("#upsertIsmForm fieldset input").val("");
        }
        modals.show(ismDeletedModal);
        modals.hideAfterAWhile(ismDeletedModal);
      });
    } else {
      log.exit(getName());
      return false;
    }
    log.exit(getName());
  },
  exportData : function() {
    auth.handleLogin();
    var txtFile = "test.txt";
    var file = new File([""], txtFile);
    var str = JSON.stringify(sources.isms.cached);
    var dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(str);

    var link = document.createElement("a");
    link.setAttribute("href", dataUri);
    link.setAttribute("download", "export.json");
    document.body.appendChild(link); // Required for FF

    link.click(); // This will download the data file named "my_data.csv".
  },
  getTagmeIsms : function() {
    log.enter(getName());
    // TODO decide whether a call is needed here
    // on one hand, using mongo to do the filtering for us makes this really simple
    // on the other, we have to make a call to the DB, when we could just Array.filter the cachedIsms
    // the way we handle the uncommented isms; but this means we would have to remove already-tagged
    // isms as we come to them, rather than knowing the list we're using has all untagged isms
    $.ajax({
      type: "GET",
      url: '/isms/ismlist/tag/tagme',
      dataType: "JSON"
    }).done(function(response) {
      contentControl.props.targetIsms = response;
      forms.kickOffUpdateForm('untagged');
    });
    log.exit(getName());
  },
  getIsms : function(url) {
    database.manageGetIsmListCall(url);
  },
  manageGetIsmListCall : function(url) {
    ismDivs = elements.generateIsmHeaders();
    $.ajax({
      type: "GET",
      url: url,
      dataType: "JSON"
    }).done(function(response) {
      sources.isms.cached = response;
      $.each(response, function() {
        var source = this;
        source.isms.forEach(function(ism) {
          var ismTags = ism["tags"];
          if (updateClouds) {
            tags.add(ismTags);
          }
          ismDivs += elements.addIsmDiv(source, ism, ismTags);
        });
      });
      elements.setIsmsList(ismDivs);
      tags.setCloud(tags.generateCloud());
    });
  },
  manageGetSourceListCall : function() {
    var url = "/isms/sourcelist/";
    $.ajax({
      type: "GET",
      url: url,
      dataType: "JSON"
    }).done(function(response) {
      $.each(response, function() {
        if (updateClouds) {
          globals.sourceCloudDict[this._id] = { title: this.title, author: this.author, added: this.added };
        }
      });
      var sourceCloud = sources.generateCloud();
      sources.setCloud(sourceCloud);
    });
  },
}
