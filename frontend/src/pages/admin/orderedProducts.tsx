import CommonLoader from "@/components/common/Loaders/commonLoader/CommonLoader";
import NotFoundMessage from "@/components/common/notFoundMessage/NotFoundMessage";
import OrderedProductsTable from "@/components/common/tables/OrderedProductsTable";
import { useUserContext } from "@/context/AuthContext";
import AdminLayout from "@/layouts/AdminLayout";
import { useGetOrdersByProgressQuery } from "@/redux/features/order/orderApis";
import { IOrder, OrderProgress } from "@/types/orderTypes/orderTypes";
import React, { ReactElement, useState } from "react";

const OrderedProducts = () => {
  const { user, token } = useUserContext();
  const [status, setStatus] = useState<OrderProgress>("Pending");
  const option = {
    progress: status,
    token: token,
  };

  const { data, isLoading } = useGetOrdersByProgressQuery(option);

  if (isLoading) {
    return <CommonLoader />;
  }

  setInterval(() => {
    window.location.reload();
  }, 1800000);

  const products = data?.data as IOrder[];

  return (
    <div className="pb-12 lg:pb-0 my-12 lg:mx-4">
      <div className="flex items-center justify-between mb-6">
        <h6 className="text-lg font-medium">Select Status:</h6>
        <div>
          <select
            onChange={e => setStatus(e.target.value as OrderProgress)}
            className="border border-light-gray p-2 rounded focus:outline-none cursor-pointer"
          >
            <option value="Pending">Pending</option>
            <option value="Verifying">Verifying</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Processing">Processing</option>
            <option value="Delivered">Delivered</option>
            <option value="Completed">Completed</option>
            <option value="Canceled">Canceled</option>
          </select>
        </div>
      </div>
      {products.length ? (
        <OrderedProductsTable
          products={products}
          status={status}
          setStatus={setStatus}
        />
      ) : (
        <NotFoundMessage
          heightStyle="h-screen"
          title={`No ${status} Order's Found`}
        />
      )}
    </div>
  );
};

export default OrderedProducts;

OrderedProducts.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};
