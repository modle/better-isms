var globals = {
  targetIsms: undefined,
  currentlyUpdating: undefined,
  cachedIsms: {},
  filterType: "",
  filterId: "",
  sourceCloudDict: {},
  tagCloudDict: {},
};

$(document).ready(function() {
  // Click Entry Point Definitions =============================================================

  $("#btnSubmitLogin").on("click", auth.logUserIn);
  $("#login").on("click", auth.promptUserToLogin);
  $("#logout").on("click", auth.logUserOut);

  $("#addSource").on("click", database.addSource);
  $("#btnSubmitBulkAddIsm").on("click", database.bulkUpsertIsms);
  $("#btnSubmitUpsertSource").on("click", database.upsertSource);
  $("#btnUpsertIsm").on("click", database.upsertIsm);
  $("#export").on("click", database.exportData);
  $("#ismList isms").on("click", "a.linkdeleteism", database.deleteIsm);
  $("#save-and-next-uncommented").on("click", database.updateIsmSingleField);
  $("#save-and-next-untagged").on("click", database.updateIsmSingleField);

  $("#ismList isms").on("click", "a.linkeditism", ismForm.populateFields);
  $("#moreFields").on("click", ismForm.toggleOptionalFields);
  $("#newIsm").on("click", ismForm.openNew);

  $("#btnShowBulkAddIsm").on("click", forms.openBulkAddIsm);
  $("#quitIsmUpdateComment").on("click", forms.stopUpdate);
  $("#quitIsmUpdateTag").on("click", forms.stopUpdate);

  $(".hideModals").on("click", modals.hide);

  $("#clearFilter").on("click", content.clearFilterAndReload);
  $("#sourceCloud").on("click", "a.linksourcefilter", content.prepFilter);
  $("#tagCloud").on("click", "a.linktagfilter", content.prepFilter);
  $("#toggleSources").on("click", content.toggleSources);
  $("#toggleTags").on("click", content.toggleTags);
  $("#uncommented").on("click", content.processUncommented);
  $("#untagged").on("click", content.processUntagged);


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
      modals.hide();
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

  // generate the isms on initial page load if user is logged in
  content.hideElement("logout");
  content.hideElement("login");
  if (auth.checkLoggedIn()) {
    content.generate("");
    content.showElement("logout");
  } else {
    console.log("user is not logged in");
    auth.promptUserToLogin();
  }
});

function getName() {
  return getName.caller.name;
}

var log = {
  exit : function(name) {
    console.log("exiting", name);
  },
  enter : function(name) {
    console.log("entering", name);
  },
};
