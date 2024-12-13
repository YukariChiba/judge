<template>
  <AppHeader
    :title="
      route.params.groupid && route.params.groupvalue ? '分类列表' : '文书列表'
    "
    icon="mdi-list-box-outline"
  />
  <CaseLists
    :groupid="route.params.groupid"
    :groupvalue="route.params.groupvalue"
  />
</template>

<script setup>
import { useRoute } from "vue-router";

const route = useRoute();
</script>
