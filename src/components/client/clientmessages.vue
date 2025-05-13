<template>
  <div class="messages-container">
    <!-- Navigation Bar -->
    <nav class="navbar">
      <div class="logo-container">
        <img src="../../assets/logo.png" alt="ServiceLink Logo" class="logo" />
      </div>
      <div class="nav-menu">
        <div class="nav-links">
          <router-link to="/client/home">Home</router-link>
          <router-link to="/client/booking">My Bookings</router-link>
          <router-link to="/client/services">Services</router-link>
          <router-link to="/client/messages" class="active">Messages</router-link>
        </div>
        <div class="user-actions">
          <div class="notifications">
            <i class="notification-icon">🔔</i>
            <span v-if="notifications.length > 0" class="badge">{{ notifications.length }}</span>
          </div>
          <div class="user-profile">
            <img :src="user.profilePicture || '../../assets/avatar-placeholder.png'" alt="User" class="avatar" />
            <span>{{ user.firstName }} {{ user.lastName }}</span>
            <div class="dropdown-menu">
              <a href="#profile">My Profile</a>
              <a href="#settings">Settings</a>
              <a @click="logout" href="#">Logout</a>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Loading your messages...</p>
    </div>

    <div v-else class="content-container">
      <div class="messages-layout">
        <!-- Conversations List -->
        <div class="conversations-panel">
          <div class="conversations-header">
            <h2>Messages</h2>
            <div class="search-container">
              <input 
                type="text" 
                v-model="searchQuery" 
                placeholder="Search conversations..." 
                class="search-input"
              />
              <i class="search-icon">🔍</i>
            </div>
          </div>
          
          <!-- Conversations List -->
          <div v-if="conversations.length > 0" class="conversations-list">
            <div 
              v-for="conversation in filteredConversations" 
              :key="conversation.id" 
              :class="['conversation-item', { active: activeConversationId === conversation.id }]"
              @click="selectConversation(conversation.id)"
            >
              <div class="conversation-avatar">
                <img :src="getRecipientAvatar(conversation)" alt="User" />
              </div>
              <div class="conversation-info">
                <div class="conversation-name">{{ getRecipientName(conversation) }}</div>
                <div class="conversation-preview">{{ getLastMessagePreview(conversation) }}</div>
              </div>
              <div class="conversation-meta">
                <div class="conversation-time">{{ formatTime(conversation.lastMessage?.createdAt) }}</div>
                <div v-if="conversation.unreadCount > 0" class="unread-badge">{{ conversation.unreadCount }}</div>
              </div>
            </div>
          </div>
          
          <!-- Empty state for conversations -->
          <div v-else class="empty-conversations">
            <div class="empty-icon">💬</div>
            <p>No conversations yet</p>
            <p class="empty-subtitle">Start chatting with a service provider</p>
          </div>
        </div>

        <!-- Message Detail Area -->
        <div class="message-detail">
          <!-- Message Header -->
          <div v-if="activeConversation" class="message-header">
            <div class="recipient-info">
              <img :src="getRecipientAvatar(activeConversation)" alt="Recipient" class="recipient-avatar" />
              <div>
                <div class="recipient-name">{{ getRecipientName(activeConversation) }}</div>
                <div class="recipient-status">{{ getRecipientStatus(activeConversation) }}</div>
              </div>
            </div>
            <div class="message-actions">
              <button class="action-btn" title="Call">📞</button>
              <button class="action-btn" title="Video call">📹</button>
              <button class="action-btn" title="Info">ℹ️</button>
            </div>
          </div>

          <!-- Message Content Area -->
          <div v-if="activeConversation" class="message-content">
            <div v-if="messages.length > 0" class="messages-list" ref="messagesList">
              <!-- Date separator -->
              <template v-for="(message, index) in messages" :key="message.id">
                <div 
                  v-if="shouldShowDateSeparator(message, index)" 
                  class="date-separator"
                >
                  <span>{{ formatDate(message.createdAt) }}</span>
                </div>
                
                <!-- Message bubble -->
                <div :class="['message-bubble', { 'outgoing': message.senderId === user.id }]">
                  <div class="message-time">{{ formatMessageTime(message.createdAt) }}</div>
                  <div class="message-text">{{ message.content }}</div>
                  <div v-if="message.senderId === user.id" class="message-status">
                    <span :class="['status-icon', message.read ? 'read' : 'sent']">
                      {{ message.read ? '✓✓' : '✓' }}
                    </span>
                  </div>
                </div>
              </template>
            </div>
            
            <div v-else class="empty-messages">
              <div class="empty-icon">✉️</div>
              <p>No messages yet</p>
              <p class="empty-subtitle">Start the conversation by sending a message</p>
            </div>

            <!-- Message Input Area -->
            <div class="message-input-container">
              <div class="message-attachments">
                <button class="attachment-btn" title="Add attachment">📎</button>
                <button class="attachment-btn" title="Send image">🖼️</button>
              </div>
              <div class="message-composer">
                <textarea 
                  v-model="newMessage" 
                  placeholder="Type a message..." 
                  class="message-input"
                  @keydown.enter.prevent="sendMessage"
                  ref="messageInput"
                ></textarea>
                <button 
                  :class="['send-btn', { disabled: !newMessage.trim() }]" 
                  @click="sendMessage"
                  :disabled="!newMessage.trim()"
                >
                  <span class="send-icon">📨</span>
                </button>
              </div>
            </div>
          </div>
          
          <!-- No active conversation state -->
          <div v-else class="no-conversation-selected">
            <div class="empty-icon">💬</div>
            <h3>Select a conversation</h3>
            <p>Choose a conversation from the list or start a new one</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ClientMessages',
  data() {
    return {
      loading: true,
      user: {
        id: '',
        firstName: '',
        lastName: '',
        email: '',
        profilePicture: null
      },
      notifications: [],
      conversations: [],
      filteredConversations: [],
      activeConversationId: null,
      activeConversation: null,
      messages: [],
      newMessage: '',
      searchQuery: '',
      apiBaseUrl: 'http://localhost:5500/api',
      messagesPollingInterval: null,
      conversationsPollingInterval: null
    };
  },
  created() {
    // Initialize arrays
    this.notifications = [];
    this.conversations = [];
    this.filteredConversations = [];
    this.messages = [];
    
    // Try to get user data from localStorage first
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const userData = JSON.parse(userString);
        // Check if user data contains nested user object
        if (userData.user) {
          this.user.id = userData.user.id || '';
          this.user.firstName = userData.user.firstName || '';
          this.user.lastName = userData.user.lastName || '';
          this.user.email = userData.user.email || '';
          this.user.profilePicture = userData.user.profilePicture || null;
        } else {
          this.user.id = userData.id || '';
          this.user.firstName = userData.firstName || '';
          this.user.lastName = userData.lastName || '';
          this.user.email = userData.email || '';
          this.user.profilePicture = userData.profilePicture || null;
        }
      } catch (e) {
        console.error('Error parsing user from localStorage:', e);
      }
    }
    
    // Fetch initial data
    this.fetchUserData();
    this.fetchConversations();
    this.fetchNotifications();
    
    // Setup polling for new messages and conversations
    this.startPolling();
  },
  beforeUnmount() {
    this.stopPolling();
  },
  watch: {
    activeConversationId(newId) {
      if (newId) {
        this.fetchMessages(newId);
        this.markConversationAsRead(newId);
        // Find and set active conversation
        this.activeConversation = this.conversations.find(c => c.id === newId) || null;
      } else {
        this.activeConversation = null;
        this.messages = [];
      }
    },
    searchQuery(newQuery) {
      this.filterConversations();
    },
    messages() {
      this.$nextTick(() => {
        this.scrollToBottom();
      });
    }
  },
  methods: {
    async fetchUserData() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          this.$router.push('/login');
          return;
        }

        const response = await fetch(`${this.apiBaseUrl}/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('token');
            this.$router.push('/login');
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const userData = await response.json();
        this.user = userData;
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    },

    async fetchConversations() {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch(`${this.apiBaseUrl}/conversations`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        this.conversations = Array.isArray(data) ? data : [];
        
        // Sort conversations by most recent message
        this.conversations.sort((a, b) => {
          const dateA = a.lastMessage?.createdAt ? new Date(a.lastMessage.createdAt) : new Date(0);
          const dateB = b.lastMessage?.createdAt ? new Date(b.lastMessage.createdAt) : new Date(0);
          return dateB - dateA;
        });
        
        this.filterConversations();
        
        // If there's an active conversation, update its data
        if (this.activeConversationId) {
          this.activeConversation = this.conversations.find(c => c.id === this.activeConversationId) || null;
        }
        // If there's no active conversation but there are conversations, select the first one
        else if (this.conversations.length > 0 && !this.activeConversationId) {
          this.selectConversation(this.conversations[0].id);
        }
      } catch (error) {
        console.error('Error fetching conversations:', error);
        this.conversations = [];
      } finally {
        this.loading = false;
      }
    },

    async fetchMessages(conversationId) {
      if (!conversationId) return;
      
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch(`${this.apiBaseUrl}/conversations/${conversationId}/messages`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        this.messages = Array.isArray(data) ? data : [];
        
        // Sort messages by date
        this.messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        
        // Mark conversation as read
        this.markConversationAsRead(conversationId);
      } catch (error) {
        console.error('Error fetching messages:', error);
        this.messages = [];
      }
    },

    async markConversationAsRead(conversationId) {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch(`${this.apiBaseUrl}/conversations/${conversationId}/read`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Update local conversation data
        const conversation = this.conversations.find(c => c.id === conversationId);
        if (conversation) {
          conversation.unreadCount = 0;
        }
      } catch (error) {
        console.error('Error marking conversation as read:', error);
      }
    },

    async fetchNotifications() {
      try {
        // This would need a notifications endpoint
        const token = localStorage.getItem('token');
        if (!token) return;

        // If there's a notifications endpoint, uncomment this
        /*
        const response = await fetch(`${this.apiBaseUrl}/notifications`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        this.notifications = Array.isArray(data) ? data : [];
        */

        // Placeholder data
        this.notifications = [];
      } catch (error) {
        console.error('Error fetching notifications:', error);
        this.notifications = [];
      }
    },

    async sendMessage() {
      if (!this.newMessage.trim() || !this.activeConversationId) return;
      
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const message = {
          content: this.newMessage.trim(),
          conversationId: this.activeConversationId,
          senderId: this.user.id
        };

        const response = await fetch(`${this.apiBaseUrl}/conversations/${this.activeConversationId}/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(message)
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Add message to local state immediately for better UX
        const tempMessage = {
          ...message,
          id: `temp-${Date.now()}`,
          createdAt: new Date().toISOString(),
          read: false
        };
        this.messages.push(tempMessage);
        
        // Clear input
        this.newMessage = '';
        
        // Focus back on input
        this.$nextTick(() => {
          this.$refs.messageInput?.focus();
        });
        
        // Fetch latest messages to ensure we have the server's response
        setTimeout(() => {
          this.fetchMessages(this.activeConversationId);
          this.fetchConversations(); // Update conversation list with latest message
        }, 500);
      } catch (error) {
        console.error('Error sending message:', error);
        // Show error to user
        alert('Failed to send message. Please try again.');
      }
    },

    selectConversation(conversationId) {
      this.activeConversationId = conversationId;
    },

    filterConversations() {
      if (!this.searchQuery) {
        this.filteredConversations = [...this.conversations];
        return;
      }
      
      const query = this.searchQuery.toLowerCase();
      this.filteredConversations = this.conversations.filter(conversation => {
        // Get recipient data
        const recipient = this.getConversationRecipient(conversation);
        if (!recipient) return false;
        
        // Check if name or last message content contains query
        const name = `${recipient.firstName} ${recipient.lastName}`.toLowerCase();
        const lastMessage = (conversation.lastMessage?.content || '').toLowerCase();
        
        return name.includes(query) || lastMessage.includes(query);
      });
    },

    getConversationRecipient(conversation) {
      if (!conversation || !conversation.participants) return null;
      
      // Find the participant that is not the current user
      return conversation.participants.find(p => p.id !== this.user.id);
    },

    getRecipientName(conversation) {
      const recipient = this.getConversationRecipient(conversation);
      if (!recipient) return 'Unknown';
      return `${recipient.firstName} ${recipient.lastName}`;
    },

    getRecipientAvatar(conversation) {
      const recipient = this.getConversationRecipient(conversation);
      return recipient?.profilePicture || '../../assets/avatar-placeholder.png';
    },

    getRecipientStatus(conversation) {
      const recipient = this.getConversationRecipient(conversation);
      // This is where you could check online status if you had that info
      return recipient?.online ? 'Online' : 'Offline';
    },

    getLastMessagePreview(conversation) {
      if (!conversation.lastMessage) return 'No messages yet';
      
      let prefix = '';
      if (conversation.lastMessage.senderId === this.user.id) {
        prefix = 'You: ';
      }
      
      // Truncate message if needed
      const message = conversation.lastMessage.content;
      const maxLength = 30;
      if (message.length > maxLength) {
        return prefix + message.substring(0, maxLength) + '...';
      }
      return prefix + message;
    },

    formatTime(dateString) {
      if (!dateString) return '';
      
      const date = new Date(dateString);
      const now = new Date();
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      
      // If today, show time
      if (date.toDateString() === now.toDateString()) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
      
      // If yesterday, show "Yesterday"
      if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
      }
      
      // If this week, show day name
      if (now - date < 7 * 24 * 60 * 60 * 1000) {
        return date.toLocaleDateString([], { weekday: 'short' });
      }
      
      // Otherwise show date
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    },

    formatDate(dateString) {
      if (!dateString) return '';
      
      const date = new Date(dateString);
      const now = new Date();
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      
      // If today, show "Today"
      if (date.toDateString() === now.toDateString()) {
        return 'Today';
      }
      
      // If yesterday, show "Yesterday"
      if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
      }
      
      // Otherwise show full date
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    },

    formatMessageTime(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    },

    shouldShowDateSeparator(message, index) {
      if (index === 0) return true;
      
      const currentDate = new Date(message.createdAt).toDateString();
      const prevDate = new Date(this.messages[index - 1].createdAt).toDateString();
      
      return currentDate !== prevDate;
    },

    scrollToBottom() {
      if (!this.$refs.messagesList) return;
      
      const element = this.$refs.messagesList;
      element.scrollTop = element.scrollHeight;
    },

    startPolling() {
      // Poll for new messages every 10 seconds
      this.messagesPollingInterval = setInterval(() => {
        if (this.activeConversationId) {
          this.fetchMessages(this.activeConversationId);
        }
      }, 10000);
      
      // Poll for new conversations every 15 seconds
      this.conversationsPollingInterval = setInterval(() => {
        this.fetchConversations();
      }, 15000);
    },

    stopPolling() {
      clearInterval(this.messagesPollingInterval);
      clearInterval(this.conversationsPollingInterval);
    },

    logout() {
      localStorage.removeItem('token');
      this.$router.push('/login');
    }
  }
}
</script>

