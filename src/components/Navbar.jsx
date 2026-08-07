import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../axios";
import AppContext from "../Context/Context";
import { FiShoppingCart, FiUser, FiSearch, FiLogOut, FiMoon, FiSun, FiSliders } from "react-icons/fi";

const Navbar = ({ onSelectCategory }) => {
  const { isAuthenticated, currentUser, logout, cart } = useContext(AppContext);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light-theme");
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navbarRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close navbar and dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setIsNavCollapsed(true);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavbarToggle = () => {
    setIsNavCollapsed(!isNavCollapsed);
  };

  const handleLinkClick = () => {
    setIsNavCollapsed(true);
    setProfileDropdownOpen(false);
  };

  const handleInputChange = (value) => {
    setInput(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.trim() === "") return;

    setIsLoading(true);
    setIsNavCollapsed(true);

    try {
      const response = await axios.get(`/products/search?keyword=${input}`);
      navigate(`/search-results`, { state: { searchData: response.data } });
    } catch (error) {
      console.error("Error searching:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark-theme" ? "light-theme" : "dark-theme";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  // Calculate unique item count in cart
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav
      className="navbar navbar-expand-lg fixed-top glass-panel shadow-sm py-3"
      ref={navbarRef}
      style={{ zIndex: 1030 }}
    >
      <div className="container px-4">
        {/* Logo */}
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/" onClick={handleLinkClick}>
          <span
            className="d-inline-block bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: "32px", height: "32px", fontSize: "0.9rem", fontWeight: "bold" }}
          >
            E
          </span>
          <span style={{ fontWeight: "700", letterSpacing: "-0.5px" }}>ShopGrid</span>
        </Link>

        {/* Mobile Hamburger Toggler */}
        <button
          className="navbar-toggler border-0 shadow-none"
          type="button"
          onClick={handleNavbarToggle}
          aria-expanded={!isNavCollapsed}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Content */}
        <div className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse`} id="navbarSupportedContent">
          {/* Main Links */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-1 ms-lg-4">
            <li className="nav-item">
              <Link className="nav-link px-3 fw-500 text-secondary" to="/" onClick={handleLinkClick}>
                Shop
              </Link>
            </li>
            {isAuthenticated && currentUser?.role === "ROLE_ADMIN" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link px-3 fw-500 text-secondary" to="/admin" onClick={handleLinkClick}>
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link px-3 fw-500 text-secondary" to="/add_product" onClick={handleLinkClick}>
                    Add Product
                  </Link>
                </li>
              </>
            )}
            {isAuthenticated && (
              <li className="nav-item">
                <Link className="nav-link px-3 fw-500 text-secondary" to="/orders" onClick={handleLinkClick}>
                  {currentUser?.role === "ROLE_ADMIN" ? "All Orders" : "My Orders"}
                </Link>
              </li>
            )}
          </ul>

          {/* Right Actions */}
          <div className="d-flex flex-column flex-lg-row align-items-lg-center gap-3 ms-auto w-100 w-lg-auto mt-3 mt-lg-0">
            {/* Search Box */}
            <form className="position-relative flex-grow-1" onSubmit={handleSubmit}>
              <div className="input-group">
                <span
                  className="input-group-text bg-transparent border-end-0 text-muted"
                  style={{ borderTopLeftRadius: "20px", borderBottomLeftRadius: "20px" }}
                >
                  <FiSearch />
                </span>
                <input
                  className="form-control border-start-0 ps-0"
                  type="search"
                  placeholder="Search products..."
                  aria-label="Search"
                  value={input}
                  onChange={(e) => handleInputChange(e.target.value)}
                  style={{ borderTopRightRadius: "20px", borderBottomRightRadius: "20px" }}
                />
              </div>
              {isLoading && (
                <div className="position-absolute end-0 top-50 translate-middle-y me-3">
                  <span className="spinner-border spinner-border-sm text-primary" role="status"></span>
                </div>
              )}
            </form>

            {/* Icons Actions Bar */}
            <div className="d-flex align-items-center gap-3">
              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="btn btn-link nav-link p-2 text-secondary border-0 shadow-none"
                aria-label="Toggle theme"
              >
                {theme === "dark-theme" ? <FiSun size={20} /> : <FiMoon size={20} />}
              </button>

              {/* Cart Button */}
              <Link
                to="/cart"
                className="btn btn-link nav-link p-2 text-secondary position-relative border-0 shadow-none"
                onClick={handleLinkClick}
              >
                <FiShoppingCart size={21} />
                {cartItemCount > 0 && (
                  <span
                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-white"
                    style={{ fontSize: "0.7rem", padding: "0.25em 0.5em" }}
                  >
                    {cartItemCount}
                  </span>
                )}
              </Link>

              {/* Auth / Profile Area */}
              {isAuthenticated ? (
                <div className="position-relative" ref={dropdownRef}>
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="btn btn-link nav-link p-1 d-flex align-items-center gap-2 border-0 shadow-none"
                    aria-expanded={profileDropdownOpen}
                  >
                    <div
                      className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-semibold text-uppercase"
                      style={{ width: "36px", height: "36px", fontSize: "0.9rem" }}
                    >
                      {currentUser?.username?.slice(0, 2) || "U"}
                    </div>
                  </button>

                  {profileDropdownOpen && (
                    <div
                      className="position-absolute end-0 mt-2 p-2 bg-white text-dark rounded shadow-lg border"
                      style={{ width: "240px", zIndex: 1050, backgroundColor: "var(--bg-card)", color: "var(--text-primary)" }}
                    >
                      <div className="px-3 py-2 border-bottom">
                        <div className="fw-semibold text-truncate" style={{ color: "var(--text-primary)" }}>{currentUser?.username}</div>
                        <span className="badge bg-secondary mt-1" style={{ fontSize: "0.75rem" }}>
                          {currentUser?.role?.replace("ROLE_", "")}
                        </span>
                      </div>

                      <div className="py-1">
                        {currentUser?.role === "ROLE_ADMIN" && (
                          <Link
                            to="/admin"
                            className="dropdown-item px-3 py-2 d-flex align-items-center gap-2"
                            onClick={handleLinkClick}
                            style={{ color: "var(--text-secondary)" }}
                          >
                            <FiSliders size={16} /> Admin Dashboard
                          </Link>
                        )}
                        <Link
                          to="/orders"
                          className="dropdown-item px-3 py-2 d-flex align-items-center gap-2"
                          onClick={handleLinkClick}
                          style={{ color: "var(--text-secondary)" }}
                        >
                          <FiUser size={16} /> {currentUser?.role === "ROLE_ADMIN" ? "Manage Orders" : "My Orders"}
                        </Link>
                        <button
                          onClick={() => {
                            logout();
                            navigate("/");
                            handleLinkClick();
                          }}
                          className="dropdown-item px-3 py-2 text-danger d-flex align-items-center gap-2 border-0 w-100 bg-transparent text-start"
                        >
                          <FiLogOut size={16} /> Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="d-flex align-items-center gap-2 ms-2">
                  <Link to="/login" className="btn btn-outline-primary btn-sm px-3">
                    Login
                  </Link>
                  <Link to="/register" className="btn btn-primary btn-sm px-3 d-none d-sm-inline-flex">
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;