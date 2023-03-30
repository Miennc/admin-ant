<script setup>
import { onMounted, ref, watch } from "vue";
import Loading from "@/components/loading/Loading.vue";
import { useToast } from "vue-toastification";
import { missionServices } from "@/services/missionServices";

const toast = useToast();
const visible = ref(false);
const textSearch = ref("");
const dataMission = ref([]);
const currentPage = ref(1);
const totalPages = ref(1);
const idRemoveMission = ref("");

const visibleConfirm = ref(false);
const optionsUnit = ref([]);

const loading = ref(false);
const modalText = ref("Bạn có chắc chắn muốn xóa nhiệm vụ không?");
const confirmLoading = ref(false);
const visibleEdit = ref(false);
const idEditMission = ref("");

const optionsType = [
  { label: "Đi nhanh", value: "FASTER" },
  { label: "Đi xa", value: "LONGER" },
];

const handlChangeType = (value) => {
  inputMission.value.type = value.value;
};

const inputMission = ref({
  name: "",
  description: "",
  type: "",
  distanceInKiloMeter: "",
  minutes: "",
  reward: "",
  rewardUnit: "",
});

const errors = ref({
  name: "",
  description: "",
  type: "",
  distanceInKiloMeter: "",
  minutes: "",
  reward: "",
  rewardUnit: "",
});

const showModal = async () => {
  await getUnitMoney();
  inputMission.value = {
    name: "",
    description: "",
  };
  visible.value = true;
};

const regexNumber = /^[0-9]*$/;

const validate = () => {
  errors.value.name = inputMission.value.name
    ? ""
    : "Tên danh mục không được để trống";
  errors.value.description = inputMission.value.description
    ? ""
    : "Mô tả không được để trống";
  errors.value.type = inputMission.value.type
    ? ""
    : "Loại nhiệm vụ không được để trống";
  errors.value.distanceInKiloMeter = regexNumber.test(inputMission.value.distanceInKiloMeter)
    ? ""
    : "Số bước phải là số";
  errors.value.minutes =
    inputMission.value.minutes && inputMission.value.type == "FASTER"
      ? ""
      : "Số phút không được để trống";
  errors.value.reward = regexNumber.test(inputMission.value.reward)
    ? ""
    : "Số tiền phải là số";
  errors.value.rewardUnit = inputMission.value.rewardUnit
    ? ""
    : "Đơn vị phần thưởng không được để trống";
  if (inputMission.value.type == "FASTER") {
    return (
      !errors.value.name &&
      !errors.value.description &&
      !errors.value.type &&
      !errors.value.distanceInKiloMeter &&
      !errors.value.minutes &&
      !errors.value.reward &&
      !errors.value.rewardUnit
    );
  } else {
    return (
      !errors.value.name &&
      !errors.value.description &&
      !errors.value.type &&
      !errors.value.distanceInKiloMeter &&
      !errors.value.reward &&
      !errors.value.rewardUnit
    );
  }
};

const handlRemoveMission = async () => {
  try {
    await missionServices.removeMission(idRemoveMission.value);
    await getAllMission();
    toast.success("Xóa nhiệm vụ thành công");
  } catch (e) {
    toast.error("Xóa nhiệm vụ thất bại");
  }
  visibleConfirm.value = false;
};

const getUnitMoney = async () => {
  try {
    const res = await missionServices.getUnitMoney();
    console.log(res.data);
    optionsUnit.value = res.data.map((item) => {
      return {
        label: item,
        value: item,
      };
    });
  } catch (e) {
    console.log(e);
  }
};

const handlChangeUnit = (value) => {
  inputMission.value.rewardUnit = value.value;
};

const handleChange = (value) => {
  console.log(value); // { key: "lucy", label: "Lucy (101)" }
};

const showModalConfirm = (id) => {
  idRemoveMission.value = id;
  visibleConfirm.value = true;
};