<style scoped>
.messages-container {
  width: 100%;
  min-height: 100vh;
  background-color: #f5f7fa;
}

/* Navbar styles */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 2rem;
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;
}

.logo {
  height: 60px;
  width: auto;
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
}

.nav-links a {
  text-decoration: none;
  color: #4a5568;
  font-weight: 500;
  padding: 0.5rem 0;
  position: relative;
}

.nav-links a.active,
.nav-links a:hover {
  color: #2bad61;
}

.nav-links a.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #2bad61;
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.notifications {
  position: relative;
  cursor: pointer;
}

.notification-icon {
  font-size: 1.25rem;
}

.badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: #e53e3e;
  color: white;
  font-size: 0.75rem;
  font-weight: bold;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  cursor: pointer;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 0.5rem 0;
  min-width: 150px;
  display: none;
}

.user-profile:hover .dropdown-menu {
  display: block;
}

.dropdown-menu a {
  display: block;
  padding: 0.5rem 1rem;
  text-decoration: none;
  color: #4a5568;
  transition: background-color 0.2s ease;
}

.dropdown-menu a:hover {
  background-color: #f5f7fa;
  color: #2bad61;
}

/* Loading state */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 70vh;
  gap: 1.5rem;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #2bad61;
  border-radius: 50%;
  animation: spin 1.5s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Content container */
