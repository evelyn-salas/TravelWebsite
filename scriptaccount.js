/**
 * Name: _your name here_
 * Date: _add date here_
 * Section: CSE 154 _your section here_
 *
 * -- your description of what this file does here --
 * Do not keep comments from this template in any work you submit (functions included under "Helper
 * functions" are an exception, you may keep the function names/comments of id/qs/qsa/gen)
 */
"use strict";

(function() {

  window.addEventListener("load", init);

  /**
   * Initializes the event listeners for the menu and log actions.
   * The menu click redirects the user to the "index.html" page,
   * and the log click triggers the logout function to clear local storage
   * and redirect the user to the "signin.html" page.
   *
   * @function
   */
  function init() {
    let menu = id('menu');
    menu.addEventListener('click', function() {
      window.location.href = "index.html";
    });

    const log = id('log');
    log.addEventListener('click', logout);
  }

  /**
   * Clears the local storage and redirects the user to the "signin.html" page.
   * This function is triggered when the log action is clicked.
   *
   * @function
   */
  function logout() {
    localStorage.clear();
    window.location.href = "signin.html";
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
