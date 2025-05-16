/**
 * Name: Evelyn Salas & Lisa Ynineb
 * Date: 12/09/2024
 * Section: CSE 154 AB
 *
 * Client side code for the sign in feature of our final project, a travel website. Users can
 * create an account to sign into our website
 */

"use strict";

(function() {

  window.addEventListener("load", init);

  /**
   * Initializes the application by setting up event listeners.
   * This function adds a click event listener to a menu button to redirect to the homepage
   * and a submit event listener to the signup form to handle user registration.
   * @function init
   */
  function init() {
    let menu = id('menu');

    menu.addEventListener('click', function() {
      window.location.href = "index.html";
    });

    const form = id('form');
    form.addEventListener('submit', handleSignupSubmit);
  }

  /**
   * Handles the signup form submission.
   * This function prevents the default form submission behavior and calls signup logic.
   * @function handleSignupSubmit
   * @param {Event} event - The form submit event.
   */
  function handleSignupSubmit(event) {
    event.preventDefault();
    signup();
  }

  /**
   * Handles user signup by collecting form data and sending it to the server.
   * This function sends the data to the server and processes the response.
   * @async
   * @function signup
   */
  async function signup() {
    const email = id('email').value;
    const password = id('password').value;
    const firstName = id('first-name').value;
    const lastName = id('last-name').value;
    const phoneNumber = id('phone-number').value;
    const message = id('message');

    clearMessage(message);

    try {
      const result = await submitSignupData(email, password, firstName, lastName, phoneNumber);
      handleSignupResponse(result, message);
    } catch (err) {
      handleError(err, message);
    }
  }

  /**
   * Clears any previous message in the signup form.
   * @function clearMessage
   * @param {HTMLElement} message - The DOM element where the message is displayed.
   */
  function clearMessage(message) {
    message.textContent = '';
    message.classList.add('hidden');
  }

  /**
   * Submits the signup data to the server.
   * @async
   * @function submitSignupData
   * @param {string} email - The user's email.
   * @param {string} password - The user's password.
   * @param {string} firstName - The user's first name.
   * @param {string} lastName - The user's last name.
   * @param {string} phoneNumber - The user's phone number.
   * @returns {Promise<Response>} The response from the server.
   * @throws {Error} Throws an error if the request fails.
   */
  async function submitSignupData(email, password, firstName, lastName, phoneNumber) {
    const URLSIGNUP = 'http://localhost:8000/signup';

    const response = await fetch(URLSIGNUP, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({email, password, firstName, lastName, phoneNumber})
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }

    return response;
  }

  /**
   * Handles the server response after submitting signup data.
   * @function handleSignupResponse
   * @param {Response} result - The server response.
   * @param {HTMLElement} message - The DOM element where the message is displayed.
   */
  function handleSignupResponse(result, message) {
    result.text().then(successMessage => {
      message.textContent = successMessage;
      message.classList.remove('hidden');
      id('form').reset();
    })
      .catch(handleError);
  }

  /**
   * Handles errors by displaying an error message.
   * @function handleError
   * @param {Error} err - The error to be handled.
   * @param {HTMLElement} message - The DOM element where the error message is displayed.
   */
  function handleError(err, message) {
    message.textContent = `Error: ${err.message}`;
    message.classList.remove('hidden');
    console.error(err);
  }

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} idName - The element ID.
   * @returns {HTMLElement} The DOM object associated with the id.
   */
  function id(idName) {
    return document.getElementById(idName);
  }

})();
