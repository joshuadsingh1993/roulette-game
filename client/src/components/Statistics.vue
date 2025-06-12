<script setup lang="ts">
import { computed } from "vue";
import { ROULETTE_NUMBERS } from "../services/pixiGame/constants";

interface Props {
  balance?: number;
  history?: number[];
  spins?: number;
  record?: number;
}

const props = withDefaults(defineProps<Props>(), {
  balance: 1000,
  history: () => [],
  spins: 0,
  record: 0,
});

const valueToColor = Object.fromEntries(
  ROULETTE_NUMBERS.map(({ value, color }) => [value, color || "green"])
);

const paddedHistory = computed(() => {
  const paddingLength = 10 - props.history.length;
  const padding = Array(Math.max(paddingLength, 0)).fill("");
  return [...padding, ...props.history];
});

const getColor = (value: number) => {
  return valueToColor[value] === "red"
    ? "red"
    : valueToColor[value] === "black"
    ? "black"
    : valueToColor[value] === "green"
    ? "green"
    : undefined;
};
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-col">
      <span class="text-xs uppercase font-bold tracking-wide">Balance</span>
      <span class="font-bold text-xl">{{
        new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(props.balance)
      }}</span>
    </div>
    <div class="flex flex-col">
      <span class="text-xs uppercase font-bold tracking-wide">Spins</span>
      <span class="font-bold text-xl">{{ props.spins }}</span>
    </div>
    <div class="flex flex-col">
      <span class="text-xs uppercase font-bold tracking-wide">Wins/Losses</span>
      <span class="font-bold text-xl">{{ props.record }}</span>
    </div>
    <div class="flex flex-col">
      <span class="text-xs uppercase font-bold tracking-wide mb-2"
        >History</span
      >
      <ul class="font-bold flex">
        <li
          v-for="(item, index) in paddedHistory"
          :key="index"
          :class="[
            'h-[32px] w-[32px] border border-r-0 text-center leading-[30px] text-white last:border-r-1',
            getColor(item) === 'red'
              ? 'bg-red-600'
              : getColor(item) === 'black'
              ? 'bg-gray-900'
              : getColor(item) === 'green'
              ? 'bg-green-700'
              : 'bg-transparent',
          ]"
        >
          {{ item }}
        </li>
      </ul>
    </div>
  </div>
</template>
