import React from 'react';
import { CheckoutPage as CheckoutComponent } from './components';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '../actions';
import { getShippingAddress } from './actions';




 

   async function CheckoutPage() {
 

     const user = await getCurrentUser();
  if (!user) redirect("/login?redirect=/checkout");

  const address = await getShippingAddress();
    if (!address) redirect("/shipping");

  return (
    <main className="container mx-auto py-8">
      <CheckoutComponent address={address} />
    </main>


  );
};

export default CheckoutPage;