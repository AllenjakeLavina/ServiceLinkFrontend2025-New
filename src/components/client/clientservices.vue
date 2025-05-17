<template>
  <div class="services-container">
    <h1>Client Services</h1>
    <p>This is the client services component.</p>
  </div>
</template>

<script>
export default {
  name: 'ClientServices',
  data() {
    return {
      user: {
        firstName: '',
        lastName: ''
      }
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
  }
}
</script>

<style scoped>
.services-container {
  padding: 20px;
  margin-top: 130px;
}
</style>

