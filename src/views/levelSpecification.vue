<script setup>
import {userServices} from "@/services/userServices";
import {onMounted, ref, watch, computed, reactive, watchEffect} from "vue";
import Loading from "@/components/loading/Loading.vue";
import {useToast} from "vue-toastification";
import router from "@/router";
import {levelSpecificationServices} from "@/services/levelSpecificationServices";
import {levelServices} from "@/services/levelServices";
import {categoryServices} from "@/services/categoryServices";

const toast = useToast()
const visible = ref(false)
const textSearch = ref('')
const dataLevelSpecification = ref([])
const currentPage = ref(1)
const totalPages = ref(1)
const idRemoveLevelSpeci = ref('')

const visibleConfirm = ref(false)

const loading = ref(false)
const modalText = ref('Bạn có chắc chắn muốn xóa thông số level không?')
const confirmLoading = ref(false);
const visibleEdit = ref(false)
const idEditLevelSpeci = ref('')


const state = reactive({
  valueInput: [],
  sellingPriceUnit: []
});


const ChangeSellingPriceUnit = (value) => {
  inputLevelSpeci.value.sellingPriceUnit = value.value
}


const optionEnergyRecoverPriceUnit = ref([])
const optionRepairPriceUnit = ref([])

const handleChangeRepairPriceUnit = (value) => {
  inputLevelSpeci.value.repairPriceUnit = value.value
}
const handleChangeEnergyRecoverPriceUnit = (value) => {
  inputLevelSpeci.value.energyRecoverPriceUnit = value.value
}

const inputLevelSpeci = ref({
  durability: '',
  energy: '',
  durabilityConsumption: '',
  energyConsumption: '',
  sellingPrice: '',
  sellingPriceUnit: "",
  repairPrice: '',
  repairPriceUnit: "VND",
  energyRecoverPrice: '',
  energyRecoverPriceUnit: "VND",
  status: "ACTIVE",
  defaultLevelId: '',
  maxLevelId: '',
  productCategoryId: ''
})

const errors = ref({
  durability: '',
  energy: '',
  durabilityConsumption: '',
  energyConsumption: '',
  sellingPrice: '',
  sellingPriceUnit: "",

  repairPrice: '',
  repairPriceUnit: "",
  energyRecoverPrice: '',
  energyRecoverPriceUnit: "",
  status: "ACTIVE",
  defaultLevelId: '',
  maxLevelId: '',
  productCategoryId: ''
})


const resetState = () => {
  inputLevelSpeci.value = {
    durability: '98',
    energy: '9898',
    durabilityConsumption: '9898',
    energyConsumption: '898',
    sellingPrice: '9898',
    sellingPriceUnit: "VND",
    repairPrice: '645',
    repairPriceUnit: "VND",
    energyRecoverPrice: '645',
    energyRecoverPriceUnit: "VND",
    status: "ACTIVE",
    defaultLevelId: '6',
    maxLevelId: '7',
    productCategoryId: '5'
  }
  levelInputs.value = []
}

const resetStateError = () => {
  errors.value = {
    durability: '',
    energy: '',
    durabilityConsumption: '',
    energyConsumption: '',
    sellingPrice: '',
    sellingPriceUnit: "",
    repairPrice: '',
    repairPriceUnit: "",
    energyRecoverPrice: '',
    energyRecoverPriceUnit: "",
    status: "ACTIVE",
    defaultLevelId: '',
    maxLevelId: '',
    productCategoryId: ''
  }
}

const showModal = async () => {
  await getAllLevel()
  await getAllCate()
  await getUnitMoney()
  resetState()

  visible.value = true
}

const regexNumber = /^[0-9]*$/

const validate = () => {
  errors.value.durability = regexNumber.test(inputLevelSpeci.value.durability) && inputLevelSpeci.value.durability !== '' ? '' : 'Vui lòng nhập số'
  errors.value.energy = regexNumber.test(inputLevelSpeci.value.energy) && inputLevelSpeci.value.energy !== '' ? '' : 'Vui lòng nhập số'
  errors.value.durabilityConsumption = regexNumber.test(inputLevelSpeci.value.durabilityConsumption) && inputLevelSpeci.value.durabilityConsumption !== '' ? '' : 'Vui lòng nhập số'
  errors.value.energyConsumption = regexNumber.test(inputLevelSpeci.value.energyConsumption) && inputLevelSpeci.value.energyConsumption !== '' ? '' : 'Vui lòng nhập số'
  errors.value.sellingPrice = regexNumber.test(inputLevelSpeci.value.sellingPrice) && inputLevelSpeci.value.sellingPrice !== '' ? '' : 'Vui lòng nhập số'
  errors.value.sellingPriceUnit = inputLevelSpeci.value.sellingPriceUnit !== '' ? '' : 'Trường này không được để trống'
  // errors.value.upgradePrice = regexNumber.test(inputLevelSpeci.value.upgradePrice) && inputLevelSpeci.value.upgradePrice !== '' ? '' : 'Vui lòng nhập số'
  // errors.value.upgradePriceUnit = inputLevelSpeci.value.upgradePriceUnit !== '' ? '' : 'Trường này không được để trống'
  errors.value.repairPrice = regexNumber.test(inputLevelSpeci.value.repairPrice) && inputLevelSpeci.value.repairPrice !== '' ? '' : 'Vui lòng nhập số'
  errors.value.repairPriceUnit = inputLevelSpeci.value.repairPriceUnit !== '' ? '' : 'Trường này không được để trống'
  errors.value.energyRecoverPrice = regexNumber.test(inputLevelSpeci.value.energyRecoverPrice) && inputLevelSpeci.value.energyRecoverPrice !== '' ? '' : 'Vui lòng nhập số'
  errors.value.energyRecoverPriceUnit = inputLevelSpeci.value.energyRecoverPriceUnit !== '' ? '' : 'Trường này không được để trống'
  errors.value.defaultLevelId = inputLevelSpeci.value.defaultLevelId !== '' ? '' : 'Trường này không được để trống'
  errors.value.maxLevelId = inputLevelSpeci.value.maxLevelId !== '' ? '' : 'Trường này không được để trống'
  errors.value.productCategoryId = inputLevelSpeci.value.productCategoryId !== '' ? '' : 'Trường này không được để trống'
  return !errors.value.durability && !errors.value.energy && !errors.value.durabilityConsumption && !errors.value.energyConsumption && !errors.value.sellingPrice && !errors.value.sellingPriceUnit && !errors.value.repairPrice && !errors.value.repairPriceUnit && !errors.value.energyRecoverPrice && !errors.value.energyRecoverPriceUnit && !errors.value.defaultLevelId && !errors.value.maxLevelId && !errors.value.productCategoryId
}


const handlRemoveLevelSpeci = async () => {
  try {
    await levelSpecificationServices.removeLevelSpecification(idRemoveLevelSpeci.value)
    await getLevelSpecification()
    toast.success('Xóa thông số level thành công ')
  } catch (e) {
    toast.error('Xóa thông số level thất bại')
  }
  visibleConfirm.value = false
}


const handleChange = value => {
  console.log(value); // { key: "lucy", label: "Lucy (101)" }
};


const showModalConfirm = (id) => {
  idRemoveLevelSpeci.value = id
  visibleConfirm.value = true
}


const SellingPriceUnitOptions = ref([])
const optionSellingPriceUnit = ref([])
const getUnitMoney = async () => {
  try {
    const res = await levelSpecificationServices.getUnitMoney()

    const options = res.data.map(item => ({value: item, label: item}));
    SellingPriceUnitOptions.value = options
    optionSellingPriceUnit.value = options
    optionRepairPriceUnit.value = options
    optionEnergyRecoverPriceUnit.value = options
  } catch (e) {
    console.log(e)
  }
}

const idCategory = ref('')

