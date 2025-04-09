
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';  // Import useRouter

const username = ref('');
const password = ref('');
const router = useRouter();  // Access the router instance

const login = () => {
    // Check if username and password are provided
    if (!username.value || !password.value) {
        alert('Please enter both username and password');
        return; // Prevent further action if fields are empty
    }

    // Get the users list from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Find a matching user
    const user = users.find((user) => user.username === username.value);

    // Check if user exists and if the password matches
    if (user && user.password === password.value) {
        localStorage.setItem("username", username.value);
        localStorage.setItem("password", password.value);
        router.push('/home');
    }
    else {
        alert('Invalid username or password');
    }
};

const createAccount = () => {
    // Check if username and password are provided
    if (!username.value || !password.value) {
        alert('Please enter both username and password');
        return; // Prevent further action if fields are empty
    }

    // Get the existing users from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Add the new user to the list
    users.push({ username: username.value, password: password.value });

    // Save the updated users list back to localStorage
    localStorage.setItem('users', JSON.stringify(users));

    alert('Account Created!');
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("username", username.value);
    localStorage.setItem("password", password.value);
    router.push('/home');
};
</script>

<template>
  <div class="login-container flex justify-center items-center h-screen bg-primary-grey">
    <div class="bg-secondary-grey p-8 rounded-lg shadow-lg w-96">
      <h1 class="text-3xl font-bold text-primary-paige text-center mb-6">Login</h1>
      <input v-model="username" class="w-full p-3 mb-4 border border-secondary-grey rounded-md text-primary-text" placeholder="Username" />
      <input v-model="password" type="password" class="w-full p-3 mb-6 border border-secondary-grey rounded-md text-primary-text" placeholder="Password" />
      
      <!-- Login Button with small grey border, fills with blue color -->
      <button 
        @click="login" 
        class="w-[50%] p-3 text-primary-paige bg-blue-500 border border-secondary-grey rounded-md hover:bg-blue-600 transition-colors">
        Login
      </button>

      <!-- Create Account Button with small grey border, placed on a new line -->
      <button 
        @click="createAccount" 
        class="w-[50%] p-3 text-primary-paige border border-secondary-grey rounded-md hover:bg-primary-grey transition-colors mt-4">
        Create Account
      </button>
    </div>
  </div>
</template>