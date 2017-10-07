$(document).ready(function() {
  // Click Entry Point Definitions =============================================================

  $("#login").on("click", promptUserToLogin);
  $("#btnSubmitLogin").on("click", logUserIn);
  $("#logout").on("click", logUserOut);

  $("#upsertSource").on("click", openUpsertSourceForm);
  $("#upsertSource2").on("click", openUpsertSourceForm);
  $("#btnSubmitUpsertSource").on("click", upsertSource);

  // Show new ism form on source select
  $("#sourceListDiv").on("click", "a.linksource", openNewIsmForm);
  $("#newIsm").on("click", promptSourceSelection);
  $("#btnShowBulkAddIsm").on("click", openBulkAddIsmForm);
  $("#btnSubmitBulkAddIsm").on("click", bulkUpsertIsms);
  $("#btnUpsertIsm").on("click", upsertIsm);
  $("#btnClearIsm").on("click", clearIsm);

  $(".hideModals").on("click", hideAllModals);
  $("#clearFilter").on("click", clearFilter);

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
