<template>
  <div v-if="post" class="post-details">
    <h1>{{ post.title }}</h1>
    <div class="post-metadata">
      <p>
        By {{ post.by }} | Score: {{ post.score }} |
        {{ post.descendants || 0 }} comments
      </p>
      <p>Posted: {{ timeAgo(post.time) }}</p>
      <a v-if="post.url" :href="post.url" target="_blank">Read more</a>
    </div>
    <p v-html="post.text"></p>
    <div class="comments-section">
      <h3>Comments</h3>
      <PostComment
        v-for="comment in comments"
        :key="comment.id"
        :comment="comment"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { fetchStoryDetails } from "../../services/hackerNewsService";
import PostComment from "../posts/PostComment.vue";
import { formatDistanceToNow } from "date-fns";

const route = useRoute();
const post = ref(null);
const postId = route.params.id;
const comments = ref([]);

const fetchPostDetails = async () => {
  post.value = await fetchStoryDetails(postId);
  fetchPostComments();
};

/**
 * For all the comments a new component PostComment is called which displays the details about the comment
 */
const fetchPostComments = async () => {
  comments.value = await Promise.all(
    post.value.kids.map((kidId) => fetchStoryDetails(kidId))
  );
};

const timeAgo = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return `${formatDistanceToNow(date)} ago`;
};

onMounted(fetchPostDetails);
</script>

<style scoped>
.post-details {
  max-width: 100%;
  margin: auto;
  padding: 20px;
}

.post-metadata {
  color: #777;
}

.comments-section {
  margin-top: 30px;
}
</style>
