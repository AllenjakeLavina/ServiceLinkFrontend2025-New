<template>
  <div class="client-home">
    <!-- Navigation Bar -->
    <nav class="navbar">
      <div class="logo-container">
        <img src="../../assets/logo.png" alt="ServiceLink Logo" class="logo" />
      </div>
      <div class="nav-menu">
        <div class="nav-links">
          <router-link to="/client/home">Home</router-link>
          <router-link to="/client/booking">My Bookings</router-link>
          <router-link to="/client/services">Services</router-link>
          <router-link to="/client/messages">Messages</router-link>
        </div>
        <div class="user-actions">
          <div class="notifications">
            <i class="notification-icon">🔔</i>
            <span v-if="notifications.length > 0" class="badge">{{ notifications.length }}</span>
          </div>
          <div class="user-profile">
            <img :src="user.profilePicture || '../../assets/avatar-placeholder.png'" alt="User" class="avatar" />
            <span>{{ user.firstName }} {{ user.lastName }}</span>
            <div class="dropdown-menu">
              <a href="#profile">My Profile</a>
              <a href="#settings">Settings</a>
              <a @click="logout" href="#">Logout</a>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Loading content...</p>
    </div>

    <div v-else class="content-container">
      <!-- Welcome Section -->
      <section class="welcome-section">
        <h1>Welcome back, {{ user.firstName }}!</h1>
        <p>Discover services and providers that match your needs.</p>
      </section>

      <!-- Popular Services -->
      <section id="services" class="services-section">
        <div class="section-header">
          <h2>Popular Services</h2>
          <a href="#all-services">Browse all</a>
        </div>
        
        <div v-if="services.length > 0" class="services-grid">
          <div v-for="service in popularServices" :key="service.id" class="service-card">
            <div class="service-image" :style="getServiceImageStyle(service.imageUrls, service.category?.name)"></div>
            <h3>{{ service.title }}</h3>
            <p>{{ truncateText(service.description, 60) }}</p>
            <button @click="bookService(service.id)" class="book-now">Book Now</button>
          </div>
        </div>
        
        <div v-else class="loading-services">
          <div class="loading-spinner small"></div>
          <p>Loading services...</p>
        </div>
      </section>

      <!-- Top Providers Section -->
      <section id="providers" class="providers-section">
        <div class="section-header">
          <h2>Top Service Providers</h2>
          <a href="#all-providers">View all</a>
        </div>
        
        <div v-if="providers.length > 0" class="providers-grid">
          <div v-for="provider in topProviders" :key="provider.id" class="provider-card">
            <div class="provider-avatar">
              <img :src="provider.user?.profilePicture || '../../assets/avatar-placeholder.png'" alt="Provider" />
            </div>
            <div class="provider-info">
              <h3>{{ provider.user?.firstName }} {{ provider.user?.lastName }}</h3>
              <p class="provider-headline">{{ provider.headline || 'Service Provider' }}</p>
              <div class="provider-rating">
                <span class="stars">{{ getStars(provider.rating || 0) }}</span>
                <span class="rating-value">{{ provider.rating || '0.0' }}</span>
              </div>
              <div class="provider-categories">
                <span v-for="(service, index) in provider.services.slice(0, 3)" :key="service.id" class="category-tag">
                  {{ service.category?.name || 'Service' }}
                </span>
                <span v-if="provider.services.length > 3" class="more-tag">+{{ provider.services.length - 3 }} more</span>
              </div>
            </div>
            <button @click="viewProvider(provider.id)" class="view-provider">View Profile</button>
          </div>
        </div>
        
        <div v-else class="loading-providers">
          <div class="loading-spinner small"></div>
          <p>Loading providers...</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ClientHomePage',
  data() {
    return {
      loading: true,
      user: {
        id: '',
        firstName: '',
        lastName: '',
        email: '',
        profilePicture: null
      },
      notifications: [],
      services: [],
      providers: [],
      apiBaseUrl: 'http://localhost:5500/api',
      categoryEmojis: {
        'Cleaning': '🧹',
        'Plumbing': '🔧',
        'Electrical': '⚡',
        'Landscaping': '🌿',
        'Tutoring': '📚',
        'Transportation': '🚗',
        'Delivery': '📦',
        'Childcare': '👶',
        'Pet Care': '🐾',
        'Photography': '📸',
        'Beauty': '💇',
        'Fitness': '💪',
        'Tech Support': '💻',
        'Event Planning': '🎉',
        'Cooking': '🍳'
      }
    };
  },
  computed: {
    popularServices() {
      // Return first 8 services
      return (this.services || []).slice(0, 8);
    },
    topProviders() {
      // Sort providers by rating and return top 6
      return (this.providers || [])
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 6);
    }
  },
  created() {
    // Initialize arrays to avoid errors from computed properties during loading
    this.services = [];
    this.providers = [];
    this.notifications = [];
    
    // Try to get user data from localStorage first
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const userData = JSON.parse(userString);
        // Check if user data contains nested user object
        if (userData.user) {
          this.user.firstName = userData.user.firstName || '';
          this.user.lastName = userData.user.lastName || '';
          this.user.email = userData.user.email || '';
          this.user.profilePicture = userData.user.profilePicture || null;
        } else {
          this.user.firstName = userData.firstName || '';
          this.user.lastName = userData.lastName || '';
          this.user.email = userData.email || '';
          this.user.profilePicture = userData.profilePicture || null;
        }
      } catch (e) {
        console.error('Error parsing user from localStorage:', e);
      }
    }
    
    // Now fetch data
    this.fetchUserData();
    this.fetchServices();
    this.fetchProviders();
    this.fetchNotifications();
  },
  methods: {
    async fetchUserData() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          this.$router.push('/login');
          return;
        }

        const response = await fetch(`${this.apiBaseUrl}/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('token');
            this.$router.push('/login');
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        this.user = await response.json();
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        this.loading = false;
      }
    },

    async fetchServices() {
      try {
        // This is a public endpoint to fetch available services
        const response = await fetch(`${this.apiBaseUrl}/services`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        this.services = Array.isArray(data) ? data : [];
      } catch (error) {
        console.error('Error fetching services:', error);
        this.services = []; // Ensure it's always an array
      }
    },

    async fetchProviders() {
      try {
        // Fetch top rated providers
        const response = await fetch(`${this.apiBaseUrl}/providers/search?sort=rating&limit=10`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        this.providers = Array.isArray(data) ? data : [];
      } catch (error) {
        console.error('Error fetching providers:', error);
        this.providers = []; // Ensure it's always an array
      }
    },

    async fetchNotifications() {
      try {
        // This would need a notifications endpoint
        // This is a placeholder assuming there's a notifications endpoint
        const token = localStorage.getItem('token');
        if (!token) return;

        // If there's a notifications endpoint, uncomment this
        /*
        const response = await fetch(`${this.apiBaseUrl}/notifications`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        this.notifications = Array.isArray(data) ? data : [];
        */

        // Placeholder data
        this.notifications = [];
      } catch (error) {
        console.error('Error fetching notifications:', error);
        this.notifications = []; // Ensure it's always an array
      }
    },

    bookService(serviceId) {
      // Navigate to service booking page
      this.$router.push(`/services/${serviceId}/book`);
    },
    
    viewProvider(providerId) {
      // Navigate to provider profile page
      this.$router.push(`/providers/${providerId}`);
    },

    getServiceImageStyle(imageUrls, categoryName) {
      let imageUrl = '../../assets/services/default.jpg';
      
      if (imageUrls) {
        try {
          const parsedUrls = JSON.parse(imageUrls);
          if (parsedUrls && parsedUrls.length > 0) {
            imageUrl = parsedUrls[0];
          }
        } catch (error) {
          console.error('Error parsing image URLs:', error);
        }
      }
      
      // Fallback to category-based images for demo
      if (categoryName) {
        const categoryLower = categoryName.toLowerCase();
        if (categoryLower === 'plumbing') {
          imageUrl = '../../assets/services/plumbing.jpg';
        } else if (categoryLower === 'cleaning') {
          imageUrl = '../../assets/services/cleaning.jpg';
        } else if (categoryLower === 'electrical') {
          imageUrl = '../../assets/services/electrical.jpg';
        } else if (categoryLower === 'landscaping') {
          imageUrl = '../../assets/services/landscaping.jpg';
        }
      }
      
      return {
        backgroundImage: `url(${imageUrl})`
      };
    },
    
    getStars(rating) {
      // Convert rating to stars (e.g., "★★★★☆" for 4.0)
      const fullStars = Math.floor(rating);
      const hasHalfStar = rating - fullStars >= 0.5;
      
      let stars = '★'.repeat(fullStars);
      if (hasHalfStar) stars += '½';
      stars += '☆'.repeat(5 - fullStars - (hasHalfStar ? 1 : 0));
      
      return stars;
    },

    truncateText(text, maxLength) {
      if (!text) return '';
      return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    },

    logout() {
      localStorage.removeItem('token');
      this.$router.push('/login');
    }
  }
}
</script>

<style scoped>
.client-home {
  width: 100%;
  min-height: 100vh;
  background-color: #f5f7fa;
}

/* Navbar styles */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 2rem;
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;
}

.logo {
  height: 60px;
  width: auto;
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
}

.nav-links a {
  text-decoration: none;
  color: #4a5568;
  font-weight: 500;
  padding: 0.5rem 0;
  position: relative;
}

.nav-links a.active,
.nav-links a:hover {
  color: #2bad61;
}

.nav-links a.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #2bad61;
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.notifications {
  position: relative;
  cursor: pointer;
}

.notification-icon {
  font-size: 1.25rem;
}

.badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: #e53e3e;
  color: white;
  font-size: 0.75rem;
  font-weight: bold;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  cursor: pointer;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 0.5rem 0;
  min-width: 150px;
  display: none;
}

.user-profile:hover .dropdown-menu {
  display: block;
}

.dropdown-menu a {
  display: block;
  padding: 0.5rem 1rem;
  text-decoration: none;
  color: #4a5568;
  transition: background-color 0.2s ease;
}

.dropdown-menu a:hover {
  background-color: #f5f7fa;
  color: #2bad61;
}

/* Loading state */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 70vh;
  gap: 1.5rem;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #2bad61;
  border-radius: 50%;
  animation: spin 1.5s linear infinite;
}

.loading-spinner.small {
  width: 30px;
  height: 30px;
  border-width: 3px;
}

.loading-services, 
.loading-providers {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
  gap: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Content container */
.content-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.welcome-section {
  margin-bottom: 2rem;
}

.welcome-section h1 {
  font-size: 2rem;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.welcome-section p {
  color: #718096;
}

/* Section headers */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h2 {
  font-size: 1.5rem;
  color: #2d3748;
}

.section-header a {
  color: #2bad61;
  text-decoration: none;
  font-weight: 600;
}

/* Services section */
.services-section {
  margin-bottom: 3rem;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

.service-card {
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
}

.service-card:hover {
  transform: translateY(-5px);
}

.service-image {
  height: 160px;
  background-size: cover;
  background-position: center;
}

.service-card h3 {
  padding: 1rem 1rem 0.5rem;
  color: #2d3748;
}

.service-card p {
  padding: 0 1rem 1.5rem;
  font-size: 0.875rem;
  color: #718096;
  min-height: 50px;
}

.book-now {
  display: block;
  width: calc(100% - 2rem);
  margin: 0 1rem 1rem;
  background-color: #2bad61;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 0;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.book-now:hover {
  background-color: #239d58;
}

/* Providers section */
.providers-section {
  margin-bottom: 3rem;
}

.providers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.provider-card {
  display: flex;
  background-color: white;
  border-radius: 10px;
  padding: 1.25rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
}

.provider-card:hover {
  transform: translateY(-3px);
}

.provider-avatar {
  margin-right: 1.25rem;
}

.provider-avatar img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
}

.provider-info {
  flex: 1;
}

.provider-info h3 {
  font-size: 1.15rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 0.25rem;
}

.provider-headline {
  color: #718096;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.provider-rating {
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
}

.stars {
  color: #f6ad55;
  font-size: 0.875rem;
  margin-right: 0.5rem;
}

.rating-value {
  font-weight: 600;
  color: #4a5568;
  font-size: 0.875rem;
}

.provider-categories {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.category-tag {
  background-color: #e9f5f0;
  color: #2bad61;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-weight: 500;
}

.more-tag {
  background-color: #edf2f7;
  color: #718096;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-weight: 500;
}

.view-provider {
  background: none;
  border: 1px solid #2bad61;
  color: #2bad61;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-weight: 600;
  cursor: pointer;
  align-self: center;
  transition: all 0.3s ease;
  margin-left: auto;
}

.view-provider:hover {
  background-color: #2bad61;
  color: white;
}

@media (max-width: 768px) {
  .nav-menu {
    flex-direction: column;
    gap: 1rem;
  }

  .providers-grid {
    grid-template-columns: 1fr;
  }
  
  .provider-card {
    flex-direction: column;
  }
  
  .provider-avatar {
    margin: 0 auto 1rem;
    text-align: center;
  }
  
  .provider-info {
    text-align: center;
  }
  
  .provider-categories {
    justify-content: center;
  }
  
  .view-provider {
    margin: 1rem auto 0;
    display: block;
  }
}
</style>
