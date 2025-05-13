<template>
  <div class="booking-container">
    <!-- Navigation Bar -->
    <nav class="navbar">
      <div class="logo-container">
        <img src="../../assets/logo.png" alt="ServiceLink Logo" class="logo" />
      </div>
      <div class="nav-menu">
        <div class="nav-links">
          <router-link to="/client/home">Home</router-link>
          <router-link to="/client/booking" class="active">My Bookings</router-link>
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
      <p>Loading your bookings...</p>
    </div>

    <div v-else class="content-container">
      <h1 class="page-title">My Bookings</h1>

      <!-- Booking filters -->
      <div class="booking-filters">
        <div class="search-container">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Search bookings..." 
            class="search-input"
            @input="filterBookings"
          />
          <i class="search-icon">🔍</i>
        </div>

        <div class="filter-tabs">
          <button 
            v-for="status in filterOptions" 
            :key="status.value" 
            :class="['filter-tab', { active: currentFilter === status.value }]"
            @click="setFilter(status.value)"
          >
            {{ status.label }}
          </button>
        </div>
      </div>

      <!-- Bookings list -->
      <div v-if="filteredBookings.length > 0" class="bookings-list">
        <div v-for="booking in filteredBookings" :key="booking.id" class="booking-card">
          <div class="booking-header">
            <div class="service-icon">
              {{ getCategoryEmoji(booking.service?.category?.name || '') }}
            </div>
            <div class="service-info">
              <h3>{{ booking.service?.title || 'Service' }}</h3>
              <p class="provider-name">by {{ booking.serviceProvider?.user?.firstName }} {{ booking.serviceProvider?.user?.lastName }}</p>
            </div>
            <div class="booking-status-tag" :class="booking.status.toLowerCase()">
              {{ formatStatus(booking.status) }}
            </div>
          </div>

          <div class="booking-details">
            <div class="detail-item">
              <i class="detail-icon">📅</i>
              <span class="detail-label">Date:</span>
              <span class="detail-value">{{ formatDate(booking.scheduledDate) }}</span>
            </div>
            <div class="detail-item">
              <i class="detail-icon">⏰</i>
              <span class="detail-label">Time:</span>
              <span class="detail-value">{{ booking.startTime || 'Not specified' }}</span>
            </div>
            <div class="detail-item">
              <i class="detail-icon">📍</i>
              <span class="detail-label">Location:</span>
              <span class="detail-value">{{ booking.location || 'Not specified' }}</span>
            </div>
            <div class="detail-item">
              <i class="detail-icon">💰</i>
              <span class="detail-label">Price:</span>
              <span class="detail-value">{{ formatPrice(booking.totalAmount) }}</span>
            </div>
          </div>

          <div class="booking-actions">
            <button v-if="booking.status === 'CONFIRMED'" @click="rescheduleBooking(booking.id)" class="action-btn reschedule">
              <i class="action-icon">📅</i> Reschedule
            </button>
            <button v-if="booking.status === 'COMPLETED'" @click="leaveReview(booking.id)" class="action-btn review">
              <i class="action-icon">⭐</i> Leave Review
            </button>
            <button v-if="booking.status !== 'CANCELED' && booking.status !== 'COMPLETED'" @click="cancelBooking(booking.id)" class="action-btn cancel">
              <i class="action-icon">❌</i> Cancel
            </button>
            <button @click="viewDetails(booking.id)" class="action-btn view">
              <i class="action-icon">👁️</i> View Details
            </button>
          </div>
        </div>
      </div>

      <div v-else class="empty-state">
        <div class="empty-icon">📅</div>
        <h3>No bookings found</h3>
        <p v-if="currentFilter !== 'all'">No {{ currentFilter.toLowerCase() }} bookings found. Try changing your filter.</p>
        <p v-else>You don't have any bookings yet. Start exploring services to book!</p>
        <router-link to="/services" class="explore-btn">Explore Services</router-link>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <div v-if="showConfirmModal" class="modal-overlay">
      <div class="modal">
        <h3>{{ confirmModalTitle }}</h3>
        <p>{{ confirmModalMessage }}</p>
        <div class="modal-actions">
          <button @click="confirmAction" class="confirm-btn">Confirm</button>
          <button @click="closeModal" class="cancel-btn">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ClientBooking',
  data() {
    return {
      loading: true,
      bookings: [],
      filteredBookings: [],
      user: {
        id: '',
        firstName: '',
        lastName: '',
        email: '',
        profilePicture: null
      },
      notifications: [],
      searchQuery: '',
      currentFilter: 'all',
      filterOptions: [
        { label: 'All', value: 'all' },
        { label: 'Upcoming', value: 'upcoming' },
        { label: 'Pending', value: 'PENDING' },
        { label: 'Confirmed', value: 'CONFIRMED' },
        { label: 'Completed', value: 'COMPLETED' },
        { label: 'Cancelled', value: 'CANCELED' }
      ],
      showConfirmModal: false,
      confirmModalTitle: '',
      confirmModalMessage: '',
      pendingAction: null,
      pendingBookingId: null,
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
  created() {
    // Initialize arrays
    this.bookings = [];
    this.filteredBookings = [];
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
    this.fetchBookings();
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

    async fetchBookings() {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch(`${this.apiBaseUrl}/client/booking`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        this.bookings = Array.isArray(data) ? data : [];
        this.filterBookings(); // Apply initial filtering
      } catch (error) {
        console.error('Error fetching bookings:', error);
        this.bookings = []; // Ensure it's always an array
      } finally {
        this.loading = false;
      }
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

    async cancelBooking(bookingId) {
      this.confirmModalTitle = 'Cancel Booking';
      this.confirmModalMessage = 'Are you sure you want to cancel this booking? This action cannot be undone.';
      this.pendingAction = 'cancel';
      this.pendingBookingId = bookingId;
      this.showConfirmModal = true;
    },

    async processCancelBooking() {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch(`${this.apiBaseUrl}/client/booking/${this.pendingBookingId}/cancel`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({})
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Refresh bookings after cancellation
        this.fetchBookings();
      } catch (error) {
        console.error('Error cancelling booking:', error);
      }
    },

    rescheduleBooking(bookingId) {
      // This would navigate to a reschedule page or show a modal
      console.log('Reschedule booking:', bookingId);
    },

    leaveReview(bookingId) {
      // This would navigate to a review page or show a modal
      console.log('Leave review for booking:', bookingId);
    },

    viewDetails(bookingId) {
      // Navigate to booking details page
      this.$router.push(`/client/booking/${bookingId}`);
    },

    filterBookings() {
      let filtered = [...this.bookings];
      
      // Apply search filter if search query exists
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(booking => 
          (booking.service?.title || '').toLowerCase().includes(query) ||
          (booking.serviceProvider?.user?.firstName || '').toLowerCase().includes(query) ||
          (booking.serviceProvider?.user?.lastName || '').toLowerCase().includes(query) ||
          (booking.location || '').toLowerCase().includes(query)
        );
      }
      
      // Apply status filter
      if (this.currentFilter !== 'all') {
        if (this.currentFilter === 'upcoming') {
          // Filter upcoming bookings (future date with CONFIRMED or PENDING status)
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          filtered = filtered.filter(booking => {
            const bookingDate = new Date(booking.scheduledDate);
            return bookingDate >= today && 
                  (booking.status === 'CONFIRMED' || booking.status === 'PENDING');
          });
        } else {
          // Filter by specific status
          filtered = filtered.filter(booking => booking.status === this.currentFilter);
        }
      }
      
      // Sort by date, most recent first
      filtered.sort((a, b) => new Date(b.scheduledDate) - new Date(a.scheduledDate));
      
      this.filteredBookings = filtered;
    },

    setFilter(filter) {
      this.currentFilter = filter;
      this.filterBookings();
    },

    getCategoryEmoji(category) {
      return this.categoryEmojis[category] || '🔍';
    },

    formatDate(dateString) {
      if (!dateString) return 'Not set';
      
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('en-US', options);
    },

    formatPrice(price) {
      if (!price) return 'N/A';
      return `₱${parseFloat(price).toFixed(2)}`;
    },

    formatStatus(status) {
      if (!status) return '';
      
      // Convert UPPERCASE_WITH_UNDERSCORE to Title Case
      return status.toLowerCase()
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    },

    confirmAction() {
      if (this.pendingAction === 'cancel') {
        this.processCancelBooking();
      }
      this.closeModal();
    },

    closeModal() {
      this.showConfirmModal = false;
      this.pendingAction = null;
      this.pendingBookingId = null;
    },

    logout() {
      localStorage.removeItem('token');
      this.$router.push('/login');
    }
  }
}
</script>

<style scoped>
.booking-container {
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

.page-title {
  font-size: 2rem;
  color: #2d3748;
  margin-bottom: 1.5rem;
}

/* Booking filters */
.booking-filters {
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.search-container {
  position: relative;
  max-width: 500px;
}

.search-input {
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  width: 100%;
  background-color: white;
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

.filter-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.filter-tab {
  padding: 0.5rem 1.25rem;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  background-color: white;
  color: #4a5568;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-tab:hover {
  background-color: #f7fafc;
  border-color: #cbd5e0;
}

.filter-tab.active {
  background-color: #2bad61;
  border-color: #2bad61;
  color: white;
}

/* Bookings list */
.bookings-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.booking-card {
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease;
}

.booking-card:hover {
  transform: translateY(-2px);
}

.booking-header {
  display: flex;
  align-items: center;
  padding: 1.25rem;
  border-bottom: 1px solid #f0f0f0;
}

.service-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ebf8f0;
  color: #2bad61;
  font-size: 1.5rem;
  width: 50px;
  height: 50px;
  border-radius: 10px;
  margin-right: 1rem;
}

.service-info {
  flex: 1;
}

.service-info h3 {
  margin: 0 0 0.25rem 0;
  color: #2d3748;
  font-size: 1.25rem;
}

.provider-name {
  color: #718096;
  font-size: 0.875rem;
  margin: 0;
}

.booking-status-tag {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.booking-status-tag.confirmed {
  background-color: #ebf8f0;
  color: #2bad61;
}

.booking-status-tag.pending {
  background-color: #fef3c7;
  color: #d97706;
}

.booking-status-tag.canceled {
  background-color: #fee2e2;
  color: #dc2626;
}

.booking-status-tag.completed {
  background-color: #ddfcf3;
  color: #059669;
}

.booking-status-tag.in_progress {
  background-color: #e0f2fe;
  color: #0369a1;
}

.booking-details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  padding: 1.25rem;
  gap: 1rem;
  border-bottom: 1px solid #f0f0f0;
}

.detail-item {
  display: flex;
  align-items: center;
}

.detail-icon {
  margin-right: 0.5rem;
  font-size: 1rem;
}

.detail-label {
  font-weight: 600;
  color: #4a5568;
  margin-right: 0.5rem;
}

.detail-value {
  color: #718096;
}

.booking-actions {
  display: flex;
  padding: 1rem 1.25rem;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.action-btn {
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.action-icon {
  margin-right: 0.5rem;
  font-size: 0.875rem;
}

.action-btn.view {
  background-color: #edf2f7;
  color: #4a5568;
}

.action-btn.view:hover {
  background-color: #e2e8f0;
}

.action-btn.reschedule {
  background-color: #e0f2fe;
  color: #0369a1;
}

.action-btn.reschedule:hover {
  background-color: #bae6fd;
}

.action-btn.cancel {
  background-color: #fee2e2;
  color: #dc2626;
}

.action-btn.cancel:hover {
  background-color: #fecaca;
}

.action-btn.review {
  background-color: #fef3c7;
  color: #d97706;
}

.action-btn.review:hover {
  background-color: #fde68a;
}

/* Empty state */
.empty-state {
  background-color: white;
  border-radius: 10px;
  padding: 3rem 2rem;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-top: 2rem;
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

.explore-btn {
  display: inline-block;
  background-color: #2bad61;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: background-color 0.3s ease;
}

.explore-btn:hover {
  background-color: #239d58;
}

/* Confirmation modal */
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
}

.modal {
  background-color: white;
  border-radius: 10px;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.modal h3 {
  margin-top: 0;
  color: #2d3748;
  margin-bottom: 1rem;
}

.modal p {
  color: #718096;
  margin-bottom: 1.5rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.confirm-btn, .cancel-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.confirm-btn {
  background-color: #e53e3e;
  color: white;
}

.confirm-btn:hover {
  background-color: #c53030;
}

.cancel-btn {
  background-color: #edf2f7;
  color: #4a5568;
}

.cancel-btn:hover {
  background-color: #e2e8f0;
}

@media (max-width: 768px) {
  .nav-menu {
    flex-direction: column;
    gap: 1rem;
  }
  
  .booking-details {
    grid-template-columns: 1fr;
  }
  
  .booking-header {
    flex-direction: column;
    text-align: center;
  }
  
  .service-icon {
    margin: 0 0 0.75rem 0;
  }
  
  .booking-status-tag {
    margin-top: 0.75rem;
  }
  
  .booking-actions {
    justify-content: center;
  }
  
  .filter-tabs {
    justify-content: center;
  }
}
</style>

