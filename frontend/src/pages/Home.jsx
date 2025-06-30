

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { ShoppingCart, Star, ArrowRight, TrendingUp, Award, Clock, Users, ChevronRight, PenToolIcon as Tool, Hammer, Ruler, Truck } from 'lucide-react'
import Slider from "../Slider/Slider.jsx"
import VideoBoard from "../components/VideoBoard/VideoBoard"
import { useCart } from "../components/context/CartContext"

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [newArrivals, setNewArrivals] = useState([])
  const [popularCategories, setPopularCategories] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()


  const getRandomItems = (array, count) => {
    if (!array || array.length === 0) return []
    
    const shuffled = [...array]
    
    // Перемішуємо масив 
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    
  
    return shuffled.slice(0, Math.min(count, shuffled.length))
  }

  useEffect(() => {

    fetch("https://localhost:7191/api/product?featured=true")
      .then((res) => res.json())
      .then((data) => {
  
        const randomProducts = getRandomItems(data, 4)
        setFeaturedProducts(randomProducts)
      })
      .catch((error) => {
        console.error("Помилка завантаження популярних товарів:", error)
        // Резервні дані, якщо API недоступний
        setFeaturedProducts([
          {
            product_Id: 1,
            name: "Цемент ПЦ-500 25кг",
            price: 150,
            image: "/placeholder.svg?height=200&width=200",
            discount: 5,
          },
          {
            product_Id: 2,
            name: "Шпаклівка фінішна Knauf 20кг",
            price: 220,
            image: "/placeholder.svg?height=200&width=200",
          },
          {
            product_Id: 3,
            name: "Фарба інтер'єрна Sniezka 10л",
            price: 450,
            image: "/placeholder.svg?height=200&width=200",
            discount: 10,
          },
          {
            product_Id: 4,
            name: "Клей для плитки Ceresit CM-11 25кг",
            price: 280,
            image: "/placeholder.svg?height=200&width=200",
          },
        ])
      })

    // завантаження нових товарів
    fetch("https://localhost:7191/api/product?new=true")
      .then((res) => res.json())
      .then((data) => {
    
        const randomNewProducts = getRandomItems(data, 4)
        setNewArrivals(randomNewProducts)
      })
      .catch((error) => {
        console.error("Помилка завантаження нових товарів:", error)
   
        setNewArrivals([
          {
            product_Id: 5,
            name: "Ламінат Kronopol Дуб Класичний 8мм",
            price: 350,
            image: "/placeholder.svg?height=200&width=200",
            isNew: true,
          },
          {
            product_Id: 6,
            name: "Шуруповерт Bosch GSR 18V-55",
            price: 3200,
            image: "/placeholder.svg?height=200&width=200",
            isNew: true,
          },
          {
            product_Id: 7,
            name: "Плитка керамічна Cersanit 30x60см",
            price: 420,
            image: "/placeholder.svg?height=200&width=200",
            isNew: true,
          },
          {
            product_Id: 8,
            name: "Утеплювач Rockwool 100мм",
            price: 520,
            image: "/placeholder.svg?height=200&width=200",
            isNew: true,
          },
        ])
      })

    // Завантаження категорій
    fetch("https://localhost:7191/api/Category")
      .then((res) => res.json())
      .then((data) => {
        setPopularCategories(data.slice(0, 4))
      })
      .catch((error) => {
        console.error("Помилка завантаження категорій:", error)
        // резервні дані, якщо API недоступний
        setPopularCategories([
          {
            id_cat: 1,
            name: "Електроінструменти",
            icon: Tool,
          },
          {
            id_cat: 2,
            name: "Будівельні суміші",
            icon: Hammer,
          },
          {
            id_cat: 3,
            name: "Вимірювальні інструменти",
            icon: Ruler,
          },
          {
            id_cat: 4,
            name: "Сантехніка",
            icon: Truck,
          },
        ])
      })

    // завантаження відгуків
    fetch("https://localhost:7191/api/Review/featured")
      .then((res) => res.json())
      .then((data) => {
        // Ввираємо випадкові 3 відгуки
        const randomReviews = getRandomItems(data, 3)
        setReviews(randomReviews)
      })
      .catch((error) => {
        console.error("Помилка завантаження відгуків:", error)
        //рРезервні дані, якщо API недоступний
        setReviews([
          {
            review_Id: 1,
            author_Name: "Олександр К.",
            location: "Київ",
            rating: 5,
            comment:
              "Дуже задоволений якістю товарів. Замовляв цемент та шпаклівку, доставили швидко, все відповідає опису. Рекомендую!",
          },
          {
            review_Id: 2,
            author_Name: "Марія Л.",
            location: "Львів",
            rating: 5,
            comment:
              "Чудовий магазин! Великий вибір будівельних матеріалів. Особливо сподобалась швидка доставка та якісна упаковка.",
          },
          {
            review_Id: 3,
            author_Name: "Ігор В.",
            location: "Одеса",
            rating: 5,
            comment:
              "Замовляв електроінструменти для ремонту. Консультант допоміг з вибором, все прийшло вчасно. Дуже задоволений!",
          },
        ])
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const handleAddToCart = (product) => {
    addToCart(
      {
        id: product.product_Id,
        name: product.name,
        price: product.price,
        image: product.image,
      },
      1,
    )
  }


  const categoryIcons = {
    1: Tool,
    2: Hammer,
    3: Ruler,
    4: Truck,
  }

  return (
    <main className="bg-gray-50">

      <section>
        <Slider />
      </section>

   
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900">Популярні категорії</h2>
          <p className="mt-2 text-lg text-gray-600">Знайдіть все необхідне для будівництва та ремонту</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {popularCategories.map((category) => {
            const IconComponent = categoryIcons[category.id_cat] || Tool
            return (
              <Link to={`/category/${category.id_cat}`} className="group" key={category.id_cat}>
                <div className="bg-gradient-to-r from-orange-500 to-amber-600 rounded-lg p-6 text-center text-white transition-transform group-hover:scale-105">
                  <IconComponent className="w-16 h-16 mx-auto mb-4" />
                  <h3 className="font-medium">{category.name}</h3>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Популярні товари */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Популярні товари</h2>
          <Link to="/catalog" className="flex items-center text-orange-600 hover:text-orange-800">
            Переглянути всі <ChevronRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-100 rounded-lg p-4 animate-pulse">
                <div className="w-full h-48 bg-gray-200 rounded-md mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <div
                key={product.product_Id}
                className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100"
              >
                <Link to={`/product/${product.product_Id}`}>
                  <img
                    src={product.image || "/placeholder.svg?height=200&width=200"}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                </Link>
                <div className="p-4">
                  <Link to={`/product/${product.product_Id}`}>
                    <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                    <div className="flex items-center gap-2">
                      <p className="text-xl font-bold">{product.price} ₴</p>
                      {product.discount && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">-{product.discount}%</span>
                      )}
                    </div>
                  </Link>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="mt-4 w-full bg-orange-600 text-white py-2 rounded flex items-center justify-center hover:bg-orange-700 transition-colors"
                  >
                    <ShoppingCart size={18} className="mr-2" />В кошик
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>


{/* банер */}
<section className="bg-orange-500 text-white py-16">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid md:grid-cols-2 gap-8 items-center">
      <div>
        <h2 className="text-3xl font-bold mb-4">Знижки до 30% на будівельні матеріали</h2>
        <p className="text-lg mb-6">
          Тільки цього тижня! Не пропустіть можливість придбати якісні будівельні матеріали за найкращими цінами.
        </p>
        <Link
          to="/catalog"
          className="inline-flex items-center px-6 py-3 bg-white text-orange-600 rounded-lg font-medium hover:bg-gray-100 transition-colors"
        >
          Переглянути пропозиції <ArrowRight size={16} className="ml-2" />
        </Link>
      </div>
      <div className="md:block">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0wwh-v_RqQRilUXoR3H0-0JihxZIeMPH2eg&shttps://media.istockphoto.com/id/104294966/uk/%D1%84%D0%BE%D1%82%D0%BE/%D1%81%D0%BA%D0%BB%D0%B0%D0%B4%D0%B5%D0%BD%D1%96-%D0%BF%D0%B8%D0%BB%D0%BE%D0%BC%D0%B0%D1%82%D0%B5%D1%80%D1%96%D0%B0%D0%BB%D0%B8-%D1%82%D0%B0-%D0%BA%D1%80%D0%B5%D1%81%D0%BB%D0%B5%D0%BD%D0%BD%D1%8F-%D0%BD%D0%B0-%D0%B1%D1%83%D0%B4%D1%96%D0%B2%D0%B5%D0%BB%D1%8C%D0%BD%D0%BE%D0%BC%D1%83-%D0%BC%D0%B0%D0%B9%D0%B4%D0%B0%D0%BD%D1%87%D0%B8%D0%BA%D1%83.jpg?s=2048x2048&w=is&k=20&c=8mgBqmAyK11Jcex4l5HUKFuZNvsCmbZoLE_KOrsEoV4=" alt="Будівельні матеріали" className="rounded-lg w-full h-auto object-cover" />
      </div>
    </div>
  </div>
</section>

      {/* Нові надходження */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Нові надходження</h2>
          <Link to="/catalog?new=true" className="flex items-center text-orange-600 hover:text-orange-800">
            Переглянути всі <ChevronRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-100 rounded-lg p-4 animate-pulse">
                <div className="w-full h-48 bg-gray-200 rounded-md mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {newArrivals.map((product) => (
              <div
                key={product.product_Id}
                className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100"
              >
                <Link to={`/product/${product.product_Id}`} className="block relative">
                  <img
                    src={product.image || "/placeholder.svg?height=200&width=200"}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                    НОВИНКА
                  </span>
                </Link>
                <div className="p-4">
                  <Link to={`/product/${product.product_Id}`}>
                    <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                    <p className="text-xl font-bold">{product.price} ₴</p>
                  </Link>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="mt-4 w-full bg-orange-600 text-white py-2 rounded flex items-center justify-center hover:bg-orange-700 transition-colors"
                  >
                    <ShoppingCart size={18} className="mr-2" />В кошик
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900">Корисні відео</h2>
          <p className="mt-2 text-lg text-gray-600">Поради та майстер-класи з будівництва та ремонту</p>
        </div>
        <VideoBoard />
      </section>


      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900">Чому обирають нас</h2>
          <p className="mt-2 text-lg text-gray-600">Переваги покупок у нашому магазині</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="bg-amber-100 text-amber-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">Якісні товари</h3>
            <p className="text-gray-600">
              Ми пропонуємо тільки перевірені будівельні матеріали від надійних виробників
            </p>
          </div>
          <div className="text-center">
            <div className="bg-amber-100 text-amber-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">Гарантія</h3>
            <p className="text-gray-600">На всі товари діє гарантія від виробника</p>
          </div>
          <div className="text-center">
            <div className="bg-amber-100 text-amber-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">Швидка доставка</h3>
            <p className="text-gray-600">Доставляємо замовлення протягом 1-3 робочих днів</p>
          </div>
          <div className="text-center">
            <div className="bg-amber-100 text-amber-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">Підтримка</h3>
            <p className="text-gray-600">Наші консультанти завжди готові допомогти з вибором будівельних матеріалів</p>
          </div>
        </div>
      </section>

      {/* Відгуки */}
      <section className="py-12 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Відгуки наших клієнтів</h2>
            <p className="mt-2 text-lg text-gray-600">Що про нас говорять</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review) => (
              <div key={review.review_Id} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={20} className={i < review.rating ? "fill-current" : "text-gray-300"} />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">"{review.comment}"</p>
                <div className="flex items-center">
                  <div>
                    <p className="font-medium">{review.author_Name}</p>
                    <p className="text-sm text-gray-500">{review.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Підписка на розсилку */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-amber-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Підпишіться на наші новини</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Отримуйте інформацію про нові надходження, акції та знижки на будівельні матеріали першими
          </p>
          <form className="max-w-md mx-auto flex">
            <input
              type="email"
              placeholder="Ваш email"
              className="flex-1 py-3 px-4 rounded-l-lg text-gray-900"
              required
            />
            <button
              type="submit"
              className="bg-amber-800 hover:bg-amber-900 py-3 px-6 rounded-r-lg font-medium transition-colors"
            >
              Підписатися
            </button>
          </form>
        </div>
      </section>
    </main>
  )
}

export default Home
