$(document).ready(function() {

  // Click Entry Point Definitions =============================================================
  // Add or Update Ism button click
  $('#btnAddOrUpdateIsm').on('click', addOrUpdateIsm);

  // New Ism button click
  $('#newIsm').on('click', promptSourceSelection);

  // New Source button click
  $('#newSource').on('click', openNewSourceForm);

  // Show new ism form on source select
  $('#sourceListDiv').on('click', 'a.linksource', openNewIsmForm);

  // Show login form button click
  $('#login').on('click', promptUserToLogin);

  // Login submit button click
  $('#btnSubmitLogin').on('click', logUserIn);

  // Add Source submit button click
  $('#btnSubmitAddSource').on('click', addNewSource);

  // Login submit button click
  $('#logout').on('click', logUserOut);

  // Show all button click
  $('#showAll').on('click', generateContent);

  // Clear Ism button click
  $('#btnClearIsm').on('click', clearIsm);

  // Update Ism link click
  $('#ismList isms').on('click', 'a.linkupdateism', populateIsmFields);

  // Delete Ism link click
  $('#ismList isms').on('click', 'a.linkdeleteism', deleteIsm);

  // Tag cloud link click
  $('#tagCloud').on('click', 'a.linktagfilter', generateContent);

  // Source cloud link click
  $('#sourceCloud').on('click', 'a.linksourcefilter', generateContent);


  // Key Events =============================================================
  $("#addOrUpdateIsm").keyup(function (event) {
    // enter or ctrl+s
    if (event.ctrlKey && event.keyCode == 83) {
      $("#btnAddOrUpdateIsm").click();
      event.preventDefault();
    }
  });

  $(window).keydown(function(event) {
    // ctrl+s
    if(event.ctrlKey && event.keyCode == 83) {
      event.preventDefault();
    }
    // ctrl+i
    if(event.ctrlKey && event.keyCode == 73) {
      $('#newIsm').click();
      event.preventDefault();
    }
    // esc
    if(event.keyCode == 27) {
      hideModal(formModal);
      event.preventDefault();
    }
  });

  $('#btnClearIsm').on('keydown', function (evt) {
    if(evt.keyCode === 9) { // Tab pressed
      evt.preventDefault();
      $('#inputNumber').focus();
    }
  });

  $('input,select').keydown(function(event) {
    var key = event.charCode ? event.charCode : event.keyCode ? event.keyCode : 0;
    if (key == 13) {
      event.preventDefault();
      var inputs = $('#addOrUpdateIsm').find(':input:visible');
      var nextinput = 0;
      if (inputs.index(this) < (inputs.length - 1)) {
        nextinput = inputs.index(this) + 1;
      }
      if (inputs.length == 1) {
        $(this).blur().focus();
      } else {
        inputs.eq(nextinput).focus();
      }
    }
  });

  // close the modals on initial page load
  modal = document.getElementById('formModal');
  hideModal(formModal);

  loginModal = document.getElementById('loginModal');
  hideModal(loginModal);

  loggedOutModal = document.getElementById('loggedOutModal');
  hideModal(loggedOutModal);

  ismDeletedModal = document.getElementById('ismDeletedModal');
  hideModal(ismDeletedModal);

  sourceSelectModal = document.getElementById('sourceSelectModal');
  hideModal(sourceSelectModal);

  newSourceModal = document.getElementById('newSourceModal');
  hideModal(newSourceModal);

  hideButton('logout');
  hideButton('login');

  // generate the isms on initial page load if user is logged in
  if (checkLoggedIn()) {
    generateContent('');
    showButton('logout');
  } else {
    console.log("user is not logged in");
    promptUserToLogin();
  }
});

// Functions =============================================================

function hideButton(buttonClass) {
  $('#' + buttonClass).hide();
}

function showButton(buttonClass) {
  $('#' + buttonClass).show();
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    hideModal(formModal);
  }
}

function promptSourceSelection() {
  showModal(sourceSelectModal);
}

function openNewSourceForm(event) {
  handleLogin();
  showModal(newSourceModal);
  $('#inputTitle').focus();
}
