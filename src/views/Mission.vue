<script setup>
import {categoryServices} from "@/services/categoryServices";
import {onMounted, ref, watch} from "vue";
import Loading from "@/components/loading/Loading.vue";
import {useToast} from "vue-toastification";
import router from "@/router";
import {missionServices} from "@/services/missionServices";

const toast = useToast()
const visible = ref(false)
const textSearch = ref('')
const dataMission = ref([])
const currentPage = ref(1)
const totalPages = ref(1)
const idRemoveMission = ref('')

const visibleConfirm = ref(false)

const loading = ref(false)
const modalText = ref('Bạn có chắc chắn muốn xóa nhiệm vụ không?')
const confirmLoading = ref(false);
const visibleEdit = ref(false)
const idEditCate = ref('')


const options = ref([{
  value: 'ACTIVE',
  label: 'ACTIVE',
}, {
  value: 'PENDING',
  label: 'PENDING',
}]);

const inputCate = ref({
  name: '',
  description: '',
})

const errors = ref({
  name: '',
  description: '',
})

const showModal = () => {
  inputCate.value = {
    name: '',
    description: '',
  }
  visible.value = true
}

const validate = () => {
  errors.value.name = inputCate.value.name ? '' : 'Tên danh mục không được để trống'
  errors.value.description = inputCate.value.description ? '' : 'Mô tả không được để trống'
  return !errors.value.name && !errors.value.description
}


const handlRemoveMission = async () => {
  try {
    await missionServices.removeMission(idRemoveMission.value)
    await getAllMission()
    toast.success('Xóa nhiệm vụ thành công')
  } catch (e) {
    toast.error('Xóa nhiệm vụ thất bại')
  }
  visibleConfirm.value = false
}


const handleChange = value => {
  console.log(value); // { key: "lucy", label: "Lucy (101)" }
};


const showModalConfirm = (id) => {
  idRemoveMission.value = id
  visibleConfirm.value = true
}

const showModalEdit = async (id) => {

  errors.value = {
    name: '',
    description: '',
  }
  visibleEdit.value = true
  idEditCate.value = id
  try {
    const res = await categoryServices.findCategoryById(id)
    inputCate.value = {
      name: res.data.name,
      description: res.data.description,
    }
  } catch (e) {
    console.log(e)
  }

}


const hanldEditCate = async () => {
  if (validate()) {
    try {
      await categoryServices.editCategory({
        id: idEditCate.value,
        name: inputCate.value.name,
        description: inputCate.value.description,
      })
      toast.success('Cập nhật danh mục thành công')
    } catch (e) {
      toast.error(e.response.data)
    }
  }
}


const handleAddCate = async () => {

  if (validate()) {
    loading.value = true
    try {
      await categoryServices.createCategory({
        name: inputCate.value.name,
        description: inputCate.value.description,
      })
      toast.success('Thêm danh mục thành công')
      await getAllMission()
      visible.value = false
      inputCate.value = {
        name: '',
        description: '',
      }
    } catch (e) {
      toast.error(e.response.data)
    }
    loading.value = false
  }

}


const searchCate = async () => {
  try {
    const res = await missionServices.searchMission({
      page: currentPage.value - 1,
      size: 10,
      sort: 'id,desc',
      keyword: textSearch.value.trim() ? textSearch.value.trim() : ''
    })
    dataMission.value = res.data.content
    totalPages.value = res.data.totalPages * 10
    currentPage.value = res.data.number + 1
  } catch (e) {
    console.log(e)
  }
}

watch(textSearch, async () => {
  await searchCate()
})

const filterByName = async (e) => {
  try {
    const res = await missionServices.listAllMission({
      page: currentPage.value - 1,
      size: 10,
      sort: e.key == '1' ? 'name,asc' : 'name,desc'
    })
    dataMission.value = res.data.content
    totalPages.value = res.data.totalPages * 10
    currentPage.value = res.data.number + 1
  } catch (e) {
    console.log(e)
  }
}


const getAllMission = async () => {
  try {
    const res = await missionServices.listAllMission({
      page: currentPage.value - 1,
      size: 10,
      sort: 'id,desc',
    })
    dataMission.value = res.data.content
    totalPages.value = res.data.totalPages * 10
    currentPage.value = res.data.number + 1
  } catch (e) {
    console.log(e)
  }
}

const pageChanged = async () => {
  await getAllMission()
}

onMounted(async () => {
  loading.value = true
  await getAllMission()
  loading.value = false
})

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
        <input v-model="textSearch" type="text" class="w-[20rem] p-1  outline-1 outline-[#1890ff]"
               placeholder="Tìm kiếm...">

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
      <a-modal v-model:visible="visible" width="1000px" title="Thêm nhiệm vụ" @ok="handleAddCate">

        <div>
          <label class="block text-sm font-medium text-gray-700">
            Tên danh mục
          </label>
          <div class="mt-1">
            <a-input v-model:value="inputCate.name" placeholder="Tên người dùng"/>
          </div>
          <span class="text-red-500 font-medium italic text-sm"> {{ errors.name }}</span>
        </div>

        <div class="mt-2">
          <label class="block text-sm font-medium text-gray-700">
            Mô tả danh mục
          </label>
          <div class="mt-1">
            <a-input v-model:value="inputCate.description" placeholder="Tên đăng nhập"/>
          </div>
          <span class="text-red-500 font-medium italic text-sm"> {{ errors.description }}</span>
        </div>

      </a-modal>
    </div>


    <div class="flex flex-col">
      <div class="overflow-x-auto ">
        <div class="py-2 inline-block min-w-full ">
          <div class="overflow-hidden">
            <table class="min-w-full">
              <thead class="bg-gray-200 border-b">
              <tr>
                <th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                  #
                </th>
                <th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                  Tên nhiệm vụ
                </th>
                <th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                  Mô tả nhiệm vụ
                </th>

                <th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                  Số bước chân
                </th>
                <th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                  Phần thưởng
                </th>
                <th scope="col" class="text-sm font-medium flex justify-end text-gray-900 px-6 py-4 text-left">
                  Hành động
                </th>
              </tr>
              </thead>
              <tbody v-for="(itemMission,indexMission) in dataMission" :key="indexMission">
              <tr class="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100 ">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ (currentPage - 1) * 10 + (indexMission + 1) }}
                </td>

                <router-link :to="{name:'DetailMission', query:{id: itemMission.id}}">
                  <a-tooltip placement="bottom">
                    <template #title>
                      <span>  Ấn vào để xem chi tiết </span>
                    </template>
                    <td class="text-sm cursor-pointer text-gray-900 font-light px-6  whitespace-nowrap">
                      {{ itemMission.name }}
                    </td>
                  </a-tooltip>
                </router-link>

                <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                  {{
                    itemMission.description.length > 50 ? itemMission.description.substring(0, 50) + '...' : itemMission.description
                  }}
                </td>
                <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                  {{ itemMission.steps }}
                </td>
                <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                  {{ itemMission.reward }}
                </td>
                <td class="text-sm flex justify-end text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                  <div class="flex justify-start items-center">

                           <span @click="showModalEdit(itemMission.id)"><i class="
                              fa-solid fa-pen-to-square
                              text-xl text-blue-500
                              mr-2
                              cursor-pointer
                            "></i></span>


                    <span @click="showModalConfirm(itemMission.id)" data-bs-toggle="modal"
                          data-bs-target="#exampleModalCenter"><i
                        class="
                    fa-solid fa-trash-can
                    text-xl text-red-600
                    cursor-pointer
                  "></i></span>
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
      <a-pagination @change="pageChanged()" v-model:current="currentPage" :total="totalPages" show-less-items
                    :showSizeChanger="false"/>
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


  <a-modal v-model:visible="visibleEdit" width="1000px" title="Sửa danh mục" @ok="hanldEditCate">
    <div>
      <label class="block text-sm font-medium text-gray-700">
        Tên danh mục
      </label>
      <div class="mt-1">
        <a-input v-model:value="inputCate.name" placeholder="Tên danh mục"/>
      </div>
      <span class="text-red-500 font-medium italic text-sm"> {{ errors.name }}</span>
    </div>

    <div class="mt-2">
      <label class="block text-sm font-medium text-gray-700">
        Mô tả danh mục
      </label>
      <div class="mt-1">
        <a-input v-model:value="inputCate.description" placeholder="môi tả"/>
      </div>
      <span class="text-red-500 font-medium italic text-sm"> {{ errors.description }}</span>
    </div>


  </a-modal>


</template>
