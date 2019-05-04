<template>
  <div class="styleRow">
    <div class="styleCol">
      <Time/>
      <Color/>
    </div>
    <div class="styleCol">
      <Time/>
      <Color/>
    </div>
  </div>
</template>

<script lang="ts">
import {
  Component,
  Vue,
} from "vue-property-decorator";
import Time from "./status/Time.vue";
import Color from "./color/Color.vue";

@Component({
  components: {
    Time,
    Color,
  }
})
export default class TwoColumn extends Vue {}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.styleRow {
  display: flex;
}
.styleCol {
    flex: 50%;
    border: 1px solid #DDD;
    margin: 10px;
    padding: 10px;
}
</style>
