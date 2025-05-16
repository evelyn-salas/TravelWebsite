 * ## /destinations
 * **Method**: *GET*
 * **Description**:
 * This endpoint retrieves a list of all available destinations from the database. It is designed to provide users with an up-to-date list of destinations when accessing the relevant part of the application.
 * This endpoint does not lead to any side effects since its only purpose is to retrieve an array of destinations.
 * **Returned Data Format**: *an array of JS objects, each representing a destination*
 * **Example Request**: *GET /destinations*
 * **Example Response**:
 ``` json
 [
  {
    "id": "1",
    "name": "Los Angeles International Airport",
    "city": "Los Angeles",
    "country": "USA"
  },
    {
    "id": "2",
    "name": "Charles de Gaulle Airport",
    "city": "Paris",
    "country": "France"
  },
    {
    "id": "3",
    "name": "Dubai International Airport",
    "city": "Dubai",
    "country": "United Arab Emirates"
  },
    {
    "id": "4",
    "name": "Sydney Kingsford Smith Airport",
    "city": "Sydney",
    "country": "Australia"
  },
    {
    "id": "5",
    "name": "Charles de Gaulle Airport",
    "city": "Paris",
    "country": "France"
  },
    {
    "id": "6",
    "name": "Mexico City International Airport",
    "city": "Mexico City",
    "country": "Mexico"
  }
  ...
 ]
 ```
 * **Error Handling:**
 * - *500 Internal Server Error*: An unexpected error occurred on the server, possibly due to a database issue or connection failure.

 * ## /login
 * **Method**: *POST*
 * **Description**:
 * This endpoint authenticates a user by verifying their email and password against the database. It is used to grant access to authenticated users.
 * If the credentials are correct, the user is successfully logged in.
 * **Request Body Format**: *JSON object containing the following properties*
 * - `email` (*string*, required): The user's email address.
 * - `password` (*string*, required): The user's password.
 * **Example Request**:
 * POST /login
 ```json
 {
    "email": "user@example.com",
    "password": "securePassword123"
 }
 ```
 *
 * **Example Response (Success)**:
 * Status: `200 OK`
 ```json
 {
  "status": "success",
  "message": "Login successful."
 }
 ```
 *
 * **Example Response (Invalid Credentials)**:
 * Status: `401 Unauthorized`
 ```json
 {
   "status": "error",
   "message": "Invalid email or password."
 }
 ```
 *
 * **Error Handling**:
 * - *400 Bad Request*: Missing email or password in the request body.
 ```json
{
  "status": "error",
  "message": "Missing email or password."
}
 ```
 * - *401 Unauthorized*: Invalid email or password provided by the user.
```json
{
  "status": "error",
  "message": "Invalid email or password."
}
```
 * - *500 Internal Server Error*: An unexpected error occurred during login, such as a database connection issue.
```json
{
  "status": "error",
  "message": "An error occurred while logging in."
}
```

 * ## /emissions
 * **Method**: *GET*
 * **Description**:
 * This endpoint retrieves the emissions data (ecofriendly status) for all flights in the database. It is used to provide environmental impact details for each flight.
 * **Returned Data Format**: *JSON object containing an array of emissions data*
 * - Each entry in the array represents the ecofriendly status of a flight.
 * **Example Request**:
 * GET /emissions
 * **Example Response (Success)**:
 * Status: `200 OK`
```json
{
  "emissions": [
   { "ecofriendly": 1 },
   { "ecofriendly": 0 },
   { "ecofriendly": 1 }
  ]
}
```
 * **Error Handling**:
 * - *500 Internal Server Error*: An unexpected error occurred while retrieving emissions data, such as a database connection issue.
```json
{
  "status": "error",
  "message": "An error occurred while fetching emissions"
}
```

 * ## /transaction
 * **Method**: *POST*
 * **Description**:
 * This endpoint processes ticket purchases for selected flights. It verifies ticket availability and updates the database to reduce the number of available tickets accordingly. A confirmation number is returned for successful transactions.
 * **Request Body Format**: *JSON object containing the following properties*
 * - `ticketIds` (*array of integers*, required): List of flight ticket IDs to purchase.
 * - `quantity` (*integer*, required): Number of tickets to purchase for each flight ID.
 * **Example Request**:
 * POST /transaction
```json
{
  "ticketIds": [123, 456, 789],
  "quantity": 2
}
```
 * **Example Response (Success)**:
 * Status: `200 OK`
```json
{
  "success": true,
  "confirmationNumber": "8HJ3LKD4"
}
```
 * **Example Response (Failure - Not Enough Tickets)**:
 * Status: `200 OK`
```json
{
  "success": false,
  "message": "Not enough tickets available. Please select another flight."
 }
```
 * **Error Handling**:
 * - *500 Internal Server Error*: An unexpected error occurred during the transaction process, such as a database connection issue.
```json
{
  "success": false,
  "message": "Server error."
}
```
 * - *Validation Error*: If a ticket ID is invalid or there are insufficient tickets for the requested quantity.
