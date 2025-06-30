import { useParams, useSearchParams } from "react-router-dom"
import CategorySidebar from "../components/categories/CategorySidebar"
import ProductGrid from "../components/products/ProductGrid"

function Catalog() {
  const { categoryId } = useParams()
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get("search")

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex gap-8">
        <CategorySidebar />
        <ProductGrid categoryId={categoryId} searchQuery={searchQuery} />
      </div>
    </main>
  )
}

export default Catalog

