<template>
  <div class="messages-container">
    <h1>Client Messages</h1>
    <p>This is the client messages component.</p>
  </div>
</template>

<script>
export default {
  name: 'ClientMessages',
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
.messages-container {
  margin-top: 130px;
  padding: 20px;
}
</style>
