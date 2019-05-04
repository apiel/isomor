<template>
    <div v-if="status">
        <p><b>Server uptime:</b> {{status.uptime}}</p>
        <p><b>Memory:</b> {{status.freemem}} available of {{status.totalmem}}</p>
        <p><b>Cpus:</b></p>
        <ul v-if="status.cpus">
            <li v-for="cpu in status.cpus">
                {{cpu.model}} {{cpu.speed}}
            </li>
        </ul>
    </div>
    <div v-else>Loading...</div>
</template>

<script lang="ts">
import {
  Component,
  Vue,
} from "vue-property-decorator";
import { getStatus, Status } from "./server/getStatus";

@Component
export default class Stats extends Vue {
  private status!: Status[];

  data() {
    return {
      status: null
    };
  }
  async mounted() {
    this.status = await getStatus();
  }
}
</script>