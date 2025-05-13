<template>
  <div class="register-container">
    <nav class="nav-bar">
      <div class="nav-buttons">
        <router-link to="/register" class="nav-btn">← Back</router-link>
      </div>
    </nav>

    <div class="register-content">
      <div class="form-container">
        <h2>Create Client Account</h2>
        <p class="subtitle">Join ServiceLink to find the services you need</p>

        <div v-if="registrationSuccess" class="success-message">
          <div v-if="verificationSuccess">
            <h3>Account Verified!</h3>
            <p>Your account has been successfully verified.</p>
            <router-link to="/login" class="login-btn">Go to Login</router-link>
          </div>
          <div v-else>
            <h3>Registration Successful!</h3>
            <p>Please check your email for a 6-digit verification code.</p>
            
            <form @submit.prevent="handleVerify" class="verify-form">
              <div class="verification-code">
                <input 
                  v-model="verificationCode" 
                  type="text"
                  required
                  placeholder="Enter 6-digit code"
                  maxlength="6"
                  pattern="[0-9]{6}"
                  inputmode="numeric"
                />
              </div>
              
              <div v-if="verificationError" class="error-message">
                {{ verificationError }}
              </div>
              
              <button type="submit" :disabled="verifyLoading" class="verify-btn">
                {{ verifyLoading ? 'Verifying...' : 'Verify Account' }}
              </button>
              
              <p class="resend-code">
                Didn't receive code? 
                <button 
                  type="button" 
                  @click="resendCode" 
                  :disabled="resendLoading || resendCooldown > 0" 
                  class="resend-btn"
                >
                  {{ resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code' }}
                </button>
              </p>
            </form>
          </div>
        </div>

        <form v-else @submit.prevent="handleRegister" class="register-form">
          <div class="form-group">
            <input v-model="formData.firstName" type="text" required placeholder="First Name">
            <input v-model="formData.lastName" type="text" required placeholder="Last Name">
          </div>

          <input v-model="formData.email" type="email" required placeholder="Email Address">
          <input v-model="formData.phone" type="tel" placeholder="Phone Number (Optional)">
          
          <div class="password-field">
            <input 
              v-model="formData.password" 
              :type="showPassword ? 'text' : 'password'" 
              required 
              placeholder="Password"
              minlength="8"
            >
            <span 
              class="password-toggle" 
              @click="showPassword = !showPassword"
            >
              {{ showPassword ? '🙈' : '👁️' }}
            </span>
          </div>

          <input 
            v-model="formData.confirmPassword" 
            type="password" 
            required 
            placeholder="Confirm Password"
            minlength="8"
          >

          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>

          <button type="submit" :disabled="loading" class="register-btn">
            {{ loading ? 'Creating Account...' : 'Create Account' }}
          </button>
        </form>

        <p class="login-link">
          Already have an account? 
          <router-link to="/login">Sign In</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ClientRegister',
  data() {
    return {
      formData: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
      },
      showPassword: false,
      loading: false,
      errorMessage: '',
      registrationSuccess: false,
      apiBaseUrl: 'http://localhost:5500',
      registeredUserId: '',
      registeredEmail: '',
      verificationCode: '',
      verifyLoading: false,
      verificationError: '',
      verificationSuccess: false,
      resendLoading: false,
      resendCooldown: 0,
      resendTimer: null
    }
  },
  mounted() {
    // Check if API is reachable
    this.checkApiStatus();
  },
  beforeUnmount() {
    if (this.resendTimer) {
      clearInterval(this.resendTimer);
    }
  },
  methods: {
    async checkApiStatus() {
      try {
        const response = await fetch(`${this.apiBaseUrl}/api/health`, { 
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
          mode: 'cors',
          credentials: 'omit'
        });
        
        if (!response.ok) {
          console.warn('API health check failed:', response.status);
        }
      } catch (error) {
        console.warn('API appears to be unavailable:', error);
      }
    },
    
    async handleRegister() {
      // Reset error message
      this.errorMessage = '';
      
      // Validate passwords match
      if (this.formData.password !== this.formData.confirmPassword) {
        this.errorMessage = 'Passwords do not match!';
        return;
      }
      
      // Validate password strength (minimum 8 characters)
      if (this.formData.password.length < 8) {
        this.errorMessage = 'Password must be at least 8 characters long';
        return;
      }

      this.loading = true;
      
      try {
        const response = await fetch(`${this.apiBaseUrl}/api/client/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          mode: 'cors',
          credentials: 'omit',
          body: JSON.stringify({
            firstName: this.formData.firstName,
            lastName: this.formData.lastName,
            email: this.formData.email,
            phone: this.formData.phone || undefined, // Only send if it has a value
            password: this.formData.password
          })
        });

        // Handle network error
        if (!response) {
          throw new Error('Network error - unable to connect to the server');
        }

        // Try to parse response as JSON
        let data;
        try {
          data = await response.json();
        } catch (e) {
          throw new Error('Invalid response from server');
        }

        if (!response.ok) {
          throw new Error(data.message || 'Registration failed');
        }

        // Registration successful
        console.log('Registration successful:', data);
        this.registrationSuccess = true;
        
        // Store user ID and email for verification
        if (data.data && data.data.id) {
          this.registeredUserId = data.data.id;
        }
        this.registeredEmail = this.formData.email;
      } catch (error) {
        console.error('Registration error:', error);
        
        if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
          this.errorMessage = 'Cannot connect to the server. Please make sure the API server is running.';
        } else {
          this.errorMessage = error.message || 'Registration failed. Please try again.';
        }
      } finally {
        this.loading = false;
      }
    },

    async handleVerify() {
      if (!this.verificationCode || this.verificationCode.length !== 6) {
        this.verificationError = 'Please enter a valid 6-digit verification code';
        return;
      }

      this.verifyLoading = true;
      this.verificationError = '';

      try {
        const response = await fetch(`${this.apiBaseUrl}/api/verify-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          mode: 'cors',
          credentials: 'omit',
          body: JSON.stringify({
            email: this.registeredEmail,
            code: this.verificationCode
          })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Verification failed');
        }

        // Verification successful
        this.verificationSuccess = true;
      } catch (error) {
        console.error('Verification error:', error);
        this.verificationError = error.message || 'Failed to verify account. Please try again.';
      } finally {
        this.verifyLoading = false;
      }
    },

    async resendCode() {
      this.resendLoading = true;
      this.verificationError = '';

      try {
        const response = await fetch(`${this.apiBaseUrl}/api/resend-verification`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          mode: 'cors',
          credentials: 'omit',
          body: JSON.stringify({
            email: this.registeredEmail
          })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to resend code');
        }

        // Start cooldown timer
        this.resendCooldown = 60; // 60 seconds cooldown
        this.resendTimer = setInterval(() => {
          this.resendCooldown -= 1;
          if (this.resendCooldown <= 0 && this.resendTimer) {
            clearInterval(this.resendTimer);
          }
        }, 1000);
        
      } catch (error) {
        console.error('Resend error:', error);
        this.verificationError = error.message || 'Failed to resend verification code. Please try again.';
      } finally {
        this.resendLoading = false;
      }
    }
  }
}
</script>

