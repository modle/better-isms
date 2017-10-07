function hideModalAfterAWhile(modal) {
  setTimeout(function() {
    hideModal(modal);
  }, 3000);
}

function hideModal(modal) {
  modal.style.display = "none";
}

function showModal(modal) {
  console.log("showing modal: " + modal.id);
  modal.style.display = "block";
}

function hideAllModals() {
  for (var modal of modals) {
    hideModal(modal);
  }
  clearAllForms();
}
