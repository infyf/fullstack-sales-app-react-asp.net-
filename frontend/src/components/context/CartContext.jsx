import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext"; 

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { user } = useAuth(); // kтримуємо інформацію про користувача з контексту авторизації

  useEffect(() => {

    if (user?.user_id) {
      loadCartFromDB(user.user_id);
    } else {
   
      const storedCart = localStorage.getItem("guestCart");
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
    }
  }, [user?.user_id]);

  useEffect(() => {
    // cинхронізуємо кошик з localStorage, якщо користувач не залогінений
    if (!user?.user_id) {
      localStorage.setItem("guestCart", JSON.stringify(cart));
    }
  }, [cart, user?.user_id]);

  const loadCartFromDB = async (userId) => {
    try {
      const response = await fetch(`/api/cart/${userId}`);
      if (!response.ok) {
        console.error("Помилка завантаження кошика:", response.status);
        return;
      }
      const data = await response.json();
      setCart(data);
    } catch (error) {
      console.error("Помилка завантаження кошика:", error);
    }
  };

  const syncCartToDB = async (newCart) => {
    if (user?.user_id) {
      try {
        await fetch(`/api/cart/update`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newCart),
        });
      } catch (error) {
        console.error("Помилка збереження кошика:", error);
      }
    }
    // zкщо користувач не залогінений, кошик зберігається в localStorage (див. useEffect вище)
  };

  const addToCart = (product, quantity = 1) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex((item) => item.id === product.id);
      let updatedCart;
      if (existingItemIndex >= 0) {
        updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + quantity,
        };
      } else {
        updatedCart = [...prevCart, { ...product, quantity }];
      }
      syncCartToDB(updatedCart);
      return updatedCart;
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter((item) => item.id !== productId);
      syncCartToDB(updatedCart);
      return updatedCart;
    });
  };

  const updateQuantity = (productId, quantity) => {
    setCart((prevCart) => {
      let updatedCart;
      if (quantity <= 0) {
        updatedCart = prevCart.filter((item) => item.id !== productId);
      } else {
        updatedCart = prevCart.map((item) =>
          item.id === productId ? { ...item, quantity } : item
        );
      }
      syncCartToDB(updatedCart);
      return updatedCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    syncCartToDB([]);
  };

  const getCartItemsCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const value = {
    cart,
    loadCartFromDB,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartItemsCount,
    getCartTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};