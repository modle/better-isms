var modal;
var span;

$(document).ready(function() {
  modal = document.getElementById('myModal');
  span = document.getElementsByClassName("modal-close")[0];

  // When the user clicks on the button, open the modal
  $('#modalBtn').on('click', openModal);

  // When the user clicks on <span> (x), close the modal
  $('.modal-close').on('click', closeModal);

  closeModal();
});

// Get the modal

function openModal() {
  console.log("opening modal");
  modal.style.display = "block";
}

function closeModal() {
  console.log("closing modal");
  modal.style.display = "none";
}


// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        closeModal();
    }
}
