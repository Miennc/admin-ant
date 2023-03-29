<script setup>
import { levelServices } from "@/services/levelServices";
import { onMounted, ref, watch } from "vue";
import Loading from "@/components/loading/Loading.vue";
import { useToast } from "vue-toastification";
import { productServices } from "@/services/productServices";
import { categoryServices } from "@/services/categoryServices";
import { useRoute } from "vue-router";

const router = useRoute();
const toast = useToast();
const visible = ref(false);
const textSearch = ref("");
const dataProduct = ref([]);
const currentPage = ref(1);
const totalPages = ref(1);
const idRemoveProduct = ref("");
const visibleConfirm = ref(false);
const loading = ref(false);
const modalText = ref("Bạn có chắc chắn muốn xóa sản phẩm không?");
const confirmLoading = ref(false);
const visibleEdit = ref(false);
const idEditLevel = ref("");

const dataLevel = ref([]);

const dataCategory = ref([]);

const handleChangeLevel = (value) => {
  inputProduct.value.defaultLevelId = value.value;
};

const handleChangeCategory = (value) => {
  inputProduct.value.categoryId = value.value;
};

const handleChangeMoney = (value) => {
  inputProduct.value.priceUnit = value.value;
};
const optionsMoney = ref([]);

const inputProduct = ref({
  name: "",
  fileUrl: [],
  fileUpload: [],
  sku: "",
  price: "",
  priceUnit: "VND",
  status: "ACTIVE",
  displayToTop: "",
  displaySale: "",
  description: "",
  categoryId: "",
  defaultLevelId: "",
  minSpeed: "",
  maxSpeed: "",
});
const errors = ref({
  name: "",
  fileUpload: "",
  sku: "",
  price: "",
  priceUnit: "",
  status: "",
  displayToTop: "",
  displaySale: "",
  description: "",
  categoryId: "",
  defaultLevelId: "",
  minSpeed: "",
  maxSpeed: "",
});

const getAllCate = async () => {
  try {
    const res = await categoryServices.getAllCategory();
    dataCategory.value = res.data.content.map((item) => {
      return {
        value: item.id,
        label: item.name,
      };
    });
  } catch (e) {
    console.log(e);
  }
};

const getAllUnitMoney = async () => {
  try {
    const res = await productServices.getUnitMoney();
    optionsMoney.value = res.data.map((item) => {
      return {
        value: item,
        label: item,
      };
    });
  } catch (e) {
    console.log(e);
  }
};

const getAllLevel = async () => {
  try {
    const res = await levelServices.getAllLevel();
    dataLevel.value = res.data.content.map((item) => {
      return {
        value: item.id,
        label: item.name,
      };
    });
  } catch (e) {
    console.log(e);
  }
};

const showModal = async () => {
  inputProduct.value = {
    name: "",
    fileUrl: [],
    fileUpload: [],
    sku: "",
    price: "",
    priceUnit: "VND",
    status: "ACTIVE",
    displayToTop: "",
    displaySale: "",
    description: "",
    categoryId: "",
    defaultLevelId: "",
    minSpeed: "",
    maxSpeed: "",
  };
  await getAllUnitMoney();
  await getAllLevel();
  await getAllCate();
  visible.value = true;
};
const regexNumber = /^[0-9]*$/;