const showModalEdit = async (id) => {
  await getAllLevel()
  await getAllCate()
  await getUnitMoney()
  await resetStateError()
  visibleEdit.value = true
  idEditLevelSpeci.value = id
  try {
    const res = await levelSpecificationServices.findByIdLevelSpecification(id)
    inputLevelSpeci.value = {
      durability: res.data.durability,
      energy: res.data.energy,
      durabilityConsumption: res.data.durabilityConsumption,
      energyConsumption: res.data.energyConsumption,
      sellingPrice: res.data.sellingPrice,
      sellingPriceUnit: res.data.sellingPriceUnit,
      repairPrice: res.data.repairPrice,
      repairPriceUnit: res.data.repairPriceUnit,
      energyRecoverPrice: res.data.energyRecoverPrice,
      energyRecoverPriceUnit: res.data.energyRecoverPriceUnit,
      maxLevelId: res.data.maxLevel.value,
      defaultLevelId: res.data.defaultLevel.value,
      productCategoryId: res.data.productCategory.name,
    }
    state.valueInput = res.data?.levelUpgrades?.map(item => item?.upgradePrice),
        state.sellingPriceUnit = res.data?.levelUpgrades?.map(item => item?.upgradePriceUnit),
        idCategory.value = res.data.productCategory.id
  } catch (e) {
    console.log(e)
  }
}


const editLevelSpeci = async () => {
  if (validate()) {
    try {
      const levelUpgradePriceUnit = SellingPriceUnitOptions.value.map(item => item.value)

      await levelSpecificationServices.editLevelSpecification({
        id: idEditLevelSpeci.value,
        daysToUseMax: 30,
        durability: inputLevelSpeci.value.durability,
        energy: inputLevelSpeci.value.energy,
        durabilityConsumption: inputLevelSpeci.value.durabilityConsumption,
        energyConsumption: inputLevelSpeci.value.energyConsumption,
        sellingPrice: inputLevelSpeci.value.sellingPrice,
        sellingPriceUnit: inputLevelSpeci.value.sellingPriceUnit,
        repairPrice: inputLevelSpeci.value.repairPrice,
        repairPriceUnit: inputLevelSpeci.value.repairPriceUnit,
        energyRecoverPrice: inputLevelSpeci.value.energyRecoverPrice,
        energyRecoverPriceUnit: inputLevelSpeci.value.energyRecoverPriceUnit,
        stepsPerTime: 1000,
        distancePerTime: 5,
        defaultLevelId: inputLevelSpeci.value.defaultLevelId,
        maxLevelId: inputLevelSpeci.value.maxLevelId,
        productCategoryId: idCategory.value,
        timeToUseMaxInDay: 8,
        levelUpgradeList: state.valueInput.map((price, index) => {
          return {
            upgradePriceUnit: levelUpgradePriceUnit[index],
            upgradePrice: parseInt(price)
          }
        })
      })
      toast.success('Cập  nhật thông số level thành công')
      await getLevelSpecification()
      visibleEdit.value = false
    } catch (e) {
      console.log(e.response.data)
    }
  }
}


const handleAddLevelSpeci = async () => {
  if (validate()) {
    loading.value = true
    try {
      const levelUpgradePriceUnit = SellingPriceUnitOptions.value.map(item => item.value)
      await levelSpecificationServices.createLevelSpecification({
        daysToUseMax: 30,
        durability: inputLevelSpeci.value.durability,
        energy: inputLevelSpeci.value.energy,
        durabilityConsumption: inputLevelSpeci.value.durabilityConsumption,
        energyConsumption: inputLevelSpeci.value.energyConsumption,
        sellingPrice: inputLevelSpeci.value.sellingPrice,
        sellingPriceUnit: inputLevelSpeci.value.sellingPriceUnit,
        repairPrice: inputLevelSpeci.value.repairPrice,
        repairPriceUnit: inputLevelSpeci.value.repairPriceUnit,
        energyRecoverPrice: inputLevelSpeci.value.energyRecoverPrice,
        energyRecoverPriceUnit: inputLevelSpeci.value.energyRecoverPriceUnit,
        stepsPerTime: 1000,
        distancePerTime: 5,
        defaultLevelId: inputLevelSpeci.value.defaultLevelId,
        maxLevelId: inputLevelSpeci.value.maxLevelId,
        productCategoryId: inputLevelSpeci.value.productCategoryId,
        timeToUseMaxInDay: 8,
        levelUpgradeList: state.valueInput.map((price, index) => {
          return {
            upgradePriceUnit: levelUpgradePriceUnit[index],
            upgradePrice: parseInt(price)
          }
        })
      })
      toast.success('Thêm thông số level thành công')
      await getLevelSpecification()
      visible.value = false
      resetState()
    } catch (e) {
      toast.error(e.response.data)
      levelInputs.value = []
    }
    loading.value = false
  }

}


const searchUser = async () => {
  try {
    const res = await levelSpecificationServices.searchLevelSpecification({
      page: currentPage.value - 1,
      size: 10,
      sort: 'id,desc',
      keyword: textSearch.value.trim() ? textSearch.value.trim() : ''
    })
    dataLevelSpecification.value = res.data.content
    totalPages.value = res.data.totalPages * 10
    currentPage.value = res.data.number + 1

  } catch (e) {
    console.log(e)
  }
}

watch(textSearch, async () => {
  await searchUser()
})

const filterByName = async (e) => {
  try {
    const res = await levelSpecificationServices.listAllLevelSpecification({
      page: currentPage.value - 1,
      size: 10,
      sort: e.key == '1' ? 'id,asc' : 'id,desc'
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


const optionMaxLevelId = ref({
  value: []
})
const optionDefaultLevelId = ref({
  value: []
})


const handleChangeDefaultLevelId = (value) => {
  inputLevelSpeci.value.defaultLevelId = value.value
}
const handleChangeMaxLevelId = (value) => {
  inputLevelSpeci.value.maxLevelId = value.value
}

const getAllLevel = async () => {
  try {
    const res = await levelServices.getAllLevel()
    const options = res.data.content.map(item => {
      return {
        label: item.name,
        value: item.id
      }
    })
    console.log(options)
    optionDefaultLevelId.value = options
    optionMaxLevelId.value = options
  } catch (e) {
    console.log(e)
  }
}

const optionsCate = ref({
  value: []
})


// danh mục

const handleChangeProductCategory = (value) => {
  inputLevelSpeci.value.productCategoryId = value.value
}

const getAllCate = async () => {
  try {
    const res = await categoryServices.getAllCategory()
    const options = res.data.content.map(item => {
      return {
        label: item.name,
        value: item.id
      }
    })
    optionsCate.value = options
  } catch (e) {

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

const handleChangeSellingPriceUnit = (value, index) => {
  state.sellingPriceUnit[index] = value.value
}

const levelInputs = computed(() => {
  const diff = Math.abs(inputLevelSpeci.value.maxLevelId - inputLevelSpeci.value.defaultLevelId);
  const inputs = [];
  for (let i = 0; i < diff; i++) {
    inputs.push(ref(null));
  }
  return inputs;
});



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
            Danh mục
          </label>
          <div class="mt-1">
            <a-select
                v-model:value="inputLevelSpeci.productCategoryId"
                label-in-value
                style="width:100%"
                :options="optionsCate"
                @change="handleChangeProductCategory"
            >
            </a-select>

          </div>
          <span class="text-red-500 font-medium italic text-sm"> {{ errors.productCategoryId }}</span>
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
                @change="ChangeSellingPriceUnit"
            >
            </a-select>


          </div>
          <span class="text-red-500 font-medium italic text-sm"> {{ errors.sellingPriceUnit }}</span>
        </div>


        <div>
          <label class="block text-sm font-medium text-gray-700">
            Giá sửa chữa (sửa xong thì giày có độ bền như ban đầu)
          </label>
          <div class="mt-1">
            <a-input v-model:value="inputLevelSpeci.repairPrice"
                     placeholder="Giá sửa chữa (sửa xong thì giày có độ bền như ban đầu)"/>
          </div>
          <span class="text-red-500 font-medium italic text-sm"> {{ errors.repairPrice }}</span>
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
            Level mặc định của giày lúc ban đầu
          </label>
          <div class="mt-1">
            <a-select
                v-model:value="inputLevelSpeci.defaultLevelId"
                label-in-value
                style="width:100%"
                :options="optionDefaultLevelId"
                @change="handleChangeDefaultLevelId"
            >
            </a-select>

          </div>
          <span class="text-red-500 font-medium italic text-sm"> {{ errors.defaultLevelId }}</span>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            Level tối đa của giày
          </label>
          <div class="mt-1">

            <a-select
                v-model:value="inputLevelSpeci.maxLevelId"
                label-in-value
                style="width:100%"
                :options="optionMaxLevelId"
                @change="handleChangeMaxLevelId"
            >
            </a-select>
          </div>
          <span class="text-red-500 font-medium italic text-sm"> {{ errors.maxLevelId }}</span>
        </div>


        <div v-for="(input, index) in levelInputs" :key="index" class="mt-2">
          <label class="block text-sm font-medium text-gray-700" :for="'input'+index">{{
              'Giá trị level ' + (index + 1)
            }}</label>
          <a-input :id="'input'+index" v-model:value="state.valueInput[index]"/>
          <label class="block text-sm font-medium text-gray-700" :for="'input'+index">
            {{ 'Đơn vị level ' + (index + 1) }}
          </label>
          <div class="mt-1">
            <a-select
                v-model:value="state.sellingPriceUnit[index]"
                label-in-value
                style="width:100%"
                :options="SellingPriceUnitOptions"
                @change="handleChangeSellingPriceUnit(index)"
            >
            </a-select>
          </div>
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
                <router-link :to="{name:'levelSpecificationDetail', query:{id: itemLevelSpeci.id}}">
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
      title="Xóa thông số level"
      :confirm-loading="confirmLoading"
      @ok="handlRemoveLevelSpeci"
  >
    <p>{{ modalText }}</p>
  </a-modal>


  <a-modal v-model:visible="visibleEdit" width="1000px" title="Sửa thông số level" @ok="editLevelSpeci">


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
        Danh mục
      </label>
      <div class="mt-1">
        <a-select
            v-model:value="inputLevelSpeci.productCategoryId"
            label-in-value
            style="width:100%"
            :options="optionsCate"
            @change="handleChangeProductCategory"
        >
        </a-select>

      </div>
      <span class="text-red-500 font-medium italic text-sm"> {{ errors.productCategoryId }}</span>
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
        <a-input v-model:value="inputLevelSpeci.energyRecoverPrice" placeholder="Giá phục hồi năng lượng"/>
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
        Level mặc định của giày lúc ban đầu
      </label>
      <div class="mt-1">
        <a-select
            v-model:value="inputLevelSpeci.defaultLevelId"
            label-in-value
            style="width:100%"
            :options="optionDefaultLevelId"
            @change="handleChangeDefaultLevelId"
        >
        </a-select>

      </div>
      <span class="text-red-500 font-medium italic text-sm"> {{ errors.defaultLevelId }}</span>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700">
        Level tối đa của giày
      </label>
      <div class="mt-1">

        <a-select
            v-model:value="inputLevelSpeci.maxLevelId"
            label-in-value
            style="width:100%"
            :options="optionMaxLevelId"
            @change="handleChangeMaxLevelId"
        >
        </a-select>
      </div>
      <span class="text-red-500 font-medium italic text-sm"> {{ errors.maxLevelId }}</span>
    </div>

    <div v-for="(input, index) in levelInputs" :key="index" class="mt-2">
      <label class="block text-sm font-medium text-gray-700" :for="'input'+index">{{
          'Giá trị level ' + (index + 1)
        }}</label>
      <a-input :id="'input'+index" v-model:value="state.valueInput[index]"/>
      <label class="block text-sm font-medium text-gray-700" :for="'input'+index">
        {{ 'Đơn vị level ' + (index + 1) }}
      </label>
      <div class="mt-1">
        <a-select
            v-model:value="state.sellingPriceUnit[index]"
            label-in-value
            style="width:100%"
            :options="optionSellingPriceUnit"
            @change="handleChangeSellingPriceUnit(index)"
        >
        </a-select>
      </div>
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