```json
{
  "success": false,
  "message": "Ticket could not be processed."
}
```

 * ## /arrival
 * **Method**: *GET*
 * **Description**:
 * This endpoint retrieves flight data filtered by optional query parameters, such as arrival city, departure date, and the number of people. It provides flexibility in searching for flights that meet specific criteria.
 * **Query Parameters**:
 * - `city` (*string*, optional): Filters flights based on the name of the arrival city (case-insensitive). Partial matches are supported.
 * - `datedep` (*string*, optional): Filters flights departing on or after the specified date (format: YYYY-MM-DD).
 * - `nbpeople` (*integer*, optional): Filters flights based on the minimum number of available tickets greater than the specified number of people.
 * **Returned Data Format**: *An array of JSON objects, each representing a flight.*
 *
 * **Example Request**:
 * GET /arrival?city=Paris&datedep=2024-12-15&nbpeople=3
 * **Example Response**:
 * Status: `200 OK`
```json
[
  {
    "FlightID": 123,
    "DepartureDate": "2024-12-15",
    "ArrivalDate": "2024-12-16",
    "AvailableTickets": 50,
    "DepartureAirportId": 1,
    "ArrivalAirportId": 5,
    "Price": 150,
    "Ecofriendly": 1
  },
  {
    "FlightID": 124,
    "DepartureDate": "2024-12-15",
    "ArrivalDate": "2024-12-16",
    "AvailableTickets": 30,
    "DepartureAirportId": 2,
    "ArrivalAirportId": 5,
    "Price": 180,
    "Ecofriendly": 0
  }
]
```
 * **Error Handling**:
 * - *500 Internal Server Error*: Indicates a server-side issue, such as a database query failure or unexpected error.
```json
{
  "error": "An error occurred while retrieving the data."
}
```
 * **Details**:
 * - The response includes flights that meet all specified query parameters. If no filters are provided, all flights are returned.
 * - The `city` filter supports partial matches, allowing users to search with incomplete names.
 * - The `datedep` filter ensures flights with departure dates on or after the specified date are included.
 * - The `nbpeople` filter ensures flights with more available tickets than the specified number of people are included.

 * ## /transactions
 * **Method**: *GET*
 * **Description**:
 * This endpoint retrieves a list of all transactions associated with the logged-in user. The transactions include ticket details, quantities purchased, confirmation numbers, and transaction dates, sorted by the most recent transaction first.
 * **Authentication Required**:
 * - Users must be logged in to access this endpoint. The session must include a valid `userId`.
 * **Returned Data Format**: *An object containing transaction details.*
 * **Example Request**:
 * GET /transactions
 * **Example Response (Success)**:
 * Status: `200 OK`
```json
{
  "success": true,
  "transactions": [
    {
      "TicketID": 1234,
      "Quantity": 2,
      "ConfirmationNumber": "ABCD1234",
      "TransactionDate": "2024-12-01T10:30:00.000Z"
    },
    {
     "TicketID": 5678,
     "Quantity": 1,
     "ConfirmationNumber": "WXYZ5678",
     "TransactionDate": "2024-11-28T15:45:00.000Z"
    }
  ]
}
 ```
 * **Example Response (User Not Logged In)**:
 * Status: `401 Unauthorized`
 ```json
{
  "success": false,
  "message": "User not logged in."
}
```
 * **Error Handling**:
 * - *401 Unauthorized*: Returned when the session does not include a valid `userId`.
```json
{
  "success": false,
  "message": "User not logged in."
}
```
 * - *500 Internal Server Error*: Returned when a server-side error occurs, such as a database failure.
```json
{
  "success": false,
  "message": "Server Error"
}
```
 * **Details**:
 * - The endpoint checks the session for a valid `userId` before proceeding. If the user is not logged in, a `401 Unauthorized` error is returned.
 * - Transactions are sorted in descending order by transaction date to show the most recent transactions first.
 * - Each transaction includes the ticket ID, quantity purchased, confirmation number, and transaction date.

 * ## /feedback
 * **Method**: *POST*
 * **Description**:
 * This endpoint allows a logged-in user to submit feedback for a specific service. The feedback includes a service ID, a rating, and an optional comment. The feedback is stored in the database for future reference and analysis.
 * **Authentication Required**:
 * - Users must be logged in to submit feedback. The session must include a valid `userId`.
 * **Request Body Format**: *A JSON object containing the following properties:*
 * - `serviceId` (*integer*, required): The ID of the service the feedback is associated with.
 * - `rating` (*integer*, required): A numeric rating for the service.
 * - `comment` (*string*, optional): Additional comments about the service.
 * **Example Request**:
 * POST /feedback
```json
{
  "serviceId": 101,
  "rating": 5,
  "comment": "Excellent service, very satisfied!"
}
```
 * **Example Response (Success)**:
 * Status: `200 OK`