.content-container {
  padding: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

/* Messages Layout */
.messages-layout {
  display: flex;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  height: calc(90vh - 100px);
  overflow: hidden;
}

/* Conversations Panel */
.conversations-panel {
  width: 340px;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
}

.conversations-header {
  padding: 1.25rem;
  border-bottom: 1px solid #e2e8f0;
}

.conversations-header h2 {
  margin: 0 0 1rem;
  font-size: 1.5rem;
  color: #2d3748;
}

.search-container {
  position: relative;
}

.search-input {
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.875rem;
  width: 100%;
  background-color: #f7fafc;
}

.search-input:focus {
  outline: none;
  border-color: #2bad61;
  box-shadow: 0 0 0 1px #2bad61;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #718096;
  font-size: 0.875rem;
}

.conversations-list {
  flex: 1;
  overflow-y: auto;
}

.conversation-item {
  display: flex;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #f7fafc;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.conversation-item:hover {
  background-color: #f7fafc;
}

.conversation-item.active {
  background-color: #f0fff4;
  border-left: 3px solid #2bad61;
}

.conversation-avatar {
  margin-right: 0.75rem;
}

.conversation-avatar img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.conversation-info {
  flex: 1;
  margin-right: 0.5rem;
  overflow: hidden;
}

.conversation-name {
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.conversation-preview {
  font-size: 0.875rem;
  color: #718096;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.conversation-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  min-width: 40px;
}

.conversation-time {
  font-size: 0.75rem;
  color: #a0aec0;
  margin-bottom: 0.25rem;
}

.unread-badge {
  background-color: #2bad61;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  min-width: 20px;
  height: 20px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 0.25rem;
}

/* Empty states */
.empty-conversations,
.empty-messages,
.no-conversation-selected {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
  height: 100%;
  color: #718096;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #a0aec0;
}

.empty-conversations p,
.empty-messages p,
.no-conversation-selected p {
  margin: 0.25rem 0;
}

.empty-subtitle {
  font-size: 0.875rem;
  color: #a0aec0;
}

/* Message Detail Area */
.message-detail {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #fafafa;
}

/* Message Header */
.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #e2e8f0;
  background-color: white;
}

.recipient-info {
  display: flex;
  align-items: center;
}

.recipient-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 0.75rem;
}

