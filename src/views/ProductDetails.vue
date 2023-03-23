<script setup>
import {userServices} from "@/services/userServices";
import {onMounted, ref} from "vue";
import {useToast} from "vue-toastification";
import {productServices} from "@/services/productServices";
import {useRoute} from "vue-router";

const route = useRoute();
const toast = useToast();
const dataProduct = ref({});

const getProductById = async () => {
  try {
    const res = await productServices.findByIdProduct(route.query.id);
    dataProduct.value = res.data;
  } catch (e) {
    console.log(e)
  }
}

const backListProduct = () => {
  window.history.back()
}

onMounted(() => {
  getProductById()
})

</script>


<template>
  <div class=" px-3  py-3">
    <div class="bg-white shadow-lg rounded-lg overflow-hidden">
      <div class="px-5 py-2">
        <div class="flex  gap-2 items-center ">
          <i @click="backListProduct" class="fa-solid text-xl  cursor-pointer  fa-circle-chevron-left"></i>
          <div class="text-xl font-bold">Chi tiết sản phẩm</div>
        </div>
        <div class="bg-[#e5e7eb] h-[1px] my-2">
        </div>

        <div class="flex gap-5">
          <div class=" text-[#111827] font-[500]">
            Tên sản phẩm
          </div>
          <div>
            {{ dataProduct?.name }}
          </div>
        </div>

        <div class="bg-[#e5e7eb] h-[1px] my-2">
        </div>


        <div class="flex gap-5">
          <div class=" text-[#111827] font-[500]">
            Giá sản phẩm
          </div>
          <div>
            {{ dataProduct?.price }}
          </div>
        </div>

        <div class="bg-[#e5e7eb] h-[1px] my-2">
        </div>


        <div class="flex gap-5">
          <div class=" text-[#111827] font-[500]">
            Mô tả sản phẩm
          </div>
          <div>
            {{ dataProduct?.description }}
          </div>
        </div>

        <div class="bg-[#e5e7eb] h-[1px] my-2">
        </div>


        <div class="flex gap-5">
          <div class=" text-[#111827] font-[500]">
            Mã sản phẩm
          </div>
          <div>
            {{ dataProduct?.sku }}
          </div>
        </div>

        <div class="bg-[#e5e7eb] h-[1px] my-2">
        </div>

        <div class="flex gap-5">
          <div class=" text-[#111827] font-[500]">
            Giảm giá
          </div>
          <div v-if="dataProduct?.displaySale">
            Giảm giá
          </div>
          <div v-else>
            Không giảm
          </div>
        </div>

        <div class="bg-[#e5e7eb] h-[1px] my-2">
        </div>


        <div class="flex gap-5">
          <div class=" text-[#111827] font-[500]">
            Thuộc danh mục
          </div>
          <div>
            {{ dataProduct?.category?.name }}
          </div>
        </div>

        <div class="bg-[#e5e7eb] h-[1px] my-2">
        </div>

        <div class="flex gap-5">
          <div class=" text-[#111827] font-[500]">
            Level
          </div>
          <div>
            {{ dataProduct?.defaultLevel?.value }}
          </div>
        </div>

        <div class="bg-[#e5e7eb] h-[1px] my-2">
        </div>


        <div class="flex gap-5">
          <div class=" text-[#111827] font-[500]">
            Trạng thái:
          </div>

          <td v-if="dataProduct?.status== 'ACTIVE' "
              class="text-sm font-medium text-black font-light   whitespace-nowrap">
            <a-tag color="green">Đang bán</a-tag>
          </td>

          <td v-if="dataProduct?.status== 'DELETE' "
              class="text-sm font-medium text-black font-light   whitespace-nowrap">
            <a-tag color="yellow"> Đã xóa</a-tag>
          </td>
          <td v-if="dataProduct?.status== 'INACTIVE' "
              class="text-sm font-medium  text-gray-900 font-light   whitespace-nowrap">
            <a-tag color="black"> Ngừng bán</a-tag>
          </td>

        </div>


        <div class="flex gap-5 mt-2">
          <div class=" text-[#111827] font-[500]">
            Ảnh sản phẩm
          </div>
        </div>
        <div class="flex flex-wrap">
          <div v-for="(itemImg,index) in dataProduct.imageList" :key="index" class="w-[100px]  h-[100px] overflow-hidden">
            <img :src="itemImg" alt="" class="w-full h-full object-cover">
          </div>
        </div>



      </div>
    </div>
  </div>
</template>