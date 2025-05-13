<template>
  <div class="services-container">
    <!-- Navigation Bar -->
    <nav class="navbar">
      <div class="logo-container">
        <img src="../../assets/logo.png" alt="ServiceLink Logo" class="logo" />
      </div>
      <div class="nav-menu">
        <div class="nav-links">
          <router-link to="/client/home">Home</router-link>
          <router-link to="/client/booking">My Bookings</router-link>
          <router-link to="/client/services" class="active">Services</router-link>
          <router-link to="/messages">Messages</router-link>
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
      <p>Loading services...</p>
    </div>

    <div v-else class="content-container">
      <!-- Search and Filter Bar -->
      <div class="search-filter-container">
        <div class="search-container">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Search services..." 
            class="search-input"
            @input="filterServices"
          />
          <i class="search-icon">🔍</i>
        </div>

        <div class="category-filter">
          <button 
            v-for="category in categories" 
            :key="category.id" 
            :class="['category-btn', { active: selectedCategory === category.id }]"
            @click="selectCategory(category.id)"
          >
            {{ category.name }}
          </button>
          <button 
            :class="['category-btn', { active: selectedCategory === null }]"
            @click="selectCategory(null)"
          >
            All Services
          </button>
        </div>
      </div>

      <!-- Services Grid -->
      <div v-if="filteredServices.length > 0" class="services-section">
        <h2 class="section-title">{{ getSectionTitle() }}</h2>
        <div class="services-grid">
          <div v-for="service in filteredServices" :key="service.id" class="service-card">
            <div class="service-image" :style="getServiceImageStyle(service.imageUrls, service.category?.name)"></div>
            <div class="service-content">
              <div class="service-category">{{ service.category?.name || 'General' }}</div>
              <h3 class="service-title">{{ service.title }}</h3>
              <div class="service-provider">
                by {{ service.serviceProvider?.user?.firstName }} {{ service.serviceProvider?.user?.lastName }}
              </div>
              <div class="service-rating">
                <span class="stars">{{ getStars(service.serviceProvider?.rating || 0) }}</span>
                <span class="rating-value">{{ service.serviceProvider?.rating?.toFixed(1) || '0.0' }}</span>
              </div>
              <p class="service-description">{{ truncateText(service.description, 100) }}</p>
              <div class="service-price">
                <span class="price-amount">₱{{ parseFloat(service.pricing).toFixed(2) }}</span>
                <span class="price-type">/ {{ formatPricingType(service.pricingType) }}</span>
              </div>
              <button @click="viewServiceDetails(service.id)" class="view-btn">View Details</button>
              <button @click="bookService(service.id)" class="book-btn">Book Now</button>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="empty-state">
        <div class="empty-icon">🔍</div>
        <h3>No services found</h3>
        <p>We couldn't find any services matching your criteria. Try changing your search or filter.</p>
        <button @click="resetFilters" class="reset-btn">Reset Filters</button>
      </div>

      <!-- Categories Showcase -->
      <div v-if="!searchQuery && selectedCategory === null && categoriesWithServices.length > 0" class="categories-showcase">
        <div v-for="category in categoriesWithServices" :key="category.id" class="category-section">
          <div class="category-header">
            <h2 class="category-title">{{ category.name }}</h2>
            <button @click="selectCategory(category.id)" class="view-all-btn">View All</button>
          </div>
          <div class="category-services">
            <div v-for="service in getCategoryServices(category.id, 4)" :key="service.id" class="service-card">
              <div class="service-image" :style="getServiceImageStyle(service.imageUrls, category.name)"></div>
              <div class="service-content">
                <h3 class="service-title">{{ service.title }}</h3>
                <div class="service-provider">
                  by {{ service.serviceProvider?.user?.firstName }} {{ service.serviceProvider?.user?.lastName }}
                </div>
                <div class="service-price">
                  <span class="price-amount">₱{{ parseFloat(service.pricing).toFixed(2) }}</span>
                  <span class="price-type">/ {{ formatPricingType(service.pricingType) }}</span>
                </div>
                <button @click="bookService(service.id)" class="book-btn">Book Now</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Service Details Modal -->
    <div v-if="showServiceModal" class="modal-overlay" @click="closeServiceModal">
      <div class="service-modal" @click.stop>
        <button class="close-btn" @click="closeServiceModal">×</button>
        <div v-if="selectedService" class="service-detail-content">
          <div class="service-detail-image" :style="getServiceImageStyle(selectedService.imageUrls, selectedService.category?.name)"></div>
          <div class="service-detail-info">
            <div class="service-category-tag">{{ selectedService.category?.name }}</div>
            <h2>{{ selectedService.title }}</h2>
            <div class="provider-info">
              <img :src="selectedService.serviceProvider?.user?.profilePicture || '../../assets/avatar-placeholder.png'" alt="Provider" class="provider-avatar" />
              <div>
                <div class="provider-name">{{ selectedService.serviceProvider?.user?.firstName }} {{ selectedService.serviceProvider?.user?.lastName }}</div>
                <div class="provider-rating">
                  <span class="stars">{{ getStars(selectedService.serviceProvider?.rating || 0) }}</span>
                  <span class="rating-value">{{ selectedService.serviceProvider?.rating?.toFixed(1) || '0.0' }}</span>
                </div>
              </div>
            </div>
            <div class="detail-price">
              <span class="price-amount">₱{{ parseFloat(selectedService.pricing).toFixed(2) }}</span>
              <span class="price-type">/ {{ formatPricingType(selectedService.pricingType) }}</span>
            </div>
            <div class="service-description-full">
              <h3>Description</h3>
              <p>{{ selectedService.description }}</p>
            </div>
            <div v-if="selectedService.skills && selectedService.skills.length > 0" class="service-skills">
              <h3>Skills</h3>
              <div class="skills-list">
                <span v-for="skill in selectedService.skills" :key="skill.id" class="skill-tag">{{ skill.name }}</span>
              </div>
            </div>
            <div class="booking-actions">
              <button @click="viewProviderProfile(selectedService.serviceProviderId)" class="view-provider-btn">
                View Provider Profile
              </button>
              <button @click="bookSelectedService()" class="book-service-btn">
                Book This Service
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ClientServices',
  data() {
    return {
      loading: true,
      services: [],
      categories: [],
      filteredServices: [],
      categoriesWithServices: [],
      user: {
        id: '',
        firstName: '',
        lastName: '',
        email: '',
        profilePicture: null
      },
      notifications: [],
      searchQuery: '',
      selectedCategory: null,
      showServiceModal: false,
      selectedService: null,
      apiBaseUrl: 'http://localhost:5500/api'
    };
  },
  created() {
    // Initialize arrays
    this.services = [];
    this.categories = [];
    this.filteredServices = [];
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
    
    // Fetch data
    this.fetchUserData();
    this.fetchServices();
    this.fetchCategories();
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
      }
    },

    async fetchServices() {
      try {
        const response = await fetch(`${this.apiBaseUrl}/services`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        this.services = Array.isArray(data) ? data : [];
        this.filterServices();
      } catch (error) {
        console.error('Error fetching services:', error);
        this.services = [];
      } finally {
        this.loading = false;
      }
    },

    async fetchCategories() {
      try {
        // Check if there's a categories endpoint
        const response = await fetch(`${this.apiBaseUrl}/services/categories`);
        
        if (!response.ok) {
          // If endpoint doesn't exist, extract categories from services
          this.extractCategoriesFromServices();
          return;
        }
        
        const data = await response.json();
        this.categories = Array.isArray(data) ? data : [];
        this.updateCategoriesWithServices();
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Fallback to extracting categories from services
        this.extractCategoriesFromServices();
      }
    },

    extractCategoriesFromServices() {
      // Extract unique categories from services
      const uniqueCategories = new Map();
      this.services.forEach(service => {
        if (service.category && !uniqueCategories.has(service.category.id)) {
          uniqueCategories.set(service.category.id, service.category);
        }
      });
      this.categories = Array.from(uniqueCategories.values());
      this.updateCategoriesWithServices();
    },

    updateCategoriesWithServices() {
      // Update categories that have services
      this.categoriesWithServices = this.categories.filter(category => 
        this.services.some(service => service.categoryId === category.id)
      );
    },

    async fetchNotifications() {
      try {
        // This would need a notifications endpoint
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

    filterServices() {
      let filtered = [...this.services];
      
      // Apply search filter if search query exists
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(service => 
          (service.title || '').toLowerCase().includes(query) ||
          (service.description || '').toLowerCase().includes(query) ||
          (service.category?.name || '').toLowerCase().includes(query) ||
          (service.serviceProvider?.user?.firstName || '').toLowerCase().includes(query) ||
          (service.serviceProvider?.user?.lastName || '').toLowerCase().includes(query)
        );
      }
      
      // Apply category filter
      if (this.selectedCategory !== null) {
        filtered = filtered.filter(service => service.categoryId === this.selectedCategory);
      }
      
      // Sort by rating, highest first
      filtered.sort((a, b) => (b.serviceProvider?.rating || 0) - (a.serviceProvider?.rating || 0));
      
      this.filteredServices = filtered;
    },

    selectCategory(categoryId) {
      this.selectedCategory = categoryId;
      this.filterServices();
    },

    getCategoryServices(categoryId, limit = 4) {
      return this.services
        .filter(service => service.categoryId === categoryId)
        .sort((a, b) => (b.serviceProvider?.rating || 0) - (a.serviceProvider?.rating || 0))
        .slice(0, limit);
    },

    getSectionTitle() {
      if (this.searchQuery) {
        return `Search Results for "${this.searchQuery}"`;
      } else if (this.selectedCategory !== null) {
        const category = this.categories.find(c => c.id === this.selectedCategory);
        return category ? category.name : 'Services';
      } else {
        return 'All Services';
      }
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

    formatPricingType(pricingType) {
      if (!pricingType) return 'service';
      
      switch (pricingType) {
        case 'HOURLY': return 'hour';
        case 'FIXED': return 'service';
        case 'DAILY': return 'day';
        case 'SESSION': return 'session';
        default: return pricingType.toLowerCase();
      }
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
        if (categoryLower.includes('plumbing')) {
          imageUrl = '../../assets/services/plumbing.jpg';
        } else if (categoryLower.includes('clean')) {
          imageUrl = '../../assets/services/cleaning.jpg';
        } else if (categoryLower.includes('electric')) {
          imageUrl = '../../assets/services/electrical.jpg';
        } else if (categoryLower.includes('landscape') || categoryLower.includes('garden')) {
          imageUrl = '../../assets/services/landscaping.jpg';
        }
      }
      
      return {
        backgroundImage: `url(${imageUrl})`
      };
    },

    truncateText(text, maxLength) {
      if (!text) return '';
      return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    },

    async viewServiceDetails(serviceId) {
      try {
        const service = this.services.find(s => s.id === serviceId);
        if (service) {
          this.selectedService = service;
        } else {
          // If service details aren't in the list, fetch from API
          const response = await fetch(`${this.apiBaseUrl}/services/${serviceId}`);
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          this.selectedService = await response.json();
        }
        this.showServiceModal = true;
      } catch (error) {
        console.error('Error fetching service details:', error);
      }
    },

    closeServiceModal() {
      this.showServiceModal = false;
      this.selectedService = null;
    },

    bookService(serviceId) {
      // Navigate to booking page or show booking modal
      this.$router.push(`/services/${serviceId}/book`);
    },

    bookSelectedService() {
      if (this.selectedService) {
        this.bookService(this.selectedService.id);
      }
    },

    viewProviderProfile(providerId) {
      // Navigate to provider profile
      this.$router.push(`/providers/${providerId}`);
    },

    resetFilters() {
      this.searchQuery = '';
      this.selectedCategory = null;
      this.filterServices();
    },

    logout() {
      localStorage.removeItem('token');
      this.$router.push('/login');
    }
  }
}
</script>

<style scoped>
.services-container {
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

/* Search and Filter Bar */
.search-filter-container {
  margin-bottom: 2rem;
}

.search-container {
  position: relative;
  max-width: 500px;
  margin-bottom: 1.5rem;
}

.search-input {
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  width: 100%;
  background-color: white;
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: #2bad61;
  box-shadow: 0 0 0 1px #2bad61;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #718096;
  font-size: 1rem;
}

.category-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.category-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  background-color: white;
  color: #4a5568;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.category-btn:hover {
  background-color: #f7fafc;
  border-color: #cbd5e0;
}

.category-btn.active {
  background-color: #2bad61;
  border-color: #2bad61;
  color: white;
}

/* Services Grid */
.section-title {
  font-size: 1.75rem;
  color: #2d3748;
  margin-bottom: 1.5rem;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.service-card {
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.service-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.08);
}

.service-image {
  height: 180px;
  background-size: cover;
  background-position: center;
}

.service-content {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.service-category {
  font-size: 0.75rem;
  color: #2bad61;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
}

.service-title {
  font-size: 1.25rem;
  color: #2d3748;
  margin: 0 0 0.5rem;
  line-height: 1.3;
}

.service-provider {
  font-size: 0.875rem;
  color: #718096;
  margin-bottom: 0.5rem;
}

.service-rating {
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

.service-description {
  font-size: 0.875rem;
  color: #4a5568;
  line-height: 1.5;
  margin-bottom: 1.25rem;
  flex-grow: 1;
}

.service-price {
  display: flex;
  align-items: baseline;
  margin-bottom: 1.25rem;
}

.price-amount {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2d3748;
}

.price-type {
  font-size: 0.875rem;
  color: #718096;
  margin-left: 0.25rem;
}

.view-btn, .book-btn {
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
  width: 100%;
  border: none;
}

.view-btn {
  background-color: #edf2f7;
  color: #4a5568;
  margin-bottom: 0.75rem;
}

.view-btn:hover {
  background-color: #e2e8f0;
}

.book-btn {
  background-color: #2bad61;
  color: white;
}

.book-btn:hover {
  background-color: #239d58;
}

/* Empty state */
.empty-state {
  background-color: white;
  border-radius: 10px;
  padding: 3rem 2rem;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #a0aec0;
}

.empty-state h3 {
  font-size: 1.2rem;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #718096;
  max-width: 400px;
  margin: 0 auto 1.5rem;
}

.reset-btn {
  display: inline-block;
  background-color: #2bad61;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.reset-btn:hover {
  background-color: #239d58;
}

/* Categories Showcase */
.category-section {
  margin-bottom: 3rem;
}

.category-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
}

.category-title {
  font-size: 1.5rem;
  color: #2d3748;
  margin: 0;
}

.view-all-btn {
  background: none;
  border: none;
  color: #2bad61;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
}

.view-all-btn:hover {
  text-decoration: underline;
}

.category-services {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.25rem;
}

/* Service Details Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.service-modal {
  background-color: white;
  border-radius: 12px;
  width: 90%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.close-btn {
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  width: 30px;
  height: 30px;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;
  z-index: 10;
}

.service-detail-content {
  display: flex;
  flex-direction: column;
}

.service-detail-image {
  height: 280px;
  background-size: cover;
  background-position: center;
}

.service-detail-info {
  padding: 1.5rem;
}

.service-category-tag {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background-color: #e9f5f0;
  color: #2bad61;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 12px;
  margin-bottom: 0.75rem;
}

.provider-info {
  display: flex;
  align-items: center;
  margin: 1.25rem 0;
}

.provider-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 1rem;
}

.provider-name {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.detail-price {
  margin: 1.25rem 0;
  font-size: 1.5rem;
  font-weight: 700;
}

.service-description-full {
  margin-bottom: 1.5rem;
}

.service-description-full h3 {
  font-size: 1.1rem;
  margin-bottom: 0.75rem;
  color: #2d3748;
}

.service-description-full p {
  font-size: 0.95rem;
  line-height: 1.6;
  color: #4a5568;
}

.service-skills h3 {
  font-size: 1.1rem;
  margin-bottom: 0.75rem;
  color: #2d3748;
}

.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.skill-tag {
  padding: 0.35rem 0.75rem;
  background-color: #edf2f7;
  color: #4a5568;
  font-size: 0.8rem;
  border-radius: 12px;
}

.booking-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.view-provider-btn, .book-service-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 1;
  border: none;
}

.view-provider-btn {
  background-color: #edf2f7;
  color: #4a5568;
}

.view-provider-btn:hover {
  background-color: #e2e8f0;
}

.book-service-btn {
  background-color: #2bad61;
  color: white;
}

.book-service-btn:hover {
  background-color: #239d58;
}

@media (min-width: 768px) {
  .service-detail-content {
    flex-direction: row;
    align-items: stretch;
  }
  
  .service-detail-image {
    width: 40%;
    height: auto;
  }
  
  .service-detail-info {
    width: 60%;
  }
}

@media (max-width: 768px) {
  .nav-menu {
    flex-direction: column;
    gap: 1rem;
  }
  
  .search-input {
    max-width: 100%;
  }
  
  .category-filter {
    justify-content: center;
  }
  
  .services-grid,
  .category-services {
    grid-template-columns: 1fr;
  }
  
  .booking-actions {
    flex-direction: column;
  }
}
</style>

