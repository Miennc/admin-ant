<script setup>
import {onMounted, ref} from "vue";
import {useToast} from "vue-toastification";
import {useRoute} from "vue-router";
import {newsServices} from "@/services/newServices";

const route = useRoute();
const toast = useToast();
const dataNew = ref({});

const getProductById = async () => {
  try {
    const res = await newsServices.findByIdNews(route.query.id);
    dataNew.value = res.data;
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
          <div class="text-xl font-bold">Chi tiết tin tức</div>
        </div>
        <div class="bg-[#e5e7eb] h-[1px] my-2">
        </div>

        <div class="flex gap-5">
          <div class=" text-[#111827] font-[500]">
            Tiêu đề
          </div>
          <div>
            {{ dataNew?.title }}
          </div>
        </div>

        <div class="bg-[#e5e7eb] h-[1px] my-2">
        </div>


        <div class="flex gap-5">
          <div class=" text-[#111827] font-[500]">
            Nội dung
          </div>
          <div>
            {{ dataNew?.content }}
          </div>
        </div>

        <div class="bg-[#e5e7eb] h-[1px] my-2">
        </div>


        <div class="flex gap-5">
          <div class=" text-[#111827] font-[500]">
            Trạng thái:
          </div>

          <td v-if="dataNew?.status== 'ACTIVE' "
              class="text-sm font-medium text-black font-light   whitespace-nowrap">
            <a-tag color="green">Hoạt động</a-tag>
          </td>

          <td v-if="dataNew?.status== 'DELETE' "
              class="text-sm font-medium text-black font-light   whitespace-nowrap">
            <a-tag color="yellow"> Đã xóa</a-tag>
          </td>
          <td v-if="dataNew?.status== 'INACTIVE' "
              class="text-sm font-medium  text-gray-900 font-light   whitespace-nowrap">
            <a-tag color="black"> Không hoạt động</a-tag>
          </td>

        </div>


        <div class="flex gap-5 mt-2">
          <div class=" text-[#111827] font-[500]">
            Ảng sản phẩm
          </div>
        </div>
        <div class="flex flex-wrap">
          <div v-for="(itemImg,index) in dataNew.attachmentList" :key="index"
               class="w-[100px]  h-[100px] overflow-hidden">
            <img :src="itemImg" alt="" class="w-full h-full object-cover">
          </div>
        </div>

        <div class="bg-[#e5e7eb] h-[1px] my-2">
        </div>


      </div>
    </div>
  </div>
</template>