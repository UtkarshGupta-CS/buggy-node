(function() {
  function init() {
    $('#regSubmitButton').click(regSubmitButtonHandler);
    $('#loginSubmitButton').click(loginSubmitButtonHandler);
  }

  function regSubmitButtonHandler(evt) {
    const form = document.getElementById('registrationform');

    //prevent form submission
    evt.preventDefault();
    evt.stopPropagation();

    //make the AJAX call
    axios
      .post('/api/users', {
        username: form.username.value,
        email: form.email.value,
        password: form.password.value,
      })
      .then(res => {
        console.log(res);
      })
      .catch(error => {
        console.log(error);
      });
  }

  function loginSubmitButtonHandler(evt) {
    const form = document.getElementById('loginform');

    //prevent form submission
    evt.preventDefault();
    evt.stopPropagation();

    //make the AJAX call
    axios
      .post('/api/authenticate', {
        username: form.username.value,
        password: form.password.value,
      })
      .then(res => {
        console.log(res);
      })
      .catch(error => {
        console.log(error);
      });
  }

  //init on document ready
  $(document).ready(init);
})();
