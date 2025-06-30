import { Link } from "react-router-dom"

const categories = [
  {
    id: 1,
    title: "Футбольне спорядження",
    image: "/eight=200&width=200",
    path: "/category/football",
  },
  {
    id: 2,
    title: "Бігове спорядження",
    image: "/placeholder.svg?height=200&width=200",
    path: "/category/running",
  },
  {
    id: 3,
    title: "Фітнес та тренажери",
    image: "/placeholder.svg?height=200&width=200",
    path: "/category/fitness",
  },
  {
    id: 4,
    title: "Спортивний одяг",
    image: "/placeholder.svg?height=200&width=200",
    path: "/category/clothing",
  },
  {
    id: 5,
    title: "Спортивне харчування",
    image: "/placeholder.svg?height=200&width=200",
    path: "/category/nutrition",
  },
]

function PopularCategories() {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6">Популярні категорії</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {categories.map((category) => (
          <Link key={category.id} to={category.path} className="block group">
            <div className="aspect-square relative overflow-hidden rounded-lg">
              <img
                src={category.image || "/placeholder.svg"}
                alt={category.title}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <h3 className="text-white text-center font-medium px-4">{category.title}</h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default PopularCategories

