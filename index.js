/**
 * Name: Evelyn Salas & Lisa Ynineb
 * Date: 12/09/2024
 * Section: CSE 154 AB
 *
 * Client side code for our final project, a travel website. Handles all page functionality
 * except for creating an account, signing in, and logging out. Allows users to search through
 * a data base of flights by destination city, date, and purchase multiple tickets at a time.
 * Users can also view previous transactions and leave reviews for each airline.
 */

"use strict";

(function() {
  let cart = [];
  let ticketId;
  let numTickets = 1;

  window.addEventListener("load", init);

  /**
   * Initializes page
   */
  function init() {
    let signIn = id('signin');

    signIn.addEventListener('click', function() {
      window.location.href = "signin.html";
    });

    let signup = id('signup');
    signup.addEventListener('click', function() {
      window.location.href = "create-account.html";
    });

    createTransactionHistoryBtn();
    createLeaveFeedbackBtn();

    displaydestinations();

    const toggle = id('toggle');
    toggle.addEventListener('click', togglestyle);

    const searchButton = id('research');
    if (searchButton) {
      searchButton.addEventListener('click', function() {
        displayview('result');
        searchflights();
      });
    }

    const destination = id('destinations');
    destination.addEventListener('click', function() {
      displayview('search');
    });
  }

  /**
   * Fetches destination data from the server, processes the data, and creates
   * corresponding containers.
   * This function sends an HTTP GET request to fetch destination data from a local
   * server, checks the response
   * status, parses the JSON response, and generates HTML containers for each destination
   * using the `createcontainers` function.
   * @async
   * @function displaydestinations
   * @throws {Error} Throws an error if the fetch request or data processing fails.
   */
  async function displaydestinations() {
    const URLDESTINATIONS = 'http://localhost:8000/destinations';
    try {
      let result = await fetch(URLDESTINATIONS);
      await statusCheck(result);
      let datadestinations = await result.json(result);

      datadestinations.forEach(destination => {
        createcontainers(destination);
      });
    } catch (err) {
      handleError(err);
    }
  }

  /**
   * Creates an HTML container for a given destination and appends it to the main container.
   * This function generates an `article` element containing an image and a paragraph
   * describing the destination.
   * It uses the destination's city and country information to set the content dynamically.
   * @function createcontainers
   * @param {Object} destination - A JS object representing a destination.
   * @param {string} destination.city - The name of the city.
   * @param {string} destination.country - The name of the country.
   */
  function createcontainers(destination) {
    const article = gen('article');
    const img = gen('img');
    const cityname = destination.city.toLowerCase().replace(/\s+/g, '');
    img.src = `/img_airport/${cityname}.jpeg`;
    img.alt = cityname;
    article.appendChild(img);

    const ptag = gen('p');
    ptag.textContent = `${destination.city}, ${destination.country}`;
    article.appendChild(ptag);

    const container = id('container');
    container.appendChild(article);
  }

  /**
   * Toggles the style of the container between list and default view modes.
   * This function toggles CSS classes on the container and button elements to switch
   * between list and default styles.
   * @function togglestyle
   */
  function togglestyle() {
    const container = id('container');
    const button = id('toggle');
    if (container.classList.contains('list')) {
      container.classList.remove('list');
      button.classList.remove('switch');
    } else {
      container.classList.add('list');
      button.classList.add('switch');
    }
  }

  /**
   * adds event listeners to the flight tickets
   * @param {Array} flightsData array of information for each flight
   */
  function addTicketListeners(flightsData) {
    const flightTickets = document.querySelectorAll("#flightscontainer .flight-container");

    flightTickets.forEach((flightTicket, index) => {
      const moreInfoBtn = createMoreInfoButton(flightTicket);

      moreInfoBtn.addEventListener("click", () => {
        handleMoreInfoClick(flightTicket, flightsData[index], index);
      });
    });
  }

  /**
   * Creates and appends the "More info" button to a flight ticket container.
   * @param {HTMLElement} flightTicket - The flight ticket container.
   * @returns {HTMLElement} The "More info" button element.
   */
  function createMoreInfoButton(flightTicket) {
    const moreInfoBtn = document.createElement("button");
    moreInfoBtn.classList.add("more-info-btn");
    moreInfoBtn.textContent = "More info";
    flightTicket.appendChild(moreInfoBtn);
    return moreInfoBtn;
  }

  /**
   * Handles the "More info" button click event.
   * @param {HTMLElement} flightTicket - The flight ticket container.
   * @param {Object} flightData - The data for the specific flight.
   * @param {number} index - The index of the flight in the dataset.
   */
  function handleMoreInfoClick(flightTicket, flightData, index) {
    let additionalInfo = document.getElementById(`additional-info-${index}`);

    if (!additionalInfo) {
      additionalInfo = createAdditionalInfo(flightData, index);
      flightTicket.parentNode.insertBefore(additionalInfo, flightTicket.nextSibling);
    } else {
      additionalInfo.classList.toggle("hidden");
    }
  }

  /**
   * Creates the additional information container for a flight.
   * @param {Object} flightData - The data for the specific flight.
   * @param {number} index - The index of the flight in the dataset.
   * @returns {HTMLElement} The additional information container element.
   */
  function createAdditionalInfo(flightData, index) {
    const additionalInfo = document.createElement("div");
    additionalInfo.classList.add("additional-info");
    additionalInfo.id = `additional-info-${index}`;

    const emissionStandard = document.createElement("p");
    let EStextContent = flightData.ecofriendly === 0 ? "Not eco-friendly" : "Eco-friendly";
    emissionStandard.textContent = EStextContent;

    const rating = document.createElement("p");
    rating.textContent = "Rating: 4/5";

    const time = document.createElement("div");
    const departureTime = document.createElement("p");
    departureTime.textContent = "Departure time: " + flightData.DepartureTime;

    const arrivalTime = document.createElement("p");
    arrivalTime.textContent = "Arrival time: " + flightData.ArrivalTime;

    time.appendChild(departureTime);
    time.appendChild(arrivalTime);

    const availableTickets = document.createElement("p");
    availableTickets.textContent = "Seats available: " + flightData.AvailableTickets;

    additionalInfo.appendChild(emissionStandard);
    additionalInfo.appendChild(rating);
    additionalInfo.appendChild(time);
    additionalInfo.appendChild(availableTickets);

    return additionalInfo;
  }

  /**
   * Displays the tickets on the html page
   * @param {Array} flightsData array of data for all returned flights
   */
  function displayTicketInfo(flightsData) {
    const flightTickets = document.querySelectorAll("#flightscontainer .flight-container");

    flightTickets.forEach((flightTicket, index) => {
      const additionalInfo = createAdditionalInfoContainer(flightsData[index]);
      flightTicket.appendChild(additionalInfo);
    });
  }

  /**
   * Creates the additional info container for a specific flight.
   * @param {Object} flightData - The data for a specific flight.
   * @returns {HTMLElement} The additional info container element.
   */
  function createAdditionalInfoContainer(flightData) {
    const additionalInfo = document.createElement("div");
    additionalInfo.classList.add("additional-info-container", "hidden");

    const emissionStandard = createEmissionStandardElement(flightData.ecofriendly);
    const ratingPlaceHolder = 4;
    const rating = createRatingElement(ratingPlaceHolder); // Placeholder rating
    const time = createTimeElement(flightData.DepartureTime, flightData.ArrivalTime);
    const availableTickets = createAvailableTicketsElement(flightData.AvailableTickets);

    additionalInfo.appendChild(emissionStandard);
    additionalInfo.appendChild(rating);
    additionalInfo.appendChild(time);
    additionalInfo.appendChild(availableTickets);

    return additionalInfo;
  }

  /**
   * Creates an emission standard element.
   * @param {number} ecofriendly - Indicates if the flight is eco-friendly.
   * @returns {HTMLElement} The emission standard element.
   */
  function createEmissionStandardElement(ecofriendly) {
    const emissionStandard = document.createElement("p");
    emissionStandard.textContent = ecofriendly === 0 ? "Not eco-friendly" : "Eco-friendly";
    return emissionStandard;
  }

  /**
   * Creates a rating element.
   * @param {number} ratingValue - The rating value.
   * @returns {HTMLElement} The rating element.
   */
  function createRatingElement(ratingValue) {
    const rating = document.createElement("p");
    rating.textContent = `Rating: ${ratingValue}/5`;
    return rating;
  }

  /**
   * Creates a time element with departure and arrival times.
   * @param {string} departureTime - The departure time of the flight.
   * @param {string} arrivalTime - The arrival time of the flight.
   * @returns {HTMLElement} The time element containing departure and arrival times.
   */
  function createTimeElement(departureTime, arrivalTime) {
    const time = document.createElement("div");
    const departure = document.createElement("p");
    const arrival = document.createElement("p");

    departure.textContent = `Departure time: ${departureTime}`;
    arrival.textContent = `Arrival time: ${arrivalTime}`;

    time.appendChild(departure);
    time.appendChild(arrival);

    return time;
  }

  /**
   * Creates an available tickets element.
   * @param {number} availableTickets - The number of available tickets.
   * @returns {HTMLElement} The available tickets element.
   */
  function createAvailableTicketsElement(availableTickets) {
    const tickets = document.createElement("p");
    tickets.textContent = `Seats available: ${availableTickets}`;
    return tickets;
  }

  /**
   * Checks if a user is logged in or not
   * @returns {Boolean} true if user is logged
   */
  function isLoggedIn() {
    const username = localStorage.getItem("username");
    return Boolean(username);
  }

  /**
   * Adds purchase button to each ticket
   */
  function createPurchaseBtns() {
    let addToCartBtn;

    let flightTickets = id("flightscontainer").querySelectorAll(".flight-container");
    for (let i = 0; i < flightTickets.length; i++) {
      let flightTicket = flightTickets[i];
      addToCartBtn = document.createElement("button");
      addToCartBtn.classList.add("add-to-cart-btn");
      addToCartBtn.textContent = "add to cart";

      flightTicket.appendChild(addToCartBtn);

      addToCartBtn.addEventListener("click", () => {
        ticketId = flightTicket.id;
        numTickets = document.getElementById("nbpeople").value;
        addToCart(ticketId, numTickets);
      });
    }
  }

  /**
   * Gives messages to user
   * @param {String} message message to display to user
   */
  function showToast(message) {
    const toast = document.createElement('div');
    const timeOut = 10;
    const param = 300;
    const ms = 3000;
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('show');
    }, timeOut);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => document.body.removeChild(toast), param);
    }, ms);
  }

  /**
   * Adds tickets to cart
   * @param {string} ticketID the id of the ticket user is trying to buy
   * @param {number} quantity the quantity of tickets
   */
  function addToCart(ticketID, quantity) {
    if (cart.includes(ticketID)) {
      showToast("This item is already in your cart.");
    } else {
      cart.push(ticketID);
      showToast("Ticket ID: " + ticketID + " with quantity: " + quantity + " added to the cart.");
    }
  }

  /**
   * Adds the view cart button and appends it to DOM
   */
  function addViewCartBtn() {
    let flightsContainer = id("flightscontainer");
    let shoppingCartContainer = document.createElement("div");
    let shoppingCart = document.createElement("div");
    let img = document.createElement("img");
    let viewCartBtn = document.createElement("button");

    shoppingCartContainer.classList.add("shopping-cart-container");
    shoppingCart.classList.add("shopping-cart");
    img.src = "img_flights/cart.png";
    viewCartBtn.textContent = "View cart";
    viewCartBtn.classList.add("view-cart-btn");

    viewCartBtn.addEventListener("click", () => {
      viewCart();
    });

    shoppingCart.appendChild(img);
    shoppingCart.appendChild(viewCartBtn);
    shoppingCartContainer.appendChild(shoppingCart);
    flightsContainer.appendChild(shoppingCartContainer);
  }

  /**
   * Function to view cart and display it on the page
   */
  function viewCart() {
    if (cart.length === 0) {
      showToast("Your cart is empty.");
      return;
    }

    let cartSummary = "Tickets in your cart:\n";
    numTickets = document.getElementById("nbpeople").value || 1;
    cart.forEach((ticketID, index) => {
      cartSummary += index + 1 + ". Ticket ID: " + ticketID + ", quantity: " + numTickets + "\n";
    });

    if (confirm(cartSummary + "\nProceed to Checkout?")) {
      checkoutCart();
    }
  }

  /**
   * Checks out cart by subtracting from the number of tickets available and generating a
   * confirmation number.
   */
  function checkoutCart() {
    if (!isLoggedIn) {
      showToast("Please log in before checking out.");
      window.location.href = "signin.html";
      return;
    }

    const ticketQuantity = parseInt(document.getElementById("nbpeople").value);

    fetch("/transaction", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        ticketIds: cart,
        quantity: ticketQuantity
      })
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          let confirmationNumber = data.confirmationNumber;
          showToast("Purchase successful! Confirmation number: " + data.confirmationNumber);
          cart = [];
          let userId = localStorage.getItem("username");
          addToHistory(userId, ticketId, ticketQuantity, confirmationNumber);
        } else {
          showToast("Purchase failed. Please try again.");
        }
      });
  }

  /**
   * Helper: sends a request to the server after checkout to save transaction
   * @param {string} userId user email to save this transaction under
   * @param {string} ticketID id to identify the ticket
   * @param {number} quantity number of tickets purchased
   * @param {string} confirmationNumber randomly generated confirmation number
   */
  async function addToHistory(userId, ticketID, quantity, confirmationNumber) {
    let response = await fetch("/checkout", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({userId, ticketID, quantity, confirmationNumber})
    });
    const data = await response.json();
    if (data.success) {
      showToast("Transaction successful: ", data.confirmationNumber);
    } else {
      console.error("Transaction Failed", data.message);
    }
  }

  /**
   * Displays the specified view by toggling visibility of all sections.
   * This function iterates through all `section` elements, hiding all except the one
   * matching the specified `viewname`.
   * @function displayview
   * @param {string} viewname - The ID of the view (section) to display.
   */
  function displayview(viewname) {
    let views = qsa('section');
    views.forEach(view => {
      if (view.id === viewname) {
        view.classList.remove('hidden');
      } else {
        view.classList.add('hidden');
      }
    });
  }

  /**
   * Searches for flights based on user input and displays the results.
   * This function collects input from the search form, fetches flight data from the server,
   * and displays the results. Handles errors by showing an error message if the request fails.
   * @async
   * @function searchflights
   * @throws {Error} Throws an error if the fetch request or data processing fails.
   */
  async function searchflights() {
    const search = id("search-input");
    const date = id("datedep");
    const people = id("nbpeople");
    const errorMessage = id("error-message");

    try {
      const input = search.value.trim();
      const inputdate = date.value;
      const inputpeople = people.value;

      const url = buildFlightSearchURL(input, inputdate, inputpeople);
      const result = await fetchFlightData(url);

      if (result.length === 0) {
        displayError(errorMessage, "Oups, no destination for those dates, try somewhere else!");
        return;
      }

      displaySearchResults(result);
      errorMessage.classList.add("hidden");
      createPurchaseBtns();
    } catch (err) {
      handleError(err);
      displayError(errorMessage, err.message);
    }
  }

  /**
   * Builds the URL for the flight search API.
   * @param {string} city - The destination city.
   * @param {string} date - The departure date.
   * @param {number} people - The number of people.
   * @returns {string} The constructed API URL.
   */
  function buildFlightSearchURL(city, date, people) {
    return `http://localhost:8000/arrival?city=${city}&datedep=${date}&nbpeople=${people}`;
  }

  /**
   * Fetches flight data from the API and checks for errors.
   * @param {string} url - The API URL.
   * @returns {Array} The parsed flight data.
   */
  async function fetchFlightData(url) {
    const result = await fetch(url);
    await statusCheck(result);

    if (!result.ok) {
      const backendMessage = await result.text();
      throw new Error(backendMessage || `Error ${result.status}: ${result.statusText}`);
    }

    return result.json();
  }

  /**
   * Displays the error message.
   * @param {HTMLElement} errorMessage - The element for displaying the error message.
   * @param {string} message - The error message text.
   */
  function displayError(errorMessage, message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove("hidden");
  }

  /**
   * Processes and displays the search results.
   * @param {Array} dataflights - The flight data from the API.
   */
  function displaySearchResults(dataflights) {
    displayflights(dataflights);
    displayTicketInfo(dataflights);
  }

  /**
   * Displays flight information in the UI.
   * This function creates HTML elements for each flight's details, including airline logo,
   * arrival airport, departure date, and ticket price. It appends these elements to a container.
   * @function displayflights
   * @param {Array} flightsData - An array of flight objects.
   * @param {string} flightsData[].Airline - The name of the airline.
   * @param {string} flightsData[].ArrivalAirport - The arrival airport name.
   * @param {string} flightsData[].DepartureDate - The departure date of the flight.
   * @param {number} flightsData[].TicketPrice - The price of the ticket.
   * @param {string} flightsData[].FlightID - The unique identifier for the flight.
   */
  function displayflights(flightsData) {
    const flightsContainer = id("flightscontainer");
    flightsContainer.innerHTML = "";

    addViewCartBtn();

    flightsData.forEach((flight) => {
      const flightContainer = createFlightContainer(flight);
      if (!flightContainer) {
        return;
      }
      flightsContainer.appendChild(flightContainer);
    });

    addTicketListeners(flightsData);
  }

  /**
   * Creates a flight container element for a given flight.
   * @param {Object} flight - The flight data.
   * @returns {HTMLElement} The flight container element.
   */
  function createFlightContainer(flight) {
    const flightContainer = gen("div");
    flightContainer.classList.add("flight-container");

    const airlineLogo = createAirlineLogo(flight.Airline);
    const arrival = createArrivalElement(flight.ArrivalAirport);
    const section = createFlightInfoSection(flight);

    if (!airlineLogo || !arrival || !section) {
      console.error("Error creating flight elements.");
      return null;
    }

    flightContainer.appendChild(airlineLogo);
    flightContainer.appendChild(arrival);
    flightContainer.appendChild(section);
    flightContainer.id = flight.FlightID;

    return flightContainer;
  }

  /**
   * Creates an airline logo element.
   * @param {string} airline - The airline name.
   * @returns {HTMLElement} The image element for the airline logo.
   */
  function createAirlineLogo(airline) {
    const airlineLogo = gen("img");
    const logo = airline.toLowerCase().replace(/\s+/g, "");
    airlineLogo.src = `img_flights/${logo}.jpeg`;
    airlineLogo.alt = airline;
    airlineLogo.classList.add("airline-logo");
    return airlineLogo;
  }

  /**
   * Creates the arrival airport element.
   * @param {string} arrivalAirport - The arrival airport name.
   * @returns {HTMLElement} The heading element for arrival.
   */
  function createArrivalElement(arrivalAirport) {
    const arrival = gen("h2");
    arrival.textContent = arrivalAirport;
    arrival.id = "arrival";
    return arrival;
  }

  /**
   * Creates the flight information section element.
   * @param {Object} flight - The flight data.
   * @returns {HTMLElement} The section element with flight details.
   */
  function createFlightInfoSection(flight) {
    const section = gen("section");
    section.id = "infos";

    const departureDate = gen("h4");
    const formattedDate = formatDate(flight.DepartureDate);
    departureDate.textContent = formattedDate;
    section.appendChild(departureDate);

    const ticketPrice = gen("p");
    ticketPrice.textContent = `${flight.TicketPrice}$`;
    section.appendChild(ticketPrice);

    return section;
  }

  /**
   * Formats a date string into "MM/DD/YYYY" format.
   * @function formatDate
   * @param {string} dateString - The date string to format.
   * @returns {string} The formatted date string.
   */
  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  }

  /**
   * Creates purchase history buttons so user can access past transactions
   */
  function createTransactionHistoryBtn() {
    let buttonContainer = document.querySelector(".button-container");

    let transactionHistoryBtn = document.createElement("button");
    transactionHistoryBtn.textContent = "purchase history";
    transactionHistoryBtn.id = "transaction-history-btn";
    buttonContainer.appendChild(transactionHistoryBtn);

    transactionHistoryBtn.addEventListener('click', function() {
      getTransactionHistory();
      let transactionHistoryContainer = document.getElementById("transaction-history");
      transactionHistoryContainer.classList.toggle("hidden");
    });

  }

  /**
   * Fetches transaction history data
   */
  async function getTransactionHistory() {
    if (!isLoggedIn()) {
      showToast("Please log in to view transaction history.");
      window.location.href = "signin.html";
      return;
    }

    try {
      let userId = localStorage.getItem("username");
      const res = await fetch(`/transactions?userId=${userId}`);
      const data = await res.json();

      if (data.success) {
        displayTransactionHistory(data.transactions);
      } else {
        showToast(data.message || "Failed to load transaction history.");
      }
    } catch (error) {
      console.error("Error fetching transaction history.");
      showToast("An error occured. please try again later.");
    }
  }

  /**
   * Displays a user's past purchases on the webpage
   * @param {Array} transactions an array of past transactions
   */
  function displayTransactionHistory(transactions) {
    const historyContainer = document.getElementById("transaction-history");
    historyContainer.innerHTML = "";

    if (transactions.length === 0) {
      historyContainer.textContent = "No transactions found.";
      return;
    }

    const list = document.createElement("ul");
    transactions.forEach((txn) => {
      const item = document.createElement("li");
      const date = new Date(txn.TransactionDate).toLocaleString();
      item.textContent = "TicketID: " + txn.TicketID + ", Quantity: " + txn.Quantity +
      ", Confirmation: " + txn.ConfirmationNumber + ", Date: " + date;
      list.appendChild(item);
    });

    historyContainer.appendChild(list);
  }

  /**
   * Creates a leave feedback button and adds functionality
   */
  function createLeaveFeedbackBtn() {
    let buttonContainer = document.querySelector(".button-container");

    let leaveFeedbackBtn = document.createElement("button");
    leaveFeedbackBtn.textContent = "leave feedback";
    leaveFeedbackBtn.id = "leave-feedback-btn";
    buttonContainer.appendChild(leaveFeedbackBtn);

    leaveFeedbackBtn.addEventListener('click', function() {
      submitFeedback();
      let feedbackContainer = document.getElementById("feedback");
      feedbackContainer.classList.toggle("hidden");
    });
  }

  /**
   * Allows users to submit feedback on a service
   */
  function submitFeedback() {
    let feedbackForm = document.getElementById("feedback-form");
    feedbackForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      let airlineId = document.getElementById("airline").value;
      let rating = document.getElementById(`rating`).value;
      let comment = document.getElementById(`comment`).value;
      let userId = localStorage.getItem("username");
      try {
        let response = await fetch('/feedback', {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({airlineId, rating, comment, userId})
        });

        const data = await response.json();
        if (data.success) {
          showToast("Thank you for your feedback!");
          fetchFeedbackData(airlineId);
        } else {
          showToast("Failed to submit feedback. Please try again.");
        }
      } catch (err) {
        console.error("Error submitting feedback:", err);
        showToast("An error occurred while submitting your feedback.");
      }
    });
  }

  /**
   * Function to fetch feedback data from the server
   * @param {number} airlineId the number corresponding with each airline
   */
  async function fetchFeedbackData(airlineId) {
    try {
      const data = await fetchFeedbackFromServer(airlineId);
      if (data.success) {
        updateFeedbackList(data);
      } else {
        showToast("Error fetching feedback.");
      }
    } catch (err) {
      console.error("Error fetching feedback data:", err);
      showToast("An error occurred while retrieving feedback.");
    }
  }

  /**
   * Fetch feedback data from the server for a given airline.
   * @param {number} airlineId - The airline ID.
   * @returns {Object} The response data containing feedback and average rating.
   */
  async function fetchFeedbackFromServer(airlineId) {
    const response = await fetch(`feedback/${airlineId}`);
    return response.json();
  }

  /**
   * Update the feedback list in the DOM.
   * @param {Object} data - The feedback data.
   */
  function updateFeedbackList(data) {
    const feedbackList = document.getElementById("feedback-list");
    feedbackList.innerHTML = "";

    const feedbackItem = createFeedbackItem(data.averageRating);
    data.feedback.forEach((item) => {
      const feedbackElements = createFeedbackElements(item);
      feedbackElements.forEach((element) => feedbackItem.appendChild(element));
    });

    feedbackList.appendChild(feedbackItem);
  }

  /**
   * Create a feedback item with the average rating and heading.
   * @param {number} averageRating - The average rating.
   * @returns {HTMLElement} The feedback item container.
   */
  function createFeedbackItem(averageRating) {
    const feedbackItem = document.createElement("div");
    const heading = document.createElement("h4");
    heading.textContent = "Customer Reviews";

    const avgRating = document.createElement("p");
    const decimalPlace = 10;
    const avgRatingNum = Math.round(averageRating * decimalPlace) / decimalPlace;
    avgRating.textContent = "Average Rating: " + avgRatingNum;

    feedbackItem.appendChild(heading);
    feedbackItem.appendChild(avgRating);

    return feedbackItem;
  }

  /**
   * Create feedback elements for a single feedback item.
   * @param {Object} item - A single feedback object.
   * @returns {Array<HTMLElement>} An array of feedback elements (rating, comment, timestamp).
   */
  function createFeedbackElements(item) {
    const rating = document.createElement("p");
    const comment = document.createElement("p");
    const timestamp = document.createElement("p");

    rating.textContent = "Rating: " + item.Rating;
    comment.textContent = "Comment: " + (item.Comment || "No comments yet.");
    timestamp.textContent = new Date(item.Timestamp).toLocaleString();

    return [rating, comment, timestamp];
  }

  /**
   * Handles errors my displaying a helpful message
   * @param {error} err an error
   */
  function handleError(err) {
    console.error('Error :', err);
  }

  /**
   * Checks the status of the response from a fetch request.
   * Throws an error if the response is not ok.
   * @param {Response} res - The response object from the fetch request.
   * @returns {Response} The original response object if the status is ok.
   * @throws {Error} Throws an error if the response status is not ok.
   */
  async function statusCheck(res) {
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return res;
  }

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} idName - element ID
   * @returns {object} DOM object associated with id.
   */
  function id(idName) {
    return document.getElementById(idName);
  }

  /**
   * Returns the array of elements that match the given CSS selector.
   * @param {string} selector - CSS query selector
   * @returns {object[]} array of DOM objects matching the query.
   */
  function qsa(selector) {
    return document.querySelectorAll(selector);
  }

  /**
   * Returns a new element with the given tag name.
   * @param {string} tagName - HTML tag name for new DOM element.
   * @returns {object} New DOM object for given HTML tag.
   */
  function gen(tagName) {
    return document.createElement(tagName);
  }

})();

