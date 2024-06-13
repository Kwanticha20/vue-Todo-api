<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

function logout() {
  // ทำการ logout logic
  // เช่น ลบสถานะการ login จาก local storage หรือ Vuex store
  localStorage.removeItem('isLoggedIn');
  router.push('/');
}
</script>

<template>
  <v-container>
    <v-btn @click="logout" color="primary">Logout</v-btn>
  </v-container>
</template>

<style scoped>
/* Custom styles here */
</style>