<script setup>
import {userServices} from "@/services/userServices";
import {onMounted, ref, watch} from "vue";
import Loading from "@/components/loading/Loading.vue";
import {useToast} from "vue-toastification";
import router from "@/router";
import {levelSpecificationServices} from "@/services/levelSpecificationServices";

const toast = useToast()
const visible = ref(false)
const textSearch = ref('')
const dataLevelSpecification = ref([])
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


const handleChangeSellingPriceUnit = (value) => {
  inputLevelSpeci.value.sellingPriceUnit = value
}
const optionSellingPriceUnit = ref([])

const handleChangeUpgradePriceUnit = (value) => {
  inputLevelSpeci.value.upgradePriceUnit = value
}
const optionUpgradePriceUnit = ref([])

const optionEnergyRecoverPriceUnit = ref([])
const optionRepairPriceUnit = ref([])

const handleChangeRepairPriceUnit = (value) => {
  inputLevelSpeci.value.repairPriceUnit = value
}
const handleChangeEnergyRecoverPriceUnit = (value) => {
  inputLevelSpeci.value.energyRecoverPriceUnit = value
}

const inputLevelSpeci = ref({
  daysToUseMax: 0,
  timeToUseMax: 0,
  durability: 0,
  energy: 0,
  durabilityConsumption: 0,
  energyConsumption: 0,
  sellingPrice: 0,
  sellingPriceUnit: "VND",
  upgradePrice: 0,
  upgradePriceUnit: "VND",
  repairPrice: 0,
  repairPriceUnit: "VND",
  energyRecoverPrice: 0,
  energyRecoverPriceUnit: "VND",
  stepsPerTime: 0,
  distancePerTime: 0,
  status: "string",
  defaultLevelId: 0,
  maxLevelId: 0,
  productCategoryId: 0
})

const errors = ref({
  daysToUseMax: '',
  timeToUseMax: '',
  durability: '',
  energy: '',
  durabilityConsumption: '',
  energyConsumption: '',
  sellingPrice: '',
  sellingPriceUnit: "",
  upgradePrice: '',
  upgradePriceUnit: "",
  repairPrice: '',
  repairPriceUnit: "",
  energyRecoverPrice: '',
  energyRecoverPriceUnit: "",
  stepsPerTime: '',
  distancePerTime: '',
  status: "",
  defaultLevelId: '',
  maxLevelId: '',
  productCategoryId: ''
})

const showModal = async () => {
  await getUnitMoney()
  inputLevelSpeci.value = {
    name: '',
    email: '',
    password: '',
    userName: '',
    phone: '',
  }

  visible.value = true
}
const regexNumber = /^[0-9]*$/

const isNumber = (value) => {
  return regexNumber.test(value)
}

const validate = () => {
  errors.daysToUseMax = isNumber(inputLevelSpeci.value.daysToUseMax) ? '' : 'Vui lòng nhập số'
  errors.timeToUseMax = isNumber(inputLevelSpeci.value.timeToUseMax) ? '' : 'Vui lòng nhập số'
  errors.durability = isNumber(inputLevelSpeci.value.durability) ? '' : 'Vui lòng nhập số'
  errors.energy = isNumber(inputLevelSpeci.value.energy) ? '' : 'Vui lòng nhập số'
  errors.durabilityConsumption = isNumber(inputLevelSpeci.value.durabilityConsumption) ? '' : 'Vui lòng nhập số'
  errors.energyConsumption = isNumber(inputLevelSpeci.value.energyConsumption) ? '' : 'Vui lòng nhập số'
  errors.sellingPrice = isNumber(inputLevelSpeci.value.sellingPrice) ? '' : 'Vui lòng nhập số'
  errors.sellingPriceUnit = inputLevelSpeci.value.sellingPriceUnit ? '' : 'Trường này không được để trống'
  errors.upgradePrice = isNumber(inputLevelSpeci.value.upgradePrice) ? '' : 'Vui lòng nhập số'
  errors.upgradePriceUnit = inputLevelSpeci.value.upgradePriceUnit ? '' : 'Trường này không được để trống'
  errors.repairPrice = isNumber(inputLevelSpeci.value.repairPrice) ? '' : 'Vui lòng nhập số'
  errors.repairPriceUnit = inputLevelSpeci.value.repairPriceUnit ? '' : 'Trường này không được để trống'
  errors.energyRecoverPrice = isNumber(inputLevelSpeci.value.energyRecoverPrice) ? '' : 'Vui lòng nhập số'
  errors.energyRecoverPriceUnit = inputLevelSpeci.value.energyRecoverPriceUnit ? '' : 'Trường này không được để trống'
  errors.stepsPerTime = isNumber(inputLevelSpeci.value.stepsPerTime) ? '' : 'Vui lòng nhập số'
  errors.distancePerTime = isNumber(inputLevelSpeci.value.distancePerTime) ? '' : 'Vui lòng nhập số'
  errors.defaultLevelId = isNumber(inputLevelSpeci.value.defaultLevelId) ? '' : 'Vui lòng nhập số'
  errors.maxLevelId = isNumber(inputLevelSpeci.value.maxLevelId) ? '' : 'Vui lòng nhập số'
  errors.productCategoryId = isNumber(inputLevelSpeci.value.productCategoryId) ? '' : 'Vui lòng nhập số'
  return !errors.daysToUseMax && !errors.timeToUseMax && !errors.durability && !errors.energy && !errors.durabilityConsumption && !errors.energyConsumption && !errors.sellingPrice && !errors.sellingPriceUnit && !errors.upgradePrice && !errors.upgradePriceUnit && !errors.repairPrice && !errors.repairPriceUnit && !errors.energyRecoverPrice && !errors.energyRecoverPriceUnit && !errors.stepsPerTime && !errors.distancePerTime && !errors.defaultLevelId && !errors.maxLevelId && !errors.productCategoryId

}


const handleRemoveUser = async () => {
  try {
    await userServices.removeUser(idRemoveUser.value)
    await getLevelSpecification()
    toast.success('Xóa người dùng thành công')
  } catch (e) {
    toast.error('Xóa người dùng thất bại')
  }
  visibleConfirm.value = false
}


const handleChange = value => {
  console.log(value); // { key: "lucy", label: "Lucy (101)" }
};


const showModalConfirm = (id) => {
  idRemoveUser.value = id
  visibleConfirm.value = true
}


const getUnitMoney = async () => {
  try {
    const res = await levelSpecificationServices.getUnitMoney()

    const options = res.data.map(item => ({value: item, label: item}));
    optionSellingPriceUnit.value = options
    optionUpgradePriceUnit.value = options
    optionRepairPriceUnit.value = options
    optionEnergyRecoverPriceUnit.value = options
  } catch (e) {
    console.log(e)
  }
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
    inputLevelSpeci.value = {
      name: res.data.displayName,
      email: res.data.email,
      password: res.data.password,
      userName: res.data.username,
      phone: res.data.phoneNumber,
      status: res.data.status
    }
  } catch (e) {
    console.log(e)
  }

}


const handleEditUser = async () => {
  if (validate()) {
    try {
      await userServices.editUser({
        id: idEditUser.value,
        displayName: inputLevelSpeci.value.name,
        email: inputLevelSpeci.value.email,
        password: inputLevelSpeci.value.password,
        username: inputLevelSpeci.value.userName,
        phoneNumber: inputLevelSpeci.value.phone,
        status: inputLevelSpeci.value.status
      })
      toast.success('Cập nhật người dùng thành công')
    } catch (e) {
      toast.error('Cập nhật người dùng thất bại')
    }
  }
}


const handleAddLevelSpeci = async () => {

  console.log(validate())
  if (validate()) {
    loading.value = true
    try {
      await userServices.addUser({
        displayName: inputLevelSpeci.value.name,
        email: inputLevelSpeci.value.email,
        password: inputLevelSpeci.value.password,
        username: inputLevelSpeci.value.userName,
        phoneNumber: inputLevelSpeci.value.phone
      })
      toast.success('Thêm người dùng thành công')
      await getLevelSpecification()
      visible.value = false
      inputLevelSpeci.value = {
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
    dataLevelSpecification.value = res.data.content
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
    const res = await userServices.getLevelSpecifications({
      page: currentPage.value - 1,
      size: 10,
      sort: e.key == '1' ? 'username,asc' : 'username,desc'
    })
    dataLevelSpecification.value = res.data.content
    totalPages.value = res.data.totalPages * 10
    currentPage.value = res.data.number + 1
  } catch (e) {
    console.log(e)
  }
}


const getLevelSpecification = async () => {
  try {
    const res = await levelSpecificationServices.listAllLevelSpecification({
      page: currentPage.value - 1,
      size: 10,
      sort: 'id,desc',
    })
    dataLevelSpecification.value = res.data.content
    totalPages.value = res.data.totalPages * 10
    currentPage.value = res.data.number + 1
  } catch (e) {
    console.log(e)
  }
}

const pageChanged = async () => {
  await getLevelSpecification()
}

onMounted(async () => {
  loading.value = true
  await getLevelSpecification()
  loading.value = false
})

</script>

<template>
  <a-page-header
      style="border: 1px solid rgb(235, 237, 240); padding: 10px"
      title="Quản lý thông số level"
  >
    <template #tags>
      <a-button type="primary" @click="showModal">Thêm thông số level</a-button>
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
      <a-modal v-model:visible="visible" width="1000px" title="Thêm thông số level" @ok="handleAddLevelSpeci">

        <div>
          <label class="block text-sm font-medium text-gray-700">
            Số ngày tối đa người mua được phép sử dụng
          </label>
          <div class="mt-1">
            <a-input v-model:value="inputLevelSpeci.daysToUseMax"
                     placeholder="  Số ngày tối đa người mua được phép sử dụng"/>
          </div>
          <span class="text-red-500 font-medium italic text-sm"> {{ errors.daysToUseMax }}</span>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            Độ bền ban đầu của giày
          </label>
          <div class="mt-1">
            <a-input v-model:value="inputLevelSpeci.durability" placeholder="Độ bền ban đầu của giày"/>
          </div>
          <span class="text-red-500 font-medium italic text-sm"> {{ errors.durability }}</span>
        </div>


        <div>
          <label class="block text-sm font-medium text-gray-700">
            Năng lượng ban đầu của giày
          </label>
          <div class="mt-1">
            <a-input v-model:value="inputLevelSpeci.energy" placeholder="Năng lượng ban đầu của giày"/>
          </div>
          <span class="text-red-500 font-medium italic text-sm"> {{ errors.energy }}</span>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            Độ bền tiêu hao trên mỗi lần sử dụng
          </label>
          <div class="mt-1">
            <a-input v-model:value="inputLevelSpeci.durabilityConsumption"
                     placeholder="Độ bền tiêu hao trên mỗi lần sử dụng"/>
          </div>
          <span class="text-red-500 font-medium italic text-sm"> {{ errors.durabilityConsumption }}</span>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">
            Năng lượng tiêu hao trên mỗi lần sử dụng
          </label>
          <div class="mt-1">
            <a-input v-model:value="inputLevelSpeci.energyConsumption"
                     placeholder="Năng lượng tiêu hao trên mỗi lần sử dụng"/>
          </div>
          <span class="text-red-500 font-medium italic text-sm"> {{ errors.energyConsumption }}</span>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            Giá bán giày
          </label>
          <div class="mt-1">
            <a-input v-model:value="inputLevelSpeci.sellingPrice" placeholder="Giá bán giày"/>
          </div>
          <span class="text-red-500 font-medium italic text-sm"> {{ errors.sellingPrice }}</span>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            Số ngày tối đa người mua được phép sử dụng
          </label>
          <div class="mt-1">
            <a-input v-model:value="inputLevelSpeci.daysToUseMax"
                     placeholder="Số ngày tối đa người mua được phép sử dụng"/>
          </div>
          <span class="text-red-500 font-medium italic text-sm"> {{ errors.name }}</span>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            Đơn vị giá bán giày
          </label>
          <div class="mt-1">

            <a-select
                v-model:value="inputLevelSpeci.sellingPriceUnit"
                label-in-value
                style="width:100%"
                :options="optionSellingPriceUnit"
                @change="handleChangeSellingPriceUnit"
            >
            </a-select>


          </div>
          <span class="text-red-500 font-medium italic text-sm"> {{ errors.sellingPriceUnit }}</span>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            Giá nâng cấp mỗi level
          </label>
          <div class="mt-1">
            <a-input v-model:value="inputLevelSpeci.upgradePrice" placeholder="Giá nâng cấp mỗi level"/>
          </div>
          <span class="text-red-500 font-medium italic text-sm"> {{ errors.upgradePrice }}</span>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            Đơn vị giá nâng cấp mỗi level
          </label>
          <div class="mt-1">

            <a-select
                v-model:value="inputLevelSpeci.upgradePriceUnit"
                label-in-value
                style="width:100%"
                :options="optionUpgradePriceUnit"
                @change="handleChangeUpgradePriceUnit"
            >
            </a-select>
          </div>
          <span class="text-red-500 font-medium italic text-sm"> {{ errors.upgradePriceUnit }}</span>
        </div>


        <div>
          <label class="block text-sm font-medium text-gray-700">
            Giá sửa chữa (sửa xong thì giày có độ bền như ban đầu)
          </label>
          <div class="mt-1">
            <a-input v-model:value="inputLevelSpeci.repairPrice"
                     placeholder="    Giá sửa chữa (sửa xong thì giày có độ bền như ban đầu)"/>
          </div>
          <span class="text-red-500 font-medium italic text-sm"> {{ errors.repairPrice }}</span>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            Số ngày tối đa người mua được phép sử dụng
          </label>
          <div class="mt-1">
            <a-input v-model:value="inputLevelSpeci.daysToUseMax"
                     placeholder="    Số ngày tối đa người mua được phép sử dụng"/>
          </div>
          <span class="text-red-500 font-medium italic text-sm"> {{ errors.name }}</span>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            Đơn vị giá sửa chữa
          </label>
          <div class="mt-1">

            <a-select
                v-model:value="inputLevelSpeci.repairPriceUnit"
                label-in-value
                style="width:100%"
                :options="optionRepairPriceUnit"
                @change="handleChangeRepairPriceUnit"
            >
            </a-select>
          </div>
          <span class="text-red-500 font-medium italic text-sm"> {{ errors.repairPriceUnit }}</span>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            Giá phục hồi năng lượng
          </label>
          <div class="mt-1">
            <a-input v-model:value="inputLevelSpeci.energyRecoverPrice" placeholder="  Giá phục hồi năng lượng"/>
          </div>
          <span class="text-red-500 font-medium italic text-sm"> {{ errors.energyRecoverPrice }}</span>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            Đơn vị giá phục hồi năng lượng
          </label>
          <div class="mt-1">


            <a-select
                v-model:value="inputLevelSpeci.energyRecoverPriceUnit"
                label-in-value
                style="width:100%"
                :options="optionEnergyRecoverPriceUnit"
                @change="handleChangeEnergyRecoverPriceUnit"
            >
            </a-select>

          </div>
          <span class="text-red-500 font-medium italic text-sm"> {{ errors.energyRecoverPriceUnit }}</span>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            Số bước chân tối đa mỗi lần sử dụng giày
          </label>
          <div class="mt-1">
            <a-input v-model:value="inputLevelSpeci.stepsPerTime" placeholder=" Số bước chân tối đa.. "/>
          </div>
          <span class="text-red-500 font-medium italic text-sm"> {{ errors.stepsPerTime }}</span>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            Số khoảng cách tối đa mỗi lần sử dụng giày (km)
          </label>
          <div class="mt-1">
            <a-input v-model:value="inputLevelSpeci.distancePerTime" placeholder="Số khoảng cách tối đa mỗi.."/>
          </div>
          <span class="text-red-500 font-medium italic text-sm"> {{ errors.distancePerTime }}</span>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            Level mặc định của giày lúc ban đầu
          </label>
          <div class="mt-1">
            <a-input v-model:value="inputLevelSpeci.defaultLevelId" placeholder="Level mặc đinh"/>
          </div>
          <span class="text-red-500 font-medium italic text-sm"> {{ errors.defaultLevelId }}</span>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            Level tối đa của giày
          </label>
          <div class="mt-1">
            <a-input v-model:value="inputLevelSpeci.maxLevelId" placeholder="Level tối đa"/>
          </div>
          <span class="text-red-500 font-medium italic text-sm"> {{ errors.maxLevelId }}</span>
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
                  Giá bán giày
                </th>
                <th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                  Đơn vị giá bán giày
                </th>
                <th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                  Giá nâng cấp mỗi level
                </th>
                <th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                  Level măc định
                </th>
                <th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                  Level tối đa
                </th>
                <th scope="col" class="text-sm font-medium flex justify-end text-gray-900 px-6 py-4 text-left">
                  Hành động
                </th>
              </tr>
              </thead>
              <tbody v-for="(itemLevelSpeci,indexLevelSpeci) in dataLevelSpecification" :key="indexLevelSpeci">
              <tr class="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100 ">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ (currentPage - 1) * 10 + (indexLevelSpeci + 1) }}
                </td>
                <router-link :to="{path:'/level-specification-detail', query:{id: itemLevelSpeci.id}}">
                  <a-tooltip placement="bottom">
                    <template #title>
                      <span>  Ấn vào để xem chi tiết </span>
                    </template>
                    <td class="text-sm cursor-pointer text-gray-900 font-light px-6  whitespace-nowrap">
                      {{ itemLevelSpeci.sellingPrice }}
                    </td>
                  </a-tooltip>
                </router-link>
                <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                  {{ itemLevelSpeci.sellingPriceUnit }}
                </td>
                <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                  {{ itemLevelSpeci.upgradePrice }}
                </td>
                <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                  {{ itemLevelSpeci?.defaultLevel?.value }}
                </td>

                <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                  {{ itemLevelSpeci?.maxLevel?.value }}
                </td>


                <td class="text-sm flex justify-end text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                  <div class="flex justify-start items-center">

                           <span @click="showModalEdit(itemLevelSpeci.id)"><i class="
                              fa-solid fa-pen-to-square
                              text-xl text-blue-500
                              mr-2
                              cursor-pointer
                            "></i></span>


                    <span @click="showModalConfirm(itemLevelSpeci.id)" data-bs-toggle="modal"
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
        <a-input v-model:value="inputLevelSpeci.name" placeholder="Tên người dùng"/>
      </div>
      <span class="text-red-500 font-medium italic text-sm"> {{ errors.name }}</span>
    </div>

    <div class="mt-2">
      <label class="block text-sm font-medium text-gray-700">
        Tên đăng nhập
      </label>
      <div class="mt-1">
        <a-input v-model:value="inputLevelSpeci.userName" placeholder="Tên đăng nhập"/>
      </div>
      <span class="text-red-500 font-medium italic text-sm"> {{ errors.userName }}</span>
    </div>


    <div class="mt-2">
      <label class="block text-sm font-medium text-gray-700">
        Email
      </label>
      <div class="mt-1">
        <a-input v-model:value="inputLevelSpeci.email" placeholder="Email"/>
      </div>
      <span class="text-red-500 font-medium italic text-sm"> {{ errors.email }}</span>
    </div>


    <div class="mt-2">
      <label class="block text-sm font-medium text-gray-700">
        Số điện thoại
      </label>
      <div class="mt-1">
        <a-input v-model:value="inputLevelSpeci.phone" placeholder="Số điện thoại"/>
      </div>
      <span class="text-red-500 font-medium italic text-sm"> {{ errors.phone }}</span>
    </div>


    <div class="mt-2">
      <label class="block text-sm font-medium text-gray-700">
        Trạng thái
      </label>
      <a-select
          v-model:value="inputLevelSpeci.status"
          label-in-value
          style="width: 100%"
          :options="options"
          @change="handleChange"
      ></a-select>
    </div>


  </a-modal>


</template>

<style scoped>
#components-a-tooltip-demo-placement .ant-btn {
  width: 70px;
  text-align: center;
  padding: 0;
  margin-right: 8px;
  margin-bottom: 8px;
}

label {
  margin-top: 5px;
}
</style>
