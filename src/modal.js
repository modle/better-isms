function hideModalAfterALongWhile(modal) {
  hideModalWithDelay(modal, 6000);
}

function hideModalAfterAWhile(modal) {
  hideModalWithDelay(modal, 3000);
}

function hideModalWithDelay(modal, timeInMs) {
  setTimeout(function() {
    hideModal(modal);
  }, timeInMs);
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
  showFooter();
  clearAllForms();
}
