/**
 * Name: Evelyn Salas & Lisa Ynineb
 * Date: 12/09/2024
 * Section: CSE 154 AB
 *
 * Server side code for our final project, which is a travel website. End points retrieve data
 * from a destinations database to complete searches, purchase plane tickets, leave reviews,
 * sign in, create an account among many other cool features.
 */

'use strict';

const express = require('express');
const app = express();

const sqlite = require('sqlite');
const sqlite3 = require('sqlite3');

const multer = require('multer');

const cors = require('cors');

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(multer().none());
app.use(cors());

const BR_ERR = 400;
const AUTH_ERR = 401;
const SERVER_ERR = 500;
const OK = 200;
const SUCCESS = 201;
const DEFAULT_PORT = 8000;
const CODE_LENGTH = 36;
const SUB_STR = 10;

/**
 *  end point to retrieve all items to dispaly them in main view
 */
app.get('/destinations', async (req, res) => {
  try {
    const db2 = await getDBConnection();
    const querydestinations = 'SELECT * FROM destinations';
    const destinations = await db2.all(querydestinations);
    res.status(OK).json(destinations);
    await db2.close();
  } catch (err) {
    console.error(err);
    res.status(SERVER_ERR).send('An error occurred with the network, try again later');
  }
});

/**
 * end point to check if username and password match
 */
app.post('/login', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    return sendErrorResponse(res, BR_ERR, 'Missing email or password.');
  }
  try {

    const user = await fetchUserByEmail(email);

    if (!user || user.password !== password) {
      return sendErrorResponse(res, AUTH_ERR, 'Invalid email or password.');
    }

    sendSuccessResponse(res, 'Login successful.');

  } catch (err) {
    console.error(err);
    sendErrorResponse(res, SERVER_ERR, 'An error occurred while logging in.');
  }
});

/**
 * Helper function to fetch user from the database
 * @param {String} email user email
 */
async function fetchUserByEmail(email) {
  const db = await getDBConnection();
  const query = `SELECT * FROM client WHERE email = ?`;
  return db.get(query, [email]);
}

/**
 * Helper function to send error responses
 * @param {res} res response
 * @param {Int} statusCode different status codes
 * @param {String} message error message
 */
function sendErrorResponse(res, statusCode, message) {
  res.status(statusCode).json({
    status: 'error',
    message
  });
}

/**
 * Helper function to send success responses
 * @param {*} res response
 * @param {String} message success message
 */
function sendSuccessResponse(res, message) {
  res.status(SUCCESS).json({
    status: 'success',
    message
  });
}

/**
 * Endpoint to check if a transaction is successful, should make sure user is logged in.
 * If the transaction is successful, update the database, and return a generated confirmation
 * code.
 */
app.post("/transaction", async (req, res) => {
  try {
    const {ticketIds, quantity} = req.body;
    const db = await getDBConnection();

    const areTicketsAvailable = await checkTicketAvailability(db, ticketIds, quantity);

    if (!areTicketsAvailable) {
      return res.json({
        success: false,
        message: "Not enough tickets available. Please select another flight."
      });
    }

    const isTransactionProcessed = await processTickets(db, ticketIds, quantity);
    if (!isTransactionProcessed) {
      return res.json({success: false, message: "Ticket could not be processed."});
    }

    const confirmationNumber = generateConfirmationNumber();
    res.json({success: true, confirmationNumber});
  } catch (err) {
    console.error("Transaction failed:", err);
    res.status(SERVER_ERR).json({success: false, message: "Server error."});
  }
});

/**
 * Helper: Check ticket availability
 * @param {sqlite3.Database} db database
 * @param {String} ticketIds ticket ids
 * @param {Int} quantity quantity of tickets
 * @returns {Boolean} true if ticket is available
 */
async function checkTicketAvailability(db, ticketIds, quantity) {
  for (const ticketId of ticketIds) {
    const ticketQuery = "SELECT AvailableTickets FROM Flights WHERE FlightID = ?";
    const ticket = await db.get(ticketQuery, [ticketId]);

    if (!ticket || ticket.AvailableTickets < quantity) {
      return false;
    }
  }
  return true;
}

/**
 * Helper: Process ticket transactions
 * @param {sqlite3.Database} db database
 * @param {String} ticketIds string for ticket ids
 * @param {Int} quantity number of tickets purchased
 * @returns {Boolean} true if ticket is processed
 */
async function processTickets(db, ticketIds, quantity) {
  for (const ticketId of ticketIds) {
    const processTicketQuery = `
      UPDATE Flights
      SET AvailableTickets = AvailableTickets - ?
      WHERE FlightID = ? AND AvailableTickets >= ?
    `;
    const result = await db.run(processTicketQuery, [quantity, ticketId, quantity]);

    if (result.changes === 0) {
      return false;
    }
  }
  return true;
}

/**
 * Helper: Generate a confirmation number
 * @returns {String} Confirmation code
 */
function generateConfirmationNumber() {
  let code = Math.random().toString(CODE_LENGTH);
  code = code.substring(2, SUB_STR);
  code = code.toUpperCase();
  return code;
}

/**
 * End point to add transaction info to transaction table in database.
 */
app.post("/checkout", async (req, res) => {
  try {
    const {userId, ticketId, quantity, confirmationNumber} = req.body;
    if (!ticketId || !quantity || quantity <= 0) {
      return res.status(BR_ERR).json({success: false, message: "Invalid ticket ID or quantity."});
    }

    const db = await getDBConnection();

    const transactionDate = new Date().toISOString();

    const checkoutQuery = `
      INSERT INTO Transactions (UserID, TicketID, Quantity, ConfirmationNumber, TransactionDate)
      VALUES (?, ?, ?, ?, ?)
    `;
    await db.run(checkoutQuery, [userId, ticketId, quantity, confirmationNumber, transactionDate]);

    res.json({success: true, message: "Transaction completed successfully.", confirmationNumber});
  } catch (err) {
    console.error("Error during checkout: ", err);
    res.status(SERVER_ERR).json({success: false, message: "Server error during checkout."});
  }
});

/**
 * End point to search database and return results
 */
app.get('/arrival', async (req, res) => {
  const {city, datedep: departure, nbpeople: people} = req.query;

  try {
    const db = await getDBConnection();

    const {whereClause, params} = buildWhereClause(city, departure, people);

    const query = `
      SELECT f.*
      FROM Flights f
      JOIN destinations d ON f.ArrivalAirportId = d.id
      ${whereClause};
    `;

    const result = await db.all(query, params);
    res.json(result);

  } catch (err) {
    handleError(err);
    res.status(SERVER_ERR).send('An error occurred while retrieving the data.');
  }
});

/**
 * Helper: function to build where clause
 * @param {String} city arrival city
 * @param {Date} departure date
 * @param {Int} people number of people
 * @returns {{whereClause: string, params: Array}} filters and parameters
 */
function buildWhereClause(city, departure, people) {
  const filters = [];
  const params = [];
  if (city) {
    filters.push("d.city LIKE ?");
    params.push(`%${city}%`);
  }
  if (departure) {
    filters.push("f.DepartureDate >= ?");
    params.push(departure);
  }
  if (people) {
    filters.push("f.AvailableTickets > ?");
    params.push(people);
  }
  const whereClause = filters.length > 0 ? `WHERE ${filters.join(" AND ")}` : "";
  return {whereClause, params};
}

/**
 * Endpoint to retrieve user's transaction history
 */
app.get("/transactions", async (req, res) => {
  try {
    const db = await getDBConnection();
    const userId = req.query.userId;

    if (!userId) {
      return res.status(BR_ERR).json({success: false, message: "User ID required."});
    }

    const query = `
      SELECT TicketID, Quantity, ConfirmationNumber, TransactionDate
      FROM Transactions
      WHERE UserID = ?
      ORDER BY TransactionDate DESC
    `;

    const transactions = await db.all(query, [userId]);
    res.json({success: true, transactions});
  } catch (err) {
    console.error("Error fetching transactions: ", err);
    res.status(SERVER_ERR).json({success: false, message: "Sever Error"});
  }
});

/**
 * Enpoint submit user feedback onto database
 */
app.post('/feedback', async (req, res) => {
  try {
    const {airlineId, rating, comment, userId} = req.body;

    const db = await getDBConnection();
    const query = `
      INSERT INTO Feedback (AirlineID, UserID, Rating, Comment)
      VALUES (?, ?, ?, ?);
    `;
    await db.run(query, [airlineId, userId, rating, comment || null]);
    res.json({success: true, message: "Feedback submitted successfully."});
  } catch (err) {
    console.error("Error submitting feedback: ", err);
    res.status(SERVER_ERR).json({success: false, message: "Server Error."});
  }
});

/**
 * endpoint to retrieve feedback for a specific airline
 */
app.get('/feedback/:airlineId', async (req, res) => {
  try {
    const {airlineId} = req.params;
    const db = await getDBConnection();
    const feedbackQuery = `
      SELECT Rating, Comment, Timestamp
      FROM Feedback
      WHERE AirlineID = ?;
    `;
    const feedback = await db.all(feedbackQuery, [airlineId]);

    const averageRatingQuery = `
      SELECT AVG(Rating) AS AverageRating
      FROM Feedback
      WHERE AirlineID = ?
    `;
    const averageResult = await db.get(averageRatingQuery, [airlineId]);
    res.json({
      success: true,
      feedback,
      averageRating: averageResult.AverageRating || "No ratings yet"
    });
  } catch (err) {
    handleError(err);
    res.status(SERVER_ERR).json({success: false, message: "Server error"});
  }
});

/**
 * end point to add new user to user data base (lisa)
 */
app.post('/signup', async (req, res) => {
  let username = req.body.email;
  let password = req.body.password;
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let phoneNumber = req.body.phoneNumber;

  if (!username || !password || !firstName || !lastName || !phoneNumber) {
    return res.status(SERVER_ERR).send('Missing one or more of the required params.');
  }

  try {
    const db = await getDBConnection();

    const insertQuery = `
    INSERT INTO client (email, password, firstName, lastName, phoneNumber)
    VALUES (?, ?, ?, ?, ?)
  `;
    await db.run(insertQuery, [username, password, firstName, lastName, phoneNumber]);

    await db.close();

    res.status(SUCCESS).send('User registered successfully.');

  } catch (err) {
    handleError(err);
    res.status(SERVER_ERR).send('An error occurred while creating the user.');
  }
});

/**
 * Handlers errors
 * @param {error} err error
 */
function handleError(err) {
  console.error('Erreur :', err);
}

/**
 * Establishes a database connection to the database and returns the database object.
 * Any errors that occur should be caught in the function that calls this one.
 * @returns {Object} - The database object for the connection.
 */
async function getDBConnection() {
  const db = await sqlite.open({
    filename: 'destinations copy.db',
    driver: sqlite3.Database
  });
  return db;
}

app.use(express.static('public'));
const PORT = process.env.PORT || DEFAULT_PORT;
app.listen(PORT);
