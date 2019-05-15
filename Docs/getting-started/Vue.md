## Getting started with VueJs

`isomor-vue-app` is a tool that will setup automatically a working environment with isomor and vue-cli.

> **Note:** for the moment, only TypeScript is supported.

Run the following command:

```bash
npx isomor-vue-app my-app
# or use env variable MANUAL=true, to manually select the setup settings. Don't forget to select TypeScript
# MANUAL=true npx isomor-vue-app my-app
cd my-app
yarn dev
```

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

### Vue async cache

[vue-async-cache](https://github.com/apiel/async-cache/tree/master/packages/vue-async-cache) is a library that will help you to use `isomore` with VueJs. When you are using `isomor` wihtout this library each call to server functions will generate a request. `vue-async-cache` will create a cache and distinct duplicated request. It will also allow you to share the response to a server function between multiple components.

Without cache you would do:

```html
<template>
  <p style="color: green">
    <button @click="load()">load</button>
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

  async load() {
    this.uptime = await getServerUptime();
  }

  mounted() {
    this.load();
  }
}
</script>
```

Using the cache:

```html
<template>
  <p style="color: green">
    <button @click="load()">load</button>
    <b>Server uptime:</b>
    {{ uptime || 'loading...' }}
  </p>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { getServerUptime } from "./server/uptime";
import { useAsyncCacheWatch } from "vue-async-cache";

@Component
export default class HelloWorld extends Vue {
  private cacheWatch = useAsyncCacheWatch(getServerUptime);

  get uptime() {
    return this.cacheWatch.getResponse();
  }

  load() {
    this.cacheWatch.call();
  }

  mounted() {
    this.load();
  }
}
</script>
```

**Without cache**, if you would have this component 2 times in your app, it would make 2 requests when the components mount. When you click the `load` button, only the component where the button is located would be refreshed.
**With the cache**, only 1 request would be sent instead of 2. When you click the `load` button, both component would be refresh.

See full [documentation](https://github.com/apiel/async-cache/tree/master/packages/vue-async-cache)
