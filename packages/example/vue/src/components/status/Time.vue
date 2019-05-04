<template>
    <p v-if="time">
        <b>Server time:</b> {{time}} <button @click="load()">reload</button>
    </p>
    <p v-else>Loading...</p>
</template>

<script lang="ts">
import {
  Component,
  Vue,
} from "vue-property-decorator";
import { useAsyncCacheWatch } from "vue-async-cache";
import { getTime } from "./server/getTime";

@Component
export default class Time extends Vue {
  private cacheWatch = useAsyncCacheWatch(getTime);

  get time() {
    return this.cacheWatch.getResponse().time;
  }

  load() {
    this.cacheWatch.load();
  }

  async mounted() {
      this.load();
  }
}
</script>