const validate = () => {
  errors.value.name = inputProduct.value.name
    ? ""
    : "Tên sản phẩm không được để trống";
  errors.value.fileUpload =
    inputProduct?.value?.fileUrl?.length < 1 ? "Ảnh không được để trống" : "";
  errors.value.sku = inputProduct.value.sku ? "" : "Sku không được để trống";
  errors.value.price =
    regexNumber.test(inputProduct.value.price) && inputProduct.value.price
      ? ""
      : "Giá phải là số";
  errors.value.minSpeed =
    regexNumber.test(inputProduct.value.minSpeed) && inputProduct.value.minSpeed
      ? ""
      : "Tốc độ tối thiểu phải là số";
  errors.value.maxSpeed =
    regexNumber.test(inputProduct.value.maxSpeed) && inputProduct.value.maxSpeed
      ? ""
      : "Tốc độ tối đa phải là số";
  errors.value.priceUnit = inputProduct.value.priceUnit
    ? ""
    : "Đơn vị in không được để trống";
  errors.value.status = inputProduct.value.status
    ? ""
    : "Trạng thái không được để trống";
  errors.value.description = inputProduct.value.description
    ? ""
    : "Mô tả không được để trống";
  errors.value.categoryId = inputProduct.value.categoryId
    ? ""
    : "Danh mục không được để trống";
  errors.value.defaultLevelId = inputProduct.value.defaultLevelId
    ? ""
    : "Level mặc định không được để trống";
  return (
    !errors.value.name &&
    !errors.value.fileUpload &&
    !errors.value.sku &&
    !errors.value.price &&
    !errors.value.priceUnit &&
    !errors.value.status &&
    !errors.value.description &&
    !errors.value.categoryId &&
    !errors.value.defaultLevelId
  );
};

const handlRemoveProduct = async () => {
  try {
    await productServices.removeProduct(idRemoveProduct.value);
    await getAllProduct();
    toast.success("Xóa sản phẩn  thành công");
  } catch (e) {
    toast.error("Xóa sản phẩm thất bại");
  }
  visibleConfirm.value = false;
};

const handleChange = (value) => {
  console.log(value); // { key: "lucy", label: "Lucy (101)" }
};

const showModalConfirm = (id) => {
  idRemoveProduct.value = id;
  visibleConfirm.value = true;
};

const showModalEdit = async (id) => {
  errors.value = {
    name: "",
    fileUrl: "",
    fileUpload: "",
    sku: "",
    price: "",
    priceUnit: "",
    status: "ACTIVE",
    displayToTop: "",
    displaySale: "",
    description: "",
    categoryId: "",
    defaultLevelId: "",
    minSpeed: "",
    maxSpeed: "",
  };
  visibleEdit.value = true;
  idEditLevel.value = id;
  await getAllUnitMoney();
  await getAllLevel();
  await getAllCate();
  try {
    const res = await productServices.findByIdProduct(id);
    inputProduct.value = {
      name: res.data.name,
      fileUrl: res.data.imageList.map((img) => img),
      fileUpload: [],
      sku: res.data.sku,
      price: res.data.price,
      priceUnit: res.data.priceUnit,
      status: res.data.status,
      description: res.data.description,
      categoryId: res.data.category.id,
      defaultLevelId: res.data.defaultLevel.id,
      minSpeed: res.data.minSpeed,
      maxSpeed: res.data.maxSpeed,
    };
  } catch (e) {
    console.log(e);
  }
};

const handlEditProduct = async () => {
  if (validate()) {
    try {
      const formData = new FormData();
      formData.append("id", idEditLevel.value);
      if (inputProduct.value.fileUpload) {
        for (let i = 0; i < inputProduct.value.fileUpload.length; i++) {
          formData.append("imageList", inputProduct.value.fileUpload[i]);
        }
      }
      formData.append("name", inputProduct.value.name);
      formData.append("sku", inputProduct.value.sku);
      formData.append("price", inputProduct.value.price);
      formData.append("priceUnit", inputProduct.value.priceUnit);
      formData.append("status", inputProduct.value.status);
      formData.append("description", inputProduct.value.description);
      formData.append("categoryId", inputProduct.value.categoryId);
      formData.append("defaultLevelId", inputProduct.value.defaultLevelId);
      formData.append("minSpeed", inputProduct.value.minSpeed);
      formData.append("maxSpeed", inputProduct.value.maxSpeed);
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      await productServices.editProduct(formData, config);
      await getAllProduct();
      visibleEdit.value = false;
      toast.success("Cập nhật sản phẩm thành công");
    } catch (e) {
      toast.error(e.response.data);
    }
  }
};

const removeFilePreview = (index) => {
  if (inputProduct.value.fileUrl?.length > 0) {
    inputProduct.value.fileUrl?.splice(index, 1);
  }
  if (inputProduct.value.fileUpload?.length > 0) {
    inputProduct.value.fileUpload?.splice(index, 1);
  }
};

