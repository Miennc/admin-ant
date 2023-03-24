<script setup>
import {levelServices} from "@/services/levelServices";
import {onMounted, ref, watch} from "vue";
import Loading from "@/components/loading/Loading.vue";
import {useToast} from "vue-toastification";

const toast = useToast()
const visible = ref(false)
const textSearch = ref('')
const dataLevel = ref([])
const currentPage = ref(1)
const totalPages = ref(1)
const idRemoveLevel = ref('')
const visibleConfirm = ref(false)
const loading = ref(false)
const modalText = ref('Bạn có chắc chắn muốn xóa level không?')
const confirmLoading = ref(false);
const visibleEdit = ref(false)
const idEditLevel = ref('')
const inputLevel = ref({
  name: '',
  fileUrl: '',
  fileUpload: '',
  valueNumber: '',
})
const errors = ref({
  name: '',
  fileUpload: '',
  valueNumber: '',
})
const showModal = () => {
  inputLevel.value = {
    name: '',
    fileUrl: '',
    fileUpload: '',
    valueNumber: '',
  }
  visible.value = true
}
const regexValue = /^[0-9]*$/;

const validate = () => {
  errors.value.name = inputLevel.value.name ? '' : 'Tên danh level không được để trống'
  errors.value.fileUpload = inputLevel?.value?.fileUpload?.length < 1 ? 'Ảnh không được để trống' : ''
  errors.value.valueNumber = regexValue.test(inputLevel.value.valueNumber) && inputLevel.value.valueNumber ? '' : 'Giá trị không hợp lệ'
  return !errors.value.name && !errors.value.fileUpload && !errors.value.valueNumber
}


const handlRemoveLevel = async () => {
  try {
    await levelServices.removeLevel(idRemoveLevel.value)
    await getAllLevel()
    toast.success('Xóa level thành công')
  } catch (e) {
    toast.error('Xóa level thất bại')
  }
  visibleConfirm.value = false
}


const handleChange = value => {
  console.log(value); // { key: "lucy", label: "Lucy (101)" }
};


const showModalConfirm = (id) => {
  idRemoveLevel.value = id
  visibleConfirm.value = true
}

const showModalEdit = async (id) => {
  errors.value = {
    name: '',
    fileUpload: '',
    valueNumber: '',
  }
  visibleEdit.value = true
  idEditLevel.value = id
  try {
    const res = await levelServices.findLevelById(id)
    inputLevel.value = {
      name: res.data.name,
      fileUrl: res.data.image,
      valueNumber: res.data.value,
    }
  } catch (e) {
    console.log(e)
  }

}


const handlEditLevel = async () => {
  if (validate()) {
    try {
      const formData = new FormData()
      formData.append('id', idEditLevel.value)
      if (inputLevel.value.fileUpload) {
        formData.append('image', inputLevel.value.fileUpload)
      }
      formData.append('name', inputLevel.value.name)
      formData.append('value', inputLevel.value.valueNumber)
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      await levelServices.editLevel(formData, config)
      await getAllLevel()
      visibleEdit.value = false
      toast.success('Cập nhật level thành công')
    } catch (e) {
      toast.error(e.response.data)
    }
  }
}


const previewFile = (e) => {
  const file = e.target.files[0]
  if (file) {
    inputLevel.value.fileUpload = file
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => {
      inputLevel.value.fileUrl = reader.result
    }
  }
  e.target.value = ''
}

const handlAddLevel = async () => {

  if (validate()) {
    loading.value = true
    try {
      const formData = new FormData()
      formData.append('image', inputLevel.value.fileUpload)
      formData.append('name', inputLevel.value.name)
      formData.append('value', inputLevel.value.valueNumber)
      const config = {
        headers: {
          'content-type': 'multipart/form-data'
        }
      }
      await levelServices.createLevel(formData, config)
      toast.success('Thêm level thành công')
      await getAllLevel()
      visible.value = false
      inputLevel.value = {
        name: '',
        fileUrl: '',
        fileUpload: '',
      }
    } catch (e) {
      toast.error(e.response.data)
    }

    loading.value = false
  }

}


const searchLevel = async () => {
  try {
    const res = await levelServices.searchLevel({
      page: currentPage.value - 1,
      size: 5,
      sort: 'id,desc',
      keyword: textSearch.value.trim() ? textSearch.value.trim() : ''
    })
    dataLevel.value = res.data.content
    totalPages.value = res.data.totalPages * 10
    currentPage.value = res.data.number + 1
  } catch (e) {
    console.log(e)
  }
}

watch(textSearch, async () => {
  await searchLevel()
})

const filterByName = async (e) => {
  try {
    const res = await levelServices.getAllLevel({
      page: currentPage.value - 1,
      size: 5,
      sort: e.key == '1' ? 'name,asc' : 'name,desc'
    })
    dataLevel.value = res.data.content
    totalPages.value = res.data.totalPages * 10
    currentPage.value = res.data.number + 1
  } catch (e) {
    console.log(e)
  }
}


const getAllLevel = async () => {
  try {
    const res = await levelServices.getAllLevel({
      page: currentPage.value - 1,
      size: 5,
      sort: 'id,desc',
    })
    dataLevel.value = res.data.content
    totalPages.value = res.data.totalPages * 10
    currentPage.value = res.data.number + 1
  } catch (e) {
    console.log(e)
  }
}

const pageChanged = async () => {
  await getAllLevel()
}


