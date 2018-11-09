
// Get sesssion data from localStorage
var LOCAL_STORAGE_KEY = 'bp_session';
var sessionData = window.localStorage.getItem(LOCAL_STORAGE_KEY);
sessionData = sessionData ? JSON.parse(sessionData) : {submissions: 0, email: false};

/*
 * Validate the form
 *
 * - Check that fields aren't empty, if so add invalid class
 */
function validate(data) {
  var valid = true;

  for (var key in data) {
    var input = $("input[name='" + key + "']");

    if (!data[key]) {
      valid = false;
      input.addClass('invalid');
    }
    else {
      input.removeClass('invalid');
    }
  }

  return valid;
}

/*
 * Build data
 *
 * - Serialize form and build object
 */
function buildData(form) {
  return $(form).serializeArray().reduce(function(obj, item) {
    obj[item.name] = item.value.trim();

    if (obj[item.name]) {
      obj[item.name] = item.value.toLowerCase();
    }

    return obj;
  }, {});
}

/*
 * On submit handler
 */
function onSubmit(e) {
  var loadingCover = $('.loading-cover');
  var result = $('#result');

  e.preventDefault();

  // Get data from form
  var data = buildData(e.target);

  if (!validate(data)) {
    return
  }

  // Show loading screen
  loadingCover.addClass('show');

  // Clear old result
  result.html('');

  $('#result').html;

  $.ajax({
    url: "/find",
    method: "POST",
    data: JSON.stringify(data),
    timeout: 20000,
    contentType: "application/json; charset=utf-8",
    dataType: "json",
  })
  .done(function(data) {

    // Hide loading screen
    loadingCover.removeClass('show');

    // Set result
    $('#result').html('Sucesso! O email é: ' + data.email);

  })
  .fail(function (err) {

    // Hide loading screen
    loadingCover.removeClass('show');
    
    // Set result
    $('#result').html('Ooops! Ocorreu um erro ao tentar encontrar o email.');
    console.log(err)
  });

  return false;
}

/*
 * Initialize
 */
function init() {

  $('#email-form').on('submit', onSubmit);

  $(".button-collapse").sideNav();

  $('.modal').modal({
      dismissible: false, // Modal can be dismissed by clicking outside of the modal
      opacity: .5, // Opacity of modal background
      in_duration: 300, // Transition in duration
      out_duration: 200, // Transition out duration
      starting_top: '4%', // Starting top style attribute
      ending_top: '10%', // Ending top style attribute
    }
  );

}

$(document).ready(init);
