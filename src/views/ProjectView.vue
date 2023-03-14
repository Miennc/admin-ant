<script setup>
import { EditOutlined, DeleteOutlined } from "@ant-design/icons-vue";

import { reactive } from "vue";
import AddEditProjectModal from "@/components/project/AddEditProjectModal.vue";

const tblConfig = reactive({
  columns: [
    {
      title: "Project Name",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Description",
      dataIndex: "desc",
      key: "desc",
    },
    {
      title: "Default language",
      dataIndex: "defaultLanguage",
      key: "defaultLanguage",
    },
    {
      title: "Other languages",
      dataIndex: "otherLanguages",
      key: "otherLanguages",
    },
    {
      title: "Create at",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
    },
  ],
  data: [
    {
      key: "1",
      title: "John Brown",
      desc: 32,
      defaultLanguage: "New York No. 1 Lake Park",
      otherLanguages: "New York No. 1 Lake Park",
      createdAt: "New York No. 1 Lake Park",
      action: "New York No. 1 Lake Park",
    },
    {
      key: "2",
      title: "Jim Green",
      desc: 42,
      defaultLanguage: "London No. 1 Lake Park",
      otherLanguages: "New York No. 1 Lake Park",
      createdAt: "New York No. 1 Lake Park",
      action: "New York No. 1 Lake Park",
    },
    {
      key: "3",
      title: "Joe Black",
      desc: 32,
      defaultLanguage: "Sidney No. 1 Lake Park",
      otherLanguages: "New York No. 1 Lake Park",
      createdAt: "New York No. 1 Lake Park",
      action: "New York No. 1 Lake Park",
    },
    {
      key: "4",
      title: "Jim Red",
      desc: 32,
      defaultLanguage: "London No. 2 Lake Park",
      otherLanguages: "New York No. 1 Lake Park",
      createdAt: "New York No. 1 Lake Park",
      action: "New York No. 1 Lake Park",
    }

  ],
  loading: false,
  pagination: {
    current: 1,
    pageSize: 2,
    total: 0,
  },
});

const modalInstance = reactive({
  visible: false,
  title: "Add new project",
  projectModel: undefined,
  addNewProject: () => {
    modalInstance.visible = true;
    modalInstance.title = "Add new project";
    modalInstance.projectModel = undefined;
  },
  afterSuccessSaveProject: () => {
    modalInstance.visible = false;
  },
});
const filterModel = reactive({
  q: "",
  isSearching: false,
});

const callFilterProjectService = () => {
  console.log("callFilterProjectService");
};
</script>

<template>
  <a-page-header
    style="border: 1px solid rgb(235, 237, 240); padding: 10px"
    title="Project view"
  >
    <template #tags>
      <a-button type="primary" @click="modalInstance.addNewProject"
        >Add</a-button
      >
    </template>

    <template #extra>
      <a-space>
        <a-input placeholder="Search project" />
        <a-dropdown placement="bottomRight">
          <a-button>Sort</a-button>
          <template #overlay>
            <a-menu>
              <a-menu-item> Latest </a-menu-item>
              <a-menu-item> From A - Z </a-menu-item>
              <a-menu-item> From Z-A </a-menu-item>
              <a-menu-item> Oldest </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </a-space>
    </template>

    <a-table
      :columns="tblConfig.columns"
      :data-source="tblConfig.data"
      :loading="tblConfig.loading"
      :pagination="tblConfig.pagination"
      :row-key="(record) => record.id"
      :scroll="{ x: 800 }"
    >

      <template #bodyCell="{ column, text, record }">
        <template v-if="column.key === 'action'">
          <a-space>
            <span
              class="cursor-pointer text-blue-400 hover:text-blue-500 ease-in-out duration-300"
            >
              <edit-outlined />
            </span>

            <a-popconfirm
              title="Are you sure?"
              @confirm="() => {}"
              placement="bottomLeft"
            >
              <span
                class="cursor-pointer text-red-400 hover:text-red-500 ease-in-out duration-300"
                ><delete-outlined
              /></span>
            </a-popconfirm>
          </a-space>
        </template>
      </template>
    </a-table>
    <add-edit-project-modal
      :modal-instance="modalInstance"
      @afterSuccessSaveProject="modalInstance.afterSuccessSaveProject"
    />
  </a-page-header>
</template>
