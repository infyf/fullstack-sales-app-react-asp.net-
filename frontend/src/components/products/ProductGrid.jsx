import React from "react";
import { useNavigate, useParams } from "react-router-dom";  
import { Heart, ShoppingCart } from "lucide-react";
import { useWishlist } from "../../components/context/WishlistContext";
import { useCart } from "../../components/context/CartContext";

const ProductGrid = ({ searchQuery }) => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = React.useState([]);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();

  React.useEffect(() => {
    fetch("https://localhost:7191/api/product")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error("Error loading products:", error));
  }, []); 

  const filteredProducts = products.filter((product) => {
    // Фільтр
    const matchesCategory = categoryId ? product.cat_id === parseInt(categoryId) : true;
    const matchesSearchQuery = searchQuery ? product.name.toLowerCase().includes(searchQuery.toLowerCase()) : true;
    return matchesCategory && matchesSearchQuery;
  });

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleToggleWishlist = (e, product) => {
    e.stopPropagation();
    if (isInWishlist(product.product_Id)) {
      removeFromWishlist(product.product_Id);
    } else {
      addToWishlist({
        id: product.product_Id,
        name: product.name,
        price: product.price,
        image: product.image,
      });
    }
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    addToCart(
      {
        id: product.product_Id,
        name: product.name,
        price: product.price,
        image: product.image,
      },
      1
    );
  };

  return (
    <div className="flex-1">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => {
            const productInWishlist = isInWishlist(product.product_Id);
            return (
              <div
                key={product.product_Id}
                className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
              >
                <div onClick={() => handleProductClick(product.product_Id)} className="cursor-pointer">
                  <div className="relative">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full aspect-square object-cover rounded-md"
                    />
                    <button
                      className="absolute top-2 right-2 p-2 bg-white rounded-full shadow hover:bg-gray-100 transition-all duration-300"
                      onClick={(e) => handleToggleWishlist(e, product)}
                      title={productInWishlist ? "Видалити зі списку бажань" : "Додати до списку бажань"}
                    >
                      <Heart size={20} className={productInWishlist ? "text-red-500 fill-red-500" : "text-gray-600"} />
                    </button>
                    {product.isNew && (
                      <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                        НОВИНКА
                      </span>
                    )}
                    {product.discount && (
                      <span className="absolute top-2 right-12 bg-red-500 text-white text-xs px-2 py-1 rounded">
                        -{product.discount}%
                      </span>
                    )}
                  </div>
                  <h3 className="mt-4 text-gray-800 font-medium">{product.name}</h3>
                  <p className="mt-2 text-xl font-bold">{product.price} ₴</p>
                </div>
                <button
                  className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors flex items-center justify-center"
                  onClick={(e) => handleAddToCart(e, product)}
                >
                  <ShoppingCart size={18} className="mr-2" />В кошик
                </button>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900">Товари не знайдено</h2>
            <p className="mt-2 text-gray-600">
              {searchQuery
                ? `Не знайдено товарів за запитом "${searchQuery}"`
                : "Не знайдено товарів у цій категорії"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductGrid;
