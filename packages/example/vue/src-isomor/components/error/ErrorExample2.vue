<template>
    <div>
        <p v-if="error" class="error"><b>Some error handling example 2:</b> {{error}} </p>
        <button @click="load()">Throw another error</button>
    </div>
</template>

<script lang="ts">
import {
  Component,
  Vue,
} from "vue-property-decorator";
import { getSomethingWithError } from "./server/data";
import { asyncCache, useAsyncCacheWatch } from "vue-async-cache";

@Component
export default class ErrorExample2 extends Vue {
  private cacheWatch = useAsyncCacheWatch(getSomethingWithError);

  get error() {
    return this.cacheWatch.getError();
  }

  load() {
    this.cacheWatch.call();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.error {
  color: red;
}
</style>
