<template>
  <div class="search-container">
    <InputText
      v-model="searchQuery"
      type="text"
      placeholder="Search stories by title, url or author"
      fluid
      class="search-input"
    />
    <i class="pi pi-search search-icon" @click="performSearch"></i>
  </div>
</template>

<script setup>
import InputText from "primevue/inputtext";
import "primeicons/primeicons.css";
import { defineEmits } from "vue";
import { ref, watch } from "vue";

const searchQuery = ref("");
const emit = defineEmits(["search"]);

/**
 * the value of the search is emmited from the search bar to the header to the home page and then to the stories list
 * so the stories can be filtered depending on what is entered in the search bar
 */
const performSearch = () => {
  emit("search", searchQuery.value);
};

watch(searchQuery, performSearch);
</script>

<style scoped>
.search-container {
  position: relative;
  display: flex;
  align-items: center;
  width: 90%;
  max-width: 400px;
  margin: 0 auto;
}

.search-input {
  width: 100%;
  padding-right: 40px;
}

.search-icon {
  position: absolute;
  right: 10px;
  cursor: pointer;
  color: #888;
  font-size: 1.2em;
}

@media (max-width: 768px) {
  .search-container {
    max-width: 100%;
    padding: 0 10px;
  }

  .search-input {
    padding-right: 30px;
  }

  .search-icon {
    font-size: 1.5em;
    right: 20px;
  }
}

@media (max-width: 480px) {
  .search-container {
    flex-direction: column;
  }

  .search-input {
    padding-right: 10px;
  }

  .search-icon {
    display: none;
  }
}
</style>
