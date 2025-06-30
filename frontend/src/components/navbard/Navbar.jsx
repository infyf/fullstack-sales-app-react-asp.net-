import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Search, Headphones, Heart, User, ShoppingCart, Menu, LogOut, PenToolIcon as Tool } from "lucide-react"
import AuthForm from "../Auth/AuthForm"
import { useWishlist } from "../context/WishlistContext"
import { useCart } from "../context/CartContext"
import { useAuth } from "../context/AuthContext"

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [isAuthFormVisible, setAuthFormVisible] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const { wishlist } = useWishlist()
  const { getCartItemsCount } = useCart()
  const { currentUser, logout, isAuthenticated } = useAuth()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleAuthFormToggle = () => {
    setAuthFormVisible(!isAuthFormVisible)
  }

  const handleLogout = () => {
    logout()
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <header>
      {/* Верхня панель */}
      <div className="bg-gray-800 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <a href="tel:+380501234567" className="text-sm hover:text-orange-300">
                +38 (050) 123-45-67
              </a>
              <span className="hidden md:inline text-sm">Працюємо щодня з 8:00 до 20:00</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/delivery" className="text-sm hover:text-orange-300">
                Доставка і оплата
              </Link>
              <Link to="/contacts" className="text-sm hover:text-orange-300">
                Контакти
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* оосновна навігація */}
      <nav className="bg-gradient-to-r from-orange-600 to-amber-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-white text-2xl font-bold flex items-center">
                <Tool size={28} className="mr-2" />
                БУДМАТЕРІАЛИ
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-white px-3 py-1 rounded-md transition-all duration-300 hover:bg-white/20">
                Головна
              </Link>
              <Link
                to="/catalog"
                className="text-white px-3 py-1 rounded-md transition-all duration-300 hover:bg-white/20"
              >
                Каталог товарів
              </Link>
              {isAuthenticated && currentUser.role === "admin" && (
                <Link
                  to="/admin/security"
                  className="text-white px-3 py-1 rounded-md transition-all duration-300 hover:bg-white/20"
                >
                  Панель безпеки
                </Link>
              )}
            </div>

            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <div className="flex items-center gap-4">
                  <Link to="/profile" className="text-white hover:text-gray-200 flex items-center gap-2">
                    {currentUser.avatar ? (
                      <img
                        src={currentUser.avatar || "/placeholder.svg"}
                        alt={currentUser.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <User size={24} className="text-white" />
                    )}
                    <span className="hidden md:inline">{currentUser.name}</span>
                  </Link>
                  <button
                    className="bg-amber-800 hover:bg-amber-900 text-white px-4 py-2 rounded flex items-center gap-2"
                    onClick={handleLogout}
                  >
                    <LogOut size={18} />
                    <span className="hidden md:inline">Вийти</span>
                  </button>
                </div>
              ) : (
                <button
                  className="bg-amber-800 hover:bg-amber-900 text-white px-4 py-2 rounded"
                  onClick={handleAuthFormToggle}
                >
                  Вхід/Реєстрація
                </button>
              )}

              <button className="md:hidden text-white" onClick={toggleMobileMenu}>
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Мобільне меню */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-800 text-white">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md hover:bg-gray-700"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Головна
            </Link>
            <Link
              to="/catalog"
              className="block px-3 py-2 rounded-md hover:bg-gray-700"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Каталог товарів
            </Link>
            {isAuthenticated && currentUser.role === "admin" && (
              <Link
                to="/admin/security"
                className="block px-3 py-2 rounded-md hover:bg-gray-700"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Панель безпеки
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Панель пошуку та корзини */}
      <div className="bg-gray-900 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link
              to="/catalog"
              className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded"
            >
              <Menu size={20} />
              <span className="hidden sm:inline">Каталог товарів</span>
            </Link>

            <form onSubmit={handleSearch} className="flex-1 relative">
              <input
                type="text"
                placeholder="Що ви шукаєте?"
                className="w-full py-2 px-4 pr-12 rounded"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-0 top-0 bottom-0 px-4 bg-orange-600 rounded-r hover:bg-orange-700"
              >
                <Search size={20} className="text-white" />
              </button>
            </form>

            <div className="flex items-center gap-6 text-white">
              <button className="hidden md:flex items-center gap-2 hover:text-orange-300">
                <Headphones size={20} />
                <span className="hidden lg:inline">Зворотній зв'язок</span>
              </button>

              <Link to="/wishlist" className="relative hover:text-orange-300">
                <Heart size={20} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              <Link to="/cart" className="relative hover:text-orange-300">
                <ShoppingCart size={20} />
                {getCartItemsCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                    {getCartItemsCount()}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {isAuthFormVisible && <AuthForm closeForm={handleAuthFormToggle} />}
    </header>
  )
}

export default Navbar
