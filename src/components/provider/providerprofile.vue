<template>
  <div class="provider-profile">
    <h1 class="title is-3">Provider Profile</h1>
    <div class="tabs">
      <ul>
        <li :class="{ 'is-active': currentTab === 'profile' }">
          <a @click="currentTab = 'profile'">Profile</a>
        </li>
        <li :class="{ 'is-active': currentTab === 'experience' }">
          <a @click="currentTab = 'experience'">Work Experience</a>
        </li>
        <li :class="{ 'is-active': currentTab === 'education' }">
          <a @click="currentTab = 'education'">Education</a>
        </li>
        <li :class="{ 'is-active': currentTab === 'skills' }">
          <a @click="currentTab = 'skills'">Skills</a>
        </li>
        <li :class="{ 'is-active': currentTab === 'portfolio' }">
          <a @click="currentTab = 'portfolio'">Portfolio</a>
        </li>
        <li :class="{ 'is-active': currentTab === 'documents' }">
          <a @click="currentTab = 'documents'">Documents</a>
        </li>
        <li :class="{ 'is-active': currentTab === 'services' }">
          <a @click="currentTab = 'services'">Services</a>
        </li>
      </ul>
    </div>

    <!-- Profile Tab -->
    <div v-if="currentTab === 'profile'" class="tab-content">
      <div class="card">
        <div class="card-content">
          <div class="field">
            <label class="label">First Name</label>
            <div class="control">
              <input class="input" type="text" v-model="profile.firstName" placeholder="First Name">
            </div>
          </div>
          <div class="field">
            <label class="label">Last Name</label>
            <div class="control">
              <input class="input" type="text" v-model="profile.lastName" placeholder="Last Name">
            </div>
          </div>
          <div class="field">
            <label class="label">Phone</label>
            <div class="control">
              <input class="input" type="text" v-model="profile.phone" placeholder="Phone Number">
            </div>
          </div>
          <div class="field">
            <label class="label">Bio</label>
            <div class="control">
              <textarea class="textarea" v-model="profile.bio" placeholder="Tell us about yourself"></textarea>
            </div>
          </div>
          <div class="field">
            <label class="label">Headline</label>
            <div class="control">
              <input class="input" type="text" v-model="profile.headline" placeholder="Professional Headline">
            </div>
          </div>
          <div class="field">
            <label class="label">Hourly Rate ($)</label>
            <div class="control">
              <input class="input" type="number" v-model="profile.hourlyRate" min="0" step="0.01">
            </div>
          </div>
          <div class="field">
            <div class="control">
              <button class="button is-primary" @click="updateProfile">Update Profile</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Experience Tab -->
    <div v-if="currentTab === 'experience'" class="tab-content">
      <div class="card">
        <div class="card-content">
          <h2 class="title is-4">Work Experience</h2>
          
          <div v-if="experiences.length > 0" class="mb-4">
            <div v-for="(exp, index) in experiences" :key="index" class="box">
              <h3 class="is-size-5">{{ exp.position }} at {{ exp.company }}</h3>
              <p>{{ formatDate(exp.startDate) }} - {{ exp.isCurrentPosition ? 'Present' : formatDate(exp.endDate) }}</p>
              <p>{{ exp.description }}</p>
              <button class="button is-small is-danger mt-2" @click="removeExperience(index)">Remove</button>
            </div>
          </div>
          
          <div class="field">
            <label class="label">Company</label>
            <div class="control">
              <input class="input" type="text" v-model="newExperience.company" placeholder="Company Name">
            </div>
          </div>
          <div class="field">
            <label class="label">Position</label>
            <div class="control">
              <input class="input" type="text" v-model="newExperience.position" placeholder="Your Position">
            </div>
          </div>
          <div class="field">
            <label class="label">Start Date</label>
            <div class="control">
              <input class="input" type="date" v-model="newExperience.startDate">
            </div>
          </div>
          <div class="field">
            <label class="label">End Date</label>
            <div class="control">
              <input class="input" type="date" v-model="newExperience.endDate" :disabled="newExperience.isCurrentPosition">
            </div>
          </div>
          <div class="field">
            <div class="control">
              <label class="checkbox">
                <input type="checkbox" v-model="newExperience.isCurrentPosition">
                This is my current position
              </label>
            </div>
          </div>
          <div class="field">
            <label class="label">Description</label>
            <div class="control">
              <textarea class="textarea" v-model="newExperience.description" placeholder="Describe your responsibilities"></textarea>
            </div>
          </div>
          <div class="field">
            <div class="control">
              <button class="button is-primary" @click="addExperience">Add Experience</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Education Tab -->
    <div v-if="currentTab === 'education'" class="tab-content">
      <div class="card">
        <div class="card-content">
          <h2 class="title is-4">Education</h2>
          
          <div v-if="educations.length > 0" class="mb-4">
            <div v-for="(edu, index) in educations" :key="index" class="box">
              <h3 class="is-size-5">{{ edu.degree }} in {{ edu.fieldOfStudy }}</h3>
              <p>{{ edu.institution }}</p>
              <p>{{ formatDate(edu.startDate) }} - {{ edu.isCurrentlyStudying ? 'Present' : formatDate(edu.endDate) }}</p>
              <button class="button is-small is-danger mt-2" @click="removeEducation(index)">Remove</button>
            </div>
          </div>
          
          <div class="field">
            <label class="label">Institution</label>
            <div class="control">
              <input class="input" type="text" v-model="newEducation.institution" placeholder="School/University Name">
            </div>
          </div>
          <div class="field">
            <label class="label">Degree</label>
            <div class="control">
              <input class="input" type="text" v-model="newEducation.degree" placeholder="Degree">
            </div>
          </div>
          <div class="field">
            <label class="label">Field of Study</label>
            <div class="control">
              <input class="input" type="text" v-model="newEducation.fieldOfStudy" placeholder="Field of Study">
            </div>
          </div>
          <div class="field">
            <label class="label">Start Date</label>
            <div class="control">
              <input class="input" type="date" v-model="newEducation.startDate">
            </div>
          </div>
          <div class="field">
            <label class="label">End Date</label>
            <div class="control">
              <input class="input" type="date" v-model="newEducation.endDate" :disabled="newEducation.isCurrentlyStudying">
            </div>
          </div>
          <div class="field">
            <div class="control">
              <label class="checkbox">
                <input type="checkbox" v-model="newEducation.isCurrentlyStudying">
                I am currently studying here
              </label>
            </div>
          </div>
          <div class="field">
            <div class="control">
              <button class="button is-primary" @click="addEducation">Add Education</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Skills Tab -->
    <div v-if="currentTab === 'skills'" class="tab-content">
      <div class="card">
        <div class="card-content">
          <h2 class="title is-4">Skills</h2>
          
          <div v-if="skills.length > 0" class="tags mb-4">
            <span v-for="(skill, index) in skills" :key="index" class="tag is-medium is-primary">
              {{ skill.skillName }}
              <button class="delete is-small" @click="removeSkill(index)"></button>
            </span>
          </div>
          
          <div class="field has-addons">
            <div class="control is-expanded">
              <input class="input" type="text" v-model="newSkill.skillName" placeholder="Add a skill">
            </div>
            <div class="control">
              <button class="button is-primary" @click="addSkill">Add</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Portfolio Tab -->
    <div v-if="currentTab === 'portfolio'" class="tab-content">
      <div class="card">
        <div class="card-content">
          <h2 class="title is-4">Portfolio</h2>
          
          <div v-if="portfolioItems.length > 0" class="mb-4">
            <div v-for="(item, index) in portfolioItems" :key="index" class="box">
              <h3 class="is-size-5">{{ item.title }}</h3>
              <p v-if="item.description">{{ item.description }}</p>
              <p v-if="item.projectUrl"><a :href="item.projectUrl" target="_blank">{{ item.projectUrl }}</a></p>
              <div v-if="item.files && item.files.length" class="mt-2">
                <p class="is-size-6 has-text-weight-bold">Files:</p>
                <ul>
                  <li v-for="(file, fIndex) in item.files" :key="fIndex">{{ file.name }}</li>
                </ul>
              </div>
              <button class="button is-small is-danger mt-3" @click="removePortfolioItem(index)">Remove</button>
            </div>
          </div>
          
          <div class="field">
            <label class="label">Title</label>
            <div class="control">
              <input class="input" type="text" v-model="newPortfolio.title" placeholder="Project Title">
            </div>
          </div>
          <div class="field">
            <label class="label">Description</label>
            <div class="control">
              <textarea class="textarea" v-model="newPortfolio.description" placeholder="Project Description"></textarea>
            </div>
          </div>
          <div class="field">
            <label class="label">Project URL</label>
            <div class="control">
              <input class="input" type="url" v-model="newPortfolio.projectUrl" placeholder="https://...">
            </div>
          </div>
          <div class="field">
            <label class="label">Files (Images/Documents)</label>
            <div class="control">
              <input class="input" type="file" ref="portfolioFiles" multiple @change="handlePortfolioFiles">
            </div>
            <p class="help">Max 5 files. Accepted: JPG, PNG, PDF, DOC</p>
          </div>
          <div class="field">
            <div class="control">
              <button class="button is-primary" @click="addPortfolio">Add Portfolio Item</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Documents Tab -->
    <div v-if="currentTab === 'documents'" class="tab-content">
      <div class="card">
        <div class="card-content">
          <h2 class="title is-4">Documents</h2>
          
          <div v-if="documents.length > 0" class="mb-4">
            <div v-for="(doc, index) in documents" :key="index" class="box">
              <div class="is-flex is-justify-content-space-between">
                <div>
                  <h3 class="is-size-5">{{ doc.title }}</h3>
                  <p>Type: {{ doc.type }}</p>
                  <p v-if="doc.file">File: {{ doc.file.name }}</p>
                </div>
                <button class="button is-small is-danger" @click="removeDocument(index)">Remove</button>
              </div>
            </div>
          </div>
          
          <div class="field">
            <label class="label">Title</label>
            <div class="control">
              <input class="input" type="text" v-model="newDocument.title" placeholder="Document Title">
            </div>
          </div>
          <div class="field">
            <label class="label">Document Type</label>
            <div class="control">
              <div class="select is-fullwidth">
                <select v-model="newDocument.type">
                  <option value="ID">ID</option>
                  <option value="CERTIFICATE">Certificate</option>
                  <option value="LICENSE">License</option>
                  <option value="RESUME">Resume</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>
          </div>
          <div class="field">
            <label class="label">File</label>
            <div class="control">
              <input class="input" type="file" ref="documentFile" @change="handleDocumentFile">
            </div>
            <p class="help">Accepted: PDF, DOC, DOCX, TXT</p>
          </div>
          <div class="field">
            <div class="control">
              <button class="button is-primary" @click="addDocument">Upload Document</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Services Tab -->
    <div v-if="currentTab === 'services'" class="tab-content">
      <div class="card">
        <div class="card-content">
          <h2 class="title is-4">Services</h2>
          
          <div v-if="services.length > 0" class="mb-4">
            <div v-for="(service, index) in services" :key="index" class="box">
              <div class="is-flex is-justify-content-space-between">
                <div>
                  <h3 class="is-size-5">{{ service.title }}</h3>
                  <p>{{ service.description }}</p>
                  <p>Price: ${{ service.pricing }} ({{ service.pricingType }})</p>
                  <p>Category: {{ getCategoryName(service.categoryId) }}</p>
                </div>
                <button class="button is-small is-danger" @click="removeService(index)">Remove</button>
              </div>
            </div>
          </div>
          
          <button class="button is-info mb-4" @click="loadCategories">Load Categories</button>
          
          <div class="field">
            <label class="label">Title</label>
            <div class="control">
              <input class="input" type="text" v-model="newService.title" placeholder="Service Title">
            </div>
          </div>
          <div class="field">
            <label class="label">Description</label>
            <div class="control">
              <textarea class="textarea" v-model="newService.description" placeholder="Service Description"></textarea>
            </div>
          </div>
          <div class="field">
            <label class="label">Category</label>
            <div class="control">
              <div class="select is-fullwidth">
                <select v-model="newService.categoryId">
                  <option value="">Select a category</option>
                  <option v-for="category in categories" :key="category.id" :value="category.id">
                    {{ category.name }}
                  </option>
                </select>
              </div>
            </div>
          </div>
          <div class="field">
            <label class="label">Price</label>
            <div class="control">
              <input class="input" type="number" v-model="newService.pricing" min="0" step="0.01">
            </div>
          </div>
          <div class="field">
            <label class="label">Pricing Type</label>
            <div class="control">
              <div class="select is-fullwidth">
                <select v-model="newService.pricingType">
                  <option value="HOURLY">Hourly</option>
                  <option value="FIXED">Fixed</option>
                  <option value="DAILY">Daily</option>
                  <option value="SESSION">Per Session</option>
                </select>
              </div>
            </div>
          </div>
          <div class="field">
            <div class="control">
              <button class="button is-primary" @click="addService">Create Service</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-5">
      <div class="field is-grouped">
        <div class="control">
          <button class="button is-success is-large" @click="submitProfile">Submit Profile for Approval</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ProviderProfile',
  data() {
    return {
      currentTab: 'profile',
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
  mounted() {
    this.loadProfile();
  },
  methods: {
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
    
    // API Calls
    async loadProfile() {
      try {
        const response = await axios.get('/api/provider/profile');
        if (response.data && response.data.data) {
          this.profile = response.data.data;
          this.experiences = response.data.data.workExperiences || [];
          this.educations = response.data.data.educations || [];
          this.skills = response.data.data.skills || [];
          this.portfolioItems = response.data.data.portfolioItems || [];
          this.documents = response.data.data.documents || [];
          this.services = response.data.data.services || [];
          this.profileStatus = response.data.data.status || 'pending';
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    },
    
    async updateProfile() {
      try {
        const response = await axios.patch('/api/provider/profile', this.profile);
        alert('Profile updated successfully!');
      } catch (error) {
        console.error('Error updating profile:', error);
        alert('Failed to update profile. Please try again.');
      }
    },
    
    // Work Experience
    async addExperience() {
      try {
        const response = await axios.post('/api/provider/experience', this.newExperience);
        this.experiences.push(response.data.data);
        this.resetForm('experience');
      } catch (error) {
        console.error('Error adding experience:', error);
        alert('Failed to add experience. Please try again.');
      }
    },
    
    async removeExperience(index) {
      try {
        const experienceId = this.experiences[index].id;
        await axios.delete(`/api/provider/experience/${experienceId}`);
        this.experiences.splice(index, 1);
      } catch (error) {
        console.error('Error removing experience:', error);
        alert('Failed to remove experience. Please try again.');
      }
    },
    
    // Education
    async addEducation() {
      try {
        const response = await axios.post('/api/provider/education', this.newEducation);
        this.educations.push(response.data.data);
        this.resetForm('education');
      } catch (error) {
        console.error('Error adding education:', error);
        alert('Failed to add education. Please try again.');
      }
    },
    
    async removeEducation(index) {
      try {
        const educationId = this.educations[index].id;
        await axios.delete(`/api/provider/education/${educationId}`);
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
        const response = await axios.post('/api/provider/skill', this.newSkill);
        this.skills.push(response.data.data);
        this.resetForm('skill');
      } catch (error) {
        console.error('Error adding skill:', error);
        alert('Failed to add skill. Please try again.');
      }
    },
    
    async removeSkill(index) {
      try {
        const skillId = this.skills[index].id;
        await axios.delete(`/api/provider/skill/${skillId}`);
        this.skills.splice(index, 1);
      } catch (error) {
        console.error('Error removing skill:', error);
        alert('Failed to remove skill. Please try again.');
      }
    },
    
    // Portfolio
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
        
        const response = await axios.post('/api/provider/portfolio/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        this.portfolioItems.push({
          ...response.data.data,
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
        await axios.delete(`/api/provider/portfolio/${portfolioId}`);
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
        
        const response = await axios.post('/api/provider/document', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        this.documents.push({
          ...response.data.data,
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
        await axios.delete(`/api/provider/document/${documentId}`);
        this.documents.splice(index, 1);
      } catch (error) {
        console.error('Error removing document:', error);
        alert('Failed to remove document. Please try again.');
      }
    },
    
    // Services
    async loadCategories() {
      try {
        const response = await axios.get('/api/provider/categories');
        if (response.data && response.data.data) {
          this.categories = response.data.data;
        }
      } catch (error) {
        console.error('Error loading categories:', error);
        alert('Failed to load categories. Please try again.');
      }
    },
    
    async addService() {
      try {
        const response = await axios.post('/api/provider/service', this.newService);
        this.services.push(response.data.data);
        this.resetForm('service');
      } catch (error) {
        console.error('Error adding service:', error);
        alert('Failed to add service. Please try again.');
      }
    },
    
    async removeService(index) {
      try {
        const serviceId = this.services[index].id;
        await axios.delete(`/api/provider/service/${serviceId}`);
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
        if (!this.profile.firstName || !this.profile.lastName) {
          alert('Please fill in your basic profile information.');
          this.currentTab = 'profile';
          return;
        }
        
        if (this.experiences.length === 0) {
          alert('Please add at least one work experience.');
          this.currentTab = 'experience';
          return;
        }
        
        if (this.skills.length === 0) {
          alert('Please add at least one skill.');
          this.currentTab = 'skills';
          return;
        }
        
        // Submit profile for approval
        const response = await axios.post('/api/provider/profile/submit');
        alert('Your profile has been submitted for approval!');
      } catch (error) {
        console.error('Error submitting profile:', error);
        alert('Failed to submit profile. Please try again.');
      }
    }
  }
};
</script>

<style scoped>
.provider-profile {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.tab-content {
  margin-top: 20px;
}

.card {
  margin-bottom: 20px;
}

.box {
  margin-bottom: 15px;
}
</style>
