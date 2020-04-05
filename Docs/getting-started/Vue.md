## Getting started with VueJs

`isomor-vue-app` is a tool that will setup automatically a working environment with isomor and vue-cli.

> **Note:** for the moment, only TypeScript is supported.

Run the following command:

```bash
npx isomor-vue-app my-app
cd my-app
yarn dev
```

Your app is now running on http://localhost:8080/

Finish, you are ready to code :-)

> **Note: `src-isomor` folder is where you will be coding** instead of `src`.

`isomor-vue-app` provide as well a little example:

*components/HelloWorld.vue*
```html
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
```

*components/server/uptime.ts*
```ts
export async function getServerUptime(): Promise<string> {
    return process.uptime().toString();
}
```