const previewFile = (e) => {
  const files = e.target.files;
  for (let i = 0; i < files.length; i++) {
    console.log("files[i]", files[i]);
    inputProduct.value.fileUpload.push(files[i]);
    inputProduct.value.fileUrl.push(URL.createObjectURL(files[i]));
  }
  e.target.value = "";
};

const handlAddProduct = async () => {
  console.log(validate());
  if (validate()) {
    loading.value = true;
    try {
      const formData = new FormData();
      formData.append("name", inputProduct.value.name);
      formData.append("sku", inputProduct.value.sku);
      formData.append("price", inputProduct.value.price);
      formData.append("priceUnit", inputProduct.value.priceUnit);
      formData.append("status", inputProduct.value.status);
      formData.append("displayToTop", false);
      formData.append("displaySale", false);
      formData.append("description", inputProduct.value.description);
      formData.append("categoryId", inputProduct.value.categoryId);
      formData.append("defaultLevelId", inputProduct.value.defaultLevelId);
      formData.append("minSpeed", inputProduct.value.minSpeed);
      formData.append("maxSpeed", inputProduct.value.maxSpeed);
      if (inputProduct.value.fileUpload) {
        for (let i = 0; i < inputProduct.value.fileUpload.length; i++) {
          formData.append("imageList", inputProduct.value.fileUpload[i]);
        }
      }
      const config = {
        headers: {
          "content-type": "multipart/form-data",
        },
      };

      await productServices.createProduct(formData, config);

      toast.success("Thêm sản phẩm thành công");
      await getAllProduct();
      visible.value = false;
      inputProduct.value = {
        name: "",
        fileUrl: [],
        fileUpload: [],
        sku: "",
        price: "",
        priceUnit: "VND",
        status: "ACTIVE",
        displayToTop: "",
        displaySale: "",
        description: "",
        categoryId: "",
        defaultLevelId: "",
        minSpeed: "",
        maxSpeed: "",
      };
    } catch (e) {
      toast.error(e.response.data);
    }
    loading.value = false;
  }
};

const searchProduct = async () => {
  try {
    const res = await productServices.searchProduct({
      page: currentPage.value - 1,
      size: 5,
      sort: "id,desc",
      keyword: textSearch.value.trim() ? textSearch.value.trim() : "",
    });
    dataProduct.value = res.data.content;
    totalPages.value = res.data.totalPages * 10;
    currentPage.value = res.data.number + 1;
  } catch (e) {
    console.log(e);
  }
};

watch(textSearch, async () => {
  await searchProduct();
});

const filterByName = async (e) => {
  try {
    const res = await productServices.listAllProduct({
      page: currentPage.value - 1,
      size: 5,
      sort: e.key == "1" ? "name,asc" : "name,desc",
    });
    dataProduct.value = res.data.content;
    totalPages.value = res.data.totalPages * 10;
    currentPage.value = res.data.number + 1;
  } catch (e) {
    console.log(e);
  }
};

const getAllProduct = async () => {
  try {
    const res = await productServices.listAllProduct({
      page: currentPage.value - 1,
      size: 5,
      sort: "id,desc",
    });
    dataProduct.value = res.data.content;
    totalPages.value = res.data.totalPages * 10;
    currentPage.value = res.data.number + 1;
  } catch (e) {
    console.log(e);
  }
};

const pageChanged = async () => {
  await getAllProduct();
};

const checkToken = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    router.push({ name: "login" });
  }
};

onMounted(async () => {
  await checkToken();
  loading.value = true;
  await getAllProduct();
  loading.value = false;
});
</script>