```json
{
  "success": true
}
```
 * **Error Handling**:
 * - *400 Bad Request*: Missing required fields (e.g., service ID or rating).
```json
{
  "success": false,
  "message": "Service ID and rating are required."
}
```
 * - *401 Unauthorized*: User is not logged in or session is invalid.
```json
{
  "success": false,
  "message": "User not logged in."
}
```
 * - *500 Internal Server Error*: Unexpected error during feedback submission, such as database issues.
```json
{
  "success": false,
  "message": "Server Error."
}
```
 * **Details**:
 * - The endpoint requires the user to be logged in and have a valid session. Feedback submission fails if the session is missing or invalid.
 * - The feedback is stored in the `Feedback` table of the database, with fields for the user ID, service ID, rating, and comment.
 * - Comments are optional, but both the `serviceId` and `rating` fields are mandatory for a successful request.

 * ## /feedback/:serviceId
 * **Method**: *GET*
 * **Description**:
 * This endpoint retrieves all feedback for a specific service, identified by its service ID. It also calculates and returns the average rating for the service.
 * **URL Parameters**:
 * - `serviceId` (*integer*, required): The ID of the service for which feedback is being retrieved.
 * **Example Request**:
 * GET /feedback/101
 * **Example Response (Success)**:
 * Status: `200 OK`
```json
{
  "success": true,
  "feedback": [
    {
      "Rating": 5,
      "Comment": "Excellent service, highly recommend!"
    },
    {
      "Rating": 4,
      "Comment": "Great experience, but room for improvement."
    }
  ],
  "averageRating": 4.5
}
```
 * **Example Response (No Ratings Yet)**:
 * Status: `200 OK`
```json
{
  "success": true,
  "feedback": [],
  "averageRating": "No ratings yet"
}
```
 * **Error Handling**:
 * - *500 Internal Server Error*: An unexpected issue occurred while fetching feedback or calculating the average rating.
 * ```json
 * {
 *   "success": false,
 *   "message": "Server error"
 * }
 * ```
 * **Details**:
 * - The endpoint retrieves feedback data (ratings and comments) from the `Feedback` table for the specified service ID.
 * - It also calculates the average rating for the service using the `AVG` function in SQL.
 * - If no ratings are available, the `averageRating` field will return "No ratings yet".
 * - Feedback is returned as an array, with each entry containing a `Rating` (integer) and `Comment` (string).

 * ## /signup
 * **Method**: *POST*
 * **Description**:
 * This endpoint registers a new user by creating an entry in the `client` table with the provided user details. It ensures that all required fields are present before creating the account.
 * **Request Body Format**: *JSON object containing the following properties*
 * - `email` (*string*, required): The email address for the user account.
 * - `password` (*string*, required): The password for the user account.
 * - `first_name` (*string*, required): The user's first name.
 * - `last_name` (*string*, required): The user's last name.
 * - `phone_number` (*string*, required): The user's phone number.
 * **Example Request**:
 * POST /signup
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "first_name": "John",
  "last_name": "Doe",
  "phone_number": "123-456-7890"
}
```
 * **Example Response (Success)**:
 * Status: `200 OK`
```
User registered successfully.
```
 * **Error Handling**:
 * - *400 Bad Request*: Missing one or more required parameters in the request body.
```json
{
  "status": "error",
  "message": "Missing one or more of the required params."
}
```
 * - *500 Internal Server Error*: An unexpected issue occurred while processing the user registration.
```json
{
  "status": "error",
  "message": "An error occurred while creating the user."
}
 ```
 * **Details**:
 * - This endpoint validates the presence of all required fields (`email`, `password`, `first_name`, `last_name`, and `phone_number`) before executing the database query.
 * - The user details are inserted into the `client` table, with `email` serving as the unique identifier.
 * - On success, the endpoint returns a success message and HTTP 200 status.
 * - On error, appropriate error messages and status codes are returned.

a checker

## */login*
**Method** : *POST*
**Description:** : *This endpoints allows an user to login into his Flight Club account by furnishing his
email adress and password.*
**Returned Data Format** : *If, his information are matches with an existant user on the database, a
token will be returned. If not, an error message will be returned.*
**Parameters (required):**
- *email (user@departure.com): the user's email adress*
- *password (string) : the user's password*
**Example Request:** :
*POST /login HTTP /1.1
Host : localhost
Content-Type: application/json

{
  "email" : "user@departure.com",
  "password" : "password"
}*
**Example Response:** :
*{
  "status": "success",
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMjM0NTY3ODkwLCJpYXQiOjE2NzE5NzU4MDB9.G8l1Vb5mdN8mvZKmptLlmTkJwYO7Ldy9ZnP1MbHz7Vg"
}*
**Example Response:** :
*{
  "status": "error",
  "message": "Invalid email or password"
}*
**Error Handling:**
- *400 Bad Request : caused by a missing or invalid query parameters*
- *401 Unauthorized : if the user's informations are incorrect*
- *500 Internal Server Error : Unexpected error on the server*
