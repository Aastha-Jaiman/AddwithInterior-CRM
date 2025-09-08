'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import AddPaymentPage from './AddPaymentHistory';
import { getPaymentById, updatePayment } from '@/services/paymenthistory.services';


export default function EditPaymentPage() {
  const { id } = useParams();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await getPaymentById(id);
        setPayment(res?.data);
        console.log("res" , res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <div>Loading...</div>;

  return (
    <AddPaymentPage editMode={true} existingPayment={payment} onSubmit={updatePayment} />
  );
}
