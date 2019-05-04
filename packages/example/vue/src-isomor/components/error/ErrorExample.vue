<template>
    <div>
        <p v-if="error" class="error"><b>Some error handling example:</b> {{error}} </p>
        <button @click="load()">Throw an error</button>
    </div>
</template>

<script lang="ts">
import {
  Component,
  Vue,
} from "vue-property-decorator";
import { getSomethingWithError } from "./server/data";

@Component
export default class ErrorExample extends Vue {
  private error!: string;

  async load() {
    try {
        await getSomethingWithError();
    } catch (error) {
        this.error = error.toString();
    }
  }

  data() {
    return {
      error: null
    };
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.error {
  color: red;
}
</style>

