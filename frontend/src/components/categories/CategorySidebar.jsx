import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from './CategorySidebar.module.css';


const rawCategories = [
  { id_cat: 1, name: "Електроінструменти" },
  { id_cat: 2, name: "Вимірювальні інструменти" },
  { id_cat: 3, name: "Садово-будівельні інструменти" },
  { id_cat: 4, name: "Облицювальні та штукатурні інструменти" },
  { id_cat: 5, name: "Інструменти для укладання підлоги та плитки" },
  { id_cat: 6, name: "Ручні інструменти" },
  { id_cat: 7, name: "Інструменти" },
  { id_cat: 8, name: "Теплиці" },
  { id_cat: 9, name: "Горщики" },
  { id_cat: 10, name: "Освітлення" },
  { id_cat: 11, name: "Будівельні матеріали" },
  { id_cat: 12, name: "Електроінструменти" },
];

const categories = rawCategories.filter(
  (cat, index, self) => index === self.findIndex(c => c.name === cat.name)
);

function CategorySidebar() {
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (selectedCategoryId !== null) {
      
      fetch(`https://localhost:7191/api/Category/${selectedCategoryId}`)
        .then((res) => res.json())
        .then((data) => setProducts(data.products)) 
        .catch((err) => console.error("Помилка завантаження товарів:", err));
    }
  }, [selectedCategoryId]);

  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.title}>Категорії</h2>
      <div className={styles.categories}>
        {categories.map((category) => (
          <div key={category.id_cat}>
            <h3
              className={styles.categoryTitle}
              onClick={() => setSelectedCategoryId(category.id_cat)}
            >
              {category.name}
            </h3>
            {selectedCategoryId === category.id_cat && (
              <ul className={styles.linkList}>
                {products.length > 0 ? (
                  products.slice(0, 3).map((product) => (
                    <li key={product.product_Id} className={styles.linkItem}>
                      <Link to={`/product/${product.product_Id}`} className={styles.link}>
                        {product.name}
                      </Link>
                    </li>
                  ))
                ) : (
                  <li className={styles.linkItem}>Немає товарів</li>
                )}
              </ul>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}

export default CategorySidebar;