.recipient-name {
  font-weight: 600;
  color: #2d3748;
}

.recipient-status {
  font-size: 0.75rem;
  color: #2bad61;
}

.message-actions {
  display: flex;
  gap: 0.75rem;
}

.action-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.25rem;
  padding: 0.25rem;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
}

.action-btn:hover {
  background-color: #f7fafc;
}

/* Message Content */
.message-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
}

.messages-list {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.date-separator {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1rem 0;
  position: relative;
}

.date-separator span {
  background-color: #f0f0f0;
  padding: 0.35rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  color: #718096;
}

.message-bubble {
  max-width: 70%;
  padding: 0.5rem 1rem;
  border-radius: 12px;
  position: relative;
  margin-bottom: 0.5rem;
  align-self: flex-start;
  background-color: white;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.message-bubble.outgoing {
  align-self: flex-end;
  background-color: #e3f8ec;
}

.message-text {
  font-size: 0.95rem;
  color: #4a5568;
  white-space: pre-wrap;
  word-break: break-word;
}

.message-time {
  font-size: 0.7rem;
  color: #a0aec0;
  margin-bottom: 0.25rem;
}

.message-status {
  position: absolute;
  right: 8px;
  bottom: -14px;
  font-size: 0.7rem;
}

.status-icon {
  color: #a0aec0;
}

.status-icon.read {
  color: #2bad61;
}

/* Message Input */
.message-input-container {
  padding: 1rem;
  border-top: 1px solid #e2e8f0;
  background-color: white;
}

.message-attachments {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.attachment-btn {
  background: none;
  border: none;
  font-size: 1.25rem;
  padding: 0.25rem;
  cursor: pointer;
  color: #718096;
  transition: color 0.2s ease;
}

.attachment-btn:hover {
  color: #2bad61;
}

.message-composer {
  display: flex;
  gap: 0.75rem;
  align-items: flex-end;
}

.message-input {
  flex: 1;
  border: 1px solid #e2e8f0;
  border-radius: 24px;
  padding: 0.75rem 1rem;
  font-size: 0.95rem;
  resize: none;
  max-height: 120px;
  min-height: 24px;
  outline: none;
  transition: border-color 0.2s ease;
}

.message-input:focus {
  border-color: #2bad61;
}

.send-btn {
  background-color: #2bad61;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.send-btn:hover {
  background-color: #239d58;
}

.send-btn.disabled {
  background-color: #e2e8f0;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .nav-menu {
    flex-direction: column;
    gap: 1rem;
  }
  
  .messages-layout {
    flex-direction: column;
    height: auto;
  }
  
  .conversations-panel {
    width: 100%;
    height: 350px;
  }
  
  .message-detail {
    height: calc(100vh - 450px);
  }
}
</style>
