$(document).ready(function() {
  // Click Entry Point Definitions =============================================================

  $("#login").on("click", promptUserToLogin);
  $("#btnSubmitLogin").on("click", logUserIn);
  $("#logout").on("click", logUserOut);
  $("#export").on("click", exportData);

  $("#addSource").on("click", addSource);
  $("#btnSubmitUpsertSource").on("click", upsertSource);

  $("#newIsm").on("click", openNewIsmForm);
  $("#btnShowBulkAddIsm").on("click", openBulkAddIsmForm);
  $("#btnSubmitBulkAddIsm").on("click", bulkUpsertIsms);
  $("#btnUpsertIsm").on("click", upsertIsm);
  $("#saveAndNext").on("click", updateTagmeIsm);
  $("#moreFields").on("click", toggleOptionalFields);

  $(".hideModals").on("click", hideAllModals);
  $("#clearFilter").on("click", clearFilter);
  $("#quitIsmUpdate").on("click", stopTagmeUpdate);

  $("#ismList isms").on("click", "a.linkeditism", populateIsmFields);
  $("#ismList isms").on("click", "a.linkdeleteism", deleteIsm);

  $("#tagCloud").on("click", "a.linktagfilter", prepFilter);
  $("#toggleTags").on("click", toggleTags);
  $("#untagged").on("click", processUntagged);
  $("#sourceCloud").on("click", "a.linksourcefilter", prepFilter);
  $("#toggleSources").on("click", toggleSources);

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
      hideAllModals();
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
  hideElement("logout");
  hideElement("login");
  if (checkLoggedIn()) {
    generateContent("");
    showElement("logout");
  } else {
    console.log("user is not logged in");
    promptUserToLogin();
  }
});


function exportData() {
  handleLogin();
  var txtFile = "test.txt";
  var file = new File([""], txtFile);
  var str = JSON.stringify(ismListData);
  var dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(str);


  var link = document.createElement("a");
  link.setAttribute("href", dataUri);
  link.setAttribute("download", "export.json");
  document.body.appendChild(link); // Required for FF

  link.click(); // This will download the data file named "my_data.csv".
}

function hideFooter() {
  var footer = document.getElementById("footer");
  footer.style.display = "none";
}

function showFooter() {
  var footer = document.getElementById("footer");
  footer.style.display = "block";
}

function toggleTags() {
  let tagDiv = document.getElementById("tagCloud");
  if (tagDiv.style.display === "none" || !tagDiv.style.display) {
    tagDiv.style.display = "flex";
  } else {
    tagDiv.style.display = "none";
  }
}

function toggleSources() {
  let sourceDiv = document.getElementById("sourceCloud");
  if (sourceDiv.style.display === "flex" || !sourceDiv.style.display) {
    sourceDiv.style.display = "none";
  } else {
    sourceDiv.style.display = "flex";
  }
}

function hideElement(elementClass) {
  $("#" + elementClass).hide();
}

function showElement(elementClass) {
  $("#" + elementClass).show();
}

function setText(elementClass, text) {
  $("#" + elementClass).text(text);
}

function processUntagged() {
  getTagmeIsms();
}

function stopTagmeUpdate() {
  untaggedIsms = undefined;
  hideAllModals();
  clearFilter();
}
