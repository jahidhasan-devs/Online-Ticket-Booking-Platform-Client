import Image from "next/image";
import { getProductById } from "@/lib/api/product";
import Link from "next/link";

const ProductDetailsPage = async ({ params }) => {
  const { id } = await params;
  const product = await getProductById(id);

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/products"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        <svg
          className="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back to Products
      </Link>

      {product ? (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            {/* Product Image */}
            <div className="relative h-96 w-full bg-gray-100 rounded-lg overflow-hidden">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-200">
                  <span className="text-gray-400">No image available</span>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                {product.title}
              </h1>

              <div className="text-4xl font-bold text-blue-600 mb-4">
                ${product.price}
              </div>

              <div className="mb-4">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                    parseInt(product.quantity) > 0
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {parseInt(product.quantity) > 0
                    ? `In Stock (${product.quantity} available)`
                    : "Out of Stock"}
                </span>
              </div>

              <div className="border-t border-b py-4 my-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  Description
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-600">Product ID:</span>
                  <span className="text-gray-800 font-mono text-sm">
                    {product._id}
                  </span>
                </div>
                {product.userId && (
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-600">Seller ID:</span>
                    <span className="text-gray-800 font-mono text-sm">
                      {product.userId}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-6 space-y-3">
                <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold">
                  Add to Cart
                </button>
                <form action={"/api/payment"} method="POST">
                  <input type="hidden" name="price" value={product.price} />
                  <input type="hidden" name="title" value={product.title} />
                  <input type="hidden" name="productId" value={product._id} />

                  <button
                    type="submit"
                    className="w-full border-2 border-blue-600 text-blue-600 py-3 px-6 rounded-lg hover:bg-blue-50 transition-colors duration-200 font-semibold"
                  >
                    Buy Now
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <svg
            className="mx-auto h-16 w-16 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="mt-4 text-xl font-semibold text-gray-600">
            Product Not Found
          </h2>
          <p className="mt-2 text-gray-500">
            The product you are looking for does not exist or has been removed.
          </p>
          <Link
            href="/products"
            className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Browse Products
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProductDetailsPage;
