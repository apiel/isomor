<template>
    <p v-if="response">
        <b>Server time:</b> {{response.time}} <button @click="load()">reload</button>
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

  get response() {
    return this.cacheWatch.getResponse();
  }

  load() {
    this.cacheWatch.call();
  }

  async mounted() {
      this.load();
  }
}
</script>