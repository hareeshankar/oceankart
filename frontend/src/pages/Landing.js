import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import '../styles/HotelDashboard.css';

const Landing = () => {
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    // Fetch products from the backend
    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/products'); // Update with your backend URL
            if (!response.ok) {
                throw new Error(`Error fetching products: ${response.statusText}`);
            }
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    // Fetch products on component mount
    useEffect(() => {
        fetchProducts();
    }, []);
    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return (
        <div className="hotel-dashboard">
            {/* Top Navbar */}
            <Navbar showAuthButtons={false} onSearch={setSearchQuery} />

            <div className="dashboard-content">
                {/* Product Grid */}
                <div className="main-content">
                    <div className="product-grid">
                    {filteredProducts.map((product) => (
                    <ProductCard key={product._id} product={product} isGuestView={!localStorage.getItem("token")}/>
                ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Landing;
