<template>
    <div v-if="color" v-bind:style="{ color }">
        <b>{{color}}</b> Choose a color &nbsp;
        <button @click="setColor('blue')">blue</button>
        <button @click="setColor('red')">red</button>
        <button @click="setColor('green')">green</button>
        <button @click="setColor('pink')">pink</button>
    </div>
</template>

<script lang="ts">
import {
  Component,
  Vue,
} from "vue-property-decorator";
import { useAsyncCacheWatch } from "vue-async-cache";
import { getColor, setColor } from "./server/color";

@Component
export default class Color extends Vue {
  private cacheWatch = useAsyncCacheWatch(getColor);

  get color() {
    return this.cacheWatch.getResponse();
  }

  async setColor(newColor: string) {
    await setColor(newColor);
    this.cacheWatch.update(newColor);
  }

  load() {
    this.cacheWatch.call();
  }

  async mounted() {
      this.load();
  }
}
</script>