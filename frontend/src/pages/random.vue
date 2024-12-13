<template>
  <AppHeader title="随机文书" icon="mdi-dice-multiple-outline" />
  <CaseInfo ref="caseInfoRef" />
  <v-fab
    @click="refresh"
    icon="mdi-reload"
    location="bottom end"
    position="sticky"
    app
    appear
  ></v-fab>
</template>

<script setup>
import { watch, ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import CaseInfo from "../components/CaseInfo.vue";

const caseInfoRef = ref();

const caseid = ref(null);
const route = useRoute();

function refresh() {
  caseInfoRef.value.loadCase();
}
</script>
