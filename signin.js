/**
 * Name: Evelyn Salas & Lisa Ynineb
 * Date: 12/09/2024
 * Section: CSE 154 AB
 *
 * Client side code for the sign in feature of our final project, a travel website. Users can
 * sign in and log out of our website.
 */

"use strict";

(function() {

  window.addEventListener("load", init);

  /**
   * Initializes the login page.
   *
   * This function pre-fills the email and password fields if saved in localStorage,
   * sets up event listeners for the menu navigation and login form submission.
   *
   * @function init
   */
  function init() {
    const storedUsername = localStorage.getItem('username');
    const storedPassword = localStorage.getItem('password');

    if (storedUsername) {
      id('email').value = storedUsername;
    }

    if (storedPassword) {
      id('password').value = storedPassword;
    }

    let menu = id('menu');
    menu.addEventListener('click', function() {
      window.location.href = "index.html";
    });

    let form = id('formlog');
    form.addEventListener('submit', function(event) {
      event.preventDefault();
      handleLogin();
    });
  }

  /**
   * Handles user login by sending credentials to the server.
   *
   * This function collects the user's email and password, sends them to the server
   * via a POST request, and handles the server's response to log in or display an error message.
   *
   * @async
   * @function handleLogin
   */
  async function handleLogin() {
    const email = id('email').value;
    const password = id('password').value;

    try {
      const result = await submitLoginRequest(email, password);
      handleLoginResponse(result);
    } catch (err) {
      handleError(err);
    }
  }

  /**
   * Submits the login request with the provided email and password.
   *
   * @async
   * @function submitLoginRequest
   * @param {string} email - The user's email address.
   * @param {string} password - The user's password.
   * @returns {Promise<Response>} The response from the server.
   * @throws {Error} Throws an error if the login request fails or the server returns an
   * unsuccessful response.
   */
  async function submitLoginRequest(email, password) {
    const URLLOGIN = 'http://localhost:8000/login';

    const response = await fetch(URLLOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({email, password})
    });

    if (!response.ok) {
      const responseText = await response.text();
      throw new Error(`Login failed. Server response: ${responseText}`);
    }

    return response;
  }

  /**
   * Handles the response from the server after the login attempt.
   *
   * This function processes the server response to either log the user in,
   * or display an error message based on the server's response.
   *
   * @function handleLoginResponse
   * @param {Response} result - The response from the server after the login request.
   */
  function handleLoginResponse(result) {
    const error = id('error');
    error.classList.add('hidden');
    error.textContent = '';

    result.json().then(datalog => {
      if (datalog.status === 'success') {
        localStorage.setItem('username', id('email').value);
        localStorage.setItem('password', id('password').value);
        window.location.href = "account.html";
      } else {
        error.textContent = datalog.message || 'Invalid email or password.';
        error.classList.remove('hidden');
      }

      id('formlog').reset();
    })
      .catch(handleError);
  }

  /**
   * Handles errors by displaying an error message and hiding certain elements of the interface.
   * It also disables navigation buttons in case of an error.
   * @param {Error} err - The error that was generated.
   * @returns {void}
   */
  function handleError(err) {
    console.error('Error:', err);
    const error = id('error');
    error.textContent = 'Network error. Please try again later.';
    error.classList.remove('hidden');
  }

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} idName - element ID
   * @returns {object} DOM object associated with id.
   */
  function id(idName) {
    return document.getElementById(idName);
  }

})();
