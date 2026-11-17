
import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  return (
    <div className="home-page">

      {/* Navbar */}
      <nav className="home-navbar">
        <Link to="/" className="home-logo">
          <span className="logo-icon">T</span>
          TaskFlow
        </Link>

        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How it Works</a>
          <Link to="/login" className="nav-login">
            Login
          </Link>
          <Link to="/register" className="nav-signup">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">

        <div className="hero-content">
          <span className="hero-badge">
             Organize your work. Achieve more.
          </span>

          <h1>
            Manage Your Projects.
            <span> Simplify Your Tasks.</span>
          </h1>

          <p>
            Stay organized, track your progress, and manage
            all your projects in one place with TaskFlow.
            Make productivity simple and effective.
          </p>

          <div className="hero-buttons">
            <Link to="/register" className="primary-btn">
              Get Started Free →
            </Link>

            <Link to="/login" className="secondary-btn">
              Login to Account
            </Link>
          </div>

          <div className="hero-note">
            ✓ Easy to use &nbsp; ✓ Track progress &nbsp;
            ✓ Manage projects
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="hero-preview">
          <div className="preview-window">

            <div className="preview-header">
              <div className="preview-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <span>TaskFlow Dashboard</span>
            </div>

            <div className="preview-body">
              <h3>Overview</h3>
              <p className="preview-subtitle">
                Welcome back! Here's your progress.
              </p>

              <div className="preview-stats">
                <div>
                  <small>Total Tasks</small>
                  <h2>24</h2>
                </div>
                <div>
                  <small>In Progress</small>
                  <h2>08</h2>
                </div>
                <div>
                  <small>Completed</small>
                  <h2>16</h2>
                </div>
              </div>

              <h4>Recent Tasks</h4>

              <div className="preview-task">
                <span className="task-check">✓</span>
                <span>Build Login Page</span>
                <span className="task-status completed">
                  Completed
                </span>
              </div>

              <div className="preview-task">
                <span className="task-check pending">○</span>
                <span>Create Dashboard</span>
                <span className="task-status progress">
                  In Progress
                </span>
              </div>

              <div className="preview-task">
                <span className="task-check pending">○</span>
                <span>Setup Database</span>
                <span className="task-status todo">
                  Todo
                </span>
              </div>

              <div className="preview-progress">
                <div className="progress-heading">
                  <span>Overall Progress</span>
                  <strong>75%</strong>
                </div>
                <div className="progress-track">
                  <div className="progress-fill"></div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </section>

      {/* Features */}
      <section className="features-section" id="features">
        <div className="section-heading">
          <span>OUR FEATURES</span>
          <h2>Everything you need to stay productive</h2>
          <p>
            Manage your workflow with simple and powerful tools.
          </p>
        </div>

        <div className="features-grid">

          <div className="feature-card">
            <div className="feature-icon purple"></div>
            <h3>Project Management</h3>
            <p>
              Create, organize, edit and manage all your
              projects from one place.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon blue"></div>
            <h3>Task Management</h3>
            <p>
              Create tasks, set priorities, assign statuses
              and manage deadlines.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon green"></div>
            <h3>Track Progress</h3>
            <p>
              Monitor completed, pending and ongoing tasks
              through dashboard statistics.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon orange"></div>
            <h3>Search & Filter</h3>
            <p>
              Quickly find tasks using search, status
              and priority filters.
            </p>
          </div>

        </div>
      </section>

      {/* How It Works */}
      <section className="how-section" id="how-it-works">
        <div className="section-heading">
          <span>GET STARTED</span>
          <h2>Three simple steps to better productivity</h2>
        </div>

        <div className="steps-grid">
          <div className="step-card">
            <span>01</span>
            <h3>Create an Account</h3>
            <p>Register and get started with your personal workspace.</p>
          </div>

          <div className="step-card">
            <span>02</span>
            <h3>Create Projects</h3>
            <p>Organize your work by creating individual projects.</p>
          </div>

          <div className="step-card">
            <span>03</span>
            <h3>Manage Your Tasks</h3>
            <p>Track progress and complete your work efficiently.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <h2>Ready to organize your work?</h2>
        <p>
          Start managing your projects and tasks more efficiently.
        </p>
        <Link to="/register" className="primary-btn">
          Start Using TaskFlow →
        </Link>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <Link to="/" className="home-logo">
          <span className="logo-icon">T</span>
          TaskFlow
        </Link>

        <p>Stay organized. Stay productive. © 2026 TaskFlow.</p>

        <div>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>
      </footer>

    </div>
  );
};

export default Home;
