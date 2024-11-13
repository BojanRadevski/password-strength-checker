<template>
  <div class="white-box-col">
    <HeaderComponent
      class="header-container"
      @search="searchQuery = $event"
    ></HeaderComponent>
    <StoriesList :searchQuery="searchQuery"></StoriesList>
  </div>
</template>

<script setup>
import HeaderComponent from "../header/HeaderComponent.vue";
import StoriesList from "../../components/posts/StoriesList.vue";
import { ref } from "vue";
const searchQuery = ref("");
</script>

<style scoped>
.white-box-col {
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
}

.header-container {
  width: 100%;
  box-sizing: border-box;
}
</style>
