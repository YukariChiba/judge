<template>
  <v-app>
    <v-main>
      <template v-if="route.path === '/'">
        <router-view />
      </template>
      <template v-else>
        <v-container max-width="1400">
          <router-view />
        </v-container>
        <app-footer />
      </template>
    </v-main>
  </v-app>
</template>

<script setup>
import { useRoute } from "vue-router";

const route = useRoute();
</script>
