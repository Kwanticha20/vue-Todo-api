<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import  useMockStore from '../stores/useMockStore';


const username = ref('');
const password = ref('');
const visible = ref(false);
const loading = ref(false);
const error = ref<string | null>(null);
const router = useRouter();


async function onLogin() {
  loading.value = true;
  error.value = null;

  try {
    const response = await useMockStore.post('login', {
      username: username.value,
      password: password.value,
    });

    if (response.data === 'Login successful') {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('username', username.value); // Store username in localStorage
      router.push('/todo');
      console.log('Login successful:', username.value);
    } else {
      error.value = 'Invalid login credentials';
      console.log('Login failed:', username.value);
    }
  } catch (err) {
    error.value = 'An error occurred during login';
    console.error('Login error:', err);
  } finally {
    loading.value = false;
  }
}

</script>

<template>
  <v-container class="justify-center align-center" fill-height>
    <v-card class="mx-auto px-6 py-8 mt-12" max-width="450" color="grey-lighten-5">
      <div class="center-container">
        <div class="text-h5 text-md-h5 text-lg-h4 mb-2">Login</div>
      </div>
      <v-form @submit.prevent="onLogin">
        <v-text-field
          v-model="username"
          label="Username"
          type="text"
          :readonly="loading"
          :rules="[v => !!v || 'Username is required']"
          class="mb-2"
          placeholder="Enter your Username"
          variant="solo"
          rounded
          required
          clearable
          :error-messages="error ? [error] : []"
        ></v-text-field>

        <v-text-field
          class="my-3"
          v-model="password"
          label="Password"
          :type="visible ? 'text' : 'password'"
          placeholder="Enter your password"
          variant="solo"
          :readonly="loading"
          :rules="[v => !!v || 'Password is required']"
          :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append-inner="visible = !visible"
          density="compact"
          rounded
          required
          clearable
        ></v-text-field>

        <div class="button-container">
          <v-btn
            :disabled="!username || !password || loading"
            :loading="loading"
            color="green-lighten-1"
            type="submit"
            variant="elevated"
            rounded
            class="mr-4"
          >
            Login
          </v-btn>

          <v-btn
            :to="{ name: 'RegisterView' }"
            color="grey-lighten-3"
            class="text-grey-darken-2"
            rounded
          >
            Register
          </v-btn>
        </div>

        <v-alert v-if="error" class="mt-5" type="error" dismissible>
          {{ error }}
        </v-alert>
      </v-form>
    </v-card>
  </v-container>
</template>

<style scoped>
  .center-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50px;
  }

  .button-container {
    display: flex;
    justify-content: center;
    margin-top: 20px; /* Adjust as needed */
  }

  .button-container > * {
    margin: 0 12px; /* ปรับแต่งขอบเขต (margin) ระหว่างปุ่มเพื่อให้มีการเว้นระยะห่างที่เหมาะสม */
  }
</style>
