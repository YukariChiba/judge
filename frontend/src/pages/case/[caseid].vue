<template>
  <AppHeader title="文书内容" icon="mdi-gavel" />
  <CaseInfo :id="route.params.caseid" />
</template>

<script setup>
import { watch, ref } from "vue";
import { useRoute } from "vue-router";

const caseid = ref(null);
const route = useRoute();
</script>