<template>
  <a-page-header
    style="border: 1px solid rgb(235, 237, 240); padding: 10px"
    title="Quản lý sản phẩm"
  >
    <template #tags>
      <a-button type="primary" @click="showModal">Thêm sản phẩm</a-button>
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
        title="Thêm sản phẩm"
        @ok="handlAddProduct"
      >
        <div>
          <label class="block text-sm font-medium text-gray-700">
            Tên sản phẩm
          </label>
          <div class="mt-1">
            <a-input
              v-model:value="inputProduct.name"
              placeholder="Tên sản  phẩm "
            />
          </div>
          <span class="text-red-500 font-medium italic text-sm">
            {{ errors.name }}</span
          >
        </div>

        <div class="mt-2">
          <label class="block text-sm font-medium text-gray-700">
            Mã sản phẩm
          </label>
          <div class="mt-1">
            <a-input
              v-model:value="inputProduct.sku"
              placeholder="Mã sản phẩm"
            />
          </div>
          <span class="text-red-500 font-medium italic text-sm">
            {{ errors.sku }}</span
          >
        </div>

        <div class="mt-2">
          <label class="block text-sm font-medium text-gray-700">
            Giá sản phẩm
          </label>
          <div class="mt-1">
            <a-input
              v-model:value="inputProduct.price"
              placeholder="Giá sản phẩm "
            />
          </div>
          <span class="text-red-500 font-medium italic text-sm">
            {{ errors.price }}</span
          >
        </div>

        <div class="mt-2">
          <label class="block text-sm font-medium text-gray-700">
            Đơn vị giá
          </label>
          <div class="mt-1">
            <a-select
              v-model:value="inputProduct.priceUnit"
              label-in-value
              style="width: 100%"
              :options="optionsMoney"
              @change="handleChangeMoney"
            >
            </a-select>
          </div>
          <span class="text-red-500 font-medium italic text-sm">
            {{ errors.priceUnit }}</span
          >
        </div>

        <div class="mt-2">
          <label class="block text-sm font-medium text-gray-700">
            Mô tả sản phẩm
          </label>
          <div class="mt-1">
            <a-input
              v-model:value="inputProduct.description"
              placeholder="mô tả sản phẩm"
            />
          </div>
          <span class="text-red-500 font-medium italic text-sm">
            {{ errors.description }}</span
          >
        </div>

        <div class="mt-2">
          <label class="block text-sm font-medium text-gray-700">
            Tốc độ tối đa
          </label>
          <div class="mt-1">
            <a-input v-model:value="inputProduct.maxSpeed" placeholder="10km" />
          </div>
          <span class="text-red-500 font-medium italic text-sm">
            {{ errors.maxSpeed }}</span
          >
        </div>

        <div class="mt-2">
          <label class="block text-sm font-medium text-gray-700">
            Tốc độ tối thiểu
          </label>
          <div class="mt-1">
            <a-input v-model:value="inputProduct.minSpeed" placeholder="1km" />
          </div>
          <span class="text-red-500 font-medium italic text-sm">
            {{ errors.minSpeed }}</span
          >
        </div>

        <div class="mt-2">
          <label class="block text-sm font-medium text-gray-700"> Level </label>
          <div class="mt-1">
            <a-select
              v-model:value="inputProduct.defaultLevelId"
              label-in-value
              style="width: 100%"
              :options="dataLevel"
              @change="handleChangeLevel"
            >
            </a-select>
          </div>
          <span class="text-red-500 font-medium italic text-sm">
            {{ errors.defaultLevelId }}</span
          >
        </div>

        <div class="mt-2">
          <label class="block text-sm font-medium text-gray-700">
            Danh mục sản phẩm
          </label>
          <div class="mt-1">
            <a-select
              v-model:value="inputProduct.categoryId"
              label-in-value
              style="width: 100%"
              :options="dataCategory"
              @change="handleChangeCategory"
            >
            </a-select>
          </div>
          <span class="text-red-500 font-medium italic text-sm">
            {{ errors.categoryId }}</span
          >
        </div>

        <div class="flex items-center mt-3 justify-start">
          <label
            for="file-upload"
            class="px-4 py-1 bg-blue-500 text-white cursor-pointer hover:bg-blue-600"
          >
            Tải file lên
          </label>
          <input
            id="file-upload"
            type="file"
            class="sr-only"
            @change="previewFile"
            multiple="multiple"
          />
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <div
            v-for="(itemImg, indexImg) in inputProduct.fileUrl"
            :key="index"
            class="w-44 relative mt-2 overflow-hidden h-44"
            v-if="inputProduct.fileUrl.length > 0"
          >
            <img class="w-full h-full object-cover" :src="itemImg" alt="" />
            <div v-if="inputProduct.fileUrl.length > 0" class="ml-2">
              <button
                class="text-red-700 bg-[#ffffff] w-7 h-7 shadow-md rounded-full absolute -top-1 -right-1"
                @click="removeFilePreview(indexImg)"
              >
                <i class="fa-solid text-gray-500 text-lg fa-xmark"></i>
              </button>
            </div>
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
                    Tên sản phẩm
                  </th>
                  <th
                    scope="col"
                    class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                  >
                    Mô tả
                  </th>
                  <th
                    scope="col"
                    class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                  >
                    Giá
                  </th>

                  <th
                    scope="col"
                    class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                  >
                    Ảnh
                  </th>

                  <th
                    scope="col"
                    class="text-sm font-medium flex justify-end text-gray-900 px-6 py-4 text-left"
                  >
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody
                v-for="(itemLevel, indexProduct) in dataProduct"
                :key="indexProduct"
              >
                <tr
                  class="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100"
                >
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                  >
                    {{ (currentPage - 1) * 10 + (indexProduct + 1) }}
                  </td>
                  <td
                    class="text-sm cursor-pointer text-gray-900 font-light px-6 py-4 whitespace-nowrap"
                  >
                    <router-link
                      :to="{
                        name: 'ProductDetail',
                        query: { id: itemLevel.id },
                      }"
                    >
                      <a-tooltip placement="bottom">
                        <template #title>
                          <span> Ấn vào để xem chi tiết sản phẩm </span>
                        </template>
                        {{ itemLevel.name }}
                      </a-tooltip>
                    </router-link>
                  </td>
                  <td
                    class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap"
                  >
                    {{ itemLevel.description }}
                  </td>

                  <td
                    class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap"
                  >
                    {{ itemLevel.price }}đ
                  </td>

                  <td
                    class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap"
                  >
                    <div class="w-[100px] h-[100px] overflow-hidden">
                      <img
                        :src="itemLevel.imageList[0]"
                        alt=""
                        class="w-full h-full object-cover"
                      />
                    </div>
                  </td>

                  <td
                    class="text-sm flex justify-end text-gray-900 font-light px-6 py-4 whitespace-nowrap"
                  >
                    <div class="flex justify-start items-center">
                      <span @click="showModalEdit(itemLevel.id)"
                        ><i
                          class="fa-solid fa-pen-to-square text-xl text-blue-500 mr-2 cursor-pointer"
                        ></i
                      ></span>

                      <span
                        @click="showModalConfirm(itemLevel.id)"
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
    title="Xóa sản phẩm"
    :confirm-loading="confirmLoading"
    @ok="handlRemoveProduct"
  >
    <p>{{ modalText }}</p>
  </a-modal>

  <a-modal
    v-model:visible="visibleEdit"
    width="1000px"
    title="Sửa danh mục"
    @ok="handlEditProduct"
  >
    <div>
      <label class="block text-sm font-medium text-gray-700">
        Tên sản phẩm
      </label>
      <div class="mt-1">
        <a-input
          v-model:value="inputProduct.name"
          placeholder="Tên sản  phẩm "
        />
      </div>
      <span class="text-red-500 font-medium italic text-sm">
        {{ errors.name }}</span
      >
    </div>

    <div class="mt-2">
      <label class="block text-sm font-medium text-gray-700">
        Mã sản phẩm
      </label>
      <div class="mt-1">
        <a-input v-model:value="inputProduct.sku" placeholder="Mã sản phẩm" />
      </div>
      <span class="text-red-500 font-medium italic text-sm">
        {{ errors.sku }}</span
      >
    </div>

    <div class="mt-2">
      <label class="block text-sm font-medium text-gray-700">
        Giá sản phẩm
      </label>
      <div class="mt-1">
        <a-input
          v-model:value="inputProduct.price"
          placeholder="Giá   sản phẩm "
        />
      </div>
      <span class="text-red-500 font-medium italic text-sm">
        {{ errors.price }}</span
      >
    </div>

    <div class="mt-2">
      <label class="block text-sm font-medium text-gray-700">
        Đơn vị giá
      </label>
      <div class="mt-1">
        <a-select
          v-model:value="inputProduct.priceUnit"
          label-in-value
          style="width: 100%"
          :options="optionsMoney"
          @change="handleChangeMoney"
        >
        </a-select>
      </div>
      <span class="text-red-500 font-medium italic text-sm">
        {{ errors.priceUnit }}</span
      >
    </div>

    <div class="mt-2">
      <label class="block text-sm font-medium text-gray-700">
        Mô tả sản phẩm
      </label>
      <div class="mt-1">
        <a-input
          v-model:value="inputProduct.description"
          placeholder="10 000VNĐ "
        />
      </div>
      <span class="text-red-500 font-medium italic text-sm">
        {{ errors.description }}</span
      >
    </div>

    <div class="mt-2">
      <label class="block text-sm font-medium text-gray-700">
        Tốc độ tối đa
      </label>
      <div class="mt-1">
        <a-input v-model:value="inputProduct.maxSpeed" placeholder="10km" />
      </div>
      <span class="text-red-500 font-medium italic text-sm">
        {{ errors.maxSpeed }}</span
      >
    </div>

    <div class="mt-2">
      <label class="block text-sm font-medium text-gray-700">
        Tốc độ tối thiểu
      </label>
      <div class="mt-1">
        <a-input v-model:value="inputProduct.minSpeed" placeholder="1km" />
      </div>
      <span class="text-red-500 font-medium italic text-sm">
        {{ errors.minSpeed }}</span
      >
    </div>

    <div class="mt-2">
      <label class="block text-sm font-medium text-gray-700"> Level </label>
      <div class="mt-1">
        <a-select
          v-model:value="inputProduct.defaultLevelId"
          label-in-value
          style="width: 100%"
          :options="dataLevel"
          @change="handleChangeLevel"
        >
        </a-select>
      </div>
      <span class="text-red-500 font-medium italic text-sm">
        {{ errors.defaultLevelId }}</span
      >
    </div>

    <div class="mt-2">
      <label class="block text-sm font-medium text-gray-700">
        Danh mục sản phẩm
      </label>
      <div class="mt-1">
        <a-select
          v-model:value="inputProduct.categoryId"
          label-in-value
          style="width: 100%"
          :options="dataCategory"
          @change="handleChangeCategory"
        >
        </a-select>
      </div>
      <span class="text-red-500 font-medium italic text-sm">
        {{ errors.categoryId }}</span
      >
    </div>

    <div class="flex items-center mt-3 justify-start">
      <label
        for="file-upload"
        class="px-4 py-1 bg-blue-500 text-white cursor-pointer hover:bg-blue-600"
      >
        Tải file lên
      </label>
      <input
        id="file-upload"
        type="file"
        class="sr-only"
        @change="previewFile"
        multiple="multiple"
      />
    </div>

    <div class="flex flex-wrap items-center gap-2">
      <div
        v-for="(itemImg, indexImg) in inputProduct.fileUrl"
        :key="indexImg"
        class="w-44 relative mt-2 overflow-hidden h-44"
        v-if="inputProduct.fileUrl.length > 0"
      >
        <img class="w-full h-full object-cover" :src="itemImg" alt="" />
        <div v-if="inputProduct.fileUrl.length > 0" class="ml-2">
          <button
            class="text-red-700 bg-[#ffffff] w-7 h-7 shadow-md rounded-full absolute -top-1 -right-1"
            @click="removeFilePreview(indexImg)"
          >
            <i class="fa-solid text-gray-500 text-lg fa-xmark"></i>
          </button>
        </div>
      </div>
    </div>

    <span class="text-red-500 font-medium italic text-sm">
      {{ errors.fileUpload }}</span
    >
  </a-modal>
</template>
