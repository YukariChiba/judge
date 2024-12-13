<template>
  <v-container class="fill-height">
    <v-container
      class="align-centerfill-height mx-auto text-center"
      max-width="900"
    >
      <v-icon class="mb-4" size="120" icon="mdi-gavel" />

      <div class="text-center">
        <div class="text-body-2 font-weight-light mb-2">并不完整的</div>

        <h2 class="text-h4 text-sm-h3 text-md-h2 font-weight-bold mb-2">
          裁判文书数据库
        </h2>

        <h4 class="text-h6 text-sm-h5 text-md-h4">
          共计收录裁判文书 {{ totcount }} 件
        </h4>
      </div>

      <div class="py-4"></div>

      <v-row>
        <v-col cols="12">
          <v-row no-gutters>
            <v-col cols="12" sm="6" md="4" lg="3">
              <v-select
                class="pr-sm-1"
                label="搜索目标"
                rounded="lg"
                color="surface-variant"
                variant="outlined"
                v-model="searchOption"
                :items="searchOptions"
                item-title="descr"
                item-value="value"
              >
                <template v-slot:append-inner>
                  <v-overlay
                    opacity=".12"
                    scrim="primary"
                    class="rounded-lg"
                    contained
                    model-value
                    persistent
                  />
                </template>
              </v-select>
            </v-col>
            <v-col cols="12" sm="6" md="8" lg="9">
              <v-text-field
                :disabled="searchOption == 'fulltext'"
                color="surface-variant"
                rounded="lg"
                variant="outlined"
                v-model="search"
                @keyup.enter="searchAction"
                label="请输入查询内容 ..."
              >
                <v-overlay
                  opacity=".12"
                  scrim="primary"
                  class="rounded-lg"
                  contained
                  model-value
                  persistent
                />
              </v-text-field>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" md="6">
          <v-card
            class="py-4"
            color="surface-variant"
            to="/list"
            prepend-icon="mdi-list-box-outline"
            rounded="lg"
            subtitle="浏览数据库中的全部数据"
            title="浏览"
            variant="text"
          >
            <v-overlay
              opacity=".06"
              scrim="primary"
              contained
              model-value
              persistent
            />
          </v-card>
        </v-col>

        <v-col cols="12" md="6">
          <v-card
            class="py-4"
            color="surface-variant"
            to="/random"
            prepend-icon="mdi-dice-multiple-outline"
            rounded="lg"
            subtitle="发现更多有趣内容"
            title="随机"
            variant="text"
          >
            <v-overlay
              opacity=".06"
              scrim="primary"
              contained
              model-value
              persistent
            />
          </v-card>
        </v-col>

        <v-col cols="12" md="6">
          <v-card
            class="py-4"
            color="surface-variant"
            to="/group"
            prepend-icon="mdi-shape-plus-outline"
            rounded="lg"
            subtitle="分门别类查看各种类型的裁判文书"
            title="分类"
            variant="text"
          >
            <v-overlay
              opacity=".06"
              scrim="primary"
              contained
              model-value
              persistent
            />
          </v-card>
        </v-col>

        <v-col cols="12" md="6">
          <v-card
            disabled
            class="py-4"
            color="surface-variant"
            prepend-icon="mdi-head-snowflake-outline"
            rounded="lg"
            subtitle="通过 AI 分析判决案例 (暂不可用)"
            title="AI"
            variant="text"
          >
            <v-overlay
              opacity=".06"
              scrim="primary"
              contained
              model-value
              persistent
            />
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getCount } from "../utils/api";

const totcount = ref(0);
const search = ref(null);
const router = useRouter();
const searchOption = ref("fulltext");

const searchOptions = [
  { descr: "全文搜索 (暂不可用)", value: "fulltext" },
  {
    descr: "当事人",
    value: "person",
  },
  { descr: "地区", value: "region" },
  { descr: "法院", value: "court" },
  { descr: "内部 ID", value: "_id" },
];

async function updateCount() {
  const loadresult = await getCount();
  if (!loadresult.ok) console.log("WIP: error");
  totcount.value = (await loadresult.json()).count;
}

function searchAction() {
  if (search.value.length > 50) return;
  switch (searchOption.value) {
    case "_id": {
      if (/^[0-9a-f]{24}$/.test(search.value)) {
        router.push(`/case/${search.value}`);
      }
      break;
    }
    case "fulltext": {
      break;
    }
    default: {
      router.push(`/list/${searchOption.value}/${search.value}`);
    }
  }
}

onMounted(() => {
  updateCount();
});
</script>
