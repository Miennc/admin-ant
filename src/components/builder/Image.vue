<script setup>
const props = defineProps({
  model: {
    type: Object,
    required: true,
  },
});
props.src = "https://picsum.photos/200/300";
</script>

<template>
  <img :src="props.src" />
</template>
