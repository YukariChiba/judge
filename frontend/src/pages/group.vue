<template>
    <AppHeader title="分类列表" icon="mdi-shape-plus-outline" />
    <v-row>
      <v-col cols="12" md="6" v-for="group in groups" :key="group.key">
        <v-card rounded="lg" :title="`# 按照 ${group.descr}`">
          <v-card-text>
            <v-chip
              v-for="item in group.data"
              :to="`/list/${group.key}/${item.value}`"
              :key="item.value"
              class="mr-1 mb-1"
              variant="text"
            >
              # {{ item.descr }}</v-chip
            >
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </template>
  
  <script setup>
  import groups from "../assets/groups.json";
  </script>
  