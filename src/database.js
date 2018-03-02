var database = {
  determineIsmQueryUrl : function() {
    url = "/isms/ismlist/";
    if (contentControl.props.filterType) {
      url += contentControl.props.filterType + "/" + contentControl.props.filterId;
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
    ism.tags = tags.buildArray($("#upsertIsmForm fieldset input#inputTags").val());
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
    let ism = contentControl.targetIsmsControl.getIsm(ids);
    let url = "/isms/updateism/" + ids.sourceId + "/" + ids.ismId;
    $.ajax({
      type: "PUT",
      data: ism,
      url: url,
      dataType: "JSON"
    }).done(function(response) {
      if (response.msg === "") {
        contentControl.targetIsmsControl.removeFromList(ids.sourceId, ids.ismId);
        forms.kickOffUpdateForm(ids.type);
      } else {
        alert("Error: " + response.msg);
        forms.resetUpdateTracker();
      }
    });
    log.exit(getName());
  },
  upsertSource : function(event) {
    event.preventDefault();
    log.enter(getName());
    if(database.okToProceed("upsertSourceForm")) {
      return false;
    };
    let putTargetId = $(this).attr("value");
    $.ajax(database.buildSourceAjaxObject(putTargetId))
    .done(function(response) {
      if (response.msg === "") {
        forms.clearSourceFormFields();
        contentControl.generate(null);
      } else {
        alert("Error: " + response.msg);
      }
    });
    modals.hide();
    log.exit(getName());
  },
  okToProceed : function(formName) {
    auth.handleLogin();
    if (!forms.validate(formName)) {
      log.exit(getName());
      return false;
    }
  },
  buildSourceAjaxObject : function(putTarget) {
    console.log(putTarget);
    return {
      type: putTarget ? "PUT" : "POST",
      data: this.buildSourceObject(),
      url: putTarget ? "/isms/updatesource/" + putTarget : "/isms/addsource/",
      dataType: "JSON"
    };
  },
  buildSourceObject : function() {
    var source = {};
    source.title = $("#upsertSourceForm fieldset input#inputTitle").val();
    source.author = $("#upsertSourceForm fieldset input#inputAuthor").val();
    return source;
  },
  openUpsertSourceForm : function() {
    auth.handleLogin();
    modals.show(upsertSourceModal);
    $("#sourceFormTitle").html("Add source");
    $("#upsertSourceModal fieldset button#btnSubmitUpsertSource").val("");
    $("#upsertSourceModal fieldset button#btnSubmitUpsertSource").html("Add");
    if (contentControl.props.filterId) {
      source = contentControl.props.sourceCloudDict[contentControl.props.filterId];
      $("#sourceFormTitle").html("Update source");
      $("#upsertSourceModal fieldset input#inputTitle").val(source["title"]);
      $("#upsertSourceModal fieldset input#inputAuthor").val(source["author"]);
      $("#upsertSourceModal fieldset button#btnSubmitUpsertSource").val(contentControl.props.filterId);
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
          contentControl.props.sourceCloudDict[this._id] = { title: this.title, author: this.author, added: this.added };
        }
      });
      var sourceCloud = sources.generateCloud();
      sources.setCloud(sourceCloud);
    });
  },
}
