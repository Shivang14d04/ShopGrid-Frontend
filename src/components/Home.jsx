import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AppContext from "../Context/Context";
import unplugged from "../assets/unplugged.png";
import { FiFilter, FiShoppingCart, FiEye, FiSearch, FiX } from "react-icons/fi";

const Home = ({ selectedCategory: navbarCategory }) => {
  const { data, isError, addToCart, refreshData } = useContext(AppContext);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastProduct, setToastProduct] = useState(null);
  const navigate = useNavigate();
  // Filtering & Sorting states
  const [categoryFilter, setCategoryFilter] = useState("");
  const [priceRange, setPriceRange] = useState(100000);
  const [maxPriceLimit, setMaxPriceLimit] = useState(100000);
  const [sortBy, setSortBy] = useState("default");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Sync category selected from Navbar
  useEffect(() => {
    if (navbarCategory !== undefined) {
      setCategoryFilter(navbarCategory);
    }
  }, [navbarCategory]);

  useEffect(() => {
    if (!isDataFetched) {
      refreshData();
      setIsDataFetched(true);
    }
  }, [refreshData, isDataFetched]);

  // Determine dynamic maximum price from fetched products
  useEffect(() => {
    if (data && data.length > 0) {
      const prices = data.map(p => p.price);
      const maxPrice = Math.max(...prices);
      setMaxPriceLimit(maxPrice);
      setPriceRange(maxPrice);
    }
  }, [data]);

  useEffect(() => {
    let toastTimer;
    if (showToast) {
      toastTimer = setTimeout(() => {
        setShowToast(false);
      }, 3000);
    }
    return () => clearTimeout(toastTimer);
  }, [showToast]);

  const convertBase64ToDataURL = (base64String, mimeType = 'image/jpeg') => {
    if (!base64String) return unplugged;
    if (base64String.startsWith('data:')) return base64String;
    if (base64String.startsWith('http')) return base64String;
    return `data:${mimeType};base64,${base64String}`;
  };

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    addToCart(product);
    setToastProduct(product);
    setShowToast(true);
  };

  const handleClearFilters = () => {
    setCategoryFilter("");
    setPriceRange(maxPriceLimit);
    setSortBy("default");
  };

  const categories = [
    "Laptop",
    "Headphone",
    "Mobile",
    "Electronics",
    "Toys",
    "Fashion",
  ];

  // Apply filters
  const filteredProducts = data.filter((product) => {
    const matchesCategory = categoryFilter ? product.category === categoryFilter : true;
    const matchesPrice = product.price <= priceRange;
    return matchesCategory && matchesPrice;
  });

  // Apply sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-low") {
      return a.price - b.price;
    } else if (sortBy === "price-high") {
      return b.price - a.price;
    } else if (sortBy === "newest") {
      return new Date(b.releaseDate || 0) - new Date(a.releaseDate || 0);
    } else if (sortBy === "popularity") {
      // Simulate popularity by high stock count
      return b.stockQuantity - a.stockQuantity;
    }
    return 0; // default
  });

  if (isError) {
    return (
      <div className="container d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
        <div className="text-center bg-white p-5 rounded shadow-sm border">
          <img src={unplugged} alt="Error" className="img-fluid mb-4" width="80" />
          <h4 className="fw-bold mb-2">Network Connection Issue</h4>
          <p className="text-muted mb-4">Unable to fetch products. Please ensure the backend server is running.</p>
          <button className="btn btn-primary" onClick={() => refreshData()}>Retry Connection</button>
        </div>
      </div>
    );
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="main-layout" style={{ minHeight: "100vh" }}>
      {/* Toast Notification */}
      <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1060 }}>
        <AnimatePresence>
          {showToast && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="toast show bg-white border shadow-lg rounded-lg"
              style={{ width: "350px", backgroundColor: "var(--bg-card)", color: "var(--text-primary)", border: "1px solid var(--border-color)" }}
              role="alert"
            >
              <div className="toast-header border-bottom py-2 px-3">
                <span className="bg-success rounded-circle me-2" style={{ width: "10px", height: "10px", display: "inline-block" }}></span>
                <strong className="me-auto" style={{ color: "var(--text-primary)" }}>Item Added to Cart</strong>
                <button
                  type="button"
                  className="btn-close shadow-none"
                  onClick={() => setShowToast(false)}
                ></button>
              </div>
              <div className="toast-body p-3">
                {toastProduct && (
                  <div className="d-flex align-items-center gap-3">
                    <img
                      src={convertBase64ToDataURL(toastProduct.imageData)}
                      alt={toastProduct.name}
                      className="rounded border"
                      width="50"
                      height="50"
                      style={{ objectFit: "cover" }}
                      onError={(e) => { e.target.src = unplugged; }}
                    />
                    <div className="text-truncate">
                      <div className="fw-semibold text-truncate" style={{ color: "var(--text-primary)" }}>{toastProduct.name}</div>
                      <small className="text-muted">₹{toastProduct.price.toLocaleString("en-IN")}</small>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Hero Banner Section */}
      <div className="container px-4 mb-5 mt-4">
        <div
          className="rounded-lg p-5 d-flex flex-column justify-content-center position-relative overflow-hidden shadow-sm"
          style={{
            background: "linear-gradient(135deg, rgba(239, 246, 255, 0.9) 0%, rgba(219, 234, 254, 0.4) 100%)",
            minHeight: "280px",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--border-color)"
          }}
        >
          {/* Subtle graphic background circles */}
          <div className="position-absolute end-0 top-0 bg-primary opacity-10 rounded-circle" style={{ width: "300px", height: "300px", transform: "translate(80px, -80px)" }}></div>
          <div className="position-absolute end-0 bottom-0 bg-info opacity-10 rounded-circle" style={{ width: "200px", height: "200px", transform: "translate(40px, 40px)" }}></div>

          <div className="row position-relative" style={{ zIndex: 1 }}>
            <div className="col-md-7 d-flex flex-column justify-content-center">
              <span className="badge bg-primary align-self-start mb-3 px-3 py-2 rounded-pill fw-semibold text-uppercase" style={{ fontSize: "0.75rem" }}>
                Summer Sale Live
              </span>
              <h1 className="display-4 fw-bold mb-2 text-dark" style={{ letterSpacing: "-1.5px" }}>
                Next-Gen Tech Devices
              </h1>
              <p className="lead text-secondary mb-4" style={{ fontSize: "1.1rem" }}>
                Upgrade your desktop space. Get up to 40% discount on Laptops, Headphones, and Electronics.
              </p>
              <div>
                <a href="#products-section" className="btn btn-primary btn-lg px-4 shadow-none">
                  Shop Catalog
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products & Filters Container */}
      <div className="container px-4" id="products-section">
        <div className="row">

          {/* Filters Sidebar (Desktop) */}
          <div className="col-lg-3 d-none d-lg-block">
            <div className="card border-0 shadow-sm p-4 sticky-top" style={{ top: "100px", borderRadius: "var(--radius-md)", backgroundColor: "var(--bg-card)" }}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="mb-0 fw-semibold d-flex align-items-center gap-2">
                  <FiFilter size={18} /> Filters
                </h5>
                <button className="btn btn-link text-decoration-none text-muted p-0 border-0" onClick={handleClearFilters}>
                  Clear All
                </button>
              </div>

              {/* Categories */}
              <div className="mb-4">
                <h6 className="fw-semibold mb-3">Categories</h6>
                <div className="d-flex flex-column gap-2">
                  <button
                    className={`btn text-start py-2 px-3 border-0 w-100 rounded-sm ${!categoryFilter ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setCategoryFilter("")}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      className={`btn text-start py-2 px-3 border-0 w-100 rounded-sm ${categoryFilter === cat ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => setCategoryFilter(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h6 className="fw-semibold mb-3 d-flex justify-content-between">
                  <span>Price Range</span>
                  <span className="text-primary">₹{priceRange.toLocaleString("en-IN")}</span>
                </h6>
                <input
                  type="range"
                  className="form-range"
                  min="0"
                  max={maxPriceLimit || 100000}
                  step="500"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                />
                <div className="d-flex justify-content-between text-muted small mt-1">
                  <span>₹0</span>
                  <span>₹{(maxPriceLimit || 100000).toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Listing Main Section */}
          <div className="col-lg-9">

            {/* Control Bar (Mobile Filters toggle & Sorting dropdown) */}
            <div
              className="d-flex flex-wrap justify-content-between align-items-center p-3 mb-4 rounded-md shadow-sm"
              style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)" }}
            >
              <div className="d-flex align-items-center gap-3">
                <button
                  className="btn btn-outline-primary d-lg-none d-flex align-items-center gap-2"
                  onClick={() => setShowMobileFilters(true)}
                >
                  <FiFilter /> Filters
                </button>
                <div className="text-muted d-none d-sm-block">
                  Showing {sortedProducts.length} {sortedProducts.length === 1 ? "product" : "products"}
                </div>
              </div>

              <div className="d-flex align-items-center gap-2">
                <span className="text-muted d-none d-sm-inline">Sort by:</span>
                <select
                  className="form-select py-1 px-3"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{ width: "180px", height: "38px" }}
                >
                  <option value="default">Default</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                  <option value="popularity">Popularity</option>
                </select>
              </div>
            </div>

            {/* Mobile Filters Modal */}
            <AnimatePresence>
              {showMobileFilters && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="position-fixed top-0 start-0 w-100 h-100 bg-black bg-opacity-50 d-flex justify-content-end"
                  style={{ zIndex: 1100 }}
                  onClick={() => setShowMobileFilters(false)}
                >
                  <motion.div
                    initial={{ x: 300 }}
                    animate={{ x: 0 }}
                    exit={{ x: 300 }}
                    className="h-100 bg-white p-4 w-75 max-w-sm overflow-auto"
                    style={{ backgroundColor: "var(--bg-card)", color: "var(--text-primary)" }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h5 className="mb-0 fw-semibold">Filters</h5>
                      <button className="btn btn-link p-0 text-dark border-0" onClick={() => setShowMobileFilters(false)}>
                        <FiX size={24} />
                      </button>
                    </div>

                    <div className="mb-4">
                      <h6 className="fw-semibold mb-3">Categories</h6>
                      <div className="d-flex flex-column gap-2">
                        <button
                          className={`btn text-start py-2 px-3 border-0 w-100 rounded-sm ${!categoryFilter ? 'btn-primary' : 'btn-secondary'}`}
                          onClick={() => { setCategoryFilter(""); setShowMobileFilters(false); }}
                        >
                          All Categories
                        </button>
                        {categories.map((cat) => (
                          <button
                            key={cat}
                            className={`btn text-start py-2 px-3 border-0 w-100 rounded-sm ${categoryFilter === cat ? 'btn-primary' : 'btn-secondary'}`}
                            onClick={() => { setCategoryFilter(cat); setShowMobileFilters(false); }}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <h6 className="fw-semibold mb-3 d-flex justify-content-between">
                        <span>Price Range</span>
                        <span className="text-primary">₹{priceRange.toLocaleString("en-IN")}</span>
                      </h6>
                      <input
                        type="range"
                        className="form-range"
                        min="0"
                        max={maxPriceLimit || 100000}
                        step="500"
                        value={priceRange}
                        onChange={(e) => setPriceRange(Number(e.target.value))}
                      />
                    </div>

                    <button className="btn btn-primary w-100 py-2.5 mb-2" onClick={() => setShowMobileFilters(false)}>
                      Apply Filters
                    </button>
                    <button className="btn btn-outline-primary w-100 py-2.5" onClick={() => { handleClearFilters(); setShowMobileFilters(false); }}>
                      Clear All
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Product Grid */}
            <motion.div
              className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              {sortedProducts.length === 0 ? (
                <div className="col-12 text-center my-5 py-5 bg-white rounded border">
                  <h5 className="text-muted">No products match your current filters.</h5>
                  <button className="btn btn-outline-primary mt-3" onClick={handleClearFilters}>
                    Reset Filters
                  </button>
                </div>
              ) : (
                sortedProducts.map((product) => {
                  const { id, brand, name, price, productAvailable, imageData, stockQuantity } = product;

                  return (
                    <motion.div
                      className="col"
                      key={id}
                      variants={itemVariants}
                    >
                      <div className="premium-card h-100 d-flex flex-column border">
                        <Link to={`/product/${id}`} className="text-decoration-none text-dark d-flex flex-column h-100">
                          {/* Image Container with scale zoom */}
                          <div className="image-zoom-container p-3 d-flex align-items-center justify-content-center position-relative" style={{ height: "200px" }}>
                            {/* Stock badges */}
                            {stockQuantity === 0 ? (
                              <span className="position-absolute top-3 start-3 custom-badge custom-badge-danger shadow-sm">
                                Out of Stock
                              </span>
                            ) : stockQuantity <= 5 ? (
                              <span className="position-absolute top-3 start-3 custom-badge custom-badge-warning shadow-sm">
                                Low Stock ({stockQuantity})
                              </span>
                            ) : (
                              <span className="position-absolute top-3 start-3 custom-badge custom-badge-success shadow-sm">
                                In Stock
                              </span>
                            )}

                            <img
                              src={convertBase64ToDataURL(imageData)}
                              alt={name}
                              className="img-fluid"
                              style={{ maxHeight: "160px", objectFit: "contain" }}
                              onError={(e) => {
                                e.target.src = unplugged;
                              }}
                            />
                          </div>

                          {/* Body details */}
                          <div className="card-body p-4 d-flex flex-column flex-grow-1 border-top">
                            <span className="text-uppercase text-muted fw-bold" style={{ fontSize: "0.75rem", letterSpacing: "0.05em" }}>
                              {brand}
                            </span>
                            <h6
                              className="card-title fw-semibold text-truncate mb-2 mt-1 text-capitalize"
                              style={{ fontSize: "1rem", color: "var(--text-primary)" }}
                              title={name}
                            >
                              {name}
                            </h6>

                            <div className="mt-auto pt-3 d-flex align-items-center justify-content-between">
                              <div>
                                <span className="text-muted small">Price</span>
                                <h5 className="mb-0 fw-bold" style={{ color: "var(--text-primary)" }}>
                                  ₹{price.toLocaleString("en-IN")}
                                </h5>
                              </div>

                              <div className="d-flex gap-2">
                                {/* Quick View Button icon */}
                                <button
                                  className="btn btn-outline-primary p-2 rounded-circle"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    navigate(`/product/${id}`);
                                  }}
                                >
                                  <FiEye />
                                </button>

                                {/* Cart Button Icon */}
                                <button
                                  className="btn btn-primary p-2 rounded-circle"
                                  onClick={(e) => handleAddToCart(e, product)}
                                  disabled={!productAvailable || stockQuantity === 0}
                                  style={{ width: "60px", height: "38px", minWidth: "38px" }}
                                  title="Add to cart"
                                >
                                  <FiShoppingCart size={16} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;