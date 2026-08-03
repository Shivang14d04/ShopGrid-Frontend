import React from "react";
import { Link } from "react-router-dom";

const AccessDenied = () => {
  return (
    <div className="container mt-5 pt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow border-0">
            <div className="card-body text-center p-5">
              <h1 className="display-5 fw-bold mb-3">403</h1>
              <h4 className="mb-3">Access denied</h4>
              <p className="text-muted mb-4">
                You do not have permission to access this page.
              </p>
              <Link to="/" className="btn btn-primary me-2">
                Go Home
              </Link>
              <Link to="/login" className="btn btn-outline-primary">
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;
