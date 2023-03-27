<script setup>
import {onMounted, ref} from "vue";
import {useToast} from "vue-toastification";
import {useRoute} from "vue-router";
import {missionServices} from "@/services/missionServices";

const route = useRoute();
const toast = useToast();
const dataMission = ref({});

const getProductById = async () => {
  try {
    const res = await missionServices.findByIdMission(route.query.id);
    dataMission.value = res.data;
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
          <div class="text-xl font-bold">Chi tiết nhiệm vụ</div>
        </div>
        <div class="bg-[#e5e7eb] h-[1px] my-2">
        </div>

        <div class="flex gap-5">
          <div class=" text-[#111827] font-[500]">
            Tên nhiệm vụ
          </div>
          <div>
            {{ dataMission?.name }}
          </div>
        </div>

        <div class="bg-[#e5e7eb] h-[1px] my-2">
        </div>

        <div class="flex gap-5">
          <div class=" text-[#111827] font-[500]">
            Mô tả nhiệm vụ
          </div>
          <div>
            {{ dataMission?.description }}
          </div>
        </div>

        <div class="bg-[#e5e7eb] h-[1px] my-2">
        </div>


        <div class="flex gap-5">
          <div class=" text-[#111827] font-[500]">
            Bước thực hiện
          </div>
          <div>
            {{ dataMission?.steps }}
          </div>
        </div>

        <div class="bg-[#e5e7eb] h-[1px] my-2">
        </div>


        <div class="flex gap-5">
          <div class=" text-[#111827] font-[500]">
            Số phut thực hiện
          </div>
          <div>
            {{ dataMission?.minutes }}
          </div>
        </div>

        <div class="bg-[#e5e7eb] h-[1px] my-2">
        </div>

        <div class="flex gap-5">
          <div class=" text-[#111827] font-[500]">
            Phần thưởng
          </div>
          <div>
            {{ dataMission?.reward }}
          </div>
        </div>

        <div class="bg-[#e5e7eb] h-[1px] my-2">
        </div>


        <div class="flex gap-5">
          <div class=" text-[#111827] font-[500]">
            Đơn vị thưởng
          </div>
          <div>
            {{ dataMission?.rewardUnit }}
          </div>
        </div>

        <div class="bg-[#e5e7eb] h-[1px] my-2">
        </div>


        <div class="flex gap-5">
          <div class=" text-[#111827] font-[500]">
            kiểu đi
          </div>
          <div v-if="dataMission?.type == 'LONGER'">
            Đi xa
          </div>
          <div v-else>
            Đi nhanh
          </div>
        </div>

        <div class="bg-[#e5e7eb] h-[1px] my-2">
        </div>


      </div>
    </div>
  </div>
</template>