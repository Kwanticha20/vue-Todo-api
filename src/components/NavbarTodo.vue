<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import useMockStore from '../stores/useMockStore';

const drawer = ref(false);
const router = useRouter();
const userName = ref<string>(''); // Initialize with empty string or null

// Function to fetch user data from server
const fetchUserData = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return;

    const response = await useMockStore.get('/users', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data) {
      userName.value = response.data.username;
      localStorage.setItem('username', response.data.username); // Store username in localStorage
    } else {
      console.error('User data not found');
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
};

// Initialize userName with stored value from localStorage
const storedUsername = localStorage.getItem('username');
if (storedUsername) {
  userName.value = storedUsername;
}

// Watch Effect to update userName when isLoggedIn changes
watchEffect(() => {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  if (isLoggedIn === 'true') {
    fetchUserData();
  } else {
    userName.value = ''; // Clear userName when logged out
  }
});

// Function to toggle drawer visibility
const toggleDrawer = () => {
  drawer.value = !drawer.value;
};

// Function to handle logout
const logout = () => {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  router.push({ name: 'LoginView' });
};
</script>

<template>
  <v-layout class="mb-4">
    <v-app-bar color="green-lighten-1" prominent>
      <v-app-bar-nav-icon variant="text" @click.stop="toggleDrawer"></v-app-bar-nav-icon>
      <v-toolbar-title>My Files</v-toolbar-title>
    </v-app-bar>
    
    <v-navigation-drawer v-model="drawer" :location="$vuetify.display.mobile ? 'bottom' : undefined" temporary>
      <v-toolbar-title class="pa-4 pt-6">Name: {{ userName }}</v-toolbar-title>
      <v-list-item link @click="logout">
        <v-list-item-icon class="pa-2">
          <v-icon>mdi-logout</v-icon>
        </v-list-item-icon>
        <v-list-item-content>Logout</v-list-item-content>
      </v-list-item>
    </v-navigation-drawer>
  </v-layout>
</template>
