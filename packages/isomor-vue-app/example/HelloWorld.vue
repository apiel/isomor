<template>
  <p style="color: green">
    <b>Server uptime:</b>
    {{ uptime || 'loading...' }}
  </p>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { getServerUptime } from "./server/uptime";

@Component
export default class HelloWorld extends Vue {
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
