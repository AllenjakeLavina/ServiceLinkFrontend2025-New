<template>
  <div class="register-container">
    <nav class="nav-bar">
      <div class="nav-buttons">
        <router-link to="/register" class="nav-btn">← Back</router-link>
      </div>
    </nav>

    <div class="register-content">
      <div class="form-container">
        <h2>Provider Registration</h2>

        <div v-if="registrationSuccess" class="success-message">
          <div v-if="verificationSuccess">
            <h3>Account Verified!</h3>
            <p>Your account has been successfully verified. Your ID document will be reviewed by our administrators.</p>
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

        <form v-else @submit.prevent="handleRegister" class="register-form" enctype="multipart/form-data">
          <div class="form-group">
            <label for="email">Email:</label>
            <input v-model="formData.email" type="email" id="email" required>
          </div>
          
              <div class="form-group">
            <label for="password">Password:</label>
              <div class="password-field">
                <input 
                  v-model="formData.password" 
                  :type="showPassword ? 'text' : 'password'" 
                id="password"
                  required 
                >
                <span 
                  class="password-toggle" 
                  @click="showPassword = !showPassword"
                >
                  {{ showPassword ? '🙈' : '👁️' }}
                </span>
            </div>
              </div>

          <div class="form-group">
            <label for="firstName">First Name:</label>
            <input v-model="formData.firstName" type="text" id="firstName" required>
              </div>

          <div class="form-group">
            <label for="lastName">Last Name:</label>
            <input v-model="formData.lastName" type="text" id="lastName" required>
              </div>

          <div class="form-group">
            <label for="phone">Phone Number:</label>
            <input v-model="formData.phone" type="tel" id="phone">
              </div>

          <div class="form-group">
            <label for="idDocument">ID Document (required for verification):</label>
              <input 
              type="file" 
              id="idDocument" 
              ref="idDocumentInput"
              @change="handleFileChange" 
              class="file-input"
              accept=".jpg,.jpeg,.png,.pdf"
                required 
            >
            <small>Please upload a government-issued ID document. This will be reviewed by our administrators.</small>
            </div>

            <div v-if="errorMessage" class="error-message">
              {{ errorMessage }}
            </div>

          <button type="submit" class="register-btn" :disabled="loading">
            {{ loading ? 'Registering...' : 'Register' }}
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
  name: 'ProviderRegister',
  data() {
    return {
      formData: {
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phone: '',
        idDocument: null
      },
      showPassword: false,
      loading: false,
      errorMessage: '',
      registrationSuccess: false,
      apiBaseUrl: 'http://localhost:5500',
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
  beforeUnmount() {
    if (this.resendTimer) {
      clearInterval(this.resendTimer);
    }
  },
  methods: {
    handleFileChange(event) {
      this.formData.idDocument = event.target.files[0];
    },
    
    async handleRegister() {
      this.loading = true;
      this.errorMessage = '';
      
      // Validate form
      if (!this.formData.email || !this.formData.password || !this.formData.firstName || 
          !this.formData.lastName || !this.formData.idDocument) {
        this.errorMessage = 'Please fill in all required fields.';
        this.loading = false;
        return;
      }
      
      try {
        const formData = new FormData();
        formData.append('email', this.formData.email);
        formData.append('password', this.formData.password);
        formData.append('firstName', this.formData.firstName);
        formData.append('lastName', this.formData.lastName);
        if (this.formData.phone) {
          formData.append('phone', this.formData.phone);
        }
        formData.append('idDocument', this.formData.idDocument);
        
        // Debug what's being sent
        console.log('Submitting provider registration:', {
          email: this.formData.email,
          firstName: this.formData.firstName,
          lastName: this.formData.lastName,
          phone: this.formData.phone,
          idDocument: this.formData.idDocument ? this.formData.idDocument.name : 'No file'
        });

        const response = await fetch(`${this.apiBaseUrl}/api/provider/register`, {
          method: 'POST',
          body: formData,
          mode: 'cors'
        });

        // Try to parse response as JSON
        let data;
        try {
          data = await response.json();
          console.log('Registration response:', data);
        } catch (e) {
          throw new Error('Invalid response from server');
        }

        if (!response.ok) {
          throw new Error(data.message || 'Registration failed');
        }
        
        // Store email for verification
        this.registeredEmail = this.formData.email;
        
        // Registration successful, show verification code input
        this.registrationSuccess = true;
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
  background: linear-gradient(135deg, #1a237e 0%, #0d47a1 100%);
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
  border-radius: 10px;
  width: 100%;
  max-width: 600px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

h2 {
  color: #333;
  font-size: 1.75rem;
  margin-bottom: 1.5rem;
  text-align: center;
}

.register-form, .verify-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #333;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 1rem;
}

input:focus {
  outline: none;
  border-color: #1a237e;
}

.file-input {
  border: none;
  padding: 0;
}

small {
  color: #666;
  font-size: 0.85rem;
  display: block;
  margin-top: 5px;
}

.verification-code input {
  font-size: 1.5rem;
  letter-spacing: 4px;
  text-align: center;
  padding: 15px;
}

.password-field {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  user-select: none;
}

.success-message {
  text-align: center;
  padding: 2rem 0;
}

.success-message h3 {
  color: #4CAF50;
  margin-bottom: 1rem;
}

.error-message {
  background-color: #ffebee;
  color: #c62828;
  padding: 0.75rem;
  border-radius: 4px;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.register-btn, .login-btn, .verify-btn {
  background: #4CAF50;
  color: white;
  border: none;
  padding: 12px 15px;
  cursor: pointer;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  width: 100%;
  transition: background-color 0.3s ease;
  text-align: center;
  text-decoration: none;
  display: block;
}

.register-btn:hover, .login-btn:hover, .verify-btn:hover {
  background: #45a049;
}

.register-btn:disabled, .verify-btn:disabled {
  background: #cccccc;
  cursor: not-allowed;
}

.login-link {
  text-align: center;
  margin-top: 1.5rem;
  color: #666;
}

.login-link a {
  color: #1a237e;
  text-decoration: none;
  font-weight: 600;
}

.login-link a:hover {
  text-decoration: underline;
}

.resend-code {
  margin-top: 1.5rem;
  font-size: 0.9rem;
  color: #666;
  text-align: center;
}

.resend-btn {
  background: none;
  border: none;
  color: #1a237e;
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

  h2 {
    font-size: 1.5rem;
  }
}
</style>