<style scoped>
.register-container {
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

.register-content {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 80px);
  padding: 2rem;
}

.form-container {
  background: white;
  padding: 3rem;
  border-radius: 20px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
}

h2 {
  color: #2bad61;
  font-size: 2rem;
  margin-bottom: 0.5rem;
  text-align: center;
}

.subtitle {
  color: #666;
  text-align: center;
  margin-bottom: 2rem;
}

.register-form, .verify-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.success-message {
  text-align: center;
  padding: 2rem 0;
}

.success-message h3 {
  color: #2bad61;
  margin-bottom: 1rem;
}

.error-message {
  background-color: #ffebee;
  color: #c62828;
  padding: 0.75rem;
  border-radius: 4px;
  font-size: 0.9rem;
  text-align: center;
}

.form-group {
  display: flex;
  gap: 1rem;
}

input {
  padding: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  width: 100%;
}

input:focus {
  border-color: #2bad61;
  outline: none;
}

.verification-code input {
  font-size: 1.5rem;
  letter-spacing: 4px;
  text-align: center;
}

.password-field {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  user-select: none;
}

.register-btn, .login-btn, .verify-btn {
  background: #2bad61;
  color: white;
  padding: 1rem;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
  text-align: center;
  text-decoration: none;
  display: block;
}

.register-btn:hover, .login-btn:hover, .verify-btn:hover {
  background: #239d54;
}

.register-btn:disabled, .verify-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.login-link {
  text-align: center;
  margin-top: 1.5rem;
  color: #666;
}

.login-link a {
  color: #2bad61;
  text-decoration: none;
  font-weight: 600;
}

.login-link a:hover {
  text-decoration: underline;
}

.resend-code {
  margin-top: 1.5rem;
  font-size: 0.9rem;
  color: #7f857d;
}

.resend-btn {
  background: none;
  border: none;
  color: #2bad61;
  cursor: pointer;
  font-weight: 600;
  padding: 0;
  text-decoration: underline;
}

.resend-btn:disabled {
  color: #999;
  cursor: not-allowed;
  text-decoration: none;
}

@media (max-width: 600px) {
  .form-container {
    padding: 2rem;
  }

  .form-group {
    flex-direction: column;
  }

  h2 {
    font-size: 1.8rem;
  }
}
</style>
