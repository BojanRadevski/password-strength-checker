<template>
  <div class="comment">
    <div class="comment-metadata">
      <span>{{ comment.by }}</span> |
      <span>{{ timeAgo(comment.time) }}</span>
    </div>
    <p v-html="comment.text" class="comment-text"></p>
    <div v-if="replies.length" class="replies">
      <PostComment v-for="reply in replies" :key="reply.id" :comment="reply" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineProps } from "vue";
import { fetchStoryDetails } from "../../services/hackerNewsService";
import PostComment from "./PostComment.vue";
import { formatDistanceToNow } from "date-fns";

const props = defineProps({
  comment: {
    type: Object,
    required: true,
  },
});

const replies = ref([]);
/**
 * For every kid (comment) on this comment i fetch the details about it
 * After that for every kid a new Post Comment is initialized recursively
 */
const fetchReplies = async () => {
  if (props.comment.kids) {
    replies.value = await Promise.all(
      props.comment.kids.map((kidId) => fetchStoryDetails(kidId))
    );
  }
};

const timeAgo = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return `${formatDistanceToNow(date)} ago`;
};

onMounted(fetchReplies);
</script>

<style scoped>
.comment {
  margin-left: 20px;
  margin-top: 10px;
  border-left: 2px solid #6b2828;
  border-bottom: 2px solid #6b2828;
  padding-left: 10px;
  margin-bottom: 20px;
}

.comment-metadata {
  color: #3f3b3b;
  font-size: 1em;
  text-align: start;
  font-weight: 800;
}

.comment-text {
  margin-top: 5px;
  text-align: start;
}

.replies {
  margin-top: 10px;
}
</style>
