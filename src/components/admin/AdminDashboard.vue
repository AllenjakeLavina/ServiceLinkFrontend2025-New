<template>
  <div class="dashboard-wrapper">
    <div id="dashboard-container" class="container">
      <div class="header">
        <h1>Admin Dashboard</h1>
        <button id="logout-btn" @click="logout">Logout</button>
      </div>

      <div class="tabs">
        <div class="tab" :class="{ active: activeTab === 'unverified-providers' }" @click="activeTab = 'unverified-providers'">
          Unverified Providers
        </div>
        <div class="tab" :class="{ active: activeTab === 'all-providers' }" @click="activeTab = 'all-providers'">
          All Providers
        </div>
        <div class="tab" :class="{ active: activeTab === 'all-clients' }" @click="activeTab = 'all-clients'">
          All Clients
        </div>
        <div class="tab" :class="{ active: activeTab === 'user-management' }" @click="activeTab = 'user-management'">
          User Management
        </div>
      </div>

      <!-- Unverified Providers Tab -->
      <div id="unverified-providers" class="tab-content" v-show="activeTab === 'unverified-providers'">
        <div class="card">
          <h2>Providers Awaiting Verification</h2>
          <div id="unverified-providers-list">
            <div v-if="isLoading" class="loading">Loading...</div>
            <div v-else-if="unverifiedProviders.length === 0" class="empty-state">
              <p>No providers awaiting verification</p>
            </div>
            <div v-else>
              <div v-for="provider in unverifiedProviders" :key="provider.id" class="provider-card">
                <div class="provider-info">
                  <h3>{{ provider.user.firstName }} {{ provider.user.lastName }}</h3>
                  <p>Email: {{ provider.user.email }}</p>
                  <p>Phone: {{ provider.user.phone || 'Not provided' }}</p>
                  <p>ID Documents: {{ provider.documents && provider.documents.length > 0 ? `${provider.documents.length} document(s)` : 'No documents uploaded' }}</p>
                </div>
                <div class="provider-actions">
                  <button @click="verifyProvider(provider.id)">Verify Provider</button>
                  <button @click="rejectProvider(provider.id)">Reject</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- All Providers Tab -->
      <div id="all-providers" class="tab-content" v-show="activeTab === 'all-providers'">
        <div class="card">
          <h2>All Service Providers</h2>
          <div id="providers-list">
            <div v-if="isLoading" class="loading">Loading...</div>
            <div v-else-if="allProviders.length === 0" class="empty-state">
              <p>No providers found</p>
            </div>
            <div v-else>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Services</th>
                    <th>Skills</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="provider in allProviders" :key="provider.id">
                    <td>{{ provider.user.firstName }} {{ provider.user.lastName }}</td>
                    <td>{{ provider.user.email }}</td>
                    <td>{{ provider.user.phone || 'Not provided' }}</td>
                    <td>{{ provider.isProviderVerified ? 'Verified' : 'Pending Verification' }}</td>
                    <td>{{ provider.services.length }} service(s)</td>
                    <td>{{ provider.skills.map(s => s.name).join(', ') || 'No skills listed' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- All Clients Tab -->
      <div id="all-clients" class="tab-content" v-show="activeTab === 'all-clients'">
        <div class="card">
          <h2>All Clients</h2>
          <div id="clients-list">
            <div v-if="isLoading" class="loading">Loading...</div>
            <div v-else-if="allClients.length === 0" class="empty-state">
              <p>No clients found</p>
            </div>
            <div v-else>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Addresses</th>
                    <th>Bookings</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="client in allClients" :key="client.id">
                    <td>{{ client.user.firstName }} {{ client.user.lastName }}</td>
                    <td>{{ client.user.email }}</td>
                    <td>{{ client.user.phone || 'Not provided' }}</td>
                    <td>{{ client.user.isActive ? 'Active' : 'Inactive' }}</td>
                    <td>{{ client.addresses.length }} address(es)</td>
                    <td>{{ client.bookingCount }} booking(s)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- User Management Tab -->
      <div id="user-management" class="tab-content" v-show="activeTab === 'user-management'">
        <div class="card">
          <h2>Change User Password</h2>
          <div class="form-group">
            <label for="user-id">User ID:</label>
            <input type="text" id="user-id" v-model="userId" placeholder="Enter user ID">
          </div>
          <div class="form-group">
            <label for="new-password">New Password:</label>
            <input type="password" id="new-password" v-model="newPassword" placeholder="Enter new password">
          </div>
          <button id="change-password-btn" @click="changePassword">Change Password</button>
          <div id="password-change-result" class="result" v-if="passwordChangeMessage">
            <p :class="passwordChangeSuccess ? 'success-message' : 'error-message'">
              {{ passwordChangeMessage }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminDashboard',
  data() {
    return {
      activeTab: 'unverified-providers',
      apiBaseUrl: 'http://localhost:5500/api',
      isLoading: false,
      unverifiedProviders: [],
      allProviders: [],
      allClients: [],
      userId: '',
      newPassword: '',
      passwordChangeMessage: '',
      passwordChangeSuccess: false,
      isDevelopment: false // Changed to false to use real API
    }
  },
  mounted() {
    this.loadUnverifiedProviders();
  },
  methods: {
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');
      this.$router.push('/login');
      window.dispatchEvent(new Event('auth-changed'));
    },
    async loadUnverifiedProviders() {
      this.isLoading = true;
      
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          this.$router.push('/login');
          return;
        }
        
        // Use mock data if in development mode or token is 'mock-admin-token'
        if (this.isDevelopment || token === 'mock-admin-token') {
          console.log('Using mock data for unverified providers');
          setTimeout(() => {
            this.unverifiedProviders = [
              {
                id: 'provider-1',
                user: {
                  firstName: 'John',
                  lastName: 'Doe',
                  email: 'john.doe@example.com',
                  phone: '09123456789'
                },
                documents: [{ id: 'doc1', name: 'ID Card' }, { id: 'doc2', name: 'License' }]
              },
              {
                id: 'provider-2',
                user: {
                  firstName: 'Jane',
                  lastName: 'Smith',
                  email: 'jane.smith@example.com',
                  phone: '09876543210'
                },
                documents: []
              }
            ];
            this.isLoading = false;
          }, 500);
          return;
        }
        
        console.log('Fetching unverified providers from API:', `${this.apiBaseUrl}/admin/providers/unverified`);
        const response = await fetch(`${this.apiBaseUrl}/admin/providers/unverified`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const data = await response.json();
        console.log('Unverified providers API response:', data);
        
        if (data.success) {
          this.unverifiedProviders = data.data;
          console.log('Updated unverified providers list:', this.unverifiedProviders);
        } else {
          console.error('Failed to load unverified providers:', data.message);
        }
      } catch (error) {
        console.error('Error loading unverified providers:', error);
      } finally {
        this.isLoading = false;
      }
    },
    async loadAllProviders() {
      this.isLoading = true;
      
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          this.$router.push('/login');
          return;
        }
        
        // Use mock data if in development mode or token is 'mock-admin-token'
        if (this.isDevelopment || token === 'mock-admin-token') {
          console.log('Using mock data for all providers');
          setTimeout(() => {
            this.allProviders = [
              {
                id: 'provider-1',
                user: {
                  firstName: 'John',
                  lastName: 'Doe',
                  email: 'john.doe@example.com',
                  phone: '09123456789'
                },
                isProviderVerified: false,
                services: [{ id: 's1', name: 'Plumbing' }],
                skills: [{ id: 'sk1', name: 'Pipe Fitting' }, { id: 'sk2', name: 'Leak Repair' }]
              },
              {
                id: 'provider-2',
                user: {
                  firstName: 'Jane',
                  lastName: 'Smith',
                  email: 'jane.smith@example.com',
                  phone: '09876543210'
                },
                isProviderVerified: true,
                services: [{ id: 's2', name: 'Electrical' }, { id: 's3', name: 'Home Repair' }],
                skills: [{ id: 'sk3', name: 'Wiring' }, { id: 'sk4', name: 'Fixtures' }]
              },
              {
                id: 'provider-3',
                user: {
                  firstName: 'David',
                  lastName: 'Wilson',
                  email: 'david.wilson@example.com',
                  phone: '09512347890'
                },
                isProviderVerified: true,
                services: [{ id: 's4', name: 'Cleaning' }],
                skills: [{ id: 'sk5', name: 'Deep Cleaning' }]
              }
            ];
            this.isLoading = false;
          }, 500);
          return;
        }
        
        const response = await fetch(`${this.apiBaseUrl}/admin/providers`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const data = await response.json();
        
        if (data.success) {
          this.allProviders = data.data;
        } else {
          console.error('Failed to load providers:', data.message);
        }
      } catch (error) {
        console.error('Error loading providers:', error);
      } finally {
        this.isLoading = false;
      }
    },
    async loadAllClients() {
      this.isLoading = true;
      
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          this.$router.push('/login');
          return;
        }
        
        // Use mock data if in development mode or token is 'mock-admin-token'
        if (this.isDevelopment || token === 'mock-admin-token') {
          console.log('Using mock data for all clients');
          setTimeout(() => {
            this.allClients = [
              {
                id: 'client-1',
                user: {
                  firstName: 'Michael',
                  lastName: 'Johnson',
                  email: 'michael.j@example.com',
                  phone: '09754321890',
                  isActive: true
                },
                addresses: [{ id: 'a1', address: '123 Main St' }],
                bookingCount: 5
              },
              {
                id: 'client-2',
                user: {
                  firstName: 'Sarah',
                  lastName: 'Brown',
                  email: 'sarah.b@example.com',
                  phone: '09123789456',
                  isActive: true
                },
                addresses: [{ id: 'a2', address: '456 Oak Ave' }, { id: 'a3', address: '789 Pine St' }],
                bookingCount: 2
              },
              {
                id: 'client-3',
                user: {
                  firstName: 'Robert',
                  lastName: 'Garcia',
                  email: 'robert.g@example.com',
                  phone: null,
                  isActive: false
                },
                addresses: [],
                bookingCount: 0
              }
            ];
            this.isLoading = false;
          }, 500);
          return;
        }
        
        const response = await fetch(`${this.apiBaseUrl}/admin/clients`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const data = await response.json();
        
        if (data.success) {
          this.allClients = data.data;
        } else {
          console.error('Failed to load clients:', data.message);
        }
      } catch (error) {
        console.error('Error loading clients:', error);
      } finally {
        this.isLoading = false;
      }
    },
    async verifyProvider(providerId) {
      if (!confirm('Are you sure you want to verify this provider?')) {
        return;
      }
      
      // For development mode
      if (this.isDevelopment || localStorage.getItem('token') === 'mock-admin-token') {
        alert('Provider verified successfully (Development Mode)');
        this.unverifiedProviders = this.unverifiedProviders.filter(p => p.id !== providerId);
        return;
      }
      
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        
        this.isLoading = true;
        console.log(`Verifying provider ${providerId}`);
        
        const response = await fetch(`${this.apiBaseUrl}/admin/providers/verify`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ providerId })
        });
        
        const data = await response.json();
        console.log('Verification API response:', data);
        
        if (data.success) {
          alert('Provider verified successfully');
          
          // Immediately remove from local array for UI responsiveness
          this.unverifiedProviders = this.unverifiedProviders.filter(p => p.id !== providerId);
          
          // Then refresh data from server to ensure sync
          setTimeout(() => {
            this.loadUnverifiedProviders();
          }, 500);
        } else {
          alert(`Error: ${data.message}`);
        }
      } catch (error) {
        console.error('Error verifying provider:', error);
        alert('Failed to verify provider');
      } finally {
        this.isLoading = false;
      }
    },
    async rejectProvider(providerId) {
      const reason = prompt('Please provide a reason for rejection:');
      if (!reason) {
        alert('Rejection reason is required');
        return;
      }
      
      // For development mode
      if (this.isDevelopment || localStorage.getItem('token') === 'mock-admin-token') {
        alert('Provider rejection sent successfully (Development Mode)');
        this.unverifiedProviders = this.unverifiedProviders.filter(p => p.id !== providerId);
        return;
      }
      
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        
        this.isLoading = true;
        console.log(`Rejecting provider ${providerId} with reason: ${reason}`);
        
        const response = await fetch(`${this.apiBaseUrl}/admin/providers/reject`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ providerId, reason })
        });
        
        const data = await response.json();
        console.log('Rejection API response:', data);
        
        if (data.success) {
          alert('Provider rejection sent successfully');
          
          // Immediately remove from local array for UI responsiveness
          this.unverifiedProviders = this.unverifiedProviders.filter(p => p.id !== providerId);
          
          // Then refresh data from server to ensure sync
          setTimeout(() => {
            this.loadUnverifiedProviders();
          }, 500);
        } else {
          alert(`Error: ${data.message}`);
        }
      } catch (error) {
        console.error('Error rejecting provider:', error);
        alert('Failed to reject provider');
      } finally {
        this.isLoading = false;
      }
    },
    async changePassword() {
      if (!this.userId || !this.newPassword) {
        this.passwordChangeMessage = 'Please enter both User ID and new password';
        this.passwordChangeSuccess = false;
        return;
      }
      
      // For development mode
      if (this.isDevelopment || localStorage.getItem('token') === 'mock-admin-token') {
        this.passwordChangeMessage = `Password changed successfully for user ID: ${this.userId} (Development Mode)`;
        this.passwordChangeSuccess = true;
        this.userId = '';
        this.newPassword = '';
        return;
      }
      
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          this.passwordChangeMessage = 'You must be logged in';
          this.passwordChangeSuccess = false;
          return;
        }
        
        const response = await fetch(`${this.apiBaseUrl}/admin/users/change-password`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ userId: this.userId, newPassword: this.newPassword })
        });
        
        const data = await response.json();
        
        if (data.success) {
          this.passwordChangeMessage = 'Password changed successfully';
          this.passwordChangeSuccess = true;
          this.userId = '';
          this.newPassword = '';
        } else {
          this.passwordChangeMessage = `Error: ${data.message}`;
          this.passwordChangeSuccess = false;
        }
      } catch (error) {
        console.error('Error changing password:', error);
        this.passwordChangeMessage = 'Failed to change password';
        this.passwordChangeSuccess = false;
      }
    }
  },
  watch: {
    activeTab(newTab) {
      if (newTab === 'unverified-providers') {
        this.loadUnverifiedProviders();
      } else if (newTab === 'all-providers') {
        this.loadAllProviders();
      } else if (newTab === 'all-clients') {
        this.loadAllClients();
      }
    }
  }
}
</script>

<style scoped>
.dashboard-wrapper {
  padding-top: 100px;
  width: 100%;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #ddd;
}

.header h1 {
  color: #333;
  margin: 0;
}

.card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
}

.card h2 {
  margin-top: 0;
  color: #333;
}

.tabs {
  display: flex;
  margin-bottom: 20px;
  border-bottom: 1px solid #ddd;
}

.tab {
  padding: 10px 20px;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.3s ease;
}

.tab:hover {
  background-color: #f5f5f5;
}

.tab.active {
  border-bottom: 2px solid #2196F3;
  font-weight: bold;
}

.tab-content {
  width: 100%;
}

table {
  width: 100%;
  border-collapse: collapse;
}

table th, table td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

table th {
  background-color: #f5f5f5;
  font-weight: bold;
}

table tr:hover {
  background-color: #f9f9f9;
}

button {
  background-color: #2196F3;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #0b7dda;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

.provider-card {
  display: flex;
  margin-bottom: 15px;
  border: 1px solid #eee;
  padding: 15px;
  border-radius: 4px;
  background-color: #fff;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.provider-info {
  flex: 1;
}

.provider-info h3 {
  margin-top: 0;
  color: #333;
}

.provider-actions {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.provider-actions button {
  margin-bottom: 8px;
}

.provider-actions button:last-child {
  background-color: #f44336;
}

.provider-actions button:last-child:hover {
  background-color: #d32f2f;
}

.loading {
  text-align: center;
  padding: 20px;
  color: #666;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #666;
}

.result {
  margin-top: 15px;
  padding: 10px;
  border-radius: 4px;
}

.success-message {
  color: green;
  background-color: rgba(0, 128, 0, 0.1);
  padding: 10px;
  border-radius: 4px;
}

.error-message {
  color: red;
  background-color: rgba(255, 0, 0, 0.1);
  padding: 10px;
  border-radius: 4px;
}

@media (max-width: 768px) {
  .provider-card {
    flex-direction: column;
  }
  
  .provider-actions {
    margin-top: 15px;
    flex-direction: row;
    gap: 10px;
  }
  
  .provider-actions button {
    margin-bottom: 0;
  }
  
  .tabs {
    flex-wrap: wrap;
  }
  
  .tab {
    padding: 8px 12px;
  }
}
</style> 