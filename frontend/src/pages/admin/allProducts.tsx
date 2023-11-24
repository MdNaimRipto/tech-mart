import React, { ReactElement, useState } from "react";
import AdminLayout from "@/layouts/AdminLayout";
import { useGetAllProductsQuery } from "@/redux/features/products/productsApi";
import PaginationComponent from "@/components/adminDashboard/pagination/PaginationComponent";
import ProductTable from "@/components/common/tables/ProductTable";

const AllProducts = () => {
  const pageValue = Number(localStorage.getItem("page"));
  const [page, setPage] = useState<number>(pageValue ? pageValue : 1);
  const option = {
    page: `${page}`,
    limit: "8",
  };
  const { data, isLoading } = useGetAllProductsQuery(option);

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  const products = data.data.data;
  const count = data.data.meta.total;

  return (
    <div className="my-12 mx-0 md:mx-4 w-full">
      <ProductTable products={products} />
      <PaginationComponent
        count={count}
        page={page}
        setPage={setPage}
        storageName="page"
      />
    </div>
  );
};

export default AllProducts;

AllProducts.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};
