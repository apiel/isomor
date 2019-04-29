<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <p style="color: green">
      <b>Server uptime:</b>
      {{ uptime || 'loading...' }}
    </p>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { getServerUptime } from "./server/data";

@Component
export default class App extends Vue {
  private uptime!: string;

  data() {
    return {
      uptime: null
    };
  }
  async mounted() {
    this.uptime = await getServerUptime();
  }
}
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
