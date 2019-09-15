<template>
  <div class="container">
    <h1>Top stories</h1>
    <div class="loader" v-if="loading">
      <p class="loader__container">Loading...</p>
    </div>
    <ul class="stories" v-if="!loading && !error">
      <li v-bind:key="index" v-for="(story, index) of stories" class="story">
        <p class="story__title">{{ story.title }}</p>
        <small class="story__date">{{ new Date(story.time * 1000) }}</small>
        <a :href="story.url">{{ story.url }}</a>
      </li>
    </ul>
  </div>
</template>

<script>
import { http } from "@/services/api";

export default {
  name: "List",
  data() {
    return {
      stories: [],
      loading: true,
      error: false,
      page: 0,
      pageSize: 40
    };
  },
  async mounted() {
    /**
     * Async generator to return a promise for each story api call
     * Enables displaying stories as soon as they are fetched
     * @param {Array} ids
     * @returns {IterableIterator<*>}
     */
    function* getStories(ids) {
      yield* ids.map(id => http.get(`/item/${id}.json`));
    }

    this.error = false;

    try {
      const resp = await http.get(`/topstories.json?print=pretty`);
      // remove loading after the top stories are fetched
      this.loading = false;
      const ids = resp.data.slice(this.page, (this.page + 1) * this.pageSize);
      for await (let promise of getStories(ids)) {
        const response = await promise;
        const story = response.data;
        console.log("st", story);
        this.stories = [...this.stories, story];
      }
    } catch (e) {
      this.error = true;
    } finally {
      this.loading = false;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin: 0 10px;
}

a {
  color: #42b983;
}

.container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.loader {
  &__container {
    height: 200px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
}

.story {
  display: flex;
  flex-direction: column;
}
</style>
