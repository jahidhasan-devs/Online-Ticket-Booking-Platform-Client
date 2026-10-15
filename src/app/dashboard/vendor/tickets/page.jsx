import React from 'react';

const page = () => {
    return (
      <div>
        <p>tickets all ticket show hobe</p>
      </div>
    );
};

export default page;






// import React from "react";
// import ProductTable from "./ProductTable";

// import { getProduct } from "@/lib/api/product";
// import AddProductModal from "@/components/dashboard/seller/AddProductModal";


// const SellerProductPage = async ({searchParams}) => {
//   const params = await searchParams;
//   // console.log(params)
//   const products = await getProduct(params.page)
//   console.log(products);


//   return (
//     <div>
//       <div className="flex justify-between items-center">
//         <h1 className="text-3xl font-bold">Products</h1>
//         <AddProductModal />
//       </div>
//       <ProductTable productsData={products}/>

//     </div>
//   );
// };

// export default SellerProductPage;
