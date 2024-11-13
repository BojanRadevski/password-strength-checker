<template>
  <div class="filter-container">
    <span>Search </span>
    <select v-model="selectedCategory" @change="fetchFilteredStories">
      <option value="all">All</option>
      <option value="topstories">Stories</option>
      <option value="newstories">Comments</option>
      <option value="askstories">Ask HN</option>
      <option value="showstories">Show HN</option>
      <option value="jobstories">Jobs</option>
    </select>
    <span> by </span>
    <select v-model="sortBy" @change="fetchFilteredStories">
      <option value="popularity">Popularity</option>
      <option value="date">Date</option>
    </select>
    <span> for </span>
    <select v-model="timeRange" @change="fetchFilteredStories">
      <option value="all">All time</option>
      <option value="24h">Last 24h</option>
      <option value="week">Past Week</option>
      <option value="month">Past Month</option>
      <option value="year">Past Year</option>
      <option value="custom">Custom range</option>
    </select>
  </div>
  <div v-if="!loading">
    <ul class="story-list">
      <li v-for="story in filteredStories" :key="story.id" class="story-item">
        <div class="story-title">
          <router-link :to="`/post/${story.id}`" class="story-title">{{
            story.title
          }}</router-link>
        </div>
        <div class="story-details">
          <span>{{ story.score }} points</span> | <span>{{ story.by }}</span> |
          <span>{{ timeAgo(story.time) }}</span> |
          <span>{{ story.descendants || 0 }} comments</span>
        </div>
        <p v-if="story.text" class="story-text" v-html="story.text"></p>
      </li>
    </ul>
    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
      <span>Page {{ currentPage }}</span>
      <button @click="nextPage">Next</button>
    </div>
  </div>
  <div v-if="loading" class="loading-container">
    <ProgressSpinner />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { fetchStories } from "../../services/hackerNewsService";
import { defineProps } from "vue";
import { computed, watch } from "vue";
import ProgressSpinner from "primevue/progressspinner";
import { formatDistanceToNow } from "date-fns";

const props = defineProps(["searchQuery"]);

const selectedCategory = ref("topstories");
const sortBy = ref("popularity");
const timeRange = ref("24h");

const loading = ref(false);

const stories = ref([]);

const currentPage = ref(1);
const rowsPerPage = 20;

const nextPage = () => {
  currentPage.value++;
  fetchFilteredStories();
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    fetchFilteredStories();
  }
};

const filteredStories = computed(() => {
  if (!props.searchQuery) return stories.value;
  const lowerQuery = props.searchQuery.toLowerCase();
  return stories.value.filter((story) => {
    return (
      story.title?.toLowerCase().includes(lowerQuery) ||
      story.url?.toLowerCase().includes(lowerQuery) ||
      story.by?.toLowerCase().includes(lowerQuery)
    );
  });
});

const fetchFilteredStories = async () => {
  loading.value = true;
  if (selectedCategory.value) {
    const fetchedStories = await fetchStories(
      selectedCategory,
      currentPage.value,
      rowsPerPage
    );
    loading.value = false;
    // we filter them by time selected in the dropdown and we check which ones have been posted in that timeframe
    stories.value = fetchedStories
      .filter((story) => {
        if (timeRange.value !== "all") {
          const currentTime = Date.now() / 1000;
          let timeLimit;
          switch (timeRange.value) {
            case "24h":
              timeLimit = currentTime - 86400;
              break;
            case "week":
              timeLimit = currentTime - 604800;
              break;
            case "month":
              timeLimit = currentTime - 2592000;
              break;
            case "year":
              timeLimit = currentTime - 31536000;
              break;
            default:
              timeLimit = 0;
          }

          return story.time >= timeLimit;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy.value === "popularity") {
          return b.score - a.score;
        } else if (sortBy.value === "date") {
          return b.time - a.time;
        }
        return 0;
      });
  } else {
    stories.value = [];
  }
};

const timeAgo = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return `${formatDistanceToNow(date)} ago`;
};
watch([selectedCategory, timeRange], fetchFilteredStories);

// INITIAL API CALL
fetchFilteredStories();
</script>

<style scoped>
.filter-container {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 1rem;
}

.search-input {
  width: 200px;
  padding: 5px;
}

select {
  padding: 5px;
}

.story-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.story-item {
  margin-bottom: 1.5rem;
  text-align: start;
}

.story-title a {
  font-size: 1.1em;
  font-weight: bold;
  color: #333;
  text-decoration: none;
}

.story-title a:hover {
  text-decoration: underline;
}

.story-details {
  color: #777;
  font-size: 0.875em;
}

.story-text {
  font-size: 0.875em;
  color: #555;
  margin-top: 0.5rem;
  line-height: 1.4;
}

@media (max-width: 768px) {
  .filter-container {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
}

.search-input {
  width: 200px;
  padding: 5px;
}

@media (max-width: 768px) {
  .search-input {
    width: 100%;
  }
}

select {
  padding: 5px;
}

.story-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.story-item {
  margin-bottom: 1.5rem;
  text-align: start;
}

.story-title a {
  font-size: 1.1em;
  font-weight: bold;
  color: #333;
  text-decoration: none;
}

@media (max-width: 768px) {
  .story-title a {
    font-size: 1em;
  }
}

.story-title a:hover {
  text-decoration: underline;
}

.story-details {
  color: #777;
  font-size: 0.875em;
}

@media (max-width: 768px) {
  .story-details {
    font-size: 0.8em;
  }
}

.story-text {
  font-size: 0.875em;
  color: #555;
  margin-top: 0.5rem;
  line-height: 1.4;
}

@media (max-width: 768px) {
  .story-text {
    font-size: 0.75em;
  }
}

.loading-container {
  height: 40vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
.loading-container {
  height: 40vh;
  display: flex;
  flex-direction: column-reverse;
}
</style>