onMounted(async () => {
  loading.value = true
  await getAllLevel()
  loading.value = false
})


</script>

<template>
  <a-page-header
      style="border: 1px solid rgb(235, 237, 240); padding: 10px"
      title="Quản lý level"
  >
    <template #tags>
      <a-button type="primary" @click="showModal">Thêm level     </a-button>
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
      <a-modal v-model:visible="visible" width="1000px" title="Thêm level" @ok="handlAddLevel">

        <div>
          <label class="block text-sm font-medium text-gray-700">
            Tên level
          </label>
          <div class="mt-1">
            <a-input v-model:value="inputLevel.name" placeholder="Tên level"/>
          </div>
          <span class="text-red-500 font-medium italic text-sm"> {{ errors.name }}</span>
        </div>


        <div class="mt-2">
          <label class="block text-sm font-medium text-gray-700">
            Giá trị
          </label>
          <div class="mt-1">
            <a-input v-model:value="inputLevel.valueNumber" placeholder="Giá trị"/>
          </div>
          <span class="text-red-500 font-medium italic text-sm"> {{ errors.valueNumber }}</span>
        </div>

        <div class="flex items-center mt-3 justify-start">
          <label for="file-upload" class="px-4 py-1 bg-blue-500 text-white  cursor-pointer hover:bg-blue-600">
            Upload File
          </label>
          <input id="file-upload" type="file" class="sr-only" @change="previewFile">
        </div>
        <div class="w-44 relative mt-2  overflow-hidden h-44" v-if="inputLevel.fileUrl">
          <img class="w-full h-full object-cover" :src="inputLevel.fileUrl" alt=""/>
          <div v-if="inputLevel.fileUrl" class="ml-2">
            <button
                class="text-red-700 bg-[#ffffff] w-7 h-7 shadow-md rounded-full absolute -top-1 -right-1"
                @click=" inputLevel.fileUrl = '' ; inputLevel.fileUpload = ''"
            >
              <i class="fa-solid text-gray-500 text-lg fa-xmark"></i>
            </button>
          </div>
        </div>

        <span class="text-red-500 font-medium italic text-sm"> {{ errors.fileUpload }}</span>


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
                  Tên level
                </th>
                <th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                  Ảnh
                </th>
                <th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                  Giá trị
                </th>
                <th scope="col" class="text-sm font-medium flex justify-end text-gray-900 px-6 py-4 text-left">
                  Hành động
                </th>
              </tr>
              </thead>
              <tbody v-for="(itemLevel,indexLevel) in dataLevel" :key="indexLevel">
              <tr class="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100 ">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ (currentPage - 1) * 10 + (indexLevel + 1) }}
                </td>
                <td class="text-sm  text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                  {{ itemLevel.name }}
                </td>
                <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                  <div class="w-[100px] h-[100px] overflow-hidden">
                    <img :src="itemLevel?.image" alt="" class="w-full h-full object-cover">
                  </div>
                </td>

                <td class="text-sm  text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                  {{ itemLevel.value }}
                </td>
                <td class="text-sm flex justify-end text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                  <div class="flex justify-start items-center">

                           <span @click="showModalEdit(itemLevel.id)"><i class="
                              fa-solid fa-pen-to-square
                              text-xl text-blue-500
                              mr-2
                              cursor-pointer
                            "></i></span>


                    <span @click="showModalConfirm(itemLevel.id)" data-bs-toggle="modal"
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
      title="Xóa level"
      :confirm-loading="confirmLoading"
      @ok="handlRemoveLevel"
  >
    <p>{{ modalText }}</p>
  </a-modal>


  <a-modal v-model:visible="visibleEdit" width="1000px" title="Sửa danh mục" @ok="handlEditLevel">
    <div>
      <label class="block text-sm font-medium text-gray-700">
        Tên level
      </label>
      <div class="mt-1">
        <a-input v-model:value="inputLevel.name" placeholder="Tên level"/>
      </div>
      <span class="text-red-500 font-medium italic text-sm"> {{ errors.name }}</span>
    </div>


    <div class="mt-2">
      <label class="block text-sm font-medium text-gray-700">
        Giá trị
      </label>
      <div class="mt-1">
        <a-input v-model:value="inputLevel.valueNumber" placeholder="Giá trị"/>
      </div>
      <span class="text-red-500 font-medium italic text-sm"> {{ errors.valueNumber }}</span>
    </div>

    <div class="flex items-center mt-3 justify-start">
      <label for="file-upload" class="px-4 py-1 bg-blue-500 text-white  cursor-pointer hover:bg-blue-600">
        Upload File
      </label>
      <input id="file-upload" type="file" class="sr-only" @change="previewFile">
    </div>
    <div class="w-44 relative mt-2  overflow-hidden h-44" v-if="inputLevel.fileUrl">
      <img class="w-full h-full object-cover" :src="inputLevel.fileUrl" alt=""/>
      <div v-if="inputLevel.fileUrl" class="ml-2">
        <button
            class="text-red-700 bg-[#ffffff] w-7 h-7 shadow-md rounded-full absolute -top-1 -right-1"
            @click=" inputLevel.fileUrl = '' ; inputLevel.fileUpload = ''"
        >
          <i class="fa-solid text-gray-500 text-lg fa-xmark"></i>
        </button>
      </div>
    </div>

    <span class="text-red-500 font-medium italic text-sm"> {{ errors.fileUpload }}</span>


  </a-modal>


</template>
