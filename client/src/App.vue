<script setup lang="ts">
import { initCanvas } from "./services/pixiGame";
import { onMounted } from "vue";
import { useWebSocket } from "./services/websocket";
import Statistics from "./components/Statistics.vue";
import { useGameStore } from "./stores/gameStore";
import { ref } from "vue";
import { watch } from "vue";

const gameStore = useGameStore();
const { connect, send, error, isConnected } = useWebSocket();
const pixiContainer = ref(null);

onMounted(() => {
  connect();
});

watch(
  pixiContainer,
  (newValue) => {
    if (newValue) {
      initCanvas(newValue);
    }
  },
  { immediate: true }
);

const sendMessage = () => {
  send({
    type: "spin",
  });
};
</script>

<template>
  <main className="py-16 px-4 max-w-[1000px] mx-auto">
    <h1 className="text-4xl text-center mb-16">European Roulette</h1>
    <h4 class="text-center" v-if="!isConnected && error">
      Oh no! We can't connect you to our servers. Please try again later!
    </h4>
    <h4 class="text-center" v-if="!isConnected && error === null">
      Connecting...
    </h4>
    <div v-else className="aspect-video relative w-full" ref="pixiContainer">
      <div class="absolute z-10 bottom-8 left-8">
        <Statistics
          :record="gameStore.wins"
          :spins="gameStore.spinCount"
          :balance="gameStore.balance"
          :history="gameStore.history"
        />
      </div>

      <button
        @click="sendMessage"
        :disabled="gameStore.gameStatus !== 'idle'"
        type="button"
        class="p-2 z-10 bg-gradient-to-r disabled:cursor-auto from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br rounded-full cursor-pointer absolute bottom-8 right-8 disabled:bg-none disabled:bg-gray-400"
      >
        <svg
          class="h-12 w-12"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            class="stroke-white"
            d="M4.06189 13C4.02104 12.6724 4 12.3387 4 12C4 7.58172 7.58172 4 12 4C14.5006 4 16.7332 5.14727 18.2002 6.94416M19.9381 11C19.979 11.3276 20 11.6613 20 12C20 16.4183 16.4183 20 12 20C9.61061 20 7.46589 18.9525 6 17.2916M9 17H6V17.2916M18.2002 4V6.94416M18.2002 6.94416V6.99993L15.2002 7M6 20V17.2916"
            stroke="#000000"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </div>
  </main>
</template>
