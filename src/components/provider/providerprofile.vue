<template>
  <div class="provider-profile-container">
    <!-- Profile Completion Progress -->
    <div class="profile-completion-card" v-if="showCompletionGuide">
      <div class="completion-content">
        <div class="completion-header">
          <div class="completion-title">
            <h2>Complete Your Profile</h2>
            <span class="completion-percentage">{{ profileCompletionPercentage }}%</span>
          </div>
          <p>Create a standout profile to attract clients and grow your business</p>
    </div>

        <div class="progress-container">
          <div class="progress-bar">
            <div class="progress-filled" :style="{ width: profileCompletionPercentage + '%' }"></div>
            </div>
          </div>
        
        <div class="completion-steps">
          <div class="step" 
               :class="{ 'completed': isBasicProfileComplete, 'active': currentTab === 'profile' }"
               @click="currentTab = 'profile'">
            <div class="step-icon">
              <span v-if="isBasicProfileComplete">✓</span>
              <span v-else>1</span>
            </div>
            <div class="step-details">
              <div class="step-label">Basic Info</div>
              <div class="step-status">{{ isBasicProfileComplete ? 'Completed' : 'Incomplete' }}</div>
          </div>
            </div>
          
          <div class="step" 
               :class="{ 'completed': experiences.length > 0, 'active': currentTab === 'experience' }"
               @click="currentTab = 'experience'">
            <div class="step-icon">
              <span v-if="experiences.length > 0">✓</span>
              <span v-else>2</span>
          </div>
            <div class="step-details">
              <div class="step-label">Experience</div>
              <div class="step-status">{{ experiences.length > 0 ? `${experiences.length} added` : 'Required' }}</div>
            </div>
          </div>
          
          <div class="step" 
               :class="{ 'completed': educations.length > 0, 'active': currentTab === 'education' }"
               @click="currentTab = 'education'">
            <div class="step-icon">
              <span v-if="educations.length > 0">✓</span>
              <span v-else>3</span>
            </div>
            <div class="step-details">
              <div class="step-label">Education</div>
              <div class="step-status">{{ educations.length > 0 ? `${educations.length} added` : 'Optional' }}</div>
          </div>
            </div>
          
          <div class="step" 
               :class="{ 'completed': skills.length > 0, 'active': currentTab === 'skills' }"
               @click="currentTab = 'skills'">
            <div class="step-icon">
              <span v-if="skills.length > 0">✓</span>
              <span v-else>4</span>
          </div>
            <div class="step-details">
              <div class="step-label">Skills</div>
              <div class="step-status">{{ skills.length > 0 ? `${skills.length} added` : 'Required' }}</div>
            </div>
          </div>
          
          <div class="step" 
               :class="{ 'completed': services.length > 0, 'active': currentTab === 'services' }"
               @click="currentTab = 'services'">
            <div class="step-icon">
              <span v-if="services.length > 0">✓</span>
              <span v-else>5</span>
        </div>
            <div class="step-details">
              <div class="step-label">Services</div>
              <div class="step-status">{{ services.length > 0 ? `${services.length} added` : 'Required' }}</div>
      </div>
          </div>
        </div>
      </div>
      <button class="close-guide-btn" @click="hideCompletionGuide">×</button>
    </div>

    <div class="profile-main">
      <div class="profile-header">
        <h1>Professional Profile</h1>
        <p class="subtitle">Build a comprehensive profile to showcase your expertise and stand out to potential clients.</p>
        
        <div class="profile-tabs">
          <div class="tab" 
               :class="{ 'active': currentTab === 'profile' }"
               @click="currentTab = 'profile'">
            <i class="tab-icon">👤</i>
            <span>Basic Info</span>
          </div>
          <div class="tab" 
               :class="{ 'active': currentTab === 'experience' }"
               @click="currentTab = 'experience'">
            <i class="tab-icon">💼</i>
            <span>Experience</span>
          </div>
          <div class="tab" 
               :class="{ 'active': currentTab === 'education' }"
               @click="currentTab = 'education'">
            <i class="tab-icon">🎓</i>
            <span>Education</span>
          </div>
          <div class="tab" 
               :class="{ 'active': currentTab === 'skills' }"
               @click="currentTab = 'skills'">
            <i class="tab-icon">⚡</i>
            <span>Skills</span>
          </div>
          <div class="tab" 
               :class="{ 'active': currentTab === 'portfolio' }"
               @click="currentTab = 'portfolio'">
            <i class="tab-icon">🖼️</i>
            <span>Portfolio</span>
          </div>
          <div class="tab" 
               :class="{ 'active': currentTab === 'documents' }"
               @click="currentTab = 'documents'">
            <i class="tab-icon">📄</i>
            <span>Documents</span>
          </div>
          <div class="tab" 
               :class="{ 'active': currentTab === 'services' }"
               @click="currentTab = 'services'">
            <i class="tab-icon">🛠️</i>
            <span>Services</span>
          </div>
            </div>
          </div>
          
      <div class="profile-content">
        <!-- Profile Tab -->
        <div v-if="currentTab === 'profile'" class="tab-content">
          <div class="section-header">
            <h2>Basic Information</h2>
            <p>This information will be visible to clients and helps them decide whether to hire you.</p>
            </div>

          <div class="form-card">
            <div class="alert info" v-if="!isBasicProfileComplete">
              <i class="alert-icon">ℹ️</i>
              <p>Complete all required fields to continue with your profile setup.</p>
          </div>
            
            <div class="form-grid">
              <div class="form-group">
                <label>First Name <span class="required">*</span></label>
                <input type="text" v-model="profile.firstName" placeholder="Your first name">
            </div>
              
              <div class="form-group">
                <label>Last Name <span class="required">*</span></label>
                <input type="text" v-model="profile.lastName" placeholder="Your last name">
          </div>
              
              <div class="form-group">
                <label>Phone Number <span class="required">*</span></label>
                <input type="text" v-model="profile.phone" placeholder="Your contact number">
            </div>
              
              <div class="form-group">
                <label>Professional Headline</label>
                <input type="text" v-model="profile.headline" placeholder="e.g. Experienced Web Developer with 5+ years">
                <span class="help-text">A short headline that appears under your name</span>
          </div>
              
              <div class="form-group full-width">
                <label>Bio <span class="required">*</span></label>
                <textarea v-model="profile.bio" placeholder="Tell clients about yourself, your experience, and your work style"></textarea>
                <span class="help-text">Minimum 100 characters recommended</span>
            </div>
              
              <div class="form-group">
                <label>Hourly Rate ($)</label>
                <input type="number" v-model="profile.hourlyRate" min="0" step="0.01" placeholder="Your standard hourly rate">
                <span class="help-text">You can set different rates for individual services</span>
          </div>
            </div>
            
            <div class="form-actions">
              <button class="btn primary" @click="updateProfile">
                <i class="btn-icon">💾</i> Save Profile
              </button>
              <button v-if="isBasicProfileComplete && nextIncompleteSection" 
                      class="btn secondary" 
                      @click="currentTab = nextIncompleteSection">
                Continue to {{ nextIncompleteSection.charAt(0).toUpperCase() + nextIncompleteSection.slice(1) }} <i class="btn-icon">→</i>
              </button>
          </div>
            </div>
          </div>

        <!-- Experience Tab -->
        <div v-if="currentTab === 'experience'" class="tab-content">
          <div class="section-header">
            <h2>Work Experience</h2>
            <p>Add your professional experience to showcase your background to potential clients.</p>
            </div>

          <div class="form-card">
            <div class="alert info" v-if="experiences.length === 0">
              <i class="alert-icon">ℹ️</i>
              <p>Adding work experience helps clients trust your professional background.</p>
          </div>
            
            <div v-if="experiences.length > 0" class="items-list">
              <div v-for="(exp, index) in experiences" :key="index" class="item">
                <div class="item-content">
                  <div class="item-header">
                    <h3>{{ exp.position }}</h3>
                    <span class="item-subtitle">{{ exp.company }}</span>
        </div>
                  <div class="item-details">
                    <span class="item-date">{{ formatDate(exp.startDate) }} - {{ exp.isCurrentPosition ? 'Present' : formatDate(exp.endDate) }}</span>
                    <p class="item-description">{{ exp.description }}</p>
                  </div>
                </div>
                <button class="btn danger small" @click="removeExperience(index)">
                  <i class="btn-icon">🗑️</i>
                </button>
      </div>
    </div>

            <div class="form-divider" v-if="experiences.length > 0">
              <span>Add Another Experience</span>
            </div>
            
            <div class="form-grid">
              <div class="form-group">
                <label>Company <span class="required">*</span></label>
                <input type="text" v-model="newExperience.company" placeholder="Company name">
            </div>
              
              <div class="form-group">
                <label>Position <span class="required">*</span></label>
                <input type="text" v-model="newExperience.position" placeholder="Your job title">
          </div>
          
              <div class="form-group">
                <label>Start Date <span class="required">*</span></label>
                <input type="date" v-model="newExperience.startDate">
            </div>
              
              <div class="form-group">
                <label>End Date</label>
                <input type="date" v-model="newExperience.endDate" :disabled="newExperience.isCurrentPosition">
                <div class="checkbox-container">
                  <input type="checkbox" id="current-position" v-model="newExperience.isCurrentPosition">
                  <label for="current-position">I currently work here</label>
          </div>
            </div>
              
              <div class="form-group full-width">
                <label>Description <span class="required">*</span></label>
                <textarea v-model="newExperience.description" placeholder="Describe your responsibilities and achievements"></textarea>
          </div>
            </div>
            
            <div class="form-actions">
              <button class="btn primary" @click="addExperience">
                <i class="btn-icon">➕</i> Add Experience
              </button>
              <button v-if="experiences.length > 0 && nextIncompleteSection && nextIncompleteSection !== 'experience'" 
                      class="btn secondary" 
                      @click="currentTab = nextIncompleteSection">
                Continue to {{ nextIncompleteSection.charAt(0).toUpperCase() + nextIncompleteSection.slice(1) }} <i class="btn-icon">→</i>
              </button>
          </div>
            </div>
          </div>

        <!-- Education Tab -->
        <div v-if="currentTab === 'education'" class="tab-content">
          <div class="section-header">
            <h2>Education</h2>
            <p>Add your educational background to showcase your skills and achievements.</p>
            </div>

          <div class="form-card">
            <div class="alert info" v-if="educations.length === 0">
              <i class="alert-icon">ℹ️</i>
              <p>Adding education helps clients trust your professional background.</p>
          </div>
            
            <div v-if="educations.length > 0" class="items-list">
              <div v-for="(edu, index) in educations" :key="index" class="item">
                <div class="item-content">
                  <div class="item-header">
                    <h3>{{ edu.degree }} in {{ edu.fieldOfStudy }}</h3>
                    <span class="item-subtitle">{{ edu.institution }}</span>
            </div>
                  <div class="item-details">
                    <span class="item-date">{{ formatDate(edu.startDate) }} - {{ edu.isCurrentlyStudying ? 'Present' : formatDate(edu.endDate) }}</span>
          </div>
            </div>
                <button class="btn danger small" @click="removeEducation(index)">
                  <i class="btn-icon">🗑️</i>
                </button>
          </div>
        </div>
            
            <div class="form-divider" v-if="educations.length > 0">
              <span>Add Another Education</span>
            </div>
            
            <div class="form-grid">
              <div class="form-group">
                <label>Institution <span class="required">*</span></label>
                <input type="text" v-model="newEducation.institution" placeholder="School/University name">
              </div>
              
              <div class="form-group">
                <label>Degree <span class="required">*</span></label>
                <input type="text" v-model="newEducation.degree" placeholder="Degree">
              </div>
              
              <div class="form-group">
                <label>Field of Study <span class="required">*</span></label>
                <input type="text" v-model="newEducation.fieldOfStudy" placeholder="Field of study">
              </div>
              
              <div class="form-group">
                <label>Start Date <span class="required">*</span></label>
                <input type="date" v-model="newEducation.startDate">
              </div>
              
              <div class="form-group">
                <label>End Date</label>
                <input type="date" v-model="newEducation.endDate" :disabled="newEducation.isCurrentlyStudying">
                <div class="checkbox-container">
                  <input type="checkbox" id="currently-studying" v-model="newEducation.isCurrentlyStudying">
                  <label for="currently-studying">I am currently studying here</label>
                </div>
              </div>
            </div>
            
            <div class="form-actions">
              <button class="btn primary" @click="addEducation">
                <i class="btn-icon">➕</i> Add Education
              </button>
            </div>
      </div>
    </div>

    <!-- Skills Tab -->
    <div v-if="currentTab === 'skills'" class="tab-content">
          <div class="section-header">
            <h2>Skills</h2>
            <p>Add your professional skills to showcase your expertise and capabilities.</p>
          </div>

          <div class="form-card">
            <div class="alert info" v-if="skills.length === 0">
              <i class="alert-icon">ℹ️</i>
              <p>Adding skills helps clients understand your capabilities and expertise.</p>
          </div>
          
            <div v-if="skills.length > 0" class="items-list">
              <div v-for="(skill, index) in skills" :key="index" class="item">
                <div class="item-content">
                  <div class="item-header">
                    <h3>{{ skill.skillName }}</h3>
            </div>
            </div>
                <button class="btn danger small" @click="removeSkill(index)">
                  <i class="btn-icon">🗑️</i>
                </button>
          </div>
        </div>
            
            <div class="form-divider" v-if="skills.length > 0">
              <span>Add Another Skill</span>
            </div>
            
            <div class="form-grid">
              <div class="form-group">
                <label>Skill Name <span class="required">*</span></label>
                <input type="text" v-model="newSkill.skillName" placeholder="e.g. Web Development">
      </div>
    </div>

            <div class="form-actions">
              <button class="btn primary" @click="addSkill">
                <i class="btn-icon">➕</i> Add Skill
              </button>
              </div>
            </div>
          </div>
          
        <!-- Portfolio Tab -->
        <div v-if="currentTab === 'portfolio'" class="tab-content">
          <div class="section-header">
            <h2>Portfolio</h2>
            <p>Add your projects and work samples to showcase your skills and achievements.</p>
            </div>

          <div class="form-card">
            <div class="alert info" v-if="portfolioItems.length === 0">
              <i class="alert-icon">ℹ️</i>
              <p>Adding projects helps clients understand your capabilities and experience.</p>
          </div>
            
            <div v-if="portfolioItems.length > 0" class="items-list">
              <div v-for="(item, index) in portfolioItems" :key="index" class="item">
                <div class="item-content">
                  <div class="item-header">
                    <h3>{{ item.title }}</h3>
            </div>
                  <div class="item-details">
                    <p class="item-description">{{ item.description }}</p>
          </div>
            </div>
                <button class="btn danger small" @click="removePortfolioItem(index)">
                  <i class="btn-icon">🗑️</i>
                </button>
          </div>
            </div>
            
            <div class="form-divider" v-if="portfolioItems.length > 0">
              <span>Add Another Project</span>
          </div>
            
            <div class="form-grid">
              <div class="form-group">
                <label>Title <span class="required">*</span></label>
                <input type="text" v-model="newPortfolio.title" placeholder="Project title">
            </div>
              
              <div class="form-group">
                <label>Description</label>
                <textarea v-model="newPortfolio.description" placeholder="Project description"></textarea>
          </div>
        </div>
            
            <div class="form-actions">
              <button class="btn primary" @click="addPortfolio">
                <i class="btn-icon">➕</i> Add Project
              </button>
        </div>
      </div>
    </div>

    <!-- Documents Tab -->
    <div v-if="currentTab === 'documents'" class="tab-content">
          <div class="section-header">
            <h2>Documents</h2>
            <p>Add your relevant documents to showcase your qualifications and certifications.</p>
          </div>

          <div class="form-card">
            <div class="alert info" v-if="documents.length === 0">
              <i class="alert-icon">ℹ️</i>
              <p>Adding documents helps clients trust your professional background.</p>
                </div>
            
            <div v-if="documents.length > 0" class="items-list">
              <div v-for="(doc, index) in documents" :key="index" class="item">
                <div class="item-content">
                  <div class="item-header">
                    <h3>{{ doc.title }}</h3>
                    <span class="item-subtitle">{{ doc.type }}</span>
              </div>
                </div>
                <button class="btn danger small" @click="removeDocument(index)">
                  <i class="btn-icon">🗑️</i>
                </button>
            </div>
          </div>
          
            <div class="form-divider" v-if="documents.length > 0">
              <span>Add Another Document</span>
            </div>
            
            <div class="form-grid">
              <div class="form-group">
                <label>Title <span class="required">*</span></label>
                <input type="text" v-model="newDocument.title" placeholder="Document title">
          </div>
              
              <div class="form-group">
                <label>Document Type <span class="required">*</span></label>
                <select v-model="newDocument.type">
                  <option value="ID">ID</option>
                  <option value="CERTIFICATE">Certificate</option>
                  <option value="LICENSE">License</option>
                  <option value="RESUME">Resume</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>
            
            <div class="form-actions">
              <button class="btn primary" @click="addDocument">
                <i class="btn-icon">➕</i> Add Document
              </button>
          </div>
      </div>
    </div>

    <!-- Services Tab -->
    <div v-if="currentTab === 'services'" class="tab-content">
          <div class="section-header">
            <h2>Services</h2>
            <p>Create service listings that clients can book. Be detailed about what you offer.</p>
          </div>

          <div class="form-card">
            <div class="alert info" v-if="services.length === 0">
              <i class="alert-icon">ℹ️</i>
              <p>Creating services is essential - this is what clients will book and pay for.</p>
                </div>
            
            <div v-if="services.length > 0" class="items-list">
              <div v-for="(service, index) in services" :key="index" class="item service-item">
                <div class="item-content">
                  <div class="item-header">
                    <h3>{{ service.title }}</h3>
                    <span class="item-price">${{ service.pricing }} {{ service.pricingType.toLowerCase() }}</span>
              </div>
                  <div class="item-details">
                    <span class="category-badge">{{ getCategoryName(service.categoryId) }}</span>
                    <p class="item-description">{{ service.description }}</p>
            </div>
          </div>
                <button class="btn danger small" @click="removeService(index)">
                  <i class="btn-icon">🗑️</i>
                </button>
            </div>
          </div>
            
            <div class="form-divider" v-if="services.length > 0">
              <span>Add Another Service</span>
            </div>
            
            <button class="btn secondary" @click="loadCategories" style="margin-bottom: 20px;">
              <i class="btn-icon">🔄</i> Load Categories
            </button>
            
            <div class="form-grid">
              <div class="form-group">
                <label>Service Title <span class="required">*</span></label>
                <input type="text" v-model="newService.title" placeholder="e.g. Website Development">
          </div>
              
              <div class="form-group">
                <label>Category <span class="required">*</span></label>
                <select v-model="newService.categoryId">
                  <option value="">Select a category</option>
                  <option v-for="category in categories" :key="category.id" :value="category.id">
                    {{ category.name }}
                  </option>
                </select>
              </div>
              
              <div class="form-group">
                <label>Price <span class="required">*</span></label>
                <div class="price-input">
                  <span class="currency-symbol">$</span>
                  <input type="number" v-model="newService.pricing" min="0" step="0.01" placeholder="0.00">
            </div>
          </div>
              
              <div class="form-group">
                <label>Pricing Type <span class="required">*</span></label>
                <select v-model="newService.pricingType">
                  <option value="HOURLY">Per Hour</option>
                  <option value="FIXED">Fixed Price</option>
                  <option value="DAILY">Per Day</option>
                  <option value="SESSION">Per Session</option>
                </select>
              </div>
              
              <div class="form-group full-width">
                <label>Description <span class="required">*</span></label>
                <textarea v-model="newService.description" placeholder="Describe what's included in this service, deliverables, timeframe, etc."></textarea>
            </div>
          </div>
            
            <div class="form-actions">
              <button class="btn primary" @click="addService">
                <i class="btn-icon">➕</i> Create Service
              </button>
          </div>
        </div>
      </div>
    </div>

      <div class="profile-submission" v-if="profileCompletionPercentage >= 60">
        <div class="submission-card">
          <div class="submission-content">
            <div>
              <h3>Ready to submit your profile?</h3>
              <p>Once submitted, we'll review your profile and approve it to start receiving client requests.</p>
        </div>
            <button class="btn success large" 
                    @click="submitProfile" 
                    :disabled="!isProfileReadyForSubmission">
              Submit for Approval
            </button>
          </div>
          <div class="submission-requirements" v-if="!isProfileReadyForSubmission">
            <h4>Before submitting, please complete:</h4>
            <ul>
              <li :class="{ 'completed': isBasicProfileComplete }">
                <span v-if="isBasicProfileComplete">✓</span>
                <span v-else>○</span>
                Basic Profile Information
              </li>
              <li :class="{ 'completed': experiences.length > 0 }">
                <span v-if="experiences.length > 0">✓</span>
                <span v-else>○</span>
                At least one Work Experience
              </li>
              <li :class="{ 'completed': skills.length > 0 }">
                <span v-if="skills.length > 0">✓</span>
                <span v-else>○</span>
                At least one Professional Skill
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import axios from 'axios';

export default {
  name: 'ProviderProfile',
  data() {
    return {
      currentTab: 'profile',
      showCompletionGuide: true, // Show guide by default for new users
      apiBaseUrl: 'http://localhost:5500/api', // Add API base URL
      profile: {
        firstName: '',
        lastName: '',
        phone: '',
        bio: '',
        headline: '',
        hourlyRate: ''
      },
      profileStatus: 'pending',
      
      // Work Experience
      experiences: [],
      newExperience: {
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        description: '',
        isCurrentPosition: false
      },
      
      // Education
      educations: [],
      newEducation: {
        institution: '',
        degree: '',
        fieldOfStudy: '',
        startDate: '',
        endDate: '',
        isCurrentlyStudying: false
      },
      
      // Skills
      skills: [],
      newSkill: {
        skillName: ''
      },
      
      // Portfolio
      portfolioItems: [],
      newPortfolio: {
        title: '',
        description: '',
        projectUrl: '',
        files: []
      },
      
      // Documents
      documents: [],
      newDocument: {
        title: '',
        type: 'ID',
        file: null
      },
      
      // Services
      services: [],
      newService: {
        title: '',
        description: '',
        categoryId: '',
        pricing: '',
        pricingType: 'HOURLY'
      },
      categories: []
    };
  },
  computed: {
    // Check if basic profile info is complete
    isBasicProfileComplete() {
      return this.profile.firstName && 
             this.profile.lastName && 
             this.profile.phone &&
             this.profile.bio;
    },
    
    // Calculate profile completion percentage
    profileCompletionPercentage() {
      let completedSections = 0;
      let totalSections = 5; // Basic info, Experience, Education, Skills, Services
      
      if (this.isBasicProfileComplete) completedSections++;
      if (this.experiences.length > 0) completedSections++;
      if (this.educations.length > 0) completedSections++;
      if (this.skills.length > 0) completedSections++;
      if (this.services.length > 0) completedSections++;
      
      return Math.round((completedSections / totalSections) * 100);
    },
    
    // Check if profile is ready for submission
    isProfileReadyForSubmission() {
      return this.isBasicProfileComplete && 
             this.experiences.length > 0 && 
             this.skills.length > 0;
    },
    
    // Check if we need to guide user to next incomplete section
    nextIncompleteSection() {
      if (!this.isBasicProfileComplete) return 'profile';
      if (this.experiences.length === 0) return 'experience';
      if (this.educations.length === 0) return 'education';
      if (this.skills.length === 0) return 'skills';
      if (this.services.length === 0) return 'services';
      return null;
    }
  },
  mounted() {
    this.loadProfile();
    
    // If there's an incomplete section, navigate to it
    if (this.nextIncompleteSection) {
      this.currentTab = this.nextIncompleteSection;
    }
  },
  methods: {
    hideCompletionGuide() {
      // Only hide for current session, don't store in localStorage
      this.showCompletionGuide = false;
    },
    
    // Helper Functions
    formatDate(dateStr) {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      return date.toLocaleDateString();
    },
    resetForm(formName) {
      const defaultForms = {
        experience: {
          company: '',
          position: '',
          startDate: '',
          endDate: '',
          description: '',
          isCurrentPosition: false
        },
        education: {
          institution: '',
          degree: '',
          fieldOfStudy: '',
          startDate: '',
          endDate: '',
          isCurrentlyStudying: false
        },
        skill: {
          skillName: ''
        },
        portfolio: {
          title: '',
          description: '',
          projectUrl: '',
          files: []
        },
        document: {
          title: '',
          type: 'ID',
          file: null
        },
        service: {
          title: '',
          description: '',
          categoryId: '',
          pricing: '',
          pricingType: 'HOURLY'
        }
      };
      
      this[`new${formName.charAt(0).toUpperCase() + formName.slice(1)}`] = { ...defaultForms[formName] };
    },
    getCategoryName(categoryId) {
      const category = this.categories.find(c => c.id === categoryId);
      return category ? category.name : 'Unknown';
    },
    
    // API Calls using fetch instead of axios
    async loadProfile() {
      try {
        const response = await fetch(`${this.apiBaseUrl}/provider/profile`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!response.ok) throw new Error('Failed to load profile');
        
        const data = await response.json();
        if (data && data.data) {
          this.profile = data.data;
          this.experiences = data.data.workExperiences || [];
          this.educations = data.data.educations || [];
          this.skills = data.data.skills || [];
          this.portfolioItems = data.data.portfolioItems || [];
          this.documents = data.data.documents || [];
          this.services = data.data.services || [];
          this.profileStatus = data.data.status || 'pending';
          
          // Hide guide if profile is mostly complete
          if (this.profileCompletionPercentage > 80) {
            this.showCompletionGuide = false;
          }
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    },
    
    async updateProfile() {
      try {
        const response = await fetch(`${this.apiBaseUrl}/provider/profile`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(this.profile)
        });
        
        if (!response.ok) throw new Error('Failed to update profile');
        
        alert('Profile updated successfully!');
        
        // Navigate to next incomplete section if any
        if (this.nextIncompleteSection && this.nextIncompleteSection !== 'profile') {
          this.currentTab = this.nextIncompleteSection;
        }
      } catch (error) {
        console.error('Error updating profile:', error);
        alert('Failed to update profile. Please try again.');
      }
    },
    
    // Work Experience
    async addExperience() {
      try {
        const response = await fetch(`${this.apiBaseUrl}/provider/experience`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(this.newExperience)
        });
        
        if (!response.ok) throw new Error('Failed to add experience');
        
        const data = await response.json();
        this.experiences.push(data.data);
        this.resetForm('experience');
        
        // Navigate to next incomplete section if any
        if (this.nextIncompleteSection && this.nextIncompleteSection !== 'experience') {
          this.currentTab = this.nextIncompleteSection;
        }
      } catch (error) {
        console.error('Error adding experience:', error);
        alert('Failed to add experience. Please try again.');
      }
    },
    
    async removeExperience(index) {
      try {
        const experienceId = this.experiences[index].id;
        const response = await fetch(`${this.apiBaseUrl}/provider/experience/${experienceId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!response.ok) throw new Error('Failed to remove experience');
        
        this.experiences.splice(index, 1);
      } catch (error) {
        console.error('Error removing experience:', error);
        alert('Failed to remove experience. Please try again.');
      }
    },
    
    // Education
    async addEducation() {
      try {
        const response = await fetch(`${this.apiBaseUrl}/provider/education`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(this.newEducation)
        });
        
        if (!response.ok) throw new Error('Failed to add education');
        
        const data = await response.json();
        this.educations.push(data.data);
        this.resetForm('education');
        
        // Navigate to next incomplete section if any
        if (this.nextIncompleteSection && this.nextIncompleteSection !== 'education') {
          this.currentTab = this.nextIncompleteSection;
        }
      } catch (error) {
        console.error('Error adding education:', error);
        alert('Failed to add education. Please try again.');
      }
    },
    
    async removeEducation(index) {
      try {
        const educationId = this.educations[index].id;
        const response = await fetch(`${this.apiBaseUrl}/provider/education/${educationId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!response.ok) throw new Error('Failed to remove education');
        
        this.educations.splice(index, 1);
      } catch (error) {
        console.error('Error removing education:', error);
        alert('Failed to remove education. Please try again.');
      }
    },
    
    // Skills
    async addSkill() {
      if (!this.newSkill.skillName) return;
      
      try {
        const response = await fetch(`${this.apiBaseUrl}/provider/skill`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(this.newSkill)
        });
        
        if (!response.ok) throw new Error('Failed to add skill');
        
        const data = await response.json();
        this.skills.push(data.data);
        this.resetForm('skill');
        
        // Navigate to next incomplete section if any
        if (this.nextIncompleteSection && this.nextIncompleteSection !== 'skills') {
          this.currentTab = this.nextIncompleteSection;
        }
      } catch (error) {
        console.error('Error adding skill:', error);
        alert('Failed to add skill. Please try again.');
      }
    },
    
    async removeSkill(index) {
      try {
        const skillId = this.skills[index].id;
        const response = await fetch(`${this.apiBaseUrl}/provider/skill/${skillId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!response.ok) throw new Error('Failed to remove skill');
        
        this.skills.splice(index, 1);
      } catch (error) {
        console.error('Error removing skill:', error);
        alert('Failed to remove skill. Please try again.');
      }
    },
    
    // Portfolio uses FormData
    handlePortfolioFiles(event) {
      this.newPortfolio.files = Array.from(event.target.files);
    },
    
    async addPortfolio() {
      try {
        const formData = new FormData();
        formData.append('title', this.newPortfolio.title);
        
        if (this.newPortfolio.description) {
          formData.append('description', this.newPortfolio.description);
        }
        
        if (this.newPortfolio.projectUrl) {
          formData.append('projectUrl', this.newPortfolio.projectUrl);
        }
        
        for (const file of this.newPortfolio.files) {
          formData.append('files', file);
        }
        
        const response = await fetch(`${this.apiBaseUrl}/provider/portfolio/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: formData
        });
        
        if (!response.ok) throw new Error('Failed to add portfolio item');
        
        const data = await response.json();
        this.portfolioItems.push({
          ...data.data,
          files: this.newPortfolio.files
        });
        
        this.resetForm('portfolio');
        if (this.$refs.portfolioFiles) {
          this.$refs.portfolioFiles.value = '';
        }
      } catch (error) {
        console.error('Error adding portfolio item:', error);
        alert('Failed to add portfolio item. Please try again.');
      }
    },
    
    async removePortfolioItem(index) {
      try {
        const portfolioId = this.portfolioItems[index].id;
        const response = await fetch(`${this.apiBaseUrl}/provider/portfolio/${portfolioId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!response.ok) throw new Error('Failed to remove portfolio item');
        
        this.portfolioItems.splice(index, 1);
      } catch (error) {
        console.error('Error removing portfolio item:', error);
        alert('Failed to remove portfolio item. Please try again.');
      }
    },
    
    // Documents
    handleDocumentFile(event) {
      this.newDocument.file = event.target.files[0];
    },
    
    async addDocument() {
      try {
        const formData = new FormData();
        formData.append('title', this.newDocument.title);
        formData.append('type', this.newDocument.type);
        
        if (this.newDocument.file) {
          formData.append('file', this.newDocument.file);
        }
        
        const response = await fetch(`${this.apiBaseUrl}/provider/document`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: formData
        });
        
        if (!response.ok) throw new Error('Failed to add document');
        
        const data = await response.json();
        this.documents.push({
          ...data.data,
          file: this.newDocument.file
        });
        
        this.resetForm('document');
        if (this.$refs.documentFile) {
          this.$refs.documentFile.value = '';
        }
      } catch (error) {
        console.error('Error adding document:', error);
        alert('Failed to add document. Please try again.');
      }
    },
    
    async removeDocument(index) {
      try {
        const documentId = this.documents[index].id;
        const response = await fetch(`${this.apiBaseUrl}/provider/document/${documentId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!response.ok) throw new Error('Failed to remove document');
        
        this.documents.splice(index, 1);
      } catch (error) {
        console.error('Error removing document:', error);
        alert('Failed to remove document. Please try again.');
      }
    },
    
    // Services
    async loadCategories() {
      try {
        const response = await fetch(`${this.apiBaseUrl}/provider/categories`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!response.ok) throw new Error('Failed to load categories');
        
        const data = await response.json();
        if (data && data.data) {
          this.categories = data.data;
        }
      } catch (error) {
        console.error('Error loading categories:', error);
        alert('Failed to load categories. Please try again.');
      }
    },
    
    async addService() {
      try {
        const response = await fetch(`${this.apiBaseUrl}/provider/service`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(this.newService)
        });
        
        if (!response.ok) throw new Error('Failed to add service');
        
        const data = await response.json();
        this.services.push(data.data);
        this.resetForm('service');
        
        // Navigate to next incomplete section if any
        if (this.nextIncompleteSection && this.nextIncompleteSection !== 'services') {
          this.currentTab = this.nextIncompleteSection;
        }
      } catch (error) {
        console.error('Error adding service:', error);
        alert('Failed to add service. Please try again.');
      }
    },
    
    async removeService(index) {
      try {
        const serviceId = this.services[index].id;
        const response = await fetch(`${this.apiBaseUrl}/provider/service/${serviceId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!response.ok) throw new Error('Failed to remove service');
        
        this.services.splice(index, 1);
      } catch (error) {
        console.error('Error removing service:', error);
        alert('Failed to remove service. Please try again.');
      }
    },
    
    // Submit full profile for approval
    async submitProfile() {
      try {
        // Check if required sections are filled
        if (!this.isProfileReadyForSubmission) {
          alert('Please complete all required profile sections before submitting.');
          return;
        }
        
        // Submit profile for approval
        const response = await fetch(`${this.apiBaseUrl}/provider/profile/submit`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!response.ok) throw new Error('Failed to submit profile');
        
        alert('Your profile has been submitted for approval!');
        this.showCompletionGuide = false;
      } catch (error) {
        console.error('Error submitting profile:', error);
        alert('Failed to submit profile. Please try again.');
      }
    }
  }
};
</script>

<style scoped>
/* Base Styles */
.provider-profile-container {
  width: 100%;
  margin: 130px auto 50px;
  padding: 0 40px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.profile-completion-card {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
  padding: 35px;
  margin-bottom: 30px;
  position: relative;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #dee2e6;
}

.completion-content {
  display: flex;
  flex-direction: column;
  max-width: 100%;
}

.completion-header {
  margin-bottom: 20px;
}

.completion-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.completion-title h2 {
  font-size: 1.8rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.completion-percentage {
  font-size: 1.8rem;
  font-weight: 700;
  color: #2bad61;
}

.completion-header p {
  color: #6c757d;
  margin: 0;
  font-size: 1.1rem;
}

.progress-container {
  margin-bottom: 25px;
}

.progress-bar {
  height: 10px;
  background-color: #e9ecef;
  border-radius: 100px;
  overflow: hidden;
}

.progress-filled {
  height: 100%;
  background: linear-gradient(90deg, #2bad61 0%, #0fdd7d 100%);
  transition: width 0.5s ease;
}

.completion-steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  width: 100%;
}

.step {
  display: flex;
  align-items: center;
  background-color: white;
  padding: 16px;
  border-radius: 10px;
  border: 1px solid #e9ecef;
  transition: all 0.2s ease;
  cursor: pointer;
}

.step:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.step.active {
  border-color: #2bad61;
  background-color: rgba(43, 173, 97, 0.05);
}

.step.completed {
  background-color: rgba(43, 173, 97, 0.08);
  border-color: #2bad61;
}

.step-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background-color: #e9ecef;
  color: #6c757d;
  font-weight: bold;
  margin-right: 15px;
  flex-shrink: 0;
}

.step.completed .step-icon {
  background-color: #2bad61;
  color: white;
}

.step.active .step-icon {
  background-color: white;
  color: #2bad61;
  border: 2px solid #2bad61;
}

.step-details {
  flex-grow: 1;
}

.step-label {
  font-weight: 600;
  color: #495057;
  margin-bottom: 4px;
  font-size: 1rem;
}

.step-status {
  font-size: 0.85rem;
  color: #6c757d;
}

.step.completed .step-status {
  color: #2bad61;
}

.close-guide-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.1);
  border: none;
  color: #495057;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.close-guide-btn:hover {
  background: rgba(0, 0, 0, 0.2);
}

/* Profile Main Section */
.profile-main {
  margin-bottom: 30px;
}

.profile-header {
  margin-bottom: 40px;
}

.profile-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  margin: 0 0 15px 0;
}

.subtitle {
  color: #6c757d;
  margin: 0 0 35px 0;
  font-size: 1.1rem;
}

.profile-tabs {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border: 1px solid #e9ecef;
  margin-bottom: 30px;
  padding: 3px;
}

.tab {
  padding: 18px 22px;
  color: #6c757d;
  font-weight: 500;
  cursor: pointer;
  border-radius: 10px;
  display: flex;
  align-items: center;
  white-space: nowrap;
  transition: all 0.2s ease;
  margin-right: 2px;
  font-size: 1.05rem;
}

.tab:hover {
  background: #f8f9fa;
  color: #495057;
}

.tab.active {
  background: #2bad61;
  color: white;
}

.tab-icon {
  margin-right: 10px;
  font-size: 1.3rem;
}

/* Tab Content Styles */
.tab-content {
  max-width: 100%;
}

.section-header {
  margin-bottom: 25px;
}

.section-header h2 {
  font-size: 1.8rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 10px 0;
}

.section-header p {
  color: #6c757d;
  margin: 0;
  font-size: 1.1rem;
}

.form-card {
  background: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
  border: 1px solid #e9ecef;
  margin-bottom: 30px;
}

.alert {
  display: flex;
  align-items: center;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
}

.alert.info {
  background-color: rgba(33, 150, 243, 0.08);
  border: 1px solid rgba(33, 150, 243, 0.2);
  color: #0d6efd;
}

.alert-icon {
  margin-right: 15px;
  font-size: 1.3rem;
}

.alert p {
  margin: 0;
  font-size: 1.05rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 25px;
  margin-bottom: 35px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: span 3;
}

label {
  font-weight: 600;
  margin-bottom: 10px;
  color: #495057;
  font-size: 1.05rem;
}

.required {
  color: #e74c3c;
}

input[type="text"],
input[type="number"],
input[type="date"],
textarea,
select {
  padding: 14px 16px;
  border: 1px solid #ced4da;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s ease;
}

input:focus,
textarea:focus,
select:focus {
  outline: none;
  border-color: #2bad61;
  box-shadow: 0 0 0 3px rgba(43, 173, 97, 0.1);
}

textarea {
  min-height: 150px;
  resize: vertical;
}

.help-text {
  font-size: 0.85rem;
  color: #6c757d;
  margin-top: 6px;
}

.checkbox-container {
  display: flex;
  align-items: center;
  margin-top: 10px;
}

.checkbox-container input[type="checkbox"] {
  margin-right: 10px;
  width: 16px;
  height: 16px;
}

.checkbox-container label {
  margin-bottom: 0;
}

.form-actions {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  font-size: 1.05rem;
}

.btn-icon {
  margin-right: 10px;
}

.btn.primary {
  background-color: #2bad61;
  color: white;
}

.btn.primary:hover {
  background-color: #239c54;
  transform: translateY(-2px);
}

.btn.secondary {
  background-color: #f8f9fa;
  color: #495057;
  border: 1px solid #ced4da;
}

.btn.secondary:hover {
  background-color: #e9ecef;
  transform: translateY(-2px);
}

.btn.danger {
  background-color: #e74c3c;
  color: white;
}

.btn.danger:hover {
  background-color: #c0392b;
}

.btn.small {
  padding: 8px 14px;
  font-size: 0.95rem;
}

.btn.large {
  padding: 15px 30px;
  font-size: 1.15rem;
}

.btn.success {
  background: linear-gradient(135deg, #2bad61 0%, #0fdd7d 100%);
  color: white;
  box-shadow: 0 4px 10px rgba(43, 173, 97, 0.2);
}

.btn.success:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(43, 173, 97, 0.3);
}

.btn:disabled {
  background-color: #e9ecef;
  color: #adb5bd;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* Item List Styles */
.items-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 20px;
  margin-bottom: 35px;
}

.item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 20px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.item:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.item-header h3 {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 600;
  color: #333;
}

.item-subtitle {
  font-size: 0.95rem;
  color: #6c757d;
  margin-top: 3px;
}

.item-date {
  display: inline-block;
  font-size: 0.9rem;
  color: #6c757d;
  background-color: #e9ecef;
  padding: 5px 10px;
  border-radius: 4px;
  margin-bottom: 10px;
}

.item-description {
  color: #495057;
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.5;
}

.item-content {
  flex-grow: 1;
  margin-right: 20px;
}

.service-item {
  border-left: 4px solid #2bad61;
}

.category-badge {
  display: inline-block;
  background-color: rgba(43, 173, 97, 0.1);
  color: #2bad61;
  padding: 5px 12px;
  border-radius: 100px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 10px;
}

.item-price {
  font-weight: 700;
  color: #2bad61;
  font-size: 1.1rem;
}

.form-divider {
  position: relative;
  text-align: center;
  margin: 35px 0;
}

.form-divider:before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background-color: #e9ecef;
  z-index: 1;
}

.form-divider span {
  position: relative;
  z-index: 2;
  background-color: white;
  padding: 0 20px;
  color: #6c757d;
  font-size: 1rem;
}

.price-input {
  position: relative;
}

.currency-symbol {
  position: absolute;
  top: 50%;
  left: 15px;
  transform: translateY(-50%);
  color: #6c757d;
  font-size: 1.05rem;
}

.price-input input {
  padding-left: 30px;
}

/* Submission Section */
.profile-submission {
  margin-top: 60px;
}

.submission-card {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #dee2e6;
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
}

.submission-content {
  flex: 2;
  min-width: 300px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.submission-content h3 {
  margin: 0 0 12px 0;
  font-size: 1.6rem;
  color: #333;
}

.submission-content p {
  margin: 0;
  color: #6c757d;
  font-size: 1.05rem;
}

.submission-requirements {
  flex: 1;
  min-width: 250px;
}

.submission-requirements h4 {
  font-size: 1.1rem;
  color: #495057;
  margin: 0 0 15px 0;
}

.submission-requirements ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.submission-requirements li {
  display: flex;
  align-items: center;
  color: #6c757d;
  margin-bottom: 12px;
  font-size: 1rem;
}

.submission-requirements li span {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin-right: 12px;
  font-size: 0.9rem;
}

.submission-requirements li.completed {
  color: #2bad61;
}

.submission-requirements li.completed span {
  background-color: #2bad61;
  color: white;
}

.submission-requirements li:not(.completed) span {
  border: 1px solid #6c757d;
}

/* Responsive Adjustments */
@media (max-width: 1400px) {
  .form-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .form-group.full-width {
    grid-column: span 2;
  }
}

@media (max-width: 992px) {
  .items-list {
    grid-template-columns: 1fr;
  }
  
  .submission-content {
    flex-direction: column;
    align-items: flex-start;
  margin-bottom: 20px;
  }
}

@media (max-width: 768px) {
  .provider-profile-container {
    padding: 0 20px;
  }
  
  .profile-header h1 {
    font-size: 2rem;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .form-group.full-width {
    grid-column: span 1;
  }
  
  .form-card {
    padding: 25px;
  }
  
  .step {
    min-width: 100%;
  }
  
  .submission-card {
    padding: 25px;
  }
}

@media (max-width: 576px) {
  .provider-profile-container {
    padding: 0 15px;
    margin-top: 110px;
  }
  
  .profile-tabs {
    padding-bottom: 10px;
  }
  
  .completion-steps {
    grid-template-columns: 1fr;
  }
  
  .profile-tabs {
    overflow-x: auto;
    padding: 5px;
    margin-bottom: 20px;
  }
  
  .tab {
    padding: 12px 15px;
    font-size: 0.9rem;
  }
  
  .section-header h2 {
    font-size: 1.5rem;
  }
}
</style>
