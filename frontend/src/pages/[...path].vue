<template>
  <v-empty-state
    headline="哦豁, 404"
    title="页面不存在"
    text="您要找的内容并不存在，请确认 URL 是否正确。"
    icon="mdi-gavel"
    action-text="返回主页"
    @click:action="returnHome"
  />
</template>

<script setup>
import { useRouter } from "vue-router";
const router = useRouter();

function returnHome() {
  router.push("/");
}
</script>
