// app/page.js or app/payment-history/page.js in Next.js 13+ (or any parent container)
"use client";
import React, { useEffect, useState } from "react";
import { getAllPayments } from "@/services/paymenthistory.services";
import PaymentList from "./PaymentList";
import PaymentDetails from "./PaymentDetails";


const PaymentHistoryPage = () => {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await getAllPayments();
        if (res.data && res.data.data) {
          setClients(res.data.data);
        }
        console.log("payment-history", res)
      } catch (err) {
        console.error("Error fetching payments:", err);
      }
    };
    fetchPayments();
  }, []);

  const handleBack = () => setSelectedClient(null);

  return (
    <div className="min-h-screen bg-gray-50">
      {!selectedClient ? (
        <PaymentList clients={clients} onSelect={setSelectedClient} />
      ) : (
        <PaymentDetails clientData={selectedClient} onBack={handleBack} />
      )}
    </div>
  );
};

export default PaymentHistoryPage;