const showModalEdit = async (id) => {
  await getUnitMoney();
  errors.value = {
    name: "",
    description: "",
    type: "",
    distanceInKiloMeter: "",
    minutes: "",
    reward: "",
    rewardUnit: "",
  };
  visibleEdit.value = true;
  idEditMission.value = id;
  try {
    const res = await missionServices.findByIdMission(id);
    inputMission.value = {
      name: res.data.name,
      description: res.data.description,
      type: res.data.type,
      distanceInKiloMeter: res.data.distanceInKiloMeter,
      minutes: res.data.minutes,
      reward: res.data.reward,
      rewardUnit: res.data.rewardUnit,
    };
  } catch (e) {
    console.log(e);
  }
};

const hanldEditCate = async () => {
  if (validate()) {
    try {
      await missionServices.editMission({
        id: idEditMission.value,
        name: inputMission.value.name,
        description: inputMission.value.description,
        type: inputMission.value.type,
        distanceInKiloMeter: inputMission.value.distanceInKiloMeter,
        minutes: inputMission.value.minutes,
        reward: inputMission.value.reward,
        rewardUnit: inputMission.value.rewardUnit,
      });
      await getAllMission();
      visibleEdit.value = false;
      toast.success("Sửa nhiệm vụ thành công");
    } catch (e) {
      toast.error(e.response.data);
    }
  }
};

const handlAddMission = async () => {
  if (validate()) {
    loading.value = true;
    try {
      await missionServices.createMission({
        name: inputMission.value.name,
        description: inputMission.value.description,
        type: inputMission.value.type,
        distanceInKiloMeter: inputMission.value.distanceInKiloMeter,
        minutes: inputMission.value.minutes,
        reward: inputMission.value.reward,
        rewardUnit: inputMission.value.rewardUnit,
      });
      toast.success(" Thêm nhiệm vụ thành công");
      await getAllMission();
      visible.value = false;
      inputMission.value = {
        name: "",
        description: "",
        type: "",
        distanceInKiloMeter: "",
        minutes: "",
        reward: "",
        rewardUnit: "",
      };
    } catch (e) {
      toast.error(e.response.data);
    }
    loading.value = false;
  }
};

const searchCate = async () => {
  try {
    const res = await missionServices.searchMission({
      page: currentPage.value - 1,
      size: 10,
      sort: "id,desc",
      keyword: textSearch.value.trim() ? textSearch.value.trim() : "",
    });
    dataMission.value = res.data.content;
    totalPages.value = res.data.totalPages * 10;
    currentPage.value = res.data.number + 1;
  } catch (e) {
    console.log(e);
  }
};

watch(textSearch, async () => {
  await searchCate();
});

const filterByName = async (e) => {
  try {
    const res = await missionServices.listAllMission({
      page: currentPage.value - 1,
      size: 10,
      sort: e.key == "1" ? "name,asc" : "name,desc",
    });
    dataMission.value = res.data.content;
    totalPages.value = res.data.totalPages * 10;
    currentPage.value = res.data.number + 1;
  } catch (e) {
    console.log(e);
  }
};

const getAllMission = async () => {
  try {
    const res = await missionServices.listAllMission({
      page: currentPage.value - 1,
      size: 10,
      sort: "id,desc",
    });
    dataMission.value = res.data.content;
    totalPages.value = res.data.totalPages * 10;
    currentPage.value = res.data.number + 1;
  } catch (e) {
    console.log(e);
  }
};

const pageChanged = async () => {
  await getAllMission();
};

onMounted(async () => {
  loading.value = true;
  await getAllMission();
  loading.value = false;
});
</script>

<template>
  <a-page-header
    style="border: 1px solid rgb(235, 237, 240); padding: 10px"
    title="Quản lý  nhiệm vụ"
  >
    <template #tags>
      <a-button type="primary" @click="showModal">Thêm nhiệm vụ</a-button>
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
        title="Thêm nhiệm vụ"
        @ok="handlAddMission"
      >
        <div>
          <label class="block text-sm font-medium text-gray-700">
            Kiểu nhiệm vụ
          </label>
          <div class="mt-1">
            <a-select
              v-model:value="inputMission.type"
              label-in-value
              style="width: 100%"
              :options="optionsType"
              @change="handlChangeType"
            >
            </a-select>
          </div>
          <span class="text-red-500 font-medium italic text-sm">
            {{ errors.type }}</span
          >
        </div>

        <div class="mt-2">
          <label class="block text-sm font-medium text-gray-700">
            Tên nhiệm vụ
          </label>
          <div class="mt-1">
            <a-input
              v-model:value="inputMission.name"
              placeholder="Tên người dùng"
            />
          </div>
          <span class="text-red-500 font-medium italic text-sm">
            {{ errors.name }}</span
          >
        </div>

        <div class="mt-2">
          <label class="block text-sm font-medium text-gray-700">
            Mô tả nhiệm vụ
          </label>
          <div class="mt-1">
            <a-input
              v-model:value="inputMission.description"
              placeholder="Mô tả nhiệm vụ"
            />
          </div>
          <span class="text-red-500 font-medium italic text-sm">
            {{ errors.description }}</span
          >
        </div>

        <div class="mt-2">
          <label class="block text-sm font-medium text-gray-700">
            Khoảng cách đi được
          </label>
          <div class="mt-1">
            <a-input
              v-model:value="inputMission.distanceInKiloMeter"
              placeholder="km"
            />
          </div>
          <span class="text-red-500 font-medium italic text-sm">
            {{ errors.distanceInKiloMeter }}</span
          >
        </div>

        <div class="mt-2" v-if="inputMission.type == 'FASTER'">
          <label class="block text-sm font-medium text-gray-700">
            Số phút thực hiện
          </label>
          <div class="mt-1">
            <a-input
              v-model:value="inputMission.minutes"
              placeholder="Số phút thực hiện"
            />
          </div>
          <span class="text-red-500 font-medium italic text-sm">
            {{ errors.minutes }}</span
          >
        </div>

        <div class="mt-2">
          <label class="block text-sm font-medium text-gray-700">
            Phần thưởng
          </label>
          <div class="mt-1">
            <a-input
              v-model:value="inputMission.reward"
              placeholder="Phần thưởng"
            />
          </div>
          <span class="text-red-500 font-medium italic text-sm">
            {{ errors.reward }}</span
          >
        </div>

        <div class="mt-2">
          <label class="block text-sm font-medium text-gray-700">
            Đơn vị phần thưởng
          </label>
          <div class="mt-1">
            <a-select
              v-model:value="inputMission.rewardUnit"
              label-in-value
              style="width: 100%"
              :options="optionsUnit"
              @change="handlChangeUnit"
            >
            </a-select>
          </div>
          <span class="text-red-500 font-medium italic text-sm">
            {{ errors.rewardUnit }}</span
          >
        </div>
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
                    Tên nhiệm vụ
                  </th>
                  <th
                    scope="col"
                    class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                  >
                    Mô tả nhiệm vụ
                  </th>

                  <th
                    scope="col"
                    class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                  >
                    Số bước chân
                  </th>
                  <th
                    scope="col"
                    class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                  >
                    Phần thưởng
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
                v-for="(itemMission, indexMission) in dataMission"
                :key="indexMission"
              >
                <tr
                  class="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100"
                >
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                  >
                    {{ (currentPage - 1) * 10 + (indexMission + 1) }}
                  </td>

                  <router-link
                    :to="{
                      name: 'DetailMission',
                      query: { id: itemMission.id },
                    }"
                  >
                    <a-tooltip placement="bottom">
                      <template #title>
                        <span> Ấn vào để xem chi tiết </span>
                      </template>
                      <td
                        class="text-sm cursor-pointer text-gray-900 font-light px-6 whitespace-nowrap"
                      >
                        {{ itemMission.name }}
                      </td>
                    </a-tooltip>
                  </router-link>

                  <td
                    class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap"
                  >
                    {{
                      itemMission.description.length > 50
                        ? itemMission.description.substring(0, 50) + "..."
                        : itemMission.description
                    }}
                  </td>
                  <td
                    class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap"
                  >
                    {{ itemMission.distanceInKiloMeter }}
                  </td>
                  <td
                    class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap"
                  >
                    {{ itemMission.reward }}
                  </td>
                  <td
                    class="text-sm flex justify-end text-gray-900 font-light px-6 py-4 whitespace-nowrap"
                  >
                    <div class="flex justify-start items-center">
                      <span @click="showModalEdit(itemMission.id)"
                        ><i
                          class="fa-solid fa-pen-to-square text-xl text-blue-500 mr-2 cursor-pointer"
                        ></i
                      ></span>

                      <span
                        @click="showModalConfirm(itemMission.id)"
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
    title="Xóa nhiệm vụ"
    :confirm-loading="confirmLoading"
    @ok="handlRemoveMission"
  >
    <p>{{ modalText }}</p>
  </a-modal>

  <a-modal
    v-model:visible="visibleEdit"
    width="1000px"
    title="Sửa  nhiệm vụ"
    @ok="hanldEditCate"
  >
    <div>
      <label class="block text-sm font-medium text-gray-700">
        Kiểu nhiệm vụ
      </label>
      <div class="mt-1">
        <a-select
          v-model:value="inputMission.type"
          label-in-value
          style="width: 100%"
          :options="optionsType"
          @change="handlChangeType"
        >
        </a-select>
      </div>
      <span class="text-red-500 font-medium italic text-sm">
        {{ errors.type }}</span
      >
    </div>

    <div class="mt-2">
      <label class="block text-sm font-medium text-gray-700">
        Tên nhiệm vụ
      </label>
      <div class="mt-1">
        <a-input
          v-model:value="inputMission.name"
          placeholder="Tên người dùng"
        />
      </div>
      <span class="text-red-500 font-medium italic text-sm">
        {{ errors.name }}</span
      >
    </div>

    <div class="mt-2">
      <label class="block text-sm font-medium text-gray-700">
        Mô tả nhiệm vụ
      </label>
      <div class="mt-1">
        <a-input
          v-model:value="inputMission.description"
          placeholder="Mô tả nhiệm vụ"
        />
      </div>
      <span class="text-red-500 font-medium italic text-sm">
        {{ errors.description }}</span
      >
    </div>

    <div class="mt-2">
      <label class="block text-sm font-medium text-gray-700">
        Khoảng cách đi được
      </label>
      <div class="mt-1">
        <a-input
          v-model:value="inputMission.distanceInKiloMeter"
          placeholder="km"
        />
      </div>
      <span class="text-red-500 font-medium italic text-sm">
        {{ errors.distanceInKiloMeter }}</span
      >
    </div>

    <div class="mt-2" v-if="inputMission.type == 'FASTER'">
      <label class="block text-sm font-medium text-gray-700">
        Số phút thực hiện
      </label>
      <div class="mt-1">
        <a-input
          v-model:value="inputMission.minutes"
          placeholder="Số phút thực hiện"
        />
      </div>
      <span class="text-red-500 font-medium italic text-sm">
        {{ errors.minutes }}</span
      >
    </div>

    <div class="mt-2">
      <label class="block text-sm font-medium text-gray-700">
        Phần thưởng
      </label>
      <div class="mt-1">
        <a-input
          v-model:value="inputMission.reward"
          placeholder="Phần thưởng"
        />
      </div>
      <span class="text-red-500 font-medium italic text-sm">
        {{ errors.reward }}</span
      >
    </div>

    <div class="mt-2">
      <label class="block text-sm font-medium text-gray-700">
        Đơn vị phần thưởng
      </label>
      <div class="mt-1">
        <a-select
          v-model:value="inputMission.rewardUnit"
          label-in-value
          style="width: 100%"
          :options="optionsUnit"
          @change="handlChangeUnit"
        >
        </a-select>
      </div>
      <span class="text-red-500 font-medium italic text-sm">
        {{ errors.rewardUnit }}</span
      >
    </div>
  </a-modal>
</template>
