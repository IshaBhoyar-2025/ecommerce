import EditOrderForm from "./EditOrderForm";
import { getOrderById } from "@/app/admin/orders/actions"; // Adjust the import path as necessary

export default async function EditOrderPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const order = await getOrderById(id);

  return <EditOrderForm id={id} order={order} />;

}
