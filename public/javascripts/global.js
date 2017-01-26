// Userlist data array for filling in info box
var userListData = [];

// DOM Ready =============================================================
$(document).ready(function() {
    // Populate the user table on initial page load
    populateTable();

    // Username link click
    $('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);

    // Add User button click
    $('#btnAddUser').on('click', addUser);

    // Update User link click
    $('#userList table tbody').on('click', 'td a.linkupdateuser', populateUpdateUserFields);

    // Update User button click
    $('#btnUpdateUser').on('click', updateUser);

    // Delete User link click
    $('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);
});

// Functions =============================================================

// Fill table with data
function populateTable() {
    // Empty content string
    var tableContent = '';
    // jQuery AJAX call for JSON
    $.getJSON( '/users/userlist', function( data ) {
        userListData = data;
        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '">' + this.username + '</a></td>';
            tableContent += '<td>' + this.email + '</td>';
            tableContent += '<td><a href="#" class="linkupdateuser" rel="' + this._id + '">update</a></td>';
            tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#userList table tbody').html(tableContent);
    });
};

// Show User Info
function showUserInfo(event) {
    // Prevent Link from Firing
    event.preventDefault();

    // Retrieve username from link rel attribute
    var thisUserName = $(this).attr('rel');

    // Get Index of object based on id value
    var arrayPosition = userListData.map(function(arrayItem) { return arrayItem.username; }).indexOf(thisUserName);

    // Get our User Object
    var thisUserObject = userListData[arrayPosition];

    //Populate Info Box
    $('#userInfoName').text(thisUserObject.fullname);
    $('#userInfoAge').text(thisUserObject.age);
    $('#userInfoGender').text(thisUserObject.gender);
    $('#userInfoLocation').text(thisUserObject.location);
};

// Add User
function addUser(event) {
    event.preventDefault();
    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addUser input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    if(errorCount === 0) {
        var newUser = {
            'username': $('#addUser fieldset input#inputUserName').val(),
            'email': $('#addUser fieldset input#inputUserEmail').val(),
            'fullname': $('#addUser fieldset input#inputUserFullname').val(),
            'age': $('#addUser fieldset input#inputUserAge').val(),
            'location': $('#addUser fieldset input#inputUserLocation').val(),
            'gender': $('#addUser fieldset input#inputUserGender').val()
        }
        $.ajax({
            type: 'POST',
            data: newUser,
            url: '/users/adduser',
            dataType: 'JSON'
        }).done(function( response ) {
            if (response.msg === '') {
                $('#addUser fieldset input').val('');
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

// Delete User
function deleteUser(event) {
    event.preventDefault();
    var confirmation = confirm('Are you sure you want to delete this user?');
    userId = $(this).attr('rel');
    if (confirmation === true) {
        $.ajax({
            type: 'DELETE',
            url: '/users/deleteuser/' + userId
        }).done(function( response ) {
            if (response.msg === '') {
            } else {
                alert('Error: ' + response.msg);
            }
            populateTable();
            // clear the update fields if the id matches
            if ($('#updateUser fieldset button#btnUpdateUser').val() === userId) {
                $('#updateUser fieldset input').val('');
                $('#userBeingUpdated').text('');
            }
        });
    }
    else {
        return false;
    }
};

function populateUpdateUserFields(event) {
    event.preventDefault();
    console.log('populatefieldsclicked!');

    // Retrieve username from link rel attribute
    var thisUserId = $(this).attr('rel');

    console.log('id is ' + thisUserId);

    // Get Index of object based on id value
    var arrayPosition = userListData.map(function(arrayItem) {
        return arrayItem._id;
    }).indexOf(thisUserId);

    // Get our User Object
    var thisUserObject = userListData[arrayPosition];

    //Populate Update Fields
    console.log('the user is ' + JSON.stringify(thisUserObject));

    // fill the user to update field with the username
    $('#userBeingUpdated').text(thisUserObject.username);

    // Inject the current value into the update field
    $('#updateUser fieldset input#updateUserName').val(thisUserObject.username);
    $('#updateUser fieldset input#updateUserFullname').val(thisUserObject.fullname);
    $('#updateUser fieldset input#updateUserLocation').val(thisUserObject.location);
    $('#updateUser fieldset input#updateUserEmail').val(thisUserObject.email);
    $('#updateUser fieldset input#updateUserAge').val(thisUserObject.age);
    $('#updateUser fieldset input#updateUserGender').val(thisUserObject.gender);
    $('#updateUser fieldset button#btnUpdateUser').val(thisUserObject._id);

    console.log('exiting populateUpdateUserFields');
}

function updateUser(event) {
    event.preventDefault();
    console.warn('triggered updateUser');
    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#updateUser input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    if(errorCount === 0) {
        var updateUser = {
            'username': $('#updateUser fieldset input#updateUserName').val(),
            'fullname': $('#updateUser fieldset input#updateUserFullname').val(),
            'location': $('#updateUser fieldset input#updateUserLocation').val(),
            'email': $('#updateUser fieldset input#updateUserEmail').val(),
            'age': $('#updateUser fieldset input#updateUserAge').val(),
            'gender': $('#updateUser fieldset input#updateUserGender').val()
        }
        console.log($(this).attr('value'));
        $.ajax({
            type: 'PUT',
            data: updateUser,
            url: '/users/updateuser/' + $(this).attr('value'),
            dataType: 'JSON'
        }).done(function( response ) {
            if (response.msg === '') {
                $('#updateUser fieldset input').val('');
                $('#userBeingUpdated').text('');
                populateTable();
                console.log('user updated!');
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
