import axios from "axios";

const baseUrl = "https://hacker-news.firebaseio.com/v0";

//API call for the story ids of a given category
const fetchStoryIds = async (category) => {
  const endpoint = `${baseUrl}/${category.value}.json`;

  try {
    const response = await axios.get(endpoint);
    return response.data;
  } catch (err) {
    console.error("Error fetching story Ids:", err);
    return null;
  }
};

// API call that gets the story details for a given story id
export const fetchStoryDetails = async (id) => {
  const endpoint = `${baseUrl}/item/${id}.json`;
  try {
    const response = await axios.get(endpoint);
    return response.data;
  } catch (error) {
    console.error(`Error fetching story details for ${id}:`, error);
    return null;
  }
};

export const fetchStories = async (category, page = 1, rowsPerPage = 20) => {
  const ids = await fetchStoryIds(category);

  const start = (page - 1) * rowsPerPage;
  const end = start + rowsPerPage;

  const storyDetails = await Promise.all(
    ids.slice(start, end).map((id) => fetchStoryDetails(id))
  );

  return storyDetails.filter((story) => story != null);
};
