import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import CartModal from '../components/CartModal';
import '../styles/HotelDashboard.css';

const HotelDashboard = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showCartModal, setShowCartModal] = useState(false);

    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/products');
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAddToCart = (product) => {
        const existingItem = cart.find((item) => item._id === product._id);
        if (existingItem) {
            setCart(
                cart.map((item) =>
                    item._id === product._id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            );
        } else {
            setCart([...cart, { ...product, quantity: 1 }]);
        }
    };

    const handleRemoveFromCart = (productId) => {
        setCart(cart.filter((item) => item._id !== productId));
    };

    const handleUpdateQuantity = (productId, quantity) => {
        if (quantity === 0) {
            handleRemoveFromCart(productId);
        } else {
            setCart(
                cart.map((item) =>
                    item._id === productId ? { ...item, quantity } : item
                )
            );
        }
    };

    return (
      <div className="hotel-dashboard">
        {/* Navbar with Cart Integration */}
        <Navbar
          showAuthButtons={false}
          cartItems={cart}
          onSearch={setSearchQuery}
          onToggleCartModal={() => setShowCartModal(true)}
        />

        {/* Product Grid */}
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              isGuestView={!localStorage.getItem("token")} // Check if user is logged in
              onAddToCart={handleAddToCart} // Pass add-to-cart handler
            />
          ))}
        </div>

        {/* Cart Modal */}
        {showCartModal && (
          <CartModal
            cart={cart}
            onClose={() => setShowCartModal(false)}
            onRemoveFromCart={handleRemoveFromCart}
            onUpdateQuantity={handleUpdateQuantity}
          />
        )}

          {/* View Cart Button */}
          <div className="view-cart-footer">
                <p>
                    {cart.length} items | Total: ₹
                    {cart.reduce(
                        (total, item) => total + item.price * item.quantity,
                        0
                    )}
                </p>
                <button
                    className="view-cart-button"
                    onClick={() => setShowCartModal(true)}
                >
                    View Cart
                </button>
            </div>
      </div>
    );
};

export default HotelDashboard;
