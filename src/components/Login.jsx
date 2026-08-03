import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../axios";
import AppContext from "../Context/Context";
import { motion } from "framer-motion";
import { FiEye, FiEyeOff, FiLock, FiUser, FiChrome, FiGithub } from "react-icons/fi";

const Login = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loginMode, setLoginMode] = useState("USER");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { login } = useContext(AppContext);

  React.useEffect(() => {
    const requestedMode = searchParams.get("role");
    if (requestedMode === "admin") {
      setLoginMode("ADMIN");
      setForm({ username: "admin", password: "" });
      return;
    }
    setLoginMode("USER");
  }, [searchParams]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const selectLoginMode = (mode) => {
    setLoginMode(mode);
    setForm((current) => ({
      ...current,
      username: mode === "ADMIN" ? "admin" : current.username === "admin" ? "" : current.username,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await API.post("/auth/login", form);
      login(response.data.token);
      toast.success("Logged in successfully");
      const redirectTo = location.state?.from?.pathname || "/";
      navigate(redirectTo, { replace: true });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid p-0 min-vh-100 d-flex">
      <div className="row g-0 w-100">
        {/* Left Panel: Promo and Branding (Hidden on mobile) */}
        <div 
          className="col-lg-6 d-none d-lg-flex flex-column justify-content-between p-5 text-white position-relative overflow-hidden"
          style={{ 
            background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
            minHeight: "100vh"
          }}
        >
          {/* Subtle background graphics */}
          <div className="position-absolute start-0 top-0 bg-white opacity-10 rounded-circle" style={{ width: "400px", height: "400px", transform: "translate(-100px, -100px)" }}></div>
          <div className="position-absolute end-0 bottom-0 bg-info opacity-10 rounded-circle" style={{ width: "300px", height: "300px", transform: "translate(100px, 100px)" }}></div>

          <div className="position-relative" style={{ zIndex: 2 }}>
            <Link className="d-flex align-items-center gap-2 text-decoration-none text-white fs-4 fw-bold" to="/">
              <span className="bg-white text-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: "36px", height: "36px" }}>E</span>
              <span>ShopGrid</span>
            </Link>
          </div>

          <div className="my-auto position-relative" style={{ zIndex: 2, maxWidth: "480px" }}>
            <h1 className="display-4 fw-bold mb-4" style={{ letterSpacing: "-1.5px" }}>The Next Generation E-commerce Hub.</h1>
            <p className="lead text-white-50" style={{ fontSize: "1.1rem", lineHeight: "1.6" }}>
              Log in to access your dashboard, track current orders, manage inventories, and checkout using our instant secured gateways.
            </p>
          </div>

          <div className="position-relative" style={{ zIndex: 2 }}>
            <small className="text-white-50">© 2026 ShopGrid. All rights reserved.</small>
          </div>
        </div>

        {/* Right Panel: Login Card Panel */}
        <div className="col-lg-6 d-flex align-items-center justify-content-center bg-light p-4 p-sm-5">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-100"
            style={{ maxWidth: "420px" }}
          >
            {/* Mobile Header Logo */}
            <div className="text-center d-lg-none mb-4">
              <Link className="d-inline-flex align-items-center gap-2 text-decoration-none text-dark fs-3 fw-bold" to="/">
                <span className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: "32px", height: "32px" }}>E</span>
                <span>ShopGrid</span>
              </Link>
            </div>

            <div className="card border-0 shadow-lg p-4 p-sm-5 rounded-lg" style={{ backgroundColor: "var(--bg-card)", borderRadius: "var(--radius-lg)" }}>
              <div className="text-center mb-4">
                <h3 className="fw-bold mb-1" style={{ color: "var(--text-primary)" }}>Sign In</h3>
                <p className="text-secondary small">Choose credentials to enter shop</p>
              </div>

              {/* Mode Tabs selector */}
              <div 
                className="d-flex p-1 mb-4 rounded-sm" 
                style={{ backgroundColor: "var(--bg-primary)", borderRadius: "var(--radius-sm)" }}
              >
                <button
                  type="button"
                  className={`btn btn-sm flex-grow-1 border-0 py-2 rounded-sm ${loginMode === "USER" ? "btn-primary" : "btn-secondary"}`}
                  onClick={() => selectLoginMode("USER")}
                >
                  Customer
                </button>
                <button
                  type="button"
                  className={`btn btn-sm flex-grow-1 border-0 py-2 rounded-sm ${loginMode === "ADMIN" ? "btn-primary" : "btn-secondary"}`}
                  onClick={() => selectLoginMode("ADMIN")}
                >
                  Admin Portal
                </button>
              </div>

              {loginMode === "ADMIN" && (
                <div className="alert alert-info py-2 px-3 small mb-4 text-center" style={{ borderRadius: "var(--radius-sm)" }}>
                  Autofilled seeded Administrator credentials.
                </div>
              )}

              {/* Form Input fields */}
              <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                <div className="position-relative">
                  <span className="position-absolute start-0 top-50 translate-middle-y ms-3 text-muted">
                    <FiUser size={16} />
                  </span>
                  <input
                    className="form-control ps-5"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    placeholder="Username"
                    required
                  />
                </div>

                <div className="position-relative">
                  <span className="position-absolute start-0 top-50 translate-middle-y ms-3 text-muted">
                    <FiLock size={16} />
                  </span>
                  <input
                    className="form-control ps-5 pe-5"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Password"
                    required
                  />
                  <button
                    type="button"
                    className="position-absolute end-0 top-50 translate-middle-y me-3 border-0 bg-transparent text-secondary p-0 shadow-none"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>

                <button 
                  className="btn btn-primary w-100 py-2.5 mt-2 d-flex align-items-center justify-content-center gap-2 shadow-none" 
                  disabled={loading} 
                  type="submit"
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status"></span>
                      Signing in...
                    </>
                  ) : "Sign In"}
                </button>
              </form>

              <p className="text-center mt-4 mb-0 small text-secondary">
                New to ShopGrid? <Link to="/register" className="fw-semibold text-primary text-decoration-none">Create an account</Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;
