import React from 'react'
import { useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useEffect } from 'react';
import axios from 'axios';
import cors from 'cors';



function Message({ content }) {
    return <p>{content}</p>;
  }
  

const Paypal = () => {
 
    const initialOptions = {
        "client-id": "AYXgCKpVR1TgPakvisj2HidPU5YEhSYg4p3wFZYlG_Lz-hILZz-iLbnVLOpWH0W6wA8IJuq_O4mBM-1b",
        "enable-funding": "paylater,venmo",
        "data-sdk-integration-source": "integrationbuilder_sc",
      };
    
      const [message, setMessage] = useState("");    
      const API_GATEWAY_BASE_URL = 'https://jarhem0s0e.execute-api.us-east-1.amazonaws.com/dev'; // Replace with your actual API Gateway URL
 
    return (
    <div>
        <h1>Paypal</h1>
    <div>
        <div>
        <PayPalScriptProvider options={initialOptions}>
        <PayPalButtons
          style={{
            shape: "rect",
            //color:'blue' change the default color of the buttons
            layout: "vertical", //default value. Can be changed to horizontal
          }}
          createOrder={async () => {
            try {
             // const response = await fetch("http://localhost:8888/api/orders", {
              const response = await fetch(`${API_GATEWAY_BASE_URL}/orders`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                // use the "body" param to optionally pass additional order information
                // like product ids and quantities
                body: JSON.stringify({
                  "cart": [
                    {
                      "id": "product1",
                      "quantity": 1,
                    },
                  ],
                }),
                
              }           
            )
            console.log('Fetching from:', `${API_GATEWAY_BASE_URL}/orders`);

              if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP Error: ${response.status} - ${errorText}`);
              }

              const orderData = await response.json();

             // if (orderData.id) {
                if (orderData.jsonResponse?.id) {
                console.log("Order Created:", orderData.jsonResponse); // Debugging
                console.log("Order ID:", orderData.jsonResponse.id); // Debugging    
                return orderData.jsonResponse.id;
              } else {
                const errorDetail = orderData?.details?.[0];
                const errorMessage = errorDetail
                  ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
                  : JSON.stringify(orderData);

               throw new Error(errorMessage);
              }
            } catch (error) {
              //console.error(error);
              setMessage(`Could not initiate PayPal Checkout...${error}`);
            }
          }}
          onApprove={async (data, actions) => {
            try {
              const response = await fetch(`${API_GATEWAY_BASE_URL}/orders/${data.orderID}/capture`, {
               // `http://localhost:8888/api/orders/${data.orderID}/capture`,
               // `/api/orders/${data.orderID}/capture`,      
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                },console.log("data.orderID", data.orderID),
              );

              const orderData = await response.json();
              // Three cases to handle:
              //   (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
              //   (2) Other non-recoverable errors -> Show a failure message
              //   (3) Successful transaction -> Show confirmation or thank you message

              const errorDetail = orderData?.details?.[0];

              if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
                // (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
                // recoverable state, per https://developer.paypal.com/docs/checkout/standard/customize/handle-funding-failures/
                return actions.restart();
              } else if (errorDetail) {
                // (2) Other non-recoverable errors -> Show a failure message
                throw new Error(
                  `${errorDetail.description} (${orderData.debug_id})`,
                );
              } else {
                // (3) Successful transaction -> Show confirmation or thank you message
                // Or go to another URL:  actions.redirect('thank_you.html');
                const transaction =
                  orderData.purchase_units[0].payments.captures[0];
                setMessage(
                  `Transaction ${transaction.status}: ${transaction.id}. See console for all available details`,
                );
                console.log(
                  "Capture result",
                  orderData,
                  JSON.stringify(orderData, null, 2),
                );
              }
              console.log('Fetching from:', `${API_GATEWAY_BASE_URL}/orders/${data.orderID}/capture`);
            } 
            catch (error) {
              //console.error(error);
              setMessage(
                `Sorry, your transaction could not be processed...${error}`,
              );
            }
          }
          
        }
        />
      </PayPalScriptProvider>
      <Message content={message} />
           </div>
        </div>
        </div>
  )
}

export default Paypal
