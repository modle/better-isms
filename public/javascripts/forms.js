function hideButton(buttonClass) {
  $("#" + buttonClass).hide();
}

function showButton(buttonClass) {
  $("#" + buttonClass).show();
}

function clearAllForms() {
  $("fieldset input").val("");
  $("fieldset textarea").val("");
}
