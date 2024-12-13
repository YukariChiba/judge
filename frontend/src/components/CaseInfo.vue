<template>
  <v-card
    loading
    rounded="lg"
    v-if="loading && !error"
    title="加载中..."
    subtitle="加载中，请稍候..."
  />
  <v-alert
    v-else-if="loading && error"
    type="warning"
    variant="tonal"
    rounded="lg"
    title="未找到文书内容"
    text="请检查 ID 是否正确"
    border="start"
    prominent
    icon="mdi-alert"
  >
  </v-alert>
  <template v-else>
    <v-card rounded="lg" :subtitle="`${case_data.case_id}`">
      <template v-slot:title>
        <span style="display: block; text-wrap: wrap">
          {{ case_data.title
          }}<v-chip class="ml-4" label>{{ case_data.type }}</v-chip></span
        >
      </template>
      <v-card-text>
        <v-row>
          <v-col cols="12" lg="8" md="6">
            <v-row no-gutters>
              <v-col cols="12" sm="6" lg="3" class="mb-2">
                <v-icon start icon="mdi-calendar-edit-outline" />
                判决时间：{{ case_data.judge_date || "数据为空" }}
              </v-col>
              <v-col cols="12" sm="6" lg="3" class="mb-2">
                <v-icon start icon="mdi-calendar-check-outline" />
                公开时间：{{ case_data.publish_date || "数据为空" }}
              </v-col>
              <v-col cols="12" md="6" class="mb-2">
                <v-icon start icon="mdi-account" />当事人：
                <template v-if="case_data.person.length > 0">
                  <v-chip
                    class="mr-1 mb-1"
                    density="compact"
                    :to="`/list/person/${person}`"
                    v-for="person in case_data.person"
                    v-if="person != ''"
                    :key="person"
                    >{{ person }}</v-chip
                  >
                </template>
                <template v-else> 数据为空 </template>
              </v-col>
              <v-col cols="12" md="6" class="mb-2">
                <v-icon start icon="mdi-map-search-outline" />
                地区与法院：{{
                  `${case_data.region || "未知"} - ${case_data.court || "未知"}`
                }}
              </v-col>
              <v-col cols="auto" class="mb-2">
                <v-icon start icon="mdi-clipboard-flow-outline" />
                审理程序：{{ case_data.judge_type || "数据为空" }}
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" md="6" lg="4">
            <v-expansion-panels
              rounded="lg"
              v-if="case_data.law_basis.length > 0"
            >
              <v-expansion-panel>
                <v-expansion-panel-title expand-icon="mdi-menu-down">
                  法律依据
                  <v-chip
                    class="ml-4"
                    size="x-small"
                    variant="elevated"
                    v-text="case_data.law_basis.length"
                  />
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <v-list lines="one">
                    <template
                      v-for="(it, idx) in case_data.law_basis"
                      :key="it.law + it.lawitem"
                    >
                      <v-divider v-show="idx !== 0" />
                      <v-list-item
                        class="lawitem"
                        :title="it.law"
                        :subtitle="it.lawitem"
                      />
                    </template>
                  </v-list>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-card rounded="lg" class="mt-4">
      <v-card-text class="py-0">
        <v-alert
          rounded="lg"
          class="mt-4"
          variant="tonal"
          density="compact"
          icon="mdi-note-edit-outline"
          v-if="case_data.brief"
          :text="case_data.brief"
      /></v-card-text>
      <v-card-text style="white-space: pre-line">
        <code v-html="case_data.fulltext" />
      </v-card-text>
    </v-card>

    <v-card rounded="lg" class="mt-4">
      <v-card-text>
        内部 ID (供索引): <code>{{ case_data._id }}</code>
        <v-btn
          @click="copytext(case_data._id)"
          class="ml-2"
          icon="mdi-content-copy"
          variant="plain"
        />
      </v-card-text>
    </v-card>
  </template>
  <v-snackbar rounded="lg" v-model="snackbar" :timeout="2000">
    ID 已复制到剪贴板
  </v-snackbar>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { getCase, getRandomCase } from "../utils/api";

const props = defineProps(["id"]);

const case_data = ref(null);
const loading = ref(true);
const error = ref(false);
const snackbar = ref(false);
async function loadCase() {
  loading.value = true;
  error.value = false;
  const loadresult = props.id ? await getCase(props.id) : await getRandomCase();
  if (!loadresult.ok) {
    error.value = true;
    return;
  }
  const jsondata = await loadresult.json();
  case_data.value = jsondata;
  loading.value = false;
}

function copytext(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text);
  } else {
    const input = document.createElement("textarea");
    input.value = text;
    document.body.appendChild(input);
    input.select();
    document.execCommand("copy");
    document.body.removeChild(input);
  }
  snackbar.value = true;
}

onMounted(() => {
  loadCase();
});

defineExpose({
  loadCase,
});
</script>

<style lang="scss">
.lawitem {
  .v-list-item-title {
    text-wrap: auto !important;
  }
  .v-list-item-subtitle {
    text-wrap: auto !important;
  }
}
</style>
