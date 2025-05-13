<template>
  <div class="login-container">
    <div class="login-box">
      <div class="logo-container">
        <img src="../assets/logo.png" alt="ServiceLink Logo" class="logo" />
      </div>
      <h2>Welcome to ServiceLink</h2>
      <p class="subtitle">Sign in to your account</p>
      
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email">Email</label>
          <div class="input-group">
            <i class="icon">📧</i>
            <input
              type="email"
              id="email"
              v-model="email"
              required
              placeholder="Enter your email"
              :class="{ 'error': emailError }"
            />
          </div>
          <span class="error-message" v-if="emailError">{{ emailError }}</span>
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <div class="input-group">
            <i class="icon">🔒</i>
            <input
              :type="showPassword ? 'text' : 'password'"
              id="password"
              v-model="password"
              required
              placeholder="Enter your password"
              :class="{ 'error': passwordError }"
            />
            <i class="password-toggle" @click="togglePassword">
              {{ showPassword ? '👁️' : '👁️‍🗨️' }}
            </i>
          </div>
          <span class="error-message" v-if="passwordError">{{ passwordError }}</span>
        </div>

        <div class="remember-forgot">
          <label class="remember-me">
            <input type="checkbox" v-model="rememberMe" />
            <span>Remember me</span>
          </label>
          <a href="#" class="forgot-link">Forgot Password?</a>
        </div>

        <button type="submit" class="login-btn" :disabled="isLoading">
          <span v-if="isLoading">Loading...</span>
          <span v-else>Sign In</span>
        </button>

        <div v-if="loginError" class="error-message login-error">
          {{ loginError }}
        </div>

        <p class="signup-link">
          Don't have an account? <router-link to="/register">Sign up</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: '',
      rememberMe: false,
      showPassword: false,
      isLoading: false,
      emailError: '',
      passwordError: '',
      loginError: '',
      apiBaseUrl: 'http://localhost:5500'
    }
  },
  methods: {
    async handleLogin() {
      this.emailError = ''
      this.passwordError = ''
      this.loginError = ''
      this.isLoading = true

      try {
        const response = await fetch(`${this.apiBaseUrl}/api/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          mode: 'cors',
          credentials: 'omit',
          body: JSON.stringify({
            email: this.email,
            password: this.password
          })
        })

        // Try to parse response as JSON
        let data;
        try {
          data = await response.json();
          console.log('Login response:', data); // Log the actual response
        } catch (e) {
          throw new Error('Invalid response from server');
        }

        if (!response.ok) {
          if (data.message && data.message.toLowerCase().includes('email')) {
            this.emailError = data.message;
          } else if (data.message && data.message.toLowerCase().includes('password')) {
            this.passwordError = data.message;
          } else {
            throw new Error(data.message || 'Login failed');
          }
          return;
        }

        // Handle successful login - check various possible token locations
        const token = data.token || data.accessToken || 
                     (data.data && data.data.token) || 
                     (data.auth && data.auth.token);
        
        if (token) {
          // Store token in localStorage
          localStorage.setItem('token', token);
          
          // Find user data in various possible locations
          const userData = data.user || data.userData || data.data || {};
          console.log('User data from response:', userData);
          localStorage.setItem('user', JSON.stringify(userData));
          
          // Store remember me preference
          if (this.rememberMe) {
            localStorage.setItem('rememberMe', 'true');
          } else {
            localStorage.removeItem('rememberMe');
          }
          
          // Check structure of data to find the role correctly
          // Based on the API structure, it could be nested in user object
          const userRole = (userData && userData.user && userData.user.role) || 
                          (userData && userData.role) || 
                          (userData && userData.user && userData.user.role) ||
                          (data && data.data && data.data.user && data.data.user.role);
          
          console.log('Detected user role:', userRole);
          
          // Redirect based on user role
          if (userRole) {
            switch(userRole) {
              case 'CLIENT':
                this.$router.push('/client/home');
                break;
              case 'PROVIDER':
                this.$router.push('/provider/dashboard');
                break;
              case 'ADMIN':
                this.$router.push('/admin/dashboard');
                break;
              default:
                this.$router.push('/');
            }
          } else {
            console.error('No user role found in response', data);
            // Try to use client/home as default if we at least have a token
            this.$router.push('/client/home');
          }
        } else {
          console.error('No token found in response:', data);
          throw new Error('No authentication token received');
        }
      } catch (error) {
        console.error('Login error:', error);
        
        if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
          this.loginError = 'Cannot connect to the server. Please try again later.';
        } else {
          this.loginError = error.message || 'An error occurred. Please try again.';
        }
      } finally {
        this.isLoading = false;
      }
    },
    togglePassword() {
      this.showPassword = !this.showPassword;
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #2bad61 0%, #0fdd7d 100%);
  padding: 20px;
  width: 100%;
}

.login-box {
  background: rgba(255, 255, 255, 0.95);
  padding: 3rem;
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 480px;
  backdrop-filter: blur(10px);
}

.logo-container {
  text-align: center;
  margin-bottom: 2rem;
}

.logo {
  height: 200px;
  width: auto;
  object-fit: contain;
  margin-bottom: 1rem;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
}

h2 {
  text-align: center;
  color: #1a237e;
  margin-bottom: 0.5rem;
  font-size: 2rem;
  font-weight: 600;
}

.subtitle {
  text-align: center;
  color: #455a64;
  margin-bottom: 2.5rem;
  font-size: 1rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  font-size: 0.95rem;
  color: #455a64;
  font-weight: 500;
}

.input-group {
  position: relative;
  display: flex;
  align-items: center;
}

.icon {
  position: absolute;
  left: 12px;
  color: #1a237e;
  font-size: 1.2rem;
}

.password-toggle {
  position: absolute;
  right: 12px;
  color: #1a237e;
  cursor: pointer;
  font-size: 1.2rem;
}

input {
  padding: 1rem 2.5rem;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  width: 100%;
  background: rgba(255, 255, 255, 0.9);
}

input:focus {
  outline: none;
  border-color: #1a237e;
  box-shadow: 0 0 0 3px rgba(26, 35, 126, 0.1);
}

input.error {
  border-color: #d32f2f;
}

.error-message {
  color: #d32f2f;
  font-size: 0.85rem;
}

.login-error {
  text-align: center;
  padding: 0.5rem;
  background-color: #ffebee;
  border-radius: 5px;
  margin-top: 1rem;
}

.remember-forgot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  color: #455a64;
}

.forgot-link {
  color: #1a237e;
  text-decoration: none;
  transition: color 0.3s ease;
  font-weight: 500;
}

.forgot-link:hover {
  color: #0d47a1;
}

.login-btn {
  background: linear-gradient(135deg, #1a237e 0%, #0d47a1 100%);
  color: white;
  padding: 1rem;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(26, 35, 126, 0.3);
}

.login-btn:disabled {
  background: #bdbdbd;
  cursor: not-allowed;
}

.signup-link {
  text-align: center;
  font-size: 0.95rem;
  color: #455a64;
  margin-top: 1rem;
}

.signup-link a {
  color: #1a237e;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.signup-link a:hover {
  color: #0d47a1;
  text-decoration: underline;
}

@media (max-width: 480px) {
  .login-box {
    padding: 2rem;
  }
  
  h2 {
    font-size: 1.75rem;
  }
  
  .logo {
    height: 100px;
  }
  
  input, .login-btn {
    padding: 0.875rem;
  }
}
</style>