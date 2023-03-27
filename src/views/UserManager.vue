<script setup>
import {userServices} from "@/services/userServices";
import {onMounted, ref, watch} from "vue";
import Loading from "@/components/loading/Loading.vue";
import {useToast} from "vue-toastification";
import router from "@/router";

const toast = useToast()
const visible = ref(false)
const textSearch = ref('')
const dataUser = ref([])
const currentPage = ref(1)
const totalPages = ref(1)
const idRemoveUser = ref('')

const visibleConfirm = ref(false)

const loading = ref(false)
const modalText = ref('Bạn có chắc chắn muốn xóa người dùng không?')
const confirmLoading = ref(false);
const visibleEdit = ref(false)
const idEditUser = ref('')


const options = ref([{
  value: 'ACTIVE',
  label: 'ACTIVE',
}, {
  value: 'PENDING',
  label: 'PENDING',
}]);

const inputUsers = ref({
  name: '',
  email: '',
  password: '',
  userName: '',
  phone: '',
  status: 'ACTIVE'
})

const errors = ref({
  name: '',
  email: '',
  password: '',
  userName: '',
  phone: '',
})

const showModal = () => {
  inputUsers.value = {
    name: '',
    email: '',
    password: '',
    userName: '',
    phone: '',
  }
  visible.value = true
}
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /(03|07|08|09|01[2|6|8|9])+([0-9]{8})\b/;
const validate = () => {
  errors.value.name = inputUsers.value.name ? '' : 'Tên người dùng không được để trống'
  errors.value.email = emailRegex.test(inputUsers.value.email) ? '' : 'Email không đúng định dạng'
  errors.value.password = inputUsers.value.password ? '' : 'Mật khẩu không được để trống'
  errors.value.userName = inputUsers.value.userName ? '' : 'Tên đăng nhập không được để trống'
  errors.value.phone = phoneRegex.test(inputUsers.value.phone) ? '' : 'Số điện thoại không đúng định dạng'
  return !errors.value.name && !errors.value.email && !errors.value.password && !errors.value.userName && !errors.value.phone
}


const validateFormEdit = () => {
  errors.value.name = inputUsers.value.name ? '' : 'Tên người dùng không được để trống'
  errors.value.email = emailRegex.test(inputUsers.value.email) ? '' : 'Email không đúng định dạng'
  errors.value.userName = inputUsers.value.userName ? '' : 'Tên đăng nhập không được để trống'
  errors.value.phone = phoneRegex.test(inputUsers.value.phone) ? '' : 'Số điện thoại không đúng định dạng'
  return !errors.value.name && !errors.value.email && !errors.value.userName && !errors.value.phone
}


const handleRemoveUser = async () => {
  try {
    await userServices.removeUser(idRemoveUser.value)
    await getAllUser()
    toast.success('Xóa người dùng thành công')
  } catch (e) {
    toast.error('Xóa người dùng thất bại')
  }
  visibleConfirm.value = false
}


const handleChange = value => {
  inputUsers.value.status = value.value
  console.log(value); // { key: "lucy", label: "Lucy (101)" }
};


const showModalConfirm = (id) => {
  idRemoveUser.value = id
  visibleConfirm.value = true
}

const showModalEdit = async (id) => {

  errors.value = {
    name: '',
    email: '',
    password: '',
    userName: '',
    phone: '',
  }

  visibleEdit.value = true
  idEditUser.value = id
  try {
    const res = await userServices.findByIdUser(id)
    inputUsers.value = {
      name: res.data.displayName,
      email: res.data.email,
      userName: res.data.username,
      phone: res.data.phoneNumber,
      status: res.data.status
    }
  } catch (e) {
    console.log(e)
  }

}


const handleEditUser = async () => {
  if (validateFormEdit()) {
    try {
      await userServices.editUser({
        id: idEditUser.value,
        displayName: inputUsers.value.name,
        email: inputUsers.value.email,
        password: inputUsers.value.password,
        username: inputUsers.value.userName,
        phoneNumber: inputUsers.value.phone,
        status: inputUsers.value.status
      })
      await getAllUser()
      toast.success('Cập nhật người dùng thành công')
      visibleEdit.value = false
    } catch (e) {
      toast.error('Cập nhật người dùng thất bại')
    }
  }

}


const handleAddUser = async () => {

  if (validate()) {
    loading.value = true
    try {
      await userServices.addUser({
        displayName: inputUsers.value.name,
        email: inputUsers.value.email,
        password: inputUsers.value.password,
        username: inputUsers.value.userName,
        phoneNumber: inputUsers.value.phone
      })
      toast.success('Thêm người dùng thành công')
      await getAllUser()
      visible.value = false
      inputUsers.value = {
        name: '',
        email: '',
        password: '',
        userName: '',
        phone: '',
      }
    } catch (e) {
      toast.error(e.response.data)
    }
    loading.value = false
  }

}


const searchUser = async () => {
  try {
    const res = await userServices.searchUser({
      page: currentPage.value - 1,
      size: 10,
      sort: 'id,desc',
      keyword: textSearch.value.trim() ? textSearch.value.trim() : ''
    })
    dataUser.value = res.data.content
    totalPages.value = res.data.totalPages * 10
    currentPage.value = res.data.number + 1

  } catch (e) {

  }
}

watch(textSearch, async () => {
  await searchUser()
})

const filterByName = async (e) => {
  try {
    const res = await userServices.getAllUsers({
      page: currentPage.value - 1,
      size: 10,
      sort: e.key == '1' ? 'username,asc' : 'username,desc'
    })
    dataUser.value = res.data.content
    totalPages.value = res.data.totalPages * 10
    currentPage.value = res.data.number + 1
  } catch (e) {
    console.log(e)
  }
}


const getAllUser = async () => {
  try {
    const res = await userServices.getAllUsers({
      page: currentPage.value - 1,
      size: 10,
      sort: 'id,desc',
    })
    dataUser.value = res.data.content
    totalPages.value = res.data.totalPages * 10
    currentPage.value = res.data.number + 1
  } catch (e) {
    console.log(e)
  }
}

const pageChanged = async () => {
  await getAllUser()
}

onMounted(async () => {
  loading.value = true
  await getAllUser()
  loading.value = false
})

</script>

<template>
  <a-page-header
      style="border: 1px solid rgb(235, 237, 240); padding: 10px"
      title="Quản lý người dùng"
  >
    <template #tags>
      <a-button type="primary" @click="showModal">Thêm người dùng</a-button>
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
      <a-modal v-model:visible="visible" width="1000px" title="Thêm người dùng" @ok="handleAddUser">

        <div>
          <label class="block text-sm font-medium text-gray-700">
            Tên người dùng
          </label>
          <div class="mt-1">
            <a-input v-model:value="inputUsers.name" placeholder="Tên người dùng"/>
          </div>
          <span class="text-red-500 font-medium italic text-sm"> {{ errors.name }}</span>
        </div>

        <div class="mt-2">
          <label class="block text-sm font-medium text-gray-700">
            Tên đăng nhập
          </label>
          <div class="mt-1">
            <a-input v-model:value="inputUsers.userName" placeholder="Tên đăng nhập"/>
          </div>
          <span class="text-red-500 font-medium italic text-sm"> {{ errors.userName }}</span>
        </div>


        <div class="mt-2">
          <label class="block text-sm font-medium text-gray-700">
            Email
          </label>
          <div class="mt-1">
            <a-input v-model:value="inputUsers.email" placeholder="Email"/>
          </div>
          <span class="text-red-500 font-medium italic text-sm"> {{ errors.email }}</span>
        </div>


        <div class="mt-2">
          <label class="block text-sm font-medium text-gray-700">
            Mật khẩu
          </label>
          <div class="mt-1">
            <a-input-password v-model:value="inputUsers.password" placeholder="mật khẩu"/>
          </div>
          <span class="text-red-500 font-medium italic text-sm"> {{ errors.password }}</span>
        </div>

        <div class="mt-2">
          <label class="block text-sm font-medium text-gray-700">
            Số điện thoại
          </label>
          <div class="mt-1">
            <a-input v-model:value="inputUsers.phone" placeholder="Số điện thoại"/>
          </div>
          <span class="text-red-500 font-medium italic text-sm"> {{ errors.phone }}</span>
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
                  Họ và tên
                </th>
                <th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                  Tên đăng nhập
                </th>
                <th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                  Email
                </th>
                <th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                  Số điện thoại
                </th>
                <th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                  Trạng thái
                </th>
                <th scope="col" class="text-sm font-medium flex justify-end text-gray-900 px-6 py-4 text-left">
                  Hành động
                </th>
              </tr>
              </thead>
              <tbody v-for="(itemUser,indexUser) in dataUser" :key="indexUser">
              <tr class="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100 ">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ (currentPage - 1) * 10 + (indexUser + 1) }}
                </td>

                <router-link :to="{name:'userDetail', query:{id: itemUser.id}}">
                  <a-tooltip placement="bottom">
                    <template #title>
                      <span>  Ấn vào để xem chi tiết người dùng </span>
                    </template>
                    <td class="text-sm cursor-pointer text-gray-900 font-light px-6  whitespace-nowrap">
                      {{ itemUser.displayName }}
                    </td>
                  </a-tooltip>
                </router-link>


                <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                  {{ itemUser.username }}
                </td>
                <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                  {{ itemUser.email }}
                </td>
                <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                  {{ itemUser.phoneNumber }}
                </td>
                <td v-if="itemUser?.status== 'ACTIVE' "
                    class="text-sm  font-medium text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                  <a-tag color="green"> Hoạt động</a-tag>
                </td>
                <td v-if="itemUser?.status== 'PENDING' "
                    class="text-sm font-medium text-black font-light px-6 py-4 whitespace-nowrap">
                  <a-tag color="yellow">Chờ phê duyệt</a-tag>
                </td>
                <td v-if="itemUser?.status== 'INACTIVE' "
                    class="text-sm font-medium  text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                  <a-tag color="green"> Bị khóa</a-tag>
                </td>

                <td v-if="!itemUser.status "
                    class="text-sm font-medium  text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                  <a-tag color="green"></a-tag>
                </td>
                <td class="text-sm flex justify-end text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                  <div class="flex justify-start items-center">

                           <span @click="showModalEdit(itemUser.id)"><i class="
                              fa-solid fa-pen-to-square
                              text-xl text-blue-500
                              mr-2
                              cursor-pointer
                            "></i></span>


                    <span @click="showModalConfirm(itemUser.id)" data-bs-toggle="modal"
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
      title="Xóa người dùng"
      :confirm-loading="confirmLoading"
      @ok="handleRemoveUser"
  >
    <p>{{ modalText }}</p>
  </a-modal>


  <a-modal v-model:visible="visibleEdit" width="1000px" title="Sửa người dùng" @ok="handleEditUser">
    <div>
      <label class="block text-sm font-medium text-gray-700">
        Tên người dùng
      </label>
      <div class="mt-1">
        <a-input v-model:value="inputUsers.name" placeholder="Tên người dùng"/>
      </div>
      <span class="text-red-500 font-medium italic text-sm"> {{ errors.name }}</span>
    </div>

    <div class="mt-2">
      <label class="block text-sm font-medium text-gray-700">
        Tên đăng nhập
      </label>
      <div class="mt-1">
        <a-input v-model:value="inputUsers.userName" placeholder="Tên đăng nhập"/>
      </div>
      <span class="text-red-500 font-medium italic text-sm"> {{ errors.userName }}</span>
    </div>


    <div class="mt-2">
      <label class="block text-sm font-medium text-gray-700">
        Email
      </label>
      <div class="mt-1">
        <a-input v-model:value="inputUsers.email" placeholder="Email"/>
      </div>
      <span class="text-red-500 font-medium italic text-sm"> {{ errors.email }}</span>
    </div>


    <div class="mt-2">
      <label class="block text-sm font-medium text-gray-700">
        Số điện thoại
      </label>
      <div class="mt-1">
        <a-input v-model:value="inputUsers.phone" placeholder="Số điện thoại"/>
      </div>
      <span class="text-red-500 font-medium italic text-sm"> {{ errors.phone }}</span>
    </div>


    <div class="mt-2">
      <label class="block text-sm font-medium text-gray-700">
        Trạng thái
      </label>
      <a-select
          v-model:value="inputUsers.status"
          label-in-value
          style="width: 100%"
          :options="options"
          @change="handleChange"
      ></a-select>
    </div>


  </a-modal>


</template>
