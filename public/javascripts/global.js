// Ismlist data array for filling in info box
var ismData = [];

// DOM Ready =============================================================
$(document).ready(function() {
    // Populate the ism table on initial page load
    populateTable();

    // Add Ism button click
    $('#btnAddIsm').on('click', addIsm);

    // Update Ism link click
    $('#ismList table tbody').on('click', 'td a.linkupdateism', populateUpdateIsmFields);

    // Update Ism button click
    $('#btnUpdateIsm').on('click', updateIsm);

    // Delete Ism link click
    $('#ismList table tbody').on('click', 'td a.linkdeleteism', deleteIsm);
});

// Functions =============================================================

// Fill table with data
function populateTable() {
    // Empty content string
    console.log('isms populated!');

    var tableContent = '';
    // jQuery AJAX call for JSON
    $.getJSON( '/isms/ismlist', function( data ) {
        ismListData = data;
        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td>' + this.source + '</td>';
            tableContent += '<td>' + this.number + '</td>';
            tableContent += '<td>' + (this.tags || '') + '</td>';
            tableContent += '<td>' + this.quote + '</td>';
            tableContent += '<td>' + this.comments + '</td>';
            tableContent += '<td><a href="#" class="linkupdateism" rel="' + this._id + '">u</a></td>';
            tableContent += '<td><a href="#" class="linkdeleteism" rel="' + this._id + '">d</a></td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#ismList table tbody').html(tableContent);
    });
};

// Add Ism
function addIsm(event) {
    event.preventDefault();
    console.log('add ism clicked!');

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addIsm input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    if(errorCount === 0) {
        var newIsm = {
            'source': $('#addIsm fieldset input#inputSource').val(),
            'number': $('#addIsm fieldset input#inputNumber').val(),
            'tags': $('#addIsm fieldset input#inputTags').val(),
            'quote': $('#addIsm fieldset input#inputQuote').val(),
            'comments': $('#addIsm fieldset input#inputComments').val(),
        }
        $.ajax({
            type: 'POST',
            data: newIsm,
            url: '/isms/addism',
            dataType: 'JSON'
        }).done(function( response ) {
            if (response.msg === '') {
                $('#addIsm fieldset input').val('');
                populateTable();
            } else {
                alert('Error: ' + response.msg);
            }
        });
    }
    else {
        alert('Please fill in all fields');
        return false;
    }
};

// Delete Ism
function deleteIsm(event) {
    event.preventDefault();
    console.log('delete ism clicked!');

    var confirmation = confirm('Are you sure you want to delete this ism?');
    ismId = $(this).attr('rel');
    if (confirmation === true) {
        $.ajax({
            type: 'DELETE',
            url: '/isms/deleteism/' + ismId
        }).done(function( response ) {
            if (response.msg === '') {
            } else {
                alert('Error: ' + response.msg);
            }
            populateTable();
            // clear the update fields if the id matches
            if ($('#updateIsm fieldset button#btnUpdateIsm').val() === ismId) {
                $('#updateIsm fieldset input').val('');
                $('#ismBeingUpdated').text('');
            }
        });
    }
    else {
        return false;
    }
};

function populateUpdateIsmFields(event) {
    event.preventDefault();
    console.log('populatefieldsclicked!');

    // Retrieve ismname from link rel attribute
    var thisIsmId = $(this).attr('rel');

    console.log('id is ' + thisIsmId);

    // Get Index of object based on id value
    var arrayPosition = ismListData.map(function(arrayItem) {
        return arrayItem._id;
    }).indexOf(thisIsmId);

    // Get our Ism Object
    var thisIsmObject = ismListData[arrayPosition];

    //Populate Update Fields
    console.log('the ism is ' + JSON.stringify(thisIsmObject));

    // fill the ism to update field with the ismname
    $('#ismBeingUpdated').text(thisIsmObject.ismname);

    // Inject the current value into the update field
    $('#updateIsm fieldset input#updateSource').val(thisIsmObject.source);
    $('#updateIsm fieldset input#updateNumber').val(thisIsmObject.number);
    $('#updateIsm fieldset input#updateTags').val(thisIsmObject.tags);
    $('#updateIsm fieldset input#updateQuote').val(thisIsmObject.quote);
    $('#updateIsm fieldset input#updateComments').val(thisIsmObject.comments);
    $('#updateIsm fieldset button#btnUpdateIsm').val(thisIsmObject._id);

    console.log('exiting populateUpdateIsmFields');
}

function updateIsm(event) {
    event.preventDefault();
    console.warn('triggered updateIsm');
    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#updateIsm input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    if(errorCount === 0) {
        var updateIsm = {
            'source': $('#updateIsm fieldset input#updateSource').val(),
            'number': $('#updateIsm fieldset input#updateNumber').val(),
            'tags': $('#updateIsm fieldset input#updateTags').val(),
            'quote': $('#updateIsm fieldset input#updateQuote').val(),
            'comments': $('#updateIsm fieldset input#updateComments').val(),
        }
        console.log($(this).attr('value'));
        $.ajax({
            type: 'PUT',
            data: updateIsm,
            url: '/isms/updateism/' + $(this).attr('value'),
            dataType: 'JSON'
        }).done(function( response ) {
            if (response.msg === '') {
                $('#updateIsm fieldset input').val('');
                $('#ismBeingUpdated').text('');
                populateTable();
                console.log('ism updated!');
            } else {
                alert('Error: ' + response.msg);
            }
        });
    }
    else {
        alert('Please fill in all fields');
        return false;
    }
};
