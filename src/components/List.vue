<template>
  <div class="container">
    <h1>Top stories</h1>
    <div class="loader" v-if="loading">
      <p class="loader__container">Loading...</p>
    </div>
    <ul class="stories" v-if="!loading && !error">
      <li
        v-bind:key="index"
        v-for="(story, index) of stories"
        class="stories__item"
      >
        {{ story.title }}
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
      pageSize: 20
    };
  },
  async mounted() {
    function* getStories(ids) {
      yield* ids.map(id => http.get(`/item/${id}.json`));
    }

    this.error = false;
    try {
      const resp = await http.get(`/topstories.json?print=pretty`);
      const ids = resp.data.slice(this.page, (this.page + 1) * this.pageSize);
      for await (let promise of getStories(ids)) {
        const response = await promise;
        const story = response.data;
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
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

.container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.loader {
  &__container {
    height: 200px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
}
</style>
