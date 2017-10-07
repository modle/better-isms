var filter = "";

$(document).ready(function() {
  // Click Entry Point Definitions =============================================================

  $("#login").on("click", promptUserToLogin);
  $("#btnSubmitLogin").on("click", logUserIn);
  $("#logout").on("click", logUserOut);

  $("#upsertSource").on("click", openUpsertSourceForm);
  $("#upsertSource2").on("click", openUpsertSourceForm);
  $("#btnSubmitUpsertSource").on("click", upsertSource);
  $("#btnEditSource").on("click", openUpsertSourceForm);

  // Show new ism form on source select
  $("#sourceListDiv").on("click", "a.linksource", openNewIsmForm);
  $("#newIsm").on("click", promptSourceSelection);
  $("#btnShowBulkAddIsm").on("click", openBulkAddIsmForm);
  $("#btnSubmitBulkAddIsm").on("click", bulkUpsertIsms);
  $("#btnUpsertIsm").on("click", upsertIsm);
  $("#btnClearIsm").on("click", clearIsm);

  $(".hideModals").on("click", hideAllModals);
  $("#clearFilter").on("click", generateContent);

  $("#ismList isms").on("click", "a.linkupdateism", populateIsmFields);
  $("#ismList isms").on("click", "a.linkdeleteism", deleteIsm);

  $("#tagCloud").on("click", "a.linktagfilter", prepFilter);
  $("#sourceCloud").on("click", "a.linksourcefilter", prepFilter);

  // Key Events =============================================================
  $("#upsertIsmForm").keyup(function(event) {
    // enter or ctrl+s
    if (event.ctrlKey && event.keyCode == 83) {
      $("#btnUpsertIsm").click();
      event.preventDefault();
    }
  });

  $(window).keydown(function(event) {
    // ctrl+s
    if (event.ctrlKey && event.keyCode == 83) {
      event.preventDefault();
    }
    // ctrl+i
    if (event.ctrlKey && event.keyCode == 73) {
      $("#newIsm").click();
      event.preventDefault();
    }
    // esc
    if (event.keyCode == 27) {
      for (var modal of modals) {
        hideModal(modal);
      }
      event.preventDefault();
    }
  });

  $("#btnClearIsm").on("keydown", function(evt) {
    if (evt.keyCode === 9) {
      // Tab pressed
      evt.preventDefault();
      $("#inputNumber").focus();
    }
  });

  $("input,select").keydown(function(event) {
    var key = event.charCode
      ? event.charCode
      : event.keyCode ? event.keyCode : 0;
    if (key == 13) {
      event.preventDefault();
      var inputs = $("#upsertIsmForm").find(":input:visible");
      var nextinput = 0;
      if (inputs.index(this) < inputs.length - 1) {
        nextinput = inputs.index(this) + 1;
      }
      if (inputs.length == 1) {
        $(this)
          .blur()
          .focus();
      } else {
        inputs.eq(nextinput).focus();
      }
    }
  });

  // get the modals
  modals = document.getElementsByClassName("modal");

  // generate the isms on initial page load if user is logged in
  hideButton("logout");
  hideButton("login");
  if (checkLoggedIn()) {
    generateContent("");
    showButton("logout");
  } else {
    console.log("user is not logged in");
    promptUserToLogin();
  }
});

// Functions =============================================================

function hideButton(buttonClass) {
  $("#" + buttonClass).hide();
}

function showButton(buttonClass) {
  $("#" + buttonClass).show();
}

function promptSourceSelection() {
  showModal(sourceSelectModal);
}

function openUpsertSourceForm(event) {
  handleLogin();
  showModal(upsertSourceModal);
  var sourceId = $(this).attr("value");
  console.log(sourceId);
  $("#sourceFormTitle").html("Add source");
  $("#upsertSourceModal fieldset button#btnSubmitUpsertSource").val("");
  $("#upsertSourceModal fieldset button#btnSubmitUpsertSource").html("Add");
  if (sourceId) {
    source = sourceCloudDict[sourceId];
    $("#sourceFormTitle").html("Update source");
    $("#upsertSourceModal fieldset input#inputTitle").val(source["title"]);
    $("#upsertSourceModal fieldset input#inputAuthor").val(source["author"]);
    $("#upsertSourceModal fieldset button#btnSubmitUpsertSource").val(sourceId);
    $("#upsertSourceModal fieldset button#btnSubmitUpsertSource").html(
      "Update"
    );
  }
  $("#inputTitle").focus();
}

function hideAllModals() {
  for (var modal of modals) {
    hideModal(modal);
  }
  clearAllForms();
}

function clearAllForms() {
  $("fieldset input").val("");
  $("fieldset textarea").val("");
}

function prepFilter(event) {
  eventInfo = {};
  eventInfo.eventClass = $(this).attr("class");
  eventInfo.theRel = $(this).attr("rel");
  if (eventInfo.eventClass == "linksourcefilter") {
    filter = "source";
  } else if (eventInfo.eventClass == "linktagfilter") {
    filter = "tag";
  }
  generateContent(eventInfo);
}
