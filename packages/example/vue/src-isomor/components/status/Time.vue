<template>
  <p>Time</p>
</template>

<script lang="ts">
import {
  Component,
  Vue,
} from "vue-property-decorator";

@Component
export default class Time extends Vue {}

// import React from 'react';
// import { useAsyncCacheWatch } from 'react-async-cache';

// import { getTime } from './server/getTime';

// export const Time = () => {
//   // look at timeUTC.tsx using useAsyncCacheEffect taking care of useEffect
//   const { load, response } = useAsyncCacheWatch(getTime);
//   React.useEffect(() => { load(); }, []);
//   return (
//     <div>
//       {!response ? <p>Loading...</p> : (
//         <p><b>Server time:</b> {response.time} <button onClick={load}>reload</button></p>
//       )}
//     </div>
//   );
// }
</script>