<template>
  <div class="landing-container">
    <!-- Hero Section -->
    <section class="hero">
      <nav class="navbar">
        <div class="logo-container">
          <img src="../assets/logo.png" alt="ServiceLink Logo" class="logo" />
        </div>
        <div class="nav-links">
          <a href="#features">Features</a>
          <router-link to="/login" class="login-btn">Login</router-link>
        </div>
      </nav>

      <div class="hero-content">
        <h1>Connect with Trusted Service Providers</h1>
        <p>Find and book reliable services for all your needs in one place</p>
        <div class="cta-buttons">
          <router-link to="/register" class="primary-btn">Get Started</router-link>
          <a href="#how-it-works" class="secondary-btn">Learn More</a>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="features">
      <h2>Why Choose ServiceLink?</h2>
      <div class="features-grid">
        <div class="feature-card">
          <i class="feature-icon">🔍</i>
          <h3>Easy Search</h3>
          <p>Find the perfect service provider with our advanced search system</p>
        </div>
        <div class="feature-card">
          <i class="feature-icon">⭐</i>
          <h3>Verified Providers</h3>
          <p>All our service providers are thoroughly vetted and verified</p>
        </div>
        <div class="feature-card">
          <i class="feature-icon">💬</i>
          <h3>Real-time Chat</h3>
          <p>Communicate directly with service providers instantly</p>
        </div>
        <div class="feature-card">
          <i class="feature-icon">📱</i>
          <h3>Mobile Friendly</h3>
          <p>Access our services anywhere, anytime on any device</p>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section id="how-it-works" class="how-it-works">
      <h2>How It Works</h2>
      <div class="steps">
        <div class="step">
          <div class="step-number">1</div>
          <h3>Create Account</h3>
          <p>Sign up and create your profile in minutes</p>
        </div>
        <div class="step">
          <div class="step-number">2</div>
          <h3>Find Services</h3>
          <p>Browse and search for the services you need</p>
        </div>
        <div class="step">
          <div class="step-number">3</div>
          <h3>Book & Connect</h3>
          <p>Book services and connect with providers</p>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-section">
          <h4>ServiceLink</h4>
          <p>Connecting you with trusted service providers</p>
        </div>
        <div class="footer-section">
          <h4>Quick Links</h4>
          <a href="#features">Features</a>
          <a href="#services">Services</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </div>
        <div class="footer-section">
          <h4>Contact Us</h4>
          <p>Email: info@servicelink.com</p>
          <p>Phone: (123) 456-7890</p>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2024 ServiceLink. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'landingpage'
}
</script>

<style scoped>
.landing-container {
  width: 100%;
  min-height: 100vh;
}

/* Hero Section */
.hero {
  min-height: 100vh;
  background: linear-gradient(135deg, #2bad61 0%, #0fdd7d 100%);
  padding: 2rem;
  position: relative;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
}

.logo-container {
  display: flex;
  align-items: center;
}

.logo {
  height: 120px;
  width: auto;
}

.nav-links {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.nav-links a {
  color: white;
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.3s ease;
}

.nav-links a:hover {
  opacity: 0.8;
}

.login-btn {
  background: white;
  color: #2bad61 !important;
  padding: 0.5rem 1.5rem;
  border-radius: 25px;
  font-weight: 600;
}

.hero-content {
  max-width: 800px;
  margin: 8rem auto;
  text-align: center;
  color: white;
}

.hero-content h1 {
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
  line-height: 1.2;
}

.hero-content p {
  font-size: 1.25rem;
  margin-bottom: 2.5rem;
  opacity: 0.9;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.primary-btn, .secondary-btn {
  padding: 1rem 2rem;
  border-radius: 25px;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.3s ease;
}

.primary-btn {
  background: white;
  color: #2bad61;
}

.secondary-btn {
  background: transparent;
  color: white;
  border: 2px solid white;
}

.primary-btn:hover, .secondary-btn:hover {
  transform: translateY(-2px);
}

/* Features Section */
.features {
  padding: 5rem 2rem;
  background: white;
}

.features h2 {
  text-align: center;
  color: #2bad61;
  font-size: 2.5rem;
  margin-bottom: 3rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.feature-card {
  padding: 2rem;
  text-align: center;
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(43, 173, 97, 0.1);
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  color: #2bad61;
  margin-bottom: 1rem;
}

/* How It Works Section */
.how-it-works {
  padding: 5rem 2rem;
  background: #f8f9fa;
}

.how-it-works h2 {
  text-align: center;
  color: #2bad61;
  font-size: 2.5rem;
  margin-bottom: 3rem;
}

.steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.step {
  text-align: center;
  padding: 2rem;
}

.step-number {
  width: 50px;
  height: 50px;
  background: #2bad61;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0 auto 1rem;
}

/* Footer */
.footer {
  background: #2bad61;
  color: white;
  padding: 4rem 2rem 1rem;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.footer-section h4 {
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.footer-section a {
  color: white;
  text-decoration: none;
  display: block;
  margin-bottom: 0.5rem;
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.footer-section a:hover {
  opacity: 1;
}

.footer-bottom {
  text-align: center;
  margin-top: 3rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

/* Responsive Design */
@media (max-width: 768px) {
  .nav-links {
    display: none;
  }

  .hero-content h1 {
    font-size: 2.5rem;
  }

  .hero-content p {
    font-size: 1.1rem;
  }

  .cta-buttons {
    flex-direction: column;
  }

  .features-grid, .steps {
    grid-template-columns: 1fr;
  }
}
</style> 