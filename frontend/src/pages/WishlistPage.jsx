
import { Link } from "react-router-dom"
import { Trash2, ShoppingCart, ArrowLeft } from "lucide-react"
import { useWishlist } from "../components/context/WishlistContext"

const WishlistPage = () => {
  const { wishlist, removeFromWishlist } = useWishlist()

  if (wishlist.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold mb-4">Ваш список бажань порожній</h1>
          <p className="text-gray-600 mb-8">Додайте товари до списку бажань, щоб переглянути їх пізніше</p>
          <Link
            to="/catalog"
            className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="mr-2" size={20} />
            Перейти до каталогу
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Список бажань</h1>

      <div className="grid gap-6">
        {wishlist.map((item) => (
          <div key={item.id} className="flex flex-col md:flex-row gap-6 bg-white p-4 rounded-lg shadow">
            <div className="w-full md:w-48 h-48 flex-shrink-0">
              <img
                src={item.image || "/placeholder.svg"}
                alt={item.name}
                className="w-full h-full object-cover rounded-md"
              />
            </div>

            <div className="flex-1">
              <Link to={`/product/${item.id}`} className="text-xl font-semibold hover:text-blue-600">
                {item.name}
              </Link>
              <p className="text-2xl font-bold mt-2">{item.price} ₴</p>

              <div className="flex gap-3 mt-6">
                <Link
                  to={`/product/${item.id}`}
                  className="bg-blue-600 text-white px-4 py-2 rounded flex items-center hover:bg-blue-700 transition-colors"
                >
                  <ShoppingCart className="mr-2" size={18} />
                  Переглянути товар
                </Link>

                <button
                  onClick={() => removeFromWishlist(item.id)}
                  className="bg-red-100 text-red-600 px-4 py-2 rounded flex items-center hover:bg-red-200 transition-colors"
                >
                  <Trash2 className="mr-2" size={18} />
                  Видалити
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default WishlistPage

