// components/PaymentList.js
"use client";
import React from "react";

const PaymentList = ({ clients, onSelect }) => {
  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Clients Payment Summary</h2>
      <ul className="divide-y divide-gray-200 border rounded-md">
        {clients.map((client) => (
          <li
            key={client._id}
            onClick={() => onSelect(client)}
            className="cursor-pointer p-4 hover:bg-gray-100 flex justify-between items-center"
          >
            <div>
              <p className="font-medium text-gray-900">{client.client.name}</p>
              <p className="text-sm text-gray-600">{client.client.email}</p>
            </div>
            <div className="text-right text-sm text-gray-700">
              <p>Total Price: ₹{client.totalPrice.toLocaleString()}</p>
              <p>Pending: ₹{client.pending.toLocaleString()}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PaymentList;
