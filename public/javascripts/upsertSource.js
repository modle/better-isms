function upsertSource(event) {
  event.preventDefault();
  console.log("entering upsertSource!");
  handleLogin();
  // Super basic validation - increase errorCount variable if any fields are blank
  var errorCount = 0;
  $("#upsertSourceForm input").each(function(index, val) {
    if (this.value === "") {
      errorCount++;
    }
  });
  if (errorCount > 0) {
    alert("Please fill in all required fields");
    console.log("exiting upsertSource with return false");
    return false;
  }

  var source = {};
  source.title = $("#upsertSourceForm fieldset input#inputTitle").val();
  source.author = $("#upsertSourceForm fieldset input#inputAuthor").val();

  url = "/isms/addsource/";
  type = "POST";
  upsertedToastString = "Source added";
  var sourceId = $(this).attr("value");
  if (sourceId) {
    url += sourceId;
    type = "PUT";
    upsertedToastString =
      "Source " +
      getSourceDisplayString(sourceId) +
      " updated. New value: " +
      source.title +
      "(" +
      source.author +
      ")";
  }

  $.ajax({
    type: type,
    data: source,
    url: url,
    dataType: "JSON"
  }).done(function(response) {
    if (response.msg === "") {
      clearSourceFormFields();
      generateContent(null);
    } else {
      alert("Error: " + response.msg);
    }
  });
  hideModal(upsertSourceModal);
  showSourceUpsertedToast(upsertedToastString);
  console.log("exiting upsertSource");
}

function showSourceUpsertedToast(toastString) {
  $("#sourceUpsertedHeader").html(toastString);
  showModal(sourceUpsertedModal);
  hideModalAfterAWhile(sourceUpsertedModal);
}

function clearSourceFormFields() {
  $("#upsertSourceForm fieldset input").val("");
}

function openUpsertSourceForm(event) {
  handleLogin();
  showModal(upsertSourceModal);
  $("#sourceFormTitle").html("Add source");
  $("#upsertSourceModal fieldset button#btnSubmitUpsertSource").val("");
  $("#upsertSourceModal fieldset button#btnSubmitUpsertSource").html("Add");
  if (filterId) {
    source = sourceCloudDict[filterId];
    $("#sourceFormTitle").html("Update source");
    $("#upsertSourceModal fieldset input#inputTitle").val(source["title"]);
    $("#upsertSourceModal fieldset input#inputAuthor").val(source["author"]);
    $("#upsertSourceModal fieldset button#btnSubmitUpsertSource").val(filterId);
    $("#upsertSourceModal fieldset button#btnSubmitUpsertSource").html(
      "Update"
    );
  }
  $("#inputTitle").focus();
}
