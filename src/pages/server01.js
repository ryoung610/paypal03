import express from "express";
import fetch from "node-fetch";
import "dotenv/config";
import path from "path";
import cors from 'cors';

const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PORT = 8888 } = process.env;
const base = "https://api-m.sandbox.paypal.com"; // Correct base URL for PayPal
const app = express();

// host static files
app.use(express.static("src/pages"));
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// parse post params sent in body in json format
app.use(express.json());

//Correct endpoint now
app.post('/api/orders', async (req, res) => {
  try {
    const { cart } = req.body;
    console.log('Request received:', req.body);  // Log request body

    const order = await createOrder(cart);
    res.json(order);
    console.log('Order created:', order);  // Log order details
  } catch (error) {
    console.error('Error processing order:', error);
    res.status(500).json({ error: 'An error occurred while processing the order' });
  }
});

/**
 * Generate an OAuth 2.0 access token for authenticating with PayPal REST APIs.
 * @see https://developer.paypal.com/api/rest/authentication/
 */
const generateAccessToken = async () => {
  try {
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      throw new Error("MISSING_API_CREDENTIALS");
    }
    const auth = Buffer.from(
      PAYPAL_CLIENT_ID + ":" + PAYPAL_CLIENT_SECRET,
    ).toString("base64");
    const response = await fetch(`${base}/v1/oauth2/token`, {
      method: "POST",
      body: "grant_type=client_credentials",
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    const data = await response.json();
    return data.access_token; 
  } catch (error) {
    console.error("Failed to generate Access Token:", error);
  } 
};

/**
 * Create an order to start the transaction.
 * @see https://developer.paypal.com/docs/api/orders/v2/#orders_create
 */
const createOrder = async (cart) => {
  // use the cart information passed from the front-end to calculate the purchase unit details
  console.log(
    "shopping cart information passed from the frontend createOrder() callback:",
    cart,
  );

  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders`;
  const payload = {
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: "150.00",
        },
      },
    ],
  };

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    method: "POST",
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
};

/**
 * Capture payment for the created order to complete the transaction.
 * @see https://developer.paypal.com/docs/api/orders/v2/#orders_capture
 */
const captureOrder = async (orderID) => { //orderID passed in as param
  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders/${orderID}/capture`; //paypal url

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return handleResponse(response);
};

async function handleResponse(response) {
  try {
    const jsonResponse = await response.json();
    return {
      jsonResponse,
      httpStatusCode: response.status,
    };
  } catch (err) {
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  }
}

//Correct endpoint now
app.post("/api/orders/:orderId/capture", async (req, res) => {
  try {
    const { orderId } = req.params; // Now you are extracting correctly
    console.log("capture orderID:", orderId);  // Log order ID
    const { jsonResponse, httpStatusCode } = await captureOrder(orderId);

    // Make sure to handle the response from the captureOrder function correctly
    if (httpStatusCode === 200 || httpStatusCode === 201) {
      // If successful, you might want to update your database or perform other actions
      console.log("Order captured successfully:", jsonResponse);
      res.status(200).json({ success: true, ...jsonResponse }); // Send the PayPal response back
    } else {
      // If not successful, send back the error
      console.error("Failed to capture order:", jsonResponse);
      res.status(httpStatusCode).json({ success: false, ...jsonResponse });
    }
  } catch (error) {
    console.error("Failed to capture order:", error);
    res.status(500).json({ error: "Failed to capture order." });
  }
});

// serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.resolve("./client/dist/index.html"));
});

app.listen(PORT, () => {
  console.log(`Node server listening at http://localhost:${PORT}/`);
});