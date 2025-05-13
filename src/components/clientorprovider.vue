<template>
    <div class="choice-container">
      <nav class="nav-bar">
        <div class="nav-buttons">
          <router-link to="/" class="nav-btn"> Back to Home </router-link>
          <router-link to="/login" class="nav-btn login"> Sign In </router-link>
        </div>
      </nav>
  
      <div class="content">
        <div class="logo-container">
            <img src="../assets/logo.png" alt="ServiceLink Logo" class="logo" />
        </div>
        <h2>Choose Your Account Type</h2>
        <p class="subtitle">Select how you want to use ServiceLink</p>
        
        <div class="choices">
          <router-link to="/register/client" class="choice-card client">
            <div class="icon-circle client">
              <span>👤</span>
            </div>
            <span class="title">Client Account</span>
            <p>Find and book reliable services for all your needs</p>
            <div class="card-footer">
              <span class="select-btn">Get Started →</span>
            </div>
          </router-link>
          <router-link to="/register/provider" class="choice-card provider">
            <div class="icon-circle provider">
              <span>⚡</span>
            </div>
            <span class="title">Service Provider</span>
            <p>Offer your services and grow your business with us</p>
            <div class="card-footer">
              <span class="select-btn">Get Started →</span>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ClientOrProvider'
  }
  </script>
  
  <style scoped>
  .choice-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #2bad61 0%, #0fdd7d 100%);
  }
  
  .nav-bar {
    padding: 1.5rem 2rem;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
  }
  
  .nav-buttons {
    display: flex;
    gap: 1rem;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .nav-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    border-radius: 25px;
    text-decoration: none;
    color: white;
    font-weight: 600;
    transition: all 0.3s ease;
    background: rgba(255, 255, 255, 0.1);
    border: 2px solid rgba(255, 255, 255, 0.2);
  }
  
  .nav-btn:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }
  
  .nav-btn.login {
    background: white;
    color: #2bad61;
    border: none;
  }
  
  .nav-btn.login:hover {
    background: #f8f9fa;
  }
  
  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: calc(100vh - 80px);
    padding: 2rem;
  }
  
  .logo-container {
    margin-bottom: 2rem;
  }
  
  .logo {
    height: 180px;
    width: auto;
  }
  
  h2 {
    margin-bottom: 0.5rem;
    color: white;
    font-size: 2.2rem;
    font-weight: 800;
    letter-spacing: 1px;
    text-align: center;
  }
  
  .subtitle {
    color: rgba(255, 255, 255, 0.9);
    font-size: 1.1rem;
    margin-bottom: 3rem;
  }
  
  .choices {
    display: flex;
    gap: 3rem;
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .choice-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 20px;
    padding: 2.5rem;
    width: 300px;
    height: 380px;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
    text-decoration: none;
    color: #1a237e;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
  }
  
  .icon-circle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    font-size: 2.8rem;
    margin-bottom: 1.5rem;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  }
  
  .choice-card.client .icon-circle {
    background: linear-gradient(135deg, #2bad61 0%, #0fdd7d 100%);
    color: white;
  }
  
  .choice-card.provider .icon-circle {
    background: linear-gradient(135deg, #1a237e 0%, #0d47a1 100%);
    color: white;
  }
  
  .title {
    font-size: 1.4rem;
    font-weight: 700;
    margin-bottom: 1rem;
    letter-spacing: 0.5px;
    color: #2bad61;
  }
  
  .choice-card.provider .title {
    color: #1a237e;
  }
  
  .choice-card p {
    font-size: 1.05rem;
    font-weight: 400;
    text-align: center;
    color: #455a64;
    margin: 0;
    flex-grow: 1;
  }
  
  .card-footer {
    width: 100%;
    margin-top: 2rem;
    text-align: center;
  }
  
  .select-btn {
    font-size: 1.1rem;
    font-weight: 600;
    opacity: 0;
    transition: all 0.3s ease;
  }
  
  .choice-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    background: white;
  }
  
  .choice-card:hover .select-btn {
    opacity: 1;
  }
  
  .choice-card.client:hover .select-btn {
    color: #2bad61;
  }
  
  .choice-card.provider:hover .select-btn {
    color: #1a237e;
  }
  
  @media (max-width: 768px) {
    .choices {
      gap: 2rem;
    }
    
    .choice-card {
      width: 280px;
      height: 360px;
      padding: 2rem;
    }
    
    .icon-circle {
      width: 70px;
      height: 70px;
      font-size: 2.5rem;
    }
    
    h2 {
      font-size: 2rem;
    }
    
    .logo {
      height: 60px;
    }
  }
  
  @media (max-width: 600px) {
    .nav-buttons {
      justify-content: center;
    }
    
    .choices {
      flex-direction: column;
      gap: 1.5rem;
    }
    
    .choice-card {
      width: 100%;
      max-width: 320px;
      height: auto;
      min-height: 320px;
    }
    
    .select-btn {
      opacity: 1;
    }
    
    h2 {
      font-size: 1.8rem;
    }
    
    .subtitle {
      font-size: 1rem;
    }
  }
  </style>