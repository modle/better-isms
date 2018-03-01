var modals = {
  elements : {},
  init : function() {
    modals.elements = document.getElementsByClassName("modal");
  },
  hideAfterALongWhile : function(modal) {
    modals.hideWithDelay(modal, 6000);
  },
  hideAfterAWhile : function(modal) {
    modals.hideWithDelay(modal, 3000);
  },
  hideWithDelay : function(modal, timeInMs) {
    setTimeout(function() {
      modals.hideElement(modal);
    }, timeInMs);
  },
  hideElement : function(modal) {
    modal.style.display = "none";
  },
  show : function(modal) {
    console.log("showing modal: " + modal.id);
    modal.style.display = "block";
  },
  hide : function() {
    for (var element of modals.elements) {
      modals.hideElement(element);
    }
    showFooter();
    forms.clearAll();
  },
};
