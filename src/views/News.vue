<script setup>
import { onMounted, ref, watch } from "vue";
import Loading from "@/components/loading/Loading.vue";
import { useToast } from "vue-toastification";
import { newsServices } from "@/services/newServices";

const toast = useToast();
const visible = ref(false);
const textSearch = ref("");
const dataNew = ref([]);
const currentPage = ref(1);
const totalPages = ref(1);
const idRemoveNew = ref("");
const visibleConfirm = ref(false);
const loading = ref(false);
const modalText = ref("Bạn có chắc chắn muốn xóa level không?");
const confirmLoading = ref(false);
const visibleEdit = ref(false);
const idEditNew = ref("");
const inputNew = ref({
  title: "",
  fileUrl: "",
  fileUpload: "",
  content: "",
});
const errors = ref({
  title: "",
  fileUrl: "",
  fileUpload: "",
  content: "",
});
const showModal = () => {
  inputNew.value = {
    title: "",
    fileUrl: "",
    fileUpload: "",
    content: "",
  };
  visible.value = true;
};
const validate = () => {
  errors.value.title = inputNew.value.title
    ? ""
    : "Tiêu đề không được để trống";
  errors.value.content = inputNew.value.content
    ? ""
    : "Nội dung không được để trống";
  errors.value.fileUpload =
    inputNew?.value?.fileUpload?.length < 1 ? "Ảnh không được để trống" : "";
  return (
    !errors.value.title && !errors.value.fileUpload && !errors.value.content
  );
};

const handlRemoveNew = async () => {
  try {
    await newsServices.removeNews(idRemoveNew.value);
    await getAllNew();
    toast.success("Xóa bài viết thành công");
  } catch (e) {
    toast.error("Xóa bài viết thất bại");
  }
  visibleConfirm.value = false;
};

const handleChange = (value) => {
  console.log(value); // { key: "lucy", label: "Lucy (101)" }
};

const showModalConfirm = (id) => {
  idRemoveNew.value = id;
  visibleConfirm.value = true;
};

const showModalEdit = async (id) => {
  errors.value = {
    title: "",
    fileUrl: "",
    fileUpload: "",
    content: "",
  };
  visibleEdit.value = true;
  idEditNew.value = id;
  try {
    const res = await newsServices.findByIdNews(id);
    inputNew.value = {
      title: res.data.title,
      fileUrl: res.data.previewImage,
      content: res.data.content,
    };
  } catch (e) {
    console.log(e);
  }
};

const handlEditNew = async () => {
  if (validate()) {
    try {
      const formData = new FormData();
      formData.append("id", idEditNew.value);
      if (inputNew.value.fileUpload) {
        formData.append("previewImageFile", inputNew.value.fileUpload);
      }
      formData.append("title", inputNew.value.title);
      formData.append("content", inputNew.value.content);
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      await newsServices.editNews(formData, config);
      await getAllNew();
      visibleEdit.value = false;
      toast.success("Cập nhật tin tức thành công");
    } catch (e) {
      toast.error(e.response.data);
    }
  }
};

const previewFile = (e) => {
  const file = e.target.files[0];
  if (file) {
    inputNew.value.fileUpload = file;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      inputNew.value.fileUrl = reader.result;
    };
  }
  e.target.value = "";
};

const handlAddNew = async () => {
  if (validate()) {
    loading.value = true;
    try {
      const formData = new FormData();
      formData.append("title", inputNew.value.title);
      formData.append("content", inputNew.value.content);
      formData.append("previewImageFile", inputNew.value.fileUpload);
      const config = {
        headers: {
          "content-type": "multipart/form-data",
        },
      };
      await newsServices.createNews(formData, config);
      toast.success("Thêm tin tức thành công");
      await getAllNew();
      visible.value = false;
      inputNew.value = {
        title: "",
        fileUrl: "",
        fileUpload: "",
        content: "",
      };
    } catch (e) {
      toast.error(e.response.data);
    }

    loading.value = false;
  }
};

const searchNew = async () => {
  try {
    const res = await newsServices.searchNews({
      page: currentPage.value - 1,
      size: 5,
      sort: "id,desc",
      keyword: textSearch.value.trim() ? textSearch.value.trim() : "",
    });
    dataNew.value = res.data.content;
    totalPages.value = res.data.totalPages * 10;
    currentPage.value = res.data.number + 1;
  } catch (e) {
    console.log(e);
  }
};

