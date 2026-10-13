import ProductCard from "@/components/ProductCard";
import SearchProduct from "@/components/SearchProduct";
import { getAllProducts } from "@/lib/api/product";

const ProductsPage = async ({searchParams}) => {
    const {search} = await searchParams;
  const products = await getAllProducts(search);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Our Products</h1>

      <div className="text-center mb-10">
        <SearchProduct/>
      </div>

     { search && <h2>Found {products.length} Products with the search term <b>{search}</b></h2>}
      
      {products && products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products found.</p>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;