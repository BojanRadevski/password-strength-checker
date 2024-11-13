<template>
  <div class="header">
    <div class="left-section">
      <img class="logo" src="../../assets/logo.png" />
      <h2 class="logo-title">Search Hacker News</h2>
    </div>
    <div class="center-section">
      <SearchBar @search="handleSearch" />
    </div>
    <button @click="logoutUser" class="logout-button">
      <i class="pi pi-sign-out"></i> Logout
    </button>
  </div>
</template>

<script setup>
import SearchBar from "../header/SearchBar.vue";
import { useRouter } from "vue-router";
import { defineEmits } from "vue";

const emit = defineEmits(["search"]);

const router = useRouter();

const handleSearch = (query) => {
  emit("search", query);
};

const logoutUser = () => {
  localStorage.removeItem("isLoggedIn");
  router.push("/login");
};
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  background-color: rgb(255, 166, 0);
  width: 100%;
  box-sizing: border-box;
  flex-wrap: nowrap;
  gap: 10px;
}
.left-section {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo {
  width: 40px;
  height: 40px;
}

.logo-title {
  font-size: 1.2rem;
  margin: 0;
  white-space: nowrap;
}

.center-section {
  flex-grow: 1;
  display: flex;
  justify-content: center;
}

.logout-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: #f0f0f0;
  color: #333;
  font-size: 1rem;
  font-weight: 500;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.logout-button i {
  font-size: 1.2rem;
}

.logout-button:hover {
  background-color: #e0e0e0;
  color: #000;
}

.logout-button:active {
  background-color: #d0d0d0;
}

.logout-button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(200, 200, 200, 0.5);
}

@media (max-width: 1024px) {
  .logo-title {
    font-size: 1rem;
  }
}

@media (max-width: 768px) {
  .header {
    flex-wrap: wrap;
    justify-content: center;
    gap: 5px;
  }

  .left-section,
  .center-section,
  .logout-button {
    flex: 1 1 100%;
    justify-content: center;
    text-align: center;
  }

  .logo {
    width: 35px;
    height: 35px;
  }

  .logo-title {
    font-size: 1.1rem;
  }

  .logout-button {
    font-size: 0.9rem;
    padding: 6px 12px;
    margin-left: 2rem;
    margin-right: 2rem;
  }
}

@media (max-width: 480px) {
  .header {
    padding: 5px;
  }

  .logo {
    width: 30px;
    height: 30px;
  }

  .logo-title {
    font-size: 0.9rem;
  }

  .logout-button {
    font-size: 0.8rem;
    padding: 5px 10px;

    margin-left: 2rem;
    margin-right: 2rem;
  }
}

@media (max-width: 376px) {
  .header {
    padding: 5px;
  }

  .logo {
    width: 25px;
    height: 25px;
  }

  .logo-title {
    font-size: 0.9rem;
  }

  .logout-button {
    font-size: 0.8rem;
    padding: 5px 10px;

    margin-left: 2rem;
    margin-right: 2rem;
  }
}
</style>
