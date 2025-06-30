import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, ShoppingCart, Plus, Minus, Heart, ArrowLeft } from "lucide-react";
import { useWishlist } from "../components/context/WishlistContext";
import { useCart } from "../components/context/CartContext";
import { useAuth } from "../components/context/AuthContext";

const ProductPage = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({ rating: 0, comment: "" });
    const [profileRequired, setProfileRequired] = useState(false);
    const [loadingReviews, setLoadingReviews] = useState(true);
    const [errorLoadingReviews, setErrorLoadingReviews] = useState(null);
    const { user, loading: authLoading } = useAuth();

    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const { addToCart: addItemToCart } = useCart();
    const productInWishlist = product ? isInWishlist(Number(productId)) : false;

    const fetchProduct = useCallback(async () => {
        try {
            const res = await fetch(`https://localhost:7191/api/Product/${productId}`);
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const data = await res.json();
            setProduct(data);
        } catch (error) {
            console.error("Error loading product:", error);
        }
    }, [productId]);

    const fetchReviews = useCallback(async () => {
        setLoadingReviews(true);
        setErrorLoadingReviews(null);
        try {
            const res = await fetch(`https://localhost:7191/api/Review/product/${productId}`);
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data = await res.json();
            setReviews(data);
        } catch (error) {
            console.error("Error loading reviews:", error);
            setErrorLoadingReviews("Не вдалося завантажити відгуки.");
        } finally {
            setLoadingReviews(false);
        }
    }, [productId]);

    useEffect(() => {
        fetchProduct();
        fetchReviews();
    }, [productId, fetchProduct, fetchReviews]);

    useEffect(() => {
        console.log("User object in ProductPage:", user);
        const isProfileFilled = user?.firstName && user?.lastName;
        console.log("Is profile filled:", isProfileFilled);
        setProfileRequired(!!(user?.user_id && !isProfileFilled));
        console.log("Profile required:", !!(user?.user_id && !isProfileFilled));
    }, [user]);

    const handleQuantityChange = (change) => {
        setQuantity((prev) => Math.max(1, Math.min(prev + change, product?.quantity || 1)));
    };

    const handleAddToCart = () => {
        if (product) {
            addItemToCart({ id: product.product_id, name: product.name, price: product.price, image: product.image }, quantity);
        }
    };

    const handleToggleWishlist = () => {
        if (product) {
            const productIdNumber = Number(productId);
            if (isInWishlist(productIdNumber)) {
                removeFromWishlist(productIdNumber);
            } else {
                addToWishlist({ id: product.product_id, name: product.name, price: product.price, image: product.image });
            }
        } else {
            console.error("Продукт ще не завантажено.");
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!user?.user_id) {
            alert("Щоб залишити відгук, потрібно увійти в систему.");
            return;
        }

        if (!user?.firstName || !user?.lastName) {
            setProfileRequired(true);
            return;
        }
        setProfileRequired(false);

        const reviewData = {
            product_Id: Number(productId),
            user_Id: user.user_id,
            rating: newReview.rating,
            comment: newReview.comment,
            author_Name: `${user.firstName} ${user.lastName}`, 
        };

        try {
            const response = await fetch('https://localhost:7191/api/Review', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'accept': 'application/json' },
                body: JSON.stringify(reviewData),
            });
            if (!response.ok) {
                const error = await response.json();
                console.error("Error submitting review:", error);
                alert(`Помилка при додаванні відгуку: ${error?.message || response.status}`);
                return;
            }
            fetchReviews();
            setNewReview({ rating: 0, comment: "" });
        } catch (error) {
            console.error("Error submitting review:", error);
            alert("Сталася помилка при додаванні відгуку.");
        }
    };

    if (!product) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center p-8">
                    <h2 className="text-2xl font-bold text-gray-900">Товар не знайдено</h2>
                    <p className="mt-2 text-gray-600">Вибачте, але товар з таким ID не існує.</p>
                    <button onClick={() => navigate("/catalog")} className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-700">
                        <ArrowLeft className="mr-2" size={20} />
                        Повернутися до каталогу
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 hover:text-gray-900 mb-6">
                <ArrowLeft className="mr-2" size={20} />
                Назад
            </button>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <div className="relative">
                        <img src={product.image || "/placeholder.svg"} alt={product.name} className="w-full rounded-lg shadow-lg" />
                        <button
                            onClick={handleToggleWishlist}
                            className="absolute top-4 right-4 p-2 bg-white rounded-full shadow hover:bg-gray-100 transition-all duration-300"
                        >
                            <Heart size={24} className={productInWishlist ? "text-red-500 fill-red-500" : "text-gray-600"} />
                        </button>
                    </div>
                </div>

                <div>
                    <div className="sticky top-4">
                        <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
                        <div className="flex items-center gap-4 mb-4">
                            <p className="text-2xl font-semibold">{product.price} ₴</p>
                            {product.discount && <span className="bg-red-500 text-white text-sm px-2 py-1 rounded">-{product.discount}%</span>}
                            {product.is_new && <span className="bg-green-500 text-white text-sm px-2 py-1 rounded">НОВИНКА</span>}
                        </div>
                        {product.material && <div className="mb-2"><span className="font-semibold">Матеріал:</span> {product.material}</div>}
                        {product.length && <div className="mb-2"><span className="font-semibold">Довжина:</span> {product.length}</div>}
                        {product.weight && <div className="mb-2"><span className="font-semibold">Вага:</span> {product.weight}</div>}
                        {product.type && <div className="mb-2"><span className="font-semibold">Тип:</span> {product.type}</div>}
                        <p className="text-gray-600 mb-6 whitespace-pre-line">{product.description}</p>
                        <div className="flex items-center mb-6">
                            <button onClick={() => handleQuantityChange(-1)} className="bg-gray-100 p-2 rounded-l hover:bg-gray-200 transition-colors">
                                <Minus size={20} />
                            </button>
                            <span className="bg-gray-50 px-6 py-2">{quantity}</span>
                            <button onClick={() => handleQuantityChange(1)} className="bg-gray-100 p-2 rounded-r hover:bg-gray-200 transition-colors">
                                <Plus size={20} />
                            </button>
                            <span className="ml-4 text-gray-500">В наявності: {product.quantity} шт.</span>
                        </div>
                        <div className="flex gap-4">
                            <button onClick={handleAddToCart} className="flex-1 bg-blue-600 text-white py-3 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors">
                                <ShoppingCart className="mr-2" />
                                Додати в кошик
                            </button>
                            <button
                                onClick={handleToggleWishlist}
                                className={`px-4 py-3 rounded-lg flex items-center justify-center transition-colors ${
                                    productInWishlist
                                        ? "bg-red-100 text-red-600 hover:bg-red-200"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                            >
                                <Heart className={productInWishlist ? "fill-red-500" : ""} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-12">
                <h2 className="text-2xl font-bold mb-6">Відгуки</h2>

                {authLoading ? (
                    <p>Завантаження інформації про користувача...</p>
                ) : user?.user_id && (!user?.firstName || !user?.lastName) ? (
                    <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <strong className="font-bold">Увага!</strong>
                        <span className="block sm:inline"> Будь ласка, заповніть свій профіль для відправлення відгука.</span>
                        <button onClick={() => navigate("/profile")} className="absolute top-0 bottom-0 right-0 px-4 py-3">
                            <svg className="fill-current h-6 w-6 text-yellow-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.15 2.759-3.152a1.2 1.2 0 0 1 0 1.698z"/></svg>
                        </button>
                    </div>
                ) : user?.user_id ? (
                    <form onSubmit={handleReviewSubmit} className="mb-8 bg-gray-50 p-6 rounded-lg">
                        <div className="mb-4">
                            <label htmlFor="comment" className="block text-sm font-medium mb-1">
                                Ваш відгук
                            </label>
                            <textarea
                                id="comment"
                                value={newReview.comment}
                                onChange={(e) => setNewReview((prev) => ({ ...prev, comment: e.target.value }))}
                                className="w-full p-2 border rounded"
                                rows={4}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Оцінка</label>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        size={24}
                                        className={`cursor-pointer ${
                                            star <= newReview.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                                        }`}
                                        onClick={() => setNewReview((prev) => ({ ...prev, rating: star }))}
                                    />
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
                            disabled={profileRequired}
                        >
                            Додати відгук
                        </button>
                    </form>
                ) : (
                    <p>Щоб залишити відгук, будь ласка, увійдіть в систему.</p>
                )}

                <div>
                    {loadingReviews && <p>Завантаження відгуків...</p>}
                    {errorLoadingReviews && <p className="text-red-500">{errorLoadingReviews}</p>}
                    {!loadingReviews && !errorLoadingReviews && (
                        <div className="space-y-4">
                            {reviews.map((review) => (
                                <div key={review.review_Id} className="bg-white p-6 rounded-lg shadow">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-medium">{review.user?.name || "Анонім"}</span>
                                        <span className="text-gray-500 text-sm">{new Date(review.created_At).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex mb-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                size={16}
                                                className={`${star <= review.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-gray-600">{review.comment}</p>
                                </div>
                            ))}
                            {reviews.length === 0 && !loadingReviews && <p>Відгуків поки немає.</p>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductPage;