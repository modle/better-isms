var database = {
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
        content.generate(null);
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
        content.generate(null);
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
        content.removeIsmFromList(ids.sourceId, ids.ismId);
        content.kickOffUpdateForm(ids.type);
      } else {
        alert("Error: " + response.msg);
        resetUpdateTracker();
      }
    });
    log.exit(getName());
  },
  getIsm : function(ids) {
    let ism = database.getIsmFromSource(ids);
    if (globals.currentlyUpdating === 'untagged') {
      ism.tags = database.getTagsFromForm();
    } else if (globals.currentlyUpdating === 'uncommented') {
      ism.comments = database.getCommentFromForm();
      // this is needed because the post expects an array, but the object stores a string for single tags
      ism.tags = database.buildTags(ism.tags);
    }
    return ism;
  },
  getIsmFromSource : function(ids) {
    let source = globals.targetIsms.find(aSource => aSource._id === ids.sourceId);
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
        content.generate(null);
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
    clearFilter();
    hideFooter();
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
        content.generate();
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
}
