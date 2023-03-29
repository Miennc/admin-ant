<script setup>
import {
  FunctionOutlined,
  ProjectOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  SettingOutlined,
  GroupOutlined,
  StockOutlined,
  SendOutlined,
} from "@ant-design/icons-vue";
import {onBeforeMount, onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";

const router = useRouter();
const route = useRoute();
const selectedKeys = ref(["1"]);
const collapsed = ref(false);
const openedSubMenu = ref(["dashboard"]);
const baseAdminUrl = "/home/";

// for methods
const onMenuClick = ({key}) => {
  console.log("onMenuClick", key);
  selectedKeys.value = [key];

  if (key === "dashboard" || key === "") router.push(baseAdminUrl);
  else router.push(baseAdminUrl + key);
};

const onSubMenuClicked = (e, key) => {
  selectedKeys.value = [key];

  router.push(baseAdminUrl + key);
};

const refreshOpenedSubMenu = () => {
  // for opened sub menu
  let path = route.path.replace(baseAdminUrl, "");

  const slashIndex = path.indexOf("/");

  if (slashIndex !== -1) path = path.substring(0, slashIndex);

  selectedKeys.value = [path];
  openedSubMenu.value = [path];
};

onBeforeMount(() => {
});


const logout = () => {
  localStorage.removeItem("token");
  router.push("/");
};

onMounted(() => {
  if (!localStorage.getItem('token')) {
    router.push({name: 'Login'});
  }

  refreshOpenedSubMenu();
  if (route.path === "/home") {
    selectedKeys.value = ["dashboard"];
  }
});
</script>

<template>
  <a-layout id="admin_layout" style="min-height: 800px; display: flex">
    <a-layout-sider
        class="bordered border-[#dcdcdc66] border-r-[1px]"
        theme="light"
        width="240"
        v-model:collapsed="collapsed"
        :trigger="null"
        collapsible
    >
      <div class="logo p-[16px] flex max-w-[200px]">
        <a
            href="/"
            class="w-full h-[32px] block flex justify-center gap-[5px] items-center"
        >
          <h1
              v-if="!collapsed"
              class="text-[#1890ff] font-medium text-[18px] m-0"
          >
            Admin runner app
          </h1>
        </a>
      </div>

      <a-menu
          class="bg-[#F9FAFE]"
          :selectedKeys="selectedKeys"
          theme="light"
          mode="inline"
          :openKeys="openedSubMenu"
          @click="onMenuClick"
      >
        <a-menu-item key="dashboard">
          <span class="flex items-center">
            <project-outlined/>
            <span>Quản lý sản phẩm </span>
          </span>
        </a-menu-item>

        <a-menu-item key="users">
          <span class="flex items-center">
            <function-outlined/>
            <span>Quản lý người dùng</span>
          </span>
        </a-menu-item>


        <a-menu-item key="missions">
          <span class="flex items-center">
            <setting-outlined/>
            <span>Quản lý nhiệm vụ</span>
          </span>
        </a-menu-item>

        <a-menu-item key="categories">
          <span class="flex items-center">
            <group-outlined/>
            <span>Quản lý danh mục</span>
          </span>
        </a-menu-item>

        <a-menu-item key="level">
          <span class="flex items-center">
           <stock-outlined/>
            <span>Quản lý level</span>
          </span>
        </a-menu-item>


        <a-menu-item key="levelSpecification">
          <span class="flex items-center">
           <stock-outlined/>
            <span>Quản lý thông số level </span>
          </span>
        </a-menu-item>

        <a-menu-item key="news">
          <span class="flex items-center">
           <send-outlined/>
            <span>Quản lý Tin tức</span>
          </span>
        </a-menu-item>


<!--        <a-sub-menu key="sub4">-->
<!--          <template #icon>-->
<!--            <SettingOutlined/>-->
<!--          </template>-->
<!--          <template #title>Quản lý tin tức</template>-->
<!--          <a-menu-item key="9">Tin tức</a-menu-item>-->
<!--        </a-sub-menu>-->

      </a-menu>
    </a-layout-sider>

    <a-layout class="admin_layout_content">
      <a-layout-header
          class="flex justify-between"
          style="background: #f9fafe; padding: 0"
      >
        <div class="close_open_nav ml-[15px]">
          <menu-unfold-outlined
              v-if="collapsed"
              class="trigger"
              @click="() => (collapsed = !collapsed)"
          />
          <menu-fold-outlined
              v-else
              class="trigger"
              @click="() => (collapsed = !collapsed)"
          />
        </div>

        <a-dropdown placement="bottomRight">
          <span
              class="flex items-center gap-[10px] mr-[20px] cursor-pointer hover:bg-gray-100 p-[20px]"
          >
            <img
                loading="lazy"
                :src="
                loggedUser?.avatar ||
                'https://cdn.iconscout.com/icon/free/png-256/avatar-370-456322.png'
              "
                class="block h-[20px] w-[20px]"
            />
            {{ loggedUser?.fullName || loggedUser?.userName }}
          </span>
          <template #overlay>
            <a-menu>
              <a-menu-item>
                <router-link to="/profile"
                >Thông tin cá nhân
                </router-link>
              </a-menu-item>
              <a-menu-item>
                <span @click="logout">Đăng xuất</span>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </a-layout-header>

      <a-layout-content
          :style="{
          background: '#f2f5f7',
          minHeight: '280px',
          borderTop: '1px solid #ebebeb',
        }"
      >
        <router-view/>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<style>
.admin_layout_content {
  width: 100%;
}

.ant-page-header {
  height: 100%;
}

.ant-skeleton-element .ant-skeleton-image {
  width: 100%;
  height: 100%;
}
</style>
