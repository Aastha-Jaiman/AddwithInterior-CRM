// components/PaymentDetails.js
"use client";
import React from "react";

const PaymentDetails = ({ clientData, onBack }) => {
  return (
    <div className="max-w-xl mx-auto p-4">
      <button
        onClick={onBack}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        &larr; Back to List
      </button>
      <h2 className="text-2xl font-semibold mb-4">Payment History for {clientData.client.name}</h2>
      {clientData.payments.length > 0 ? (
        <div className="space-y-4">
          {clientData.payments.map((p) => (
            <div
              key={p._id}
              className="border rounded-md p-4 shadow-sm bg-white"
            >
              <p>
                <strong>Amount:</strong> ₹{p.amount.toLocaleString()}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(p.date).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p>No payment records found.</p>
      )}
      <div className="mt-6 border-t pt-4 text-gray-800 font-semibold">
        <p>Total Price: ₹{clientData.totalPrice.toLocaleString()}</p>
        <p>Total Received: ₹{clientData.totalReceived.toLocaleString()}</p>
        <p>Pending Amount: ₹{clientData.pending.toLocaleString()}</p>
      </div>
    </div>
  );
};

export default PaymentDetails;
