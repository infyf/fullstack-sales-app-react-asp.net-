import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { User, Upload, ShoppingBag, AlertTriangle } from 'lucide-react';
import { useAuth } from "../components/context/AuthContext";

const ProfilePage = () => {
    const { isAuthenticated, currentUser, updateProfile } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("profile");
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        avatarUrl: "",
    });
    const [profileData, setProfileData] = useState(null);
    const [purchaseHistory, setPurchaseHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const fileInputRef = useRef(null);
    const [notification, setNotification] = useState({ show: false, message: "", type: "" });

    const fetchProfileData = useCallback(async () => {
        try {
            setIsLoading(true);
            const userEmail = currentUser?.email;
            if (!userEmail) {
                throw new Error("Email користувача не знайдено");
            }

            const response = await fetch(`https://localhost:7191/api/Profile/GetProfile?email=${encodeURIComponent(userEmail)}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Не вдалося отримати дані профілю");
            }

            const data = await response.json();
            setProfileData(data.profile);
            setPurchaseHistory(data.purchaseHistory);
            setFormData({
                firstName: data.profile?.firstName || "",
                lastName: data.profile?.lastName || "",
                email: data.profile?.email || "",
                phone: data.profile?.phone || "",
                address: data.profile?.address || "",
                avatarUrl: data.profile?.avatarUrl || "",
            });
        } catch (error) {
            console.error("Помилка при отриманні даних профілю:", error);
            setNotification({
                show: true,
                message: "Помилка при отриманні даних профілю",
                type: "error",
            });
        } finally {
            setIsLoading(false);
        }
    }, [currentUser]);

    const updateProfileData = async (updatedData) => {
        try {
            const userEmail = currentUser?.email;
            if (!userEmail) {
                throw new Error("Email користувача не знайдено");
            }

            // Ensure proper casing of property names to match backend expectations
            const apiData = {
                firstName: updatedData.firstName,
                lastName: updatedData.lastName,
                phone: updatedData.phone,
                address: updatedData.address,
                avatarUrl: updatedData.avatarUrl
            };

            console.log("Request Body:", JSON.stringify(apiData));

            // Call the updateProfile function from AuthContext
            await updateProfile(apiData);
            
            // Refresh profile data
            await fetchProfileData();
            return true;
        } catch (error) {
            console.error("Помилка при оновленні даних профілю:", error);
            setNotification({
                show: true,
                message: "Помилка при оновленні профілю",
                type: "error",
            });
            return false;
        }
    };

    useEffect(() => {
        if (isAuthenticated && currentUser?.email) {
            fetchProfileData();
        }
    }, [isAuthenticated, currentUser, fetchProfileData]);

    useEffect(() => {
        if (notification.show) {
            const timer = setTimeout(() => {
                setNotification({ show: false, message: "", type: "" });
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [notification.show]);

    if (!isAuthenticated) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <User size={64} className="mx-auto text-gray-300 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Профіль недоступний</h2>
                    <p className="text-gray-600 mb-6">Будь ласка, увійдіть або зареєструйтесь, щоб отримати доступ до профілю.</p>
                    <button
                        onClick={() => navigate("/")}
                        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
                    >
                        Повернутися на головну
                    </button>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                <p className="mt-4 text-gray-600">Завантаження даних профілю...</p>
            </div>
        );
    }

    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                try {
                    const avatarUrl = reader.result;
                    // Update the form data with the new avatar URL
                    const updatedFormData = { ...formData, avatarUrl };
                    const isSuccess = await updateProfileData(updatedFormData);
                    if (isSuccess) {
                        setNotification({
                            show: true,
                            message: "Аватар успішно оновлено",
                            type: "success",
                        });
                    }
                } catch (error) {
                    setNotification({
                        show: true,
                        message: "Помилка при оновленні аватару",
                        type: "error",
                    });
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSaveProfile = async () => {
        try {
            const isSuccess = await updateProfileData(formData);
            if (isSuccess) {
                setIsEditing(false);
                setNotification({
                    show: true,
                    message: "Профіль успішно оновлено",
                    type: "success",
                });
            }
        } catch (error) {
            // Помилка вже обробляється в updateProfileData
        }
    };

    const renderProfileTab = () => (
        <div className="bg-white rounded-lg shadow-md p-6">
            {notification.show && activeTab === "profile" && (
                <div
                    className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
                        notification.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                >
                    {notification.type === "error" && <AlertTriangle size={20} />}
                    {notification.message}
                </div>
            )}

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Особиста інформація</h2>
                {!isEditing ? (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                    >
                        Редагувати
                    </button>
                ) : (
                    <div className="flex gap-2">
                        <button
                            onClick={handleSaveProfile}
                            className="flex items-center gap-1 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                        >
                            Зберегти
                        </button>
                        <button
                            onClick={() => {
                                setIsEditing(false);
                                setFormData({
                                    firstName: profileData?.firstName || "",
                                    lastName: profileData?.lastName || "",
                                    email: profileData?.email || "",
                                    phone: profileData?.phone || "",
                                    address: profileData?.address || "",
                                    avatarUrl: profileData?.avatarUrl || "",
                                });
                            }}
                            className="flex items-center gap-1 bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                        >
                            Скасувати
                        </button>
                    </div>
                )}
            </div>

            {isEditing ? (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Ім'я</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Прізвище</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                            disabled
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Телефон</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Адреса</label>
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                            rows={3}
                        />
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Ім'я</p>
                            <p className="font-medium">{profileData?.firstName || "Не вказано"}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Прізвище</p>
                            <p className="font-medium">{profileData?.lastName || "Не вказано"}</p>
                        </div>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{profileData?.email}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Телефон</p>
                        <p className="font-medium">{profileData?.phone || "Не вказано"}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Адреса</p>
                        <p className="font-medium">{profileData?.address || "Не вказано"}</p>
                    </div>
                </div>
            )}
        </div>
    );

    const renderPurchaseHistoryTab = () => {
        if (!purchaseHistory || purchaseHistory.length === 0) {
            return (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Історія покупок порожня</h2>
                    <p className="text-gray-600 mb-6">Ви ще не зробили жодної покупки.</p>
                    <button
                        onClick={() => navigate("/catalog")}
                        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
                    >
                        Перейти до каталогу
                    </button>
                </div>
            );
        }

        return (
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-6">Історія покупок</h2>
                <div className="space-y-4">
                    {purchaseHistory.map((purchase, index) => (
                        <div key={index} className="border rounded-lg p-4">
                            <div className="flex justify-between items-center mb-2">
                                <p className="font-medium">Замовлення #{purchase.orderId}</p>
                                <p className="text-gray-500 text-sm">{new Date(purchase.date).toLocaleDateString('uk-UA', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                            <div className="space-y-2">
                                {purchase.items.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-4">
                                        {item.image && (
                                            <img
                                                src={item.image || "/placeholder.svg"}
                                                alt={item.name}
                                                className="w-16 h-16 object-cover rounded"
                                            />
                                        )}
                                        <div className="flex-1">
                                            <p className="font-medium">{item.name}</p>
                                            <p className="text-sm text-gray-600">Кількість: {item.quantity}</p>
                                        </div>
                                        <p className="font-bold">{parseFloat(item.price).toFixed(2)} ₴</p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 pt-4 border-t flex justify-between">
                                <p className="font-medium">Загальна сума:</p>
                                <p className="font-bold">{parseFloat(purchase.totalAmount).toFixed(2)} ₴</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="md:col-span-1">
                    <div className="bg-white rounded-lg shadow-md p-6 text-center">
                        <div className="relative inline-block mb-4">
                            <div className="w-32 h-32 mx-auto rounded-full overflow-hidden bg-gray-200">
                                {profileData?.avatarUrl ? (
                                    <img
                                        src={profileData.avatarUrl || "/placeholder.svg"}
                                        alt={`${profileData.firstName} ${profileData.lastName}`}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <User size={128} className="w-full h-full p-6 text-gray-400" />
                                )}
                            </div>
                            <button
                                onClick={() => fileInputRef.current.click()}
                                className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700"
                                title="Завантажити аватар"
                            >
                                <Upload size={16} />
                            </button>
                            <input type="file" ref={fileInputRef} onChange={handleAvatarUpload} className="hidden" accept="image/*" />
                        </div>
                        <h2 className="text-xl font-bold">{profileData?.name || `${profileData?.firstName || ''} ${profileData?.lastName || ''}`}</h2>
                        <p className="text-gray-600 mb-6">{profileData?.email}</p>

                        <div className="space-y-2">
                            <button
                                onClick={() => setActiveTab("profile")}
                                className={`w-full text-left px-4 py-2 rounded flex items-center gap-2 ${
                                    activeTab === "profile" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100"
                                }`}
                            >
                                <User size={18} />
                                Профіль
                            </button>
                            <button
                                onClick={() => setActiveTab("purchases")}
                                className={`w-full text-left px-4 py-2 rounded flex items-center gap-2 ${
                                    activeTab === "purchases" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100"
                                }`}
                            >
                                <ShoppingBag size={18} />
                                Історія покупок
                            </button>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-3">
                    {activeTab === "profile" && renderProfileTab()}
                    {activeTab === "purchases" && renderPurchaseHistoryTab()}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
