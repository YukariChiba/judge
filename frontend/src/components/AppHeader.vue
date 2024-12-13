<template>
  <v-card-subtitle>
    <v-btn
      prepend-icon="mdi-home-outline"
      density="compact"
      variant="plain"
      class="pa-0"
      to="/"
    >
      返回首页</v-btn
    >
  </v-card-subtitle>
  <v-card-title class="text-h4 mb-2"
    ><v-icon :icon="props.icon" start v-if="props.icon" /> {{ props.title }}
  </v-card-title>
</template>

<script setup>
const props = defineProps(["title", "icon"]);
</script>
