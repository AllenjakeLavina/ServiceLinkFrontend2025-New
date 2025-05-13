import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '../components/landingpage.vue'
import Login from '../components/Login.vue'
import ClientOrProvider from '../components/clientorprovider.vue'
import ClientRegister from '../components/ClientRegister.vue'
import ProviderRegister from '../components/ProviderRegister.vue'
import ClientHomePage from '../components/client/clienthomepage.vue'
import ClientBooking from '../components/client/clientbooking.vue'
import ClientServices from '../components/client/clientservices.vue'
import ClientMessages from '../components/client/clientmessages.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: LandingPage
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      component: ClientOrProvider
    },
    {
      path: '/register/client',
      name: 'ClientRegister',
      component: ClientRegister
    },
    {
      path: '/register/provider',
      name: 'ProviderRegister',
      component: ProviderRegister
    },
    {
      path: '/client/home',
      name: 'ClientHomePage',
      component: ClientHomePage,
      meta: { requiresAuth: true }
    },
    {
      path: '/client/booking',
      name: 'ClientBooking',
      component: ClientBooking,
      meta: { requiresAuth: true }
    },
    {
      path: '/client/booking/:id',
      name: 'BookingDetails',
      component: ClientBooking,
      meta: { requiresAuth: true }
    },
    {
      path: '/client/services',
      name: 'ClientServices',
      component: ClientServices,
      meta: { requiresAuth: true }
    },
    {
      path: '/client/messages',
      name: 'ClientMessages',
      component: ClientMessages,
      meta: { requiresAuth: true }
    },
    {
      path: '/services',
      redirect: '/client/services'
    },
    {
      path: '/messages',
      redirect: '/client/messages'
    },
    {
      path: '/services/:id/book',
      name: 'BookService',
      component: ClientServices,
      meta: { requiresAuth: true }
    }
  ]
})

// Navigation guards
router.beforeEach((to, from, next) => {
  // Check if the route requires authentication
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      // Not logged in, redirect to login page
      next({ path: '/login' });
    } else {
      // User is logged in, allow navigation
      next();
    }
  } else {
    // Route doesn't require auth, allow navigation
    next();
  }
});

export default router 