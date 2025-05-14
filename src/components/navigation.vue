<template>
  <nav v-if="shouldShowNavbar" class="navbar">
    <div class="container">
      <!-- Logo - only visible on desktop -->
      <router-link :to="homeRoute" class="logo-container desktop-only">
        <img src="../assets/logo.png" alt="ServiceLink Logo" class="logo" />
      </router-link>

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
          <div class="mobile-nav-item" @click="toggleProfileMenu">
            <i class="nav-icon">👤</i>
            <span>Profile</span>
          </div>
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
          <div class="mobile-nav-item" @click="toggleProfileMenu">
            <i class="nav-icon">👤</i>
            <span>Profile</span>
          </div>
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
  background-color: #ffffff;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0.6rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Logo styling */
.logo-container {
  display: flex;
  align-items: center;
}

.logo {
  height: 50px;
  width: auto;
}

/* Desktop Navigation Links */
.nav-links {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.nav-links a {
  text-decoration: none;
  color: #4a5568;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  padding: 0.5rem 0;
  transition: color 0.2s ease;
}

.nav-links a.router-link-active {
  color: #2bad61;
}

.nav-links a.router-link-active::after {
  content: '';
  position: absolute;
  bottom: -0.25rem;
  left: 0;
  width: 100%;
  height: 3px;
  background-color: #2bad61;
  border-radius: 2px;
}

.nav-links a:hover {
  color: #2bad61;
}

.nav-icon {
  font-size: 1.2rem;
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
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  transition: background-color 0.2s ease;
}

.notifications-btn:hover {
  background-color: #f3f4f6;
}

.badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #ef4444;
  color: white;
  font-size: 0.7rem;
  font-weight: bold;
  min-width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Profile Dropdown Styling */
.profile-dropdown {
  position: relative;
}

.profile-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.4rem 0.75rem;
  border-radius: 50px;
  transition: background-color 0.2s ease;
}

.profile-btn:hover {
  background-color: #f3f4f6;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e5e7eb;
}

.user-name {
  font-weight: 500;
  color: #4a5568;
}

.dropdown-arrow {
  font-size: 0.7rem;
  color: #9ca3af;
}

/* Dropdown Content Styling */
.dropdown-content {
  position: absolute;
  right: 0;
  top: calc(100% + 8px);
  min-width: 220px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  padding: 0.5rem;
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
  padding: 0.75rem 1rem;
  text-decoration: none;
  color: #4a5568;
  font-weight: 500;
  border-radius: 8px;
  transition: background-color 0.2s ease;
  align-items: center;
  gap: 0.75rem;
}

.dropdown-content a:hover,
.mobile-profile-links a:hover {
  background-color: #f3f4f6;
  color: #2bad61;
}

.dropdown-icon {
  font-size: 1.1rem;
}

.logout-btn {
  color: #ef4444 !important;
}

.logout-btn:hover {
  background-color: #fef2f2 !important;
}

/* Notification dropdown specific styles */
.notifications-dropdown .dropdown-content {
  width: 300px;
  padding: 0;
  border-radius: 12px;
  overflow: hidden;
}

.empty-state {
  padding: 1.5rem;
  text-align: center;
  color: #9ca3af;
  font-size: 0.95rem;
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
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: #f3f4f6;
  font-size: 1.2rem;
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
  font-size: 0.95rem;
  color: #374151;
  line-height: 1.4;
}

.notification-time {
  font-size: 0.8rem;
  color: #9ca3af;
}

/* Mobile Navigation Styles */
.mobile-nav {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: white;
  padding: 0.75rem 0.5rem;
  border-top: 1px solid #e5e7eb;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  z-index: 1000;
  justify-content: space-around;
}

.mobile-nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: #6b7280;
  gap: 0.25rem;
  flex: 1;
  padding: 0.35rem 0;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.mobile-nav-item.router-link-active {
  color: #2bad61;
}

.mobile-nav-item:active {
  background-color: #f3f4f6;
}

.mobile-nav-item i {
  font-size: 1.4rem;
}

.mobile-nav-item span {
  font-size: 0.7rem;
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
}

@keyframes slide-up {
  from { transform: translateY(30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.mobile-profile-header {
  display: flex;
  padding: 1.25rem;
  border-bottom: 1px solid #f3f4f6;
  position: relative;
}

.mobile-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 1rem;
}

.mobile-user-info {
  flex: 1;
}

.mobile-user-name {
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.25rem;
}

.mobile-user-email {
  font-size: 0.85rem;
  color: #6b7280;
}

.mobile-close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.25rem;
  color: #9ca3af;
  cursor: pointer;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s ease;
}

.mobile-close-btn:hover {
  background-color: #f3f4f6;
}

.mobile-profile-links {
  padding: 0.75rem;
}

.mobile-profile-links a,
.mobile-notifications {
  display: flex;
  padding: 0.85rem 1rem;
  color: #4a5568;
  font-weight: 500;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  transition: background-color 0.2s ease;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.95rem;
}

.mobile-notifications {
  position: relative;
  cursor: pointer;
}

.mobile-badge {
  background-color: #ef4444;
  color: white;
  font-size: 0.7rem;
  font-weight: bold;
  min-width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: 1rem;
}

/* Responsive Styles */
@media (max-width: 768px) {
  .navbar {
    position: fixed;
    top: 0;
    padding: 0.5rem 0;
  }
  
  .desktop-only {
    display: none;
  }
  
  .mobile-nav {
    display: flex;
  }
  
  /* Add padding to the page content to account for bottom navbar */
  body {
    padding-bottom: 70px;
  }
  
  /* Add padding to the top to account for potential small header */
  body {
    padding-top: 10px;
  }
}
</style>
