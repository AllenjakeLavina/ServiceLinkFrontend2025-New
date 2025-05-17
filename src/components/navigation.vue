<template>
  <nav v-if="shouldShowNavbar" class="navbar">
    <div class="container">
      <!-- Logo - aligned left -->
      <div class="left-section">
        <router-link :to="homeRoute" class="logo-container">
          <img src="../assets/logo.png" alt="ServiceLink Logo" class="logo" />
        </router-link>
      </div>

      <!-- Right-aligned navigation and user actions -->
      <div class="right-section">
        <!-- Desktop Navigation Links -->
        <div class="nav-links desktop-only">
          <!-- Client Navigation -->
          <template v-if="userRole === 'client'">
            <router-link to="/client/home">
              <i class="nav-icon">🏠</i>
              <span>Home</span>
            </router-link>
            <router-link to="/client/booking">
              <i class="nav-icon">📅</i>
              <span>My Bookings</span>
            </router-link>
            <router-link to="/client/services">
              <i class="nav-icon">🛠️</i>
              <span>Services</span>
            </router-link>
            <router-link to="/client/messages">
              <i class="nav-icon">💬</i>
              <span>Messages</span>
            </router-link>
          </template>

          <!-- Provider Navigation -->
          <template v-else-if="userRole === 'provider'">
            <router-link to="/provider/home">
              <i class="nav-icon">📊</i>
              <span>Dashboard</span>
            </router-link>
            <router-link to="/provider/services">
              <i class="nav-icon">🛠️</i>
              <span>My Services</span>
            </router-link>
          </template>
          
          <!-- Admin Navigation -->
          <template v-else-if="userRole === 'admin'">
            <router-link to="/admin/dashboard">
              <i class="nav-icon">📊</i>
              <span>Dashboard</span>
            </router-link>
          </template>
        </div>

        <!-- User Actions - Desktop -->
        <div class="user-actions desktop-only">
          <!-- Notifications -->
          <div class="notifications-dropdown">
            <button class="notifications-btn" @click="toggleDropdown('notifications')">
              <i class="notification-icon">🔔</i>
              <span v-if="notifications.length > 0" class="badge">{{ notifications.length }}</span>
            </button>
            <div class="dropdown-content" v-show="activeDropdown === 'notifications'">
              <div v-if="notifications.length === 0" class="empty-state">
                No new notifications
              </div>
              <div v-else class="notification-list">
                <div v-for="notification in notifications" :key="notification.id" class="notification-item">
                  <div class="notification-icon" :class="notification.type">
                    <i v-if="notification.type === 'booking'">📅</i>
                    <i v-else-if="notification.type === 'message'">💬</i>
                    <i v-else>📢</i>
                  </div>
                  <div class="notification-content">
                    <div class="notification-text">{{ notification.message }}</div>
                    <div class="notification-time">{{ formatNotificationTime(notification.createdAt) }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- User Profile Dropdown -->
          <div class="profile-dropdown">
            <button class="profile-btn" @click="toggleDropdown('profile')">
              <img :src="user.profilePicture || '../assets/avatar-placeholder.png'" alt="User" class="avatar" />
              <span class="user-name">{{ user.firstName || 'User' }}</span>
              <span class="dropdown-arrow">▼</span>
            </button>
            <div class="dropdown-content" v-show="activeDropdown === 'profile'">
              <router-link :to="profileRoute" @click="activeDropdown = null">
                <i class="dropdown-icon">👤</i> My Profile
              </router-link>
              <router-link to="/settings" @click="activeDropdown = null">
                <i class="dropdown-icon">⚙️</i> Settings
              </router-link>
              <a @click="logout" href="#" class="logout-btn">
                <i class="dropdown-icon">🚪</i> Logout
              </a>
            </div>
          </div>
        </div>
        
        <!-- Mobile Profile Button (visible only on mobile) -->
        <div class="mobile-profile-button" @click.stop="toggleProfileMenu">
          <img :src="user.profilePicture || '../assets/avatar-placeholder.png'" alt="User" class="avatar" />
        </div>
      </div>

      <!-- Mobile Bottom Navigation -->
      <div class="mobile-nav">
        <!-- Client Navigation -->
        <template v-if="userRole === 'client'">
          <router-link to="/client/home" class="mobile-nav-item">
            <i class="nav-icon">🏠</i>
            <span>Home</span>
          </router-link>
          <router-link to="/client/booking" class="mobile-nav-item">
            <i class="nav-icon">📅</i>
            <span>Bookings</span>
          </router-link>
          <router-link to="/client/services" class="mobile-nav-item">
            <i class="nav-icon">🛠️</i>
            <span>Services</span>
          </router-link>
          <router-link to="/client/messages" class="mobile-nav-item">
            <i class="nav-icon">💬</i>
            <span>Messages</span>
          </router-link>
        </template>

        <!-- Provider Navigation -->
        <template v-else-if="userRole === 'provider'">
          <router-link to="/provider/home" class="mobile-nav-item">
            <i class="nav-icon">📊</i>
            <span>Dashboard</span>
          </router-link>
          <router-link to="/provider/services" class="mobile-nav-item">
            <i class="nav-icon">🛠️</i>
            <span>Services</span>
          </router-link>
        </template>
        
        <!-- Admin Navigation -->
        <template v-else-if="userRole === 'admin'">
          <router-link to="/admin/dashboard" class="mobile-nav-item">
            <i class="nav-icon">📊</i>
            <span>Dashboard</span>
          </router-link>
        </template>
      </div>

      <!-- Mobile Profile Menu Overlay -->
      <div v-if="showMobileProfile" class="mobile-profile-overlay" @click="showMobileProfile = false">
        <div class="mobile-profile-menu" @click.stop>
          <div class="mobile-profile-header">
            <img :src="user.profilePicture || '../assets/avatar-placeholder.png'" alt="User" class="mobile-avatar" />
            <div class="mobile-user-info">
              <div class="mobile-user-name">{{ user.firstName }} {{ user.lastName }}</div>
              <div class="mobile-user-email">{{ user.email }}</div>
            </div>
            <button class="mobile-close-btn" @click="showMobileProfile = false">✕</button>
          </div>
          <div class="mobile-profile-links">
            <router-link :to="profileRoute" @click="showMobileProfile = false">
              <i class="dropdown-icon">👤</i> My Profile
            </router-link>
            <router-link to="/settings" @click="showMobileProfile = false">
              <i class="dropdown-icon">⚙️</i> Settings
            </router-link>
            <div class="mobile-notifications">
              <i class="dropdown-icon">🔔</i> Notifications
              <span v-if="notifications.length > 0" class="mobile-badge">{{ notifications.length }}</span>
            </div>
            <a @click="logout" href="#" class="logout-btn">
              <i class="dropdown-icon">🚪</i> Logout
            </a>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Navigation',
  data() {
    return {
      user: {
        id: '',
        firstName: '',
        lastName: '',
        email: '',
        profilePicture: null,
        role: ''
      },
      notifications: [],
      isLoggedIn: false,
      userRole: null,
      apiBaseUrl: 'http://localhost:5500/api',
      showMobileProfile: false,
      activeDropdown: null
    }
  },
  created() {
    this.checkUserStatus();
    
    // Listen for authentication changes
    window.addEventListener('auth-changed', this.checkUserStatus);
    
    // Close dropdowns when clicking outside
    window.addEventListener('click', this.handleOutsideClick);
  },
  watch: {
    // Watch for route changes to update navbar visibility
    '$route': {
      immediate: true,
      handler() {
        this.checkUserStatus();
        this.showMobileProfile = false; // Close mobile profile menu on route change
      }
    }
  },
  computed: {
    shouldShowNavbar() {
      // Only show navbar when logged in (don't show on login, register, landing pages)
      return this.isLoggedIn;
    },
    homeRoute() {
      if (!this.isLoggedIn) return '/';
      
      switch(this.userRole) {
        case 'client':
          return '/client/home';
        case 'provider':
          return '/provider/home';
        case 'admin':
          return '/admin/dashboard';
        default:
          return '/';
      }
    },
    profileRoute() {
      switch(this.userRole) {
        case 'client':
          return '/client/profile';
        case 'provider':
          return '/provider/profile';
        case 'admin':
          return '/admin/dashboard';
        default:
          return '/profile';
      }
    }
  },
  methods: {
    checkUserStatus() {
      const token = localStorage.getItem('token');
      if (!token) {
        this.userRole = 'guest';
        this.isLoggedIn = false;
        localStorage.removeItem('userRole');
        return;
      }

      // Check if we have a stored role first
      const storedRole = localStorage.getItem('userRole');
      
      // Get user info from localStorage
      const userString = localStorage.getItem('user');
      if (userString) {
        try {
          const userData = JSON.parse(userString);
          this.isLoggedIn = true;
          
          // Extract user data
          if (userData.user) {
            this.user.firstName = userData.user.firstName || '';
            this.user.lastName = userData.user.lastName || '';
            this.user.email = userData.user.email || '';
            this.user.profilePicture = userData.user.profilePicture || null;
            
            // If role is in nested user object
            if (userData.user.role) {
              this.userRole = userData.user.role.toLowerCase();
            }
          } else {
            this.user.firstName = userData.firstName || '';
            this.user.lastName = userData.lastName || '';
            this.user.email = userData.email || '';
            this.user.profilePicture = userData.profilePicture || null;
            
            // Determine user role if not already in nested user object
            if (userData.role) {
              this.userRole = userData.role.toLowerCase();
            } else if (userData.isAdmin) {
              this.userRole = 'admin';
            } else if (userData.isProvider) {
              this.userRole = 'provider';
            } else {
              this.userRole = 'client';
            }
          }
          
          // If we have a previously stored role, use that for consistency
          if (storedRole && ['client', 'provider', 'admin'].includes(storedRole)) {
            console.log(`Using stored role: ${storedRole}`);
            this.userRole = storedRole;
          } else {
            // Store the determined role in localStorage
            console.log(`Setting new role: ${this.userRole}`);
            localStorage.setItem('userRole', this.userRole);
          }
          
          this.fetchNotifications();
        } catch (e) {
          console.error('Error parsing user data:', e);
          this.userRole = 'guest';
          this.isLoggedIn = false;
          localStorage.removeItem('userRole');
        }
      } else {
        this.userRole = 'guest';
        this.isLoggedIn = false;
        localStorage.removeItem('userRole');
      }

      // Debug check - to help find the routing issue
      console.log('Current User Role:', this.userRole);
      console.log('Current Route:', this.$route.path);
    },
    
    async fetchNotifications() {
      try {
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
        this.notifications = [];
      }
    },
    
    toggleProfileMenu() {
      this.showMobileProfile = !this.showMobileProfile;
    },
    
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');
      this.userRole = 'guest';
      this.isLoggedIn = false;
      this.showMobileProfile = false;
      
      // Dispatch auth changed event
      window.dispatchEvent(new Event('auth-changed'));
      
      this.$router.push('/login');
    },
    formatNotificationTime(dateString) {
      if (!dateString) return '';
      
      const date = new Date(dateString);
      const now = new Date();
      const diffMinutes = Math.floor((now - date) / (1000 * 60));
      
      if (diffMinutes < 1) return 'Just now';
      if (diffMinutes < 60) return `${diffMinutes}m ago`;
      
      const diffHours = Math.floor(diffMinutes / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      
      const diffDays = Math.floor(diffHours / 24);
      if (diffDays < 7) return `${diffDays}d ago`;
      
      return date.toLocaleDateString();
    },
    toggleDropdown(dropdown) {
      this.activeDropdown = this.activeDropdown === dropdown ? null : dropdown;
    },
    handleOutsideClick(event) {
      // Handle profile dropdown
      if (this.activeDropdown === 'profile' && 
          !event.target.closest('.profile-dropdown')) {
        this.activeDropdown = null;
      }
      
      // Handle notifications dropdown
      if (this.activeDropdown === 'notifications' && 
          !event.target.closest('.notifications-dropdown')) {
        this.activeDropdown = null;
      }
      
      // Handle mobile profile menu
      if (this.showMobileProfile && 
          !event.target.closest('.mobile-profile-menu') && 
          !event.target.closest('.mobile-nav-item')) {
        this.showMobileProfile = false;
      }
    }
  },
  beforeUnmount() {
    // Clean up event listeners
    window.removeEventListener('auth-changed', this.checkUserStatus);
    window.removeEventListener('click', this.handleOutsideClick);
  }
}
</script>

<style scoped>
/* Main navbar styling */
.navbar {
  background: linear-gradient(135deg, #2bad61 0%, #0fdd7d 100%);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  padding: 0; /* Remove padding to allow elements to touch edges */
  height: 110px; /* Increased height from 80px to 90px */
}

.container {
  width: 100%;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
}

/* Left section for logo - positioned at extreme left */
.left-section {
  display: flex;
  align-items: center;
  padding-left: 20px; /* Add padding inside the container instead */
  height: 100%;
}

/* Right section for navigation and user actions - positioned at extreme right */
.right-section {
  display: flex;
  align-items: center;
  gap: 2rem;
  padding-right: 20px; /* Add padding inside the container instead */
  height: 100%;
}

/* Logo styling */
.logo-container {
  display: flex;
  align-items: center;
  height: 100%;
  padding: 10px 0;
}

.logo {
  height: 95px; /* Increased from 60px to 70px */
  width: auto;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

/* Desktop Navigation Links */
.nav-links {
  display: flex;
  gap: 2.5rem;
  align-items: center;
}

.nav-links a {
  text-decoration: none;
  color: white;
  font-weight: 600;
  font-size: 1.05rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  padding: 0.6rem 1rem;
  border-radius: 10px;
  transition: all 0.2s ease;
}

.nav-links a.router-link-active {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  font-weight: 700;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.nav-links a:hover {
  background-color: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.nav-icon {
  font-size: 1.3rem;
}

/* User Actions Section */
.user-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

/* Notifications Styling */
.notifications-dropdown {
  position: relative;
}

.notifications-btn {
  background: rgba(255, 255, 255, 0.15);
  border: none;
  cursor: pointer;
  font-size: 1.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  transition: background-color 0.2s ease;
}

.notifications-btn:hover {
  background-color: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
}

.badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #ef4444;
  color: white;
  font-size: 0.8rem;
  font-weight: bold;
  min-width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
}

/* Profile Dropdown Styling */
.profile-dropdown {
  position: relative;
}

.profile-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(255, 255, 255, 0.15);
  border: none;
  cursor: pointer;
  padding: 0.5rem 0.95rem;
  border-radius: 50px;
  transition: all 0.2s ease;
}

.profile-btn:hover {
  background-color: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
}

.avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(255, 255, 255, 0.7);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.user-name {
  font-weight: 600;
  color: white;
  font-size: 1.05rem;
}

.dropdown-arrow {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
}

/* Dropdown Content Styling */
.dropdown-content {
  position: absolute;
  right: 0;
  top: calc(100% + 10px);
  min-width: 260px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  padding: 0.6rem;
  z-index: 1000;
  transform-origin: top right;
  animation: dropdown-appear 0.2s ease;
}

@keyframes dropdown-appear {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.dropdown-content a, 
.mobile-profile-links a {
  display: flex;
  padding: 0.85rem 1.2rem;
  text-decoration: none;
  color: #4a5568;
  font-weight: 500;
  font-size: 1.05rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  align-items: center;
  gap: 0.75rem;
}

.dropdown-content a:hover,
.mobile-profile-links a:hover {
  background-color: #f3f4f6;
  color: #1a237e;
  transform: translateY(-1px);
}

.dropdown-icon {
  font-size: 1.2rem;
}

.logout-btn {
  color: #ef4444 !important;
}

.logout-btn:hover {
  background-color: #fef2f2 !important;
}

/* Notification dropdown specific styles */
.notifications-dropdown .dropdown-content {
  width: 340px;
  padding: 0;
  border-radius: 12px;
  overflow: hidden;
}

.empty-state {
  padding: 1.75rem;
  text-align: center;
  color: #9ca3af;
  font-size: 1.05rem;
}

.notification-list {
  max-height: 350px;
  overflow-y: auto;
}

.notification-item {
  display: flex;
  padding: 1rem;
  border-bottom: 1px solid #f3f4f6;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.notification-item:last-child {
  border-bottom: none;
}

.notification-item:hover {
  background-color: #f9fafb;
}

.notification-icon {
  margin-right: 0.75rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: #f3f4f6;
  font-size: 1.3rem;
  flex-shrink: 0;
}

.notification-icon.booking {
  background-color: #dbeafe;
  color: #3b82f6;
}

.notification-icon.message {
  background-color: #dcfce7;
  color: #22c55e;
}

.notification-content {
  flex: 1;
}

.notification-text {
  margin-bottom: 0.25rem;
  font-size: 1rem;
  color: #374151;
  line-height: 1.4;
}

.notification-time {
  font-size: 0.85rem;
  color: #9ca3af;
}

/* Mobile Navigation Styles */
.mobile-nav {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: linear-gradient(to right, #2bad61 0%, #0fdd7d 100%);
  padding: 0.85rem 0.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  justify-content: space-around;
}

.mobile-nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: rgba(255, 255, 255, 0.85);
  gap: 0.3rem;
  flex: 1;
  padding: 0.4rem 0;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.mobile-nav-item.router-link-active {
  color: white;
  background-color: rgba(255, 255, 255, 0.15);
  font-weight: 600;
}

.mobile-nav-item:active {
  background-color: rgba(255, 255, 255, 0.1);
}

.mobile-nav-item i {
  font-size: 1.6rem;
}

.mobile-nav-item span {
  font-size: 0.8rem;
  font-weight: 500;
}

/* Mobile Profile Menu Overlay */
.mobile-profile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 2000;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: fade-in 0.2s ease;
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.mobile-profile-menu {
  background-color: white;
  border-radius: 16px;
  width: 90%;
  max-width: 360px;
  max-height: 90vh;
  overflow-y: auto;
  animation: slide-up 0.3s ease;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
}

@keyframes slide-up {
  from { transform: translateY(30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.mobile-profile-header {
  display: flex;
  padding: 1.5rem;
  border-bottom: 1px solid #f3f4f6;
  position: relative;
  background: linear-gradient(135deg, #2bad61 0%, #0fdd7d 100%);
  color: white;
  border-radius: 16px 16px 0 0;
}

.mobile-avatar {
  width: 55px;
  height: 55px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.7);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.mobile-user-info {
  flex: 1;
}

.mobile-user-name {
  font-weight: 600;
  color: white;
  margin-bottom: 0.25rem;
  font-size: 1.2rem;
}

.mobile-user-email {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.85);
}

.mobile-close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(255, 255, 255, 0.15);
  border: none;
  font-size: 1.25rem;
  color: white;
  cursor: pointer;
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s ease;
}

.mobile-close-btn:hover {
  background-color: rgba(255, 255, 255, 0.25);
}

.mobile-profile-links {
  padding: 0.9rem;
}

.mobile-profile-links a,
.mobile-notifications {
  display: flex;
  padding: 1rem 1.2rem;
  color: #4a5568;
  font-weight: 500;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  transition: background-color 0.2s ease;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.05rem;
}

.mobile-profile-links a:hover,
.mobile-notifications:hover {
  background-color: #f3f4f6;
  color: #1a237e;
}

.mobile-notifications {
  position: relative;
  cursor: pointer;
}

.mobile-badge {
  background-color: #ef4444;
  color: white;
  font-size: 0.8rem;
  font-weight: bold;
  min-width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
}

/* Mobile Profile Button - Top Right */
.mobile-profile-button {
  display: none; /* Hidden by default, shown only on mobile */
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  padding: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 50px;
  height: 50px;
  min-width: 50px;
  min-height: 50px;
  border: 3px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  position: relative;
}

.mobile-profile-button:active {
  background-color: rgba(255, 255, 255, 0.4);
  transform: scale(0.95);
}

.mobile-profile-button img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

/* Responsive Styles */
@media (max-width: 768px) {
  .navbar {
    position: fixed;
    top: 0;
    padding: 0.6rem 0;
    background: linear-gradient(to right, #2bad61 0%, #0fdd7d 100%);
    height: 85px; /* Added specific height for mobile */
  }
  
  .desktop-only {
    display: none;
  }
  
  .mobile-nav {
    display: flex;
  }
  
  /* Show the mobile profile button in top right */
  .mobile-profile-button {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: auto; /* Push to the far right */
    z-index: 1010; /* Increase to ensure it's above everything */
  }
  
  /* Make the logo smaller on mobile but still larger than before */
  .logo {
    height: 55px; /* Increased from 45px to 55px */
  }
  
  /* Add padding to the page content to account for bottom navbar */
  body {
    padding-bottom: 75px;
  }
  
  /* Add padding to the top to account for potential small header */
  body {
    padding-top: 15px;
  }
}
</style>
