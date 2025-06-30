import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext"; 

const PurchaseHistoryContext = createContext();

export const usePurchaseHistory = () => useContext(PurchaseHistoryContext);

export const PurchaseHistoryProvider = ({ children }) => {
    const [purchaseHistory, setPurchaseHistory] = useState([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);
    const [errorHistory, setErrorHistory] = useState(null);
    const { currentUser } = useAuth(); // currentUser, який повинен містити email

    const fetchPurchaseHistory = useCallback(async () => {
        if (currentUser?.email) {
            setIsLoadingHistory(true);
            setErrorHistory(null);
            try {
                const response = await fetch(
                    `https://localhost:7191/api/PurchaseHistory/GetUserPurchaseHistory?email=${encodeURIComponent(
                        currentUser.email
                    )}`
                );
                if (response.ok) {
                    const data = await response.json();
                    //  (від нових до старих)
                    const sortedData = data.sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate));
                    setPurchaseHistory(sortedData);
                } else {
                    setErrorHistory("Помилка при отриманні історії покупок");
                    console.error("Помилка при отриманні історії покупок:", response.status);
                    const errorData = await response.json();
                    console.error("Деталі помилки:", errorData);
                }
            } catch (error) {
                setErrorHistory("Помилка з'єднання при отриманні історії покупок");
                console.error("Помилка при отриманні історії покупок:", error);
            } finally {
                setIsLoadingHistory(false);
            }
        } else {
            console.warn("Email користувача не знайдено, неможливо отримати історію покупок.");
        }
    }, [currentUser?.email]);

    const addPurchase = useCallback(async (purchaseData) => {
        if (currentUser?.user_id) {
            try {
                const response = await fetch('https://localhost:7191/api/PurchaseHistory/CreatePurchaseHistory', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ ...purchaseData, userId: currentUser.user_id }),
                });

                if (response.ok) {
                    fetchPurchaseHistory();
                } else {
                    const error = await response.json();
                    setErrorHistory(`Помилка при додаванні покупки: ${error?.message || response.status}`);
                    console.error("Помилка при додаванні покупки:", error?.message || response.status);
                    console.error("Деталі помилки:", error);
                }
            } catch (error) {
                setErrorHistory("Помилка з'єднання при додаванні покупки");
                console.error("Помилка при додаванні покупки:", error);
            }
        } else {
            console.warn("ID користувача не знайдено, неможливо зберегти історію покупок.");
        }
    }, [currentUser?.user_id, fetchPurchaseHistory]);

    useEffect(() => {
        fetchPurchaseHistory();
    }, [fetchPurchaseHistory]);

    const value = {
        purchaseHistory,
        addPurchase,
        fetchPurchaseHistory,
        isLoadingHistory,
        errorHistory,
    };

    return (
        <PurchaseHistoryContext.Provider value={value}>
            {children}
        </PurchaseHistoryContext.Provider>
    );
};

export default PurchaseHistoryProvider;
