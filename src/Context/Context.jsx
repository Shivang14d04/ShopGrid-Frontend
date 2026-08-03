import axios from "../axios";
import { useState, useEffect, createContext } from "react";
import { clearStoredAuth, decodeToken, getToken, setToken } from "../auth";

const AppContext = createContext({
  data: [],
  isError: "",
  cart: [],
  isAuthenticated: false,
  currentUser: null,
  addToCart: (product) => {},
  removeFromCart: (productId) => {},
  refreshData:() =>{},
  updateStockQuantity: (productId, newQuantity) =>{},
  login: (token) => {},
  logout: () => {},
});

export const AppProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [isError, setIsError] = useState("");
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')) || []);
  const [authToken, setAuthToken] = useState(getToken());
  const [currentUser, setCurrentUser] = useState(() => {
    const decoded = decodeToken(getToken());
    return decoded
      ? {
          username: decoded.sub || null,
          role: decoded.role || null,
        }
      : null;
  });

  const addToCart = (product, count = 1) => {
    const existingProductIndex = cart.findIndex((item) => item.id === product.id);
    if (existingProductIndex !== -1) {
      const updatedCart = cart.map((item, index) =>
        index === existingProductIndex
          ? { ...item, quantity: Math.min(item.quantity + count, product.stockQuantity) }
          : item
      );
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    } else {
      const { imageData, ...productWithoutImage } = product; // ← only change
      const updatedCart = [...cart, { ...productWithoutImage, quantity: count }];
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    }
  };

  const removeFromCart = (productId) => {
    console.log("productID",productId)
    const updatedCart = cart.filter((item) => item.id !== productId);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    console.log("CART",cart)
  };

  const refreshData = async () => {
    try {
      const response = await axios.get("/products");
      setData(response.data);
    } catch (error) {
      setIsError(error.message);
    }
  };

  const clearCart =() =>{
    setCart([]);
  }

  const login = (token) => {
    setToken(token);
    setAuthToken(token);
    const decoded = decodeToken(token);
    setCurrentUser(
      decoded
        ? {
            username: decoded.sub || null,
            role: decoded.role || null,
          }
        : null
    );
  };

  const logout = () => {
    clearStoredAuth();
    setAuthToken(null);
    setCurrentUser(null);
  };
  
  useEffect(() => {
    refreshData();
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);
  
  return (
    <AppContext.Provider value={{
      data,
      isError,
      cart,
      addToCart,
      removeFromCart,
      refreshData,
      clearCart,
      isAuthenticated: Boolean(authToken),
      currentUser,
      login,
      logout,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;