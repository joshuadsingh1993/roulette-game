<script setup lang="ts">
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
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-col">
      <span class="text-xs uppercase tracking-wide">Balance</span>
      <span class="font-bold text-xl">${{ props.balance }}</span>
    </div>
    <div class="flex flex-col">
      <span class="text-xs uppercase tracking-wide">History</span>
      <span class="font-bold text-xl">{{
        props.history.length < 1 ? "&nbsp;" : props.history.join(", ")
      }}</span>
    </div>
    <div class="flex flex-col">
      <span class="text-xs uppercase tracking-wide">Spins</span>
      <span class="font-bold text-xl">{{ props.spins }}</span>
    </div>
    <div class="flex flex-col">
      <span class="text-xs uppercase tracking-wide">Wins/Losses</span>
      <span class="font-bold text-xl">{{ props.record }}</span>
    </div>
  </div>
</template>
