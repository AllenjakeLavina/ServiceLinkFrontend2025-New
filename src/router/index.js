import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '../components/LandingPage.vue'
import Login from '../components/Login.vue'
import ClientOrProvider from '../components/ClientOrProvider.vue'
import ClientRegister from '../components/ClientRegister.vue'
import ProviderRegister from '../components/ProviderRegister.vue'
import ClientHomepage from '../components/client/clienthomepage.vue'
import ClientBooking from '../components/client/clientbooking.vue'
import ClientServices from '../components/client/clientservices.vue'
import ClientMessages from '../components/client/clientmessages.vue'
import ProviderHomepage from '../components/provider/providerhomepage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: LandingPage,
      meta: { public: true }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { guestOnly: true, public: true }
    },
    {
      path: '/register',
      name: 'register',
      component: ClientOrProvider,
      meta: { guestOnly: true, public: true }
    },
    {
      path: '/register/client',
      name: 'ClientRegister',
      component: ClientRegister,
      meta: { guestOnly: true, public: true }
    },
    {
      path: '/register/provider',
      name: 'ProviderRegister',
      component: ProviderRegister,
      meta: { guestOnly: true, public: true }
    },
    // Client routes
    {
      path: '/client/home',
      name: 'ClientHomePage',
      component: ClientHomepage,
      meta: { requiresAuth: true, role: 'client' }
    },
    {
      path: '/client/booking',
      name: 'ClientBooking',
      component: ClientBooking,
      meta: { requiresAuth: true, role: 'client' }
    },
    {
      path: '/client/booking/:id',
      name: 'BookingDetails',
      component: ClientBooking,
      meta: { requiresAuth: true, role: 'client' }
    },
    {
      path: '/client/services',
      name: 'ClientServices',
      component: ClientServices,
      meta: { requiresAuth: true, role: 'client' }
    },
    {
      path: '/client/messages',
      name: 'ClientMessages',
      component: ClientMessages,
      meta: { requiresAuth: true, role: 'client' }
    },
    // Provider routes
    {
      path: '/provider/home',
      name: 'ProviderHome',
      component: ProviderHomepage,
      meta: { requiresAuth: true, role: 'provider' }
    },
    {
      path: '/provider/services',
      name: 'ProviderServices',
      component: () => import('../components/provider/providerservices.vue'),
      meta: { requiresAuth: true, role: 'provider' }
    },
    // Redirects
    {
      path: '/services',
      redirect: to => {
        const userString = localStorage.getItem('user');
        if (!userString) return '/client/services';
        
        try {
          const userData = JSON.parse(userString);
          // Check for provider role
          if (userData.role === 'provider' || userData.isProvider) {
            return '/provider/services';
          }
        } catch (e) {
          console.error('Error parsing user data:', e);
        }
        
        // Default to client services
        return '/client/services';
      }
    },
    {
      path: '/messages',
      redirect: to => {
        const userString = localStorage.getItem('user');
        if (!userString) return '/client/messages';
        
        try {
          const userData = JSON.parse(userString);
          // Since provider/messages doesn't exist yet, always redirect to client/messages
          // If needed, can uncomment this when the provider/messages component is created
          /*
          if (userData.role === 'provider' || userData.isProvider) {
            return '/provider/messages';
          }
          */
        } catch (e) {
          console.error('Error parsing user data:', e);
        }
        
        // Default to client messages
        return '/client/messages';
      }
    },
    {
      path: '/services/:id/book',
      name: 'BookService',
      component: ClientServices,
      meta: { requiresAuth: true, role: 'client' }
    }
  ]
})

// Navigation guards
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const guestOnly = to.matched.some(record => record.meta.guestOnly);
  
  // Get user data for role check
  const userString = localStorage.getItem('user');
  let userRole = null;
  
  if (userString) {
    try {
      const userData = JSON.parse(userString);
      
      // Determine user role
      if (userData.role) {
        userRole = userData.role.toLowerCase();
      } else if (userData.user && userData.user.role) {
        userRole = userData.user.role.toLowerCase();
      } else if (userData.isAdmin) {
        userRole = 'admin';
      } else if (userData.isProvider || userData.user && userData.user.isProvider) {
        userRole = 'provider';
      } else {
        userRole = 'client';
      }
      
      // Store role in localStorage for consistency
      localStorage.setItem('userRole', userRole);
      console.log(`Router guard detected role: ${userRole}`);
    } catch (e) {
      console.error('Error parsing user data:', e);
    }
  }
  
  // Check for stored role if we couldn't determine it above
  if (!userRole && token) {
    userRole = localStorage.getItem('userRole') || 'client';
  }
  
  // Handle authentication and role requirements
  if (requiresAuth) {
    if (!token) {
      // Not logged in, redirect to login page
      next({ path: '/login' });
    } else if (to.meta.role && to.meta.role !== userRole) {
      // Wrong role, redirect to appropriate home page
      if (userRole === 'client') {
        next({ path: '/client/home' });
      } else if (userRole === 'provider') {
        next({ path: '/provider/home' });
      } else {
        next({ path: '/login' });
      }
    } else {
      // All checks passed
      next();
    }
  } else if (guestOnly && token) {
    // Already logged in, redirect to appropriate home page
    if (userRole === 'client') {
      next({ path: '/client/home' });
    } else if (userRole === 'provider') {
      next({ path: '/provider/home' });
    } else {
      next({ path: '/' });
    }
  } else {
    // No auth required or not logged in on guestOnly page
    next();
  }
});

export default router 