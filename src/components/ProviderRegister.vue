<template>
  <div class="register-container">
    <nav class="nav-bar">
      <div class="nav-buttons">
        <router-link to="/register" class="nav-btn">← Back</router-link>
      </div>
    </nav>

    <div class="register-content">
      <div class="form-container">
        <h2>Create Provider Account</h2>
        <p class="subtitle">Join ServiceLink to grow your business</p>

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

        <div v-else>
          <!-- Progress bar -->
          <div class="progress-container">
            <div class="progress-bar">
              <div 
                class="progress-fill"
                :style="{ width: `${(currentStep / totalSteps) * 100}%` }"
              ></div>
            </div>
            <div class="progress-steps">
              <div 
                v-for="step in totalSteps" 
                :key="step" 
                class="progress-step"
                :class="{ 'active': step === currentStep, 'completed': step < currentStep }"
              >
                {{ step }}
              </div>
            </div>
            <p class="step-description">Step {{ currentStep }}: {{ stepDescriptions[currentStep-1] }}</p>
          </div>
          
          <form @submit.prevent="handleStepSubmit" class="register-form">
            <!-- Step 1: Personal Information -->
            <div v-if="currentStep === 1">
              <div class="section-title">Personal Information</div>
              <div class="form-group">
                <input v-model="formData.firstName" type="text" required placeholder="First Name">
                <input v-model="formData.lastName" type="text" required placeholder="Last Name">
              </div>

              <input v-model="formData.email" type="email" required placeholder="Email Address">
              <input v-model="formData.phone" type="tel" required placeholder="Phone Number">
            </div>
            
            <!-- Step 2: Business Information -->
            <div v-if="currentStep === 2">
              <div class="section-title">Business Information</div>
              <input v-model="formData.businessName" type="text" required placeholder="Business Name">
              <textarea v-model="formData.description" required placeholder="Describe your services (min 20 characters)" rows="3" minlength="20"></textarea>
              
              <div class="select-group">
                <select v-model="formData.serviceCategory" required>
                  <option value="" disabled selected>Select Service Category</option>
                  <option value="HOME_CLEANING">Home Cleaning</option>
                  <option value="PLUMBING">Plumbing</option>
                  <option value="ELECTRICAL">Electrical</option>
                  <option value="PAINTING">Painting</option>
                  <option value="GARDENING">Gardening</option>
                  <option value="CARPENTRY">Carpentry</option>
                  <option value="APPLIANCE_REPAIR">Appliance Repair</option>
                  <option value="ROOFING">Roofing</option>
                  <option value="HVAC">HVAC</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              
              <div class="form-group">
                <input v-model="formData.hourlyRate" type="number" min="0" step="0.01" required placeholder="Hourly Rate (PHP)">
                <input v-model="formData.yearsExperience" type="number" min="0" step="1" required placeholder="Years of Experience">
              </div>
            </div>
            
            <!-- Step 3: Verification & Documents -->
            <div v-if="currentStep === 3">
              <div class="section-title">Verification Documents</div>
              <p class="upload-instructions">Please upload documents that verify your identity and qualifications.</p>
              
              <div class="document-upload">
                <label>Profile Photo</label>
                <div 
                  class="upload-area"
                  @click="triggerFileInput('profilePhoto')"
                  @dragover.prevent="handleDragOver"
                  @drop.prevent="handleFileDrop($event, 'profilePhoto')"
                >
                  <div v-if="formData.profilePhotoPreview" class="preview-container">
                    <img :src="formData.profilePhotoPreview" class="image-preview" />
                    <button type="button" class="remove-image" @click.stop="removeImage('profilePhoto')">✕</button>
                  </div>
                  <div v-else class="upload-placeholder">
                    <span class="upload-icon">📷</span>
                    <span>Click or drag to upload photo</span>
                  </div>
                </div>
                <input 
                  type="file"
                  ref="profilePhotoInput"
                  @change="handleImageUpload($event, 'profilePhoto')"
                  accept="image/jpeg, image/png, image/jpg"
                  style="display: none"
                />
              </div>
              
              <div class="document-upload">
                <label>ID/License</label>
                <div 
                  class="upload-area"
                  @click="triggerFileInput('idLicense')"
                  @dragover.prevent="handleDragOver"
                  @drop.prevent="handleFileDrop($event, 'idLicense')"
                >
                  <div v-if="formData.idLicensePreview" class="preview-container">
                    <img :src="formData.idLicensePreview" class="image-preview" />
                    <button type="button" class="remove-image" @click.stop="removeImage('idLicense')">✕</button>
                  </div>
                  <div v-else class="upload-placeholder">
                    <span class="upload-icon">🪪</span>
                    <span>Click or drag to upload ID</span>
                  </div>
                </div>
                <input 
                  type="file"
                  ref="idLicenseInput"
                  @change="handleImageUpload($event, 'idLicense')"
                  accept="image/jpeg, image/png, image/jpg"
                  style="display: none"
                />
              </div>
              
              <div class="document-upload">
                <label>Certification/Portfolio (optional)</label>
                <div 
                  class="upload-area"
                  @click="triggerFileInput('certification')"
                  @dragover.prevent="handleDragOver"
                  @drop.prevent="handleFileDrop($event, 'certification')"
                >
                  <div v-if="formData.certificationPreview" class="preview-container">
                    <img :src="formData.certificationPreview" class="image-preview" />
                    <button type="button" class="remove-image" @click.stop="removeImage('certification')">✕</button>
                  </div>
                  <div v-else class="upload-placeholder">
                    <span class="upload-icon">📄</span>
                    <span>Click or drag to upload certification</span>
                  </div>
                </div>
                <input 
                  type="file"
                  ref="certificationInput"
                  @change="handleImageUpload($event, 'certification')"
                  accept="image/jpeg, image/png, image/jpg, application/pdf"
                  style="display: none"
                />
              </div>
            </div>
            
            <!-- Step 4: Security -->
            <div v-if="currentStep === 4">
              <div class="section-title">Account Security</div>
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

              <div class="terms-checkbox">
                <input type="checkbox" id="terms" v-model="formData.agreeToTerms" required>
                <label for="terms">I agree to the Terms of Service and Privacy Policy</label>
              </div>
            </div>

            <div v-if="errorMessage" class="error-message">
              {{ errorMessage }}
            </div>

            <div class="form-nav-buttons">
              <button 
                type="button" 
                v-if="currentStep > 1"
                @click="goToPreviousStep" 
                class="secondary-btn"
              >
                Previous
              </button>
              <button 
                type="submit" 
                :disabled="loading" 
                class="register-btn"
              >
                <span v-if="loading">Loading...</span>
                <span v-else-if="currentStep < totalSteps">Continue</span>
                <span v-else>Create Provider Account</span>
              </button>
            </div>
          </form>
        </div>

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
      currentStep: 1,
      totalSteps: 4,
      stepDescriptions: [
        'Personal Information',
        'Business Details',
        'Verification Documents',
        'Account Security'
      ],
      formData: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        businessName: '',
        description: '',
        serviceCategory: '',
        hourlyRate: null,
        yearsExperience: null,
        password: '',
        confirmPassword: '',
        agreeToTerms: false,
        profilePhoto: null,
        profilePhotoPreview: null,
        idLicense: null,
        idLicensePreview: null,
        certification: null,
        certificationPreview: null
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
    // Remove the health check to avoid 404 errors
  },
  beforeUnmount() {
    if (this.resendTimer) {
      clearInterval(this.resendTimer);
    }
  },
  methods: {
    handleStepSubmit() {
      this.errorMessage = '';
      
      // Validate current step
      if (!this.validateCurrentStep()) {
        return;
      }
      
      if (this.currentStep < this.totalSteps) {
        // Move to next step if not on the last step
        this.currentStep++;
      } else {
        // Submit the form if on the last step
        this.handleRegister();
      }
      
      // Scroll to top of form
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    
    goToPreviousStep() {
      if (this.currentStep > 1) {
        this.currentStep--;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    
    validateCurrentStep() {
      // Step 1: Personal Information
      if (this.currentStep === 1) {
        if (!this.formData.firstName) {
          this.errorMessage = 'First name is required';
          return false;
        }
        if (!this.formData.lastName) {
          this.errorMessage = 'Last name is required';
          return false;
        }
        if (!this.formData.email) {
          this.errorMessage = 'Email is required';
          return false;
        }
        if (!this.formData.phone) {
          this.errorMessage = 'Phone number is required';
          return false;
        }
      }
      
      // Step 2: Business Information
      if (this.currentStep === 2) {
        if (!this.formData.businessName) {
          this.errorMessage = 'Business name is required';
          return false;
        }
        if (!this.formData.description || this.formData.description.length < 20) {
          this.errorMessage = 'Service description must be at least 20 characters long';
          return false;
        }
        if (!this.formData.serviceCategory) {
          this.errorMessage = 'Please select a service category';
          return false;
        }
        if (!this.formData.hourlyRate) {
          this.errorMessage = 'Hourly rate is required';
          return false;
        }
        if (this.formData.yearsExperience === null || this.formData.yearsExperience === undefined) {
          this.errorMessage = 'Years of experience is required';
          return false;
        }
      }
      
      // Step 3: Verification Documents
      if (this.currentStep === 3) {
        if (!this.formData.profilePhoto) {
          this.errorMessage = 'Profile photo is required';
          return false;
        }
        if (!this.formData.idLicense) {
          this.errorMessage = 'ID/License photo is required';
          return false;
        }
        // Certification is optional
      }
      
      // Step 4: Security
      if (this.currentStep === 4) {
        if (!this.formData.password) {
          this.errorMessage = 'Password is required';
          return false;
        }
        if (this.formData.password.length < 8) {
          this.errorMessage = 'Password must be at least 8 characters long';
          return false;
        }
        if (this.formData.password !== this.formData.confirmPassword) {
          this.errorMessage = 'Passwords do not match';
          return false;
        }
        if (!this.formData.agreeToTerms) {
          this.errorMessage = 'You must agree to the Terms of Service';
          return false;
        }
      }
      
      return true;
    },
    
    triggerFileInput(type) {
      this.$refs[`${type}Input`].click();
    },
    
    handleDragOver(event) {
      event.target.classList.add('drag-over');
    },
    
    handleFileDrop(event, type) {
      event.target.classList.remove('drag-over');
      if (event.dataTransfer.files.length) {
        const file = event.dataTransfer.files[0];
        this.processFile(file, type);
      }
    },
    
    handleImageUpload(event, type) {
      const file = event.target.files[0];
      if (file) {
        this.processFile(file, type);
      }
    },
    
    processFile(file, type) {
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.errorMessage = 'File is too large. Maximum size is 5MB.';
        return;
      }
      
      // Create a preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.formData[`${type}`] = file;
        this.formData[`${type}Preview`] = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    
    removeImage(type) {
      this.formData[`${type}`] = null;
      this.formData[`${type}Preview`] = null;
      this.$refs[`${type}Input`].value = null;
    },
    
    async handleRegister() {
      this.loading = true;
      
      try {
        // Debug the form data
        console.log('Submitting registration with data:', {
          firstName: this.formData.firstName,
          lastName: this.formData.lastName,
          email: this.formData.email,
          phone: this.formData.phone,
          password: this.formData.password,
          businessName: this.formData.businessName,
          description: this.formData.description,
          serviceCategory: this.formData.serviceCategory,
          hourlyRate: parseFloat(this.formData.hourlyRate),
          yearsExperience: parseInt(this.formData.yearsExperience)
        });

        // First submit basic info (without files) as JSON
        const response = await fetch(`${this.apiBaseUrl}/api/provider/register`, {
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
            phone: this.formData.phone,
            password: this.formData.password,
            businessName: this.formData.businessName,
            description: this.formData.description,
            serviceCategory: this.formData.serviceCategory,
            hourlyRate: parseFloat(this.formData.hourlyRate),
            yearsExperience: parseInt(this.formData.yearsExperience)
          })
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

        // If initial registration succeeded, upload the images if needed
        // Store user ID and email for verification
        if (data.data && data.data.id) {
          this.registeredUserId = data.data.id;
          
          // Upload profile photo if available
          if (this.formData.profilePhoto) {
            await this.uploadProviderDocument('profilePhoto', this.formData.profilePhoto, data.data.id);
          }
          
          // Upload ID/License if available
          if (this.formData.idLicense) {
            await this.uploadProviderDocument('idLicense', this.formData.idLicense, data.data.id);
          }
          
          // Upload certification if available
          if (this.formData.certification) {
            await this.uploadProviderDocument('certification', this.formData.certification, data.data.id);
          }
        }
        
        // Store email for verification
        this.registeredEmail = this.formData.email;
        
        // Registration successful
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

    // Helper method to upload provider documents
    async uploadProviderDocument(documentType, file, providerId) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('documentType', documentType);
        formData.append('providerId', providerId);
        
        const uploadResponse = await fetch(`${this.apiBaseUrl}/api/provider/document-upload`, {
          method: 'POST',
          body: formData,
          mode: 'cors',
          credentials: 'omit'
        });
        
        if (!uploadResponse.ok) {
          console.error(`Failed to upload ${documentType}`);
        }
      } catch (error) {
        console.error(`Error uploading ${documentType}:`, error);
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
  border-radius: 20px;
  width: 100%;
  max-width: 600px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
}

h2 {
  color: #1a237e;
  font-size: 2rem;
  margin-bottom: 0.5rem;
  text-align: center;
}

.subtitle {
  color: #666;
  text-align: center;
  margin-bottom: 2rem;
}

.progress-container {
  margin-bottom: 2rem;
}

.progress-bar {
  height: 8px;
  background-color: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 1rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(to right, #1a237e, #0d47a1);
  transition: width 0.3s ease;
}

.progress-steps {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.progress-step {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #e0e0e0;
  color: #666;
  font-weight: bold;
  transition: all 0.3s ease;
}

.progress-step.active {
  background-color: #1a237e;
  color: white;
  transform: scale(1.1);
}

.progress-step.completed {
  background-color: #0d47a1;
  color: white;
}

.step-description {
  text-align: center;
  color: #1a237e;
  font-weight: 600;
  margin-top: 0.5rem;
}

.register-form, .verify-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.section-title {
  color: #1a237e;
  font-weight: 600;
  margin-top: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e0e0e0;
}

.success-message {
  text-align: center;
  padding: 2rem 0;
}

.success-message h3 {
  color: #1a237e;
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

input, textarea, select {
  padding: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  width: 100%;
}

input:focus, textarea:focus, select:focus {
  border-color: #1a237e;
  outline: none;
}

.select-group select {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1em;
}

.verification-code input {
  font-size: 1.5rem;
  letter-spacing: 4px;
  text-align: center;
}

.document-upload {
  margin-bottom: 1.5rem;
}

.document-upload label {
  display: block;
  margin-bottom: 0.5rem;
  color: #455a64;
  font-weight: 500;
}

.upload-instructions {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.upload-area {
  border: 2px dashed #c5cae9;
  border-radius: 8px;
  padding: 2rem 1rem;
  cursor: pointer;
  text-align: center;
  transition: all 0.3s ease;
  background-color: #f5f5f5;
}

.upload-area:hover {
  border-color: #1a237e;
  background-color: #e8eaf6;
}

.upload-area.drag-over {
  border-color: #1a237e;
  background-color: #e8eaf6;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: #666;
}

.upload-icon {
  font-size: 2rem;
}

.preview-container {
  position: relative;
}

.image-preview {
  max-width: 100%;
  max-height: 200px;
  border-radius: 4px;
}

.remove-image {
  position: absolute;
  top: -10px;
  right: -10px;
  background: #c62828;
  color: white;
  border: none;
  border-radius: 50%;
  width: 25px;
  height: 25px;
  font-size: 0.8rem;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
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

.terms-checkbox {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}

.terms-checkbox input {
  width: auto;
  margin-top: 0.25rem;
}

.form-nav-buttons {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1rem;
}

.register-btn, .login-btn, .verify-btn, .secondary-btn {
  padding: 1rem;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  text-decoration: none;
  display: block;
}

.register-btn, .login-btn, .verify-btn {
  background: linear-gradient(135deg, #1a237e 0%, #0d47a1 100%);
  color: white;
  flex-grow: 1;
}

.secondary-btn {
  background-color: #e0e0e0;
  color: #455a64;
}

.register-btn:hover, .login-btn:hover, .verify-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(26, 35, 126, 0.3);
}

.secondary-btn:hover {
  background-color: #d5d5d5;
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

  .form-group {
    flex-direction: column;
  }

  h2 {
    font-size: 1.8rem;
  }
}
</style>
