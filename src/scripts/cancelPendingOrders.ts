// scripts/cancelPendingOrders.ts

import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";

async function cancelPendingOrders() {
  await connectDB();

  const cutoff = new Date(Date.now() - 15 * 60 * 1000); // 15 minutes ago

  const result = await Order.updateMany(
    {
      status: "pending",
      createdAt: { $lt: cutoff },
    },
    {
      $set: { status: "cancelled" },
    }
  );

  console.log(`Cancelled ${result.modifiedCount} pending orders.`);
  process.exit(0);
}

cancelPendingOrders().catch((err) => {
  console.error("Error cancelling orders:", err);
  process.exit(1);
});
