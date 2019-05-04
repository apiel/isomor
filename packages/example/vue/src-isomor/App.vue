<template>
  <div id="app">
    <h1>Isomor Vue example</h1>
    <ul id="example-1">
      <li v-for="item in list">
        {{ item }}
      </li>
    </ul>
    <button @click="load()">load</button>
    <TwoColumn />
    <Stats />
    <ErrorExample />
    <ErrorExample2 />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import TwoColumn from "./components/TwoColumn.vue";
import Stats from "./components/status/Stats.vue";
import ErrorExample from "./components/error/ErrorExample.vue";
import ErrorExample2 from "./components/error/ErrorExample2.vue";
import { getList } from "./server/data";

@Component({
  components: {
    TwoColumn,
    Stats,
    ErrorExample,
    ErrorExample2,
  }
})
export default class App extends Vue {
  private list!: string[];

  async load() {
    this.list = await getList({ foo: "bar" });
  }

  data() {
    return {
      list: null
    };
  }
  mounted() {
    this.load();
  }
}
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
