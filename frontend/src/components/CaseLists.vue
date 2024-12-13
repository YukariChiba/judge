<template>
  <v-data-table-server
    class="rounded-lg"
    v-model:items-per-page="itemsPerPage"
    v-model:sort-by="sortBy"
    hover
    :mobile="null"
    items-per-page-text="每页显示数量: "
    loading-text="数据加载中，请稍候..."
    no-data-text="未查询到任何数据"
    mobile-breakpoint="sm"
    :headers="headers"
    :items="serverItems"
    :items-length="totalItems"
    :loading="loading"
    item-value="name"
    :items-per-page-options="itemPerPageOptions"
    @update:options="loadItems"
    @click:row="clickRow"
  ></v-data-table-server>
</template>

<script setup>
import { listCase } from "../utils/api";
import { useRouter } from "vue-router";
import { ref } from "vue";

const props = defineProps(["groupid", "groupvalue"]);

const itemsPerPage = ref(20);
const headers = [
  {
    title: "案件",
    key: "title",
    sortable: false,
  },
  {
    title: "案号",
    key: "case_id",
  },
  {
    title: "案件类型",
    key: "type",
  },
  {
    title: "审理程序",
    key: "judge_type",
  },
  {
    title: "裁判日期",
    key: "judge_date",
  },
  {
    title: "所属地区",
    key: "region",
  },
];

const itemPerPageOptions = [
  { value: 10, title: "10" },
  { value: 25, title: "25" },
  { value: 50, title: "50" },
  { value: 100, title: "100" },
];

const serverItems = ref([]);
const sortBy = ref([]);
const loading = ref(true);
const totalItems = ref(0);
const router = useRouter();

function clickRow(_, c) {
  router.push(`/case/${c.item._id}`);
}
async function loadItems({ page, itemsPerPage }) {
  loading.value = true;
  var search = {};
  if (props.groupid && props.groupvalue) {
    search[props.groupid] = props.groupvalue;
  }
  const loadresult = await listCase(
    page,
    itemsPerPage,
    sortBy.value[0]?.key,
    sortBy.value[0]?.order,
    search
  );
  if (!loadresult.ok) console.log("WIP: error");
  const jsondata = await loadresult.json();
  serverItems.value = jsondata.result;
  totalItems.value = jsondata.total;
  loading.value = false;
}
</script>