watch(textSearch, async () => {
  await searchNew();
});

const filterByName = async (e) => {
  try {
    const res = await newsServices.listAllNews({
      page: currentPage.value - 1,
      size: 5,
      sort: e.key == "1" ? "title,asc" : "title,desc",
    });
    dataNew.value = res.data.content;
    totalPages.value = res.data.totalPages * 10;
    currentPage.value = res.data.number + 1;
  } catch (e) {
    console.log(e);
  }
};

const getAllNew = async () => {
  try {
    const res = await newsServices.listAllNews({
      page: currentPage.value - 1,
      size: 5,
      sort: "id,desc",
    });
    dataNew.value = res.data.content;
    totalPages.value = res.data.totalPages * 10;
    currentPage.value = res.data.number + 1;
  } catch (e) {
    console.log(e);
  }
};

const pageChanged = async () => {
  await getAllNew();
};

onMounted(async () => {
  loading.value = true;
  await getAllNew();
  loading.value = false;
});
</script>

<template>
  <a-page-header
    style="border: 1px solid rgb(235, 237, 240); padding: 10px"
    title="Quản lý tin tức"
  >
    <template #tags>
      <a-button type="primary" @click="showModal">Thêm tin tức</a-button>
    </template>

    <template #extra>
      <a-space>
        <input
          v-model="textSearch"
          type="text"
          class="w-[20rem] p-1 outline-1 outline-[#1890ff]"
          placeholder="Tìm kiếm..."
        />

        <a-dropdown placement="bottomRight">
          <a-button>Lọc</a-button>
          <template #overlay>
            <a-menu @click="filterByName">
              <a-menu-item key="">Lọc theo tên</a-menu-item>
              <a-menu-item key="1"> Từ A - Z</a-menu-item>
              <a-menu-item key="2"> Từ Z-A</a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </a-space>
    </template>

    <div>
      <a-modal
        v-model:visible="visible"
        width="1000px"
        title="Thêm tin tức"
        @ok="handlAddNew"
      >
        <div>
          <label class="block text-sm font-medium text-gray-700">
            Tiêu đề
          </label>
          <div class="mt-1">
            <a-input v-model:value="inputNew.title" placeholder="tiêu đề" />
          </div>
          <span class="text-red-500 font-medium italic text-sm">
            {{ errors.title }}</span
          >
        </div>

        <div class="mt-2">
          <label class="block text-sm font-medium text-gray-700">
            Nội dung
          </label>
          <div class="mt-1">
            <a-input v-model:value="inputNew.content" placeholder="nội dung" />
          </div>
          <span class="text-red-500 font-medium italic text-sm">
            {{ errors.content }}</span
          >
        </div>

        <div class="flex items-center mt-3 justify-start">
          <label
            for="file-upload"
            class="px-4 py-1 bg-blue-500 text-white cursor-pointer hover:bg-blue-600"
          >
            Tải ảnh lên
          </label>
          <input
            id="file-upload"
            type="file"
            class="sr-only"
            @change="previewFile"
          />
        </div>
        <div
          class="w-44 relative mt-2 overflow-hidden h-44"
          v-if="inputNew.fileUrl"
        >
          <img
            class="w-full h-full object-cover"
            :src="inputNew.fileUrl"
            alt=""
          />
          <div v-if="inputNew.fileUrl" class="ml-2">
            <button
              class="text-red-700 bg-[#ffffff] w-7 h-7 shadow-md rounded-full absolute -top-1 -right-1"
              @click="
                inputNew.fileUrl = '';
                inputNew.fileUpload = '';
              "
            >
              <i class="fa-solid text-gray-500 text-lg fa-xmark"></i>
            </button>
          </div>
        </div>

        <span class="text-red-500 font-medium italic text-sm">
          {{ errors.fileUpload }}</span
        >
      </a-modal>
    </div>

    <div class="flex flex-col">
      <div class="overflow-x-auto">
        <div class="py-2 inline-block min-w-full">
          <div class="overflow-hidden">
            <table class="min-w-full">
              <thead class="bg-gray-200 border-b">
                <tr>
                  <th
                    scope="col"
                    class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                  >
                    #
                  </th>
                  <th
                    scope="col"
                    class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                  >
                    Tiêu đề
                  </th>
                  <th
                    scope="col"
                    class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                  >
                    Nội dung
                  </th>
                  <th
                    scope="col"
                    class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                  >
                    Ảnh tin tức
                  </th>
                  <th
                    scope="col"
                    class="text-sm font-medium flex justify-end text-gray-900 px-6 py-4 text-left"
                  >
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody v-for="(itemNew, indexNew) in dataNew" :key="indexNew">
                <tr
                  class="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100"
                >
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                  >
                    {{ (currentPage - 1) * 10 + (indexNew + 1) }}
                  </td>
                  <td
                    class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap"
                  >
                    <router-link
                      :to="{ name: 'DetailNews', query: { id: itemNew.id } }"
                    >
                      {{ itemNew.title }}
                    </router-link>
                  </td>
                  <td
                    class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap"
                  >
                    {{ itemNew.content }}
                  </td>
                  <td
                    class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap"
                  >
                    <div class="w-[100px] h-[100px] overflow-hidden">
                      <img
                        :src="itemNew?.previewImage"
                        alt=""
                        class="w-full h-full object-cover"
                      />
                    </div>
                  </td>

                  <td
                    class="text-sm flex justify-end text-gray-900 font-light px-6 py-4 whitespace-nowrap"
                  >
                    <div class="flex justify-start items-center">
                      <span @click="showModalEdit(itemNew.id)"
                        ><i
                          class="fa-solid fa-pen-to-square text-xl text-blue-500 mr-2 cursor-pointer"
                        ></i
                      ></span>

                      <span
                        @click="showModalConfirm(itemNew.id)"
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModalCenter"
                        ><i
                          class="fa-solid fa-trash-can text-xl text-red-600 cursor-pointer"
                        ></i
                      ></span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-end">
      <a-pagination
        @change="pageChanged()"
        v-model:current="currentPage"
        :total="totalPages"
        show-less-items
        :showSizeChanger="false"
      />
    </div>
  </a-page-header>

  <div
    v-if="loading"
    class="fixed top-0 bottom-0 left-0 z-[99999999] right-0 bg-black opacity-30 flex justify-center items-center"
  >
    <Loading :loading="loading"></Loading>
  </div>

  <a-modal
    v-model:visible="visibleConfirm"
    title="Xóa level"
    :confirm-loading="confirmLoading"
    @ok="handlRemoveNew"
  >
    <p>{{ modalText }}</p>
  </a-modal>

  <a-modal
    v-model:visible="visibleEdit"
    width="1000px"
    title="Sửa tin tức"
    @ok="handlEditNew"
  >
    <div>
      <label class="block text-sm font-medium text-gray-700"> Tiêu đề </label>
      <div class="mt-1">
        <a-input v-model:value="inputNew.title" placeholder="tiêu đề" />
      </div>
      <span class="text-red-500 font-medium italic text-sm">
        {{ errors.title }}</span
      >
    </div>

    <div class="mt-2">
      <label class="block text-sm font-medium text-gray-700"> Nội dung </label>
      <div class="mt-1">
        <a-input v-model:value="inputNew.content" placeholder="nội dung" />
      </div>
      <span class="text-red-500 font-medium italic text-sm">
        {{ errors.content }}</span
      >
    </div>

    <div class="flex items-center mt-3 justify-start">
      <label
        for="file-upload"
        class="px-4 py-1 bg-blue-500 text-white cursor-pointer hover:bg-blue-600"
      >
        Tải ảnh lên
      </label>
      <input
        id="file-upload"
        type="file"
        class="sr-only"
        @change="previewFile"
      />
    </div>
    <div
      class="w-44 relative mt-2 overflow-hidden h-44"
      v-if="inputNew.fileUrl"
    >
      <img class="w-full h-full object-cover" :src="inputNew.fileUrl" alt="" />
      <div v-if="inputNew.fileUrl" class="ml-2">
        <button
          class="text-red-700 bg-[#ffffff] w-7 h-7 shadow-md rounded-full absolute -top-1 -right-1"
          @click="
            inputNew.fileUrl = '';
            inputNew.fileUpload = '';
          "
        >
          <i class="fa-solid text-gray-500 text-lg fa-xmark"></i>
        </button>
      </div>
    </div>

    <span class="text-red-500 font-medium italic text-sm">
      {{ errors.fileUpload }}</span
    >
  </a-modal>
</template>
