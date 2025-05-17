<template>
  <div class="provider-dashboard">
    <!-- Profile Completion Banner -->
    <div v-if="showProfileBanner" class="profile-banner">
      <div class="banner-content">
        <div class="banner-text">
          <h2>Complete your profile to start receiving client requests</h2>
          <p>Your provider profile needs to be completed before you can be matched with clients.</p>
        </div>
        <router-link to="/provider/profile" class="banner-button">
          Complete Profile
        </router-link>
      </div>
      <button class="close-banner" @click="dismissBanner">×</button>
    </div>
    
    <!-- Dashboard content -->
    <h1 class="title is-3">Provider Dashboard</h1>
    <p>This is the provider dashboard component.</p>
  </div>
</template>

<script>
export default {
  name: 'ProviderHomePage',
  data() {
    return {
      user: {
        firstName: '',
        lastName: ''
      },
      showProfileBanner: true,
      apiBaseUrl: 'http://localhost:5500/api'
    };
  },
  created() {
    // Try to get user data from localStorage for navigation
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const userData = JSON.parse(userString);
        if (userData.user) {
          this.user.firstName = userData.user.firstName || '';
          this.user.lastName = userData.user.lastName || '';
        } else {
          this.user.firstName = userData.firstName || '';
          this.user.lastName = userData.lastName || '';
        }
      } catch (e) {
        console.error('Error parsing user from localStorage:', e);
      }
    }
  },
  mounted() {
    // Always check profile status from API rather than using localStorage
    this.checkProfileCompletion();
  },
  methods: {
    dismissBanner() {
      // Only hide banner for current session, don't store in localStorage
      this.showProfileBanner = false;
    },
    async checkProfileCompletion() {
      try {
        const response = await fetch(`${this.apiBaseUrl}/provider/verification-status`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!response.ok) return;
        
        const data = await response.json();
        // Only hide banner if profile is verified/approved
        if (data.status === 'approved' || data.status === 'verified') {
          this.showProfileBanner = false;
        } else {
          // Show banner for incomplete or pending profiles
          this.showProfileBanner = true;
        }
      } catch (error) {
        console.error('Error checking profile status:', error);
        // Show banner by default if there's an error
        this.showProfileBanner = true;
      }
    }
  }
}
</script>

<style scoped>
.provider-dashboard {
  margin-top: 130px;
  padding: 20px;
}

/* Profile Banner styling */
.profile-banner {
  background: linear-gradient(135deg, #2bad61 0%, #0fdd7d 100%);
  border-radius: 8px;
  padding: 25px;
  margin-bottom: 30px;
  color: white;
  position: relative;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.banner-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.banner-text h2 {
  font-size: 1.4rem;
  margin-bottom: 8px;
  color: white;
}

.banner-text p {
  font-size: 1rem;
  opacity: 0.9;
}

.banner-button {
  background-color: white;
  color: #2bad61;
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: bold;
  text-decoration: none;
  transition: all 0.3s ease;
}

.banner-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.close-banner {
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(255, 255, 255, 0.3);
  border: none;
  color: white;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  font-size: 1.2rem;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .banner-content {
    flex-direction: column;
    text-align: center;
  }
  
  .banner-text {
    margin-bottom: 15px;
  }
}
</style>
