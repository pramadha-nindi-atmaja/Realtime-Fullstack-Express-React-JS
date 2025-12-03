import useSWR, { useSWRConfig } from "swr";
import { getAllOrders, deleteOrder } from "../services/OrderService.jsx";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const OrderList = () => {
  const { mutate } = useSWRConfig();
  const fetcher = async (url) => {
    return await getAllOrders(url);
  };
  const { data, error } = useSWR("/api/orders", fetcher);
  let loading = false;
  if (!data) {
    loading = true;
  }

  const delOrder = async (id) => {
    Swal.fire({
      icon: "warning",
      title: "Confirmation",
      text: "Are you sure want to delete this order?",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteOrder(id);
        mutate("/api/orders");
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        return false;
      }
    });
  };

  return (
    <div className="flex flex-col mt-5">
      <div className="w-full">
        <Link
          to={"/add-order"}
          className="bg-green-500 border border-slate-text hover:bg-green-700 text-white py-1 px-3 rounded-lg"
        >
          Add New Order
        </Link>
        <div className="relative shadow rounded-lg mt-3">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
              <tr>
                <th className="py-3 px-1 text-center">No</th>
                <th className="py-3 px-1">Customer</th>
                <th className="py-3 px-1">Product</th>
                <th className="py-3 px-1 text-right">Quantity</th>
                <th className="py-3 px-1">Status</th>
                <th className="py-3 px-1 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {data && data.data ? (
                data.data.map((order, index) => {
                  return (
                    <tr key={order.id} className="bg-white border-b">
                      <td className="py-3 px-1 text-center">{index + 1}</td>
                      <td className="py-3 px-1">
                        <div>{order.customerName}</div>
                        <div className="text-xs text-gray-500">{order.customerEmail}</div>
                      </td>
                      <td className="py-3 px-1">
                        {order.product ? order.product.name : "Product not found"}
                      </td>
                      <td className="py-3 px-1 text-right">{order.qty}</td>
                      <td className="py-3 px-1">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          order.status === 'pending' ? 'bg-yellow-200 text-yellow-800' :
                          order.status === 'processing' ? 'bg-blue-200 text-blue-800' :
                          order.status === 'shipped' ? 'bg-indigo-200 text-indigo-800' :
                          order.status === 'delivered' ? 'bg-green-200 text-green-800' :
                          'bg-red-200 text-red-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-1 text-center">
                        <Link
                          to={`/edit-order/${order.id}`}
                          className="font-medium bg-blue-400 hover:bg-blue-500 px-3 py-1 rounded text-white mr-1"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => delOrder(order.id)}
                          className="font-medium bg-red-400 hover:bg-red-500 px-3 py-1 rounded text-white"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : loading ? (
                <tr>
                  <td colSpan={6} className="py-3 px-1 text-center">Loading...</td>
                </tr>
              ) : (
                <tr>
                  <td colSpan={6} className="py-3 px-1 text-center">
                    {error ? "Error loading orders" : "No orders found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderList;