<script setup>
import { onMounted, ref } from "vue";
import { useToast } from "vue-toastification";
import { useRoute } from "vue-router";
import { levelSpecificationServices } from "@/services/levelSpecificationServices";

const route = useRoute();
const toast = useToast();
const dataLevelSpeci = ref({});

const getProductById = async () => {
  try {
    const res = await levelSpecificationServices.findByIdLevelSpecification(
      route.query.id
    );
    dataLevelSpeci.value = res.data;
  } catch (e) {
    console.log(e);
  }
};

const backListProduct = () => {
  window.history.back();
};

onMounted(() => {
  getProductById();
});
</script>

<template>
  <div class="px-3 py-3">
    <div class="bg-white shadow-lg rounded-lg overflow-hidden">
      <div class="px-5 py-2">
        <div class="flex gap-2 items-center">
          <i
            @click="backListProduct"
            class="fa-solid text-xl cursor-pointer fa-circle-chevron-left"
          ></i>
          <div class="text-xl font-bold">Chi tiết thông số level</div>
        </div>
        <div class="bg-[#e5e7eb] h-[1px] my-2"></div>

        <div class="flex gap-5">
          <div class="text-[#111827] font-[500]">
            Số ngày tối đa người mua được phép sử dụng:
          </div>
          <div>
            {{ dataLevelSpeci?.daysToUseMax }}
          </div>
        </div>

        <div class="bg-[#e5e7eb] h-[1px] my-2"></div>

        <div class="flex gap-5">
          <div class="text-[#111827] font-[500]">Độ bền ban đầu của giày</div>
          <div>
            {{ dataLevelSpeci?.durability }}
          </div>
        </div>

        <div class="bg-[#e5e7eb] h-[1px] my-2"></div>

        <div class="flex gap-5">
          <div class="text-[#111827] font-[500]">
            Năng lượng ban đầu của giày
          </div>
          <div>
            {{ dataLevelSpeci?.energy }}
          </div>
        </div>

        <div class="bg-[#e5e7eb] h-[1px] my-2"></div>

        <div class="flex gap-5">
          <div class="text-[#111827] font-[500]">
            Độ bền tiêu hao mỗi lần sử dụng
          </div>
          <div>
            {{ dataLevelSpeci?.durabilityConsumption }}
          </div>
        </div>

        <div class="bg-[#e5e7eb] h-[1px] my-2"></div>

        <div class="flex gap-5">
          <div class="text-[#111827] font-[500]">
            Năng lượng tiêu hao mỗi lần sử dụng
          </div>
          <div>
            {{ dataLevelSpeci?.energyConsumption }}
          </div>
        </div>

        <div class="bg-[#e5e7eb] h-[1px] my-2"></div>

        <div class="flex gap-5">
          <div class="text-[#111827] font-[500]">
            Độ bền tiêu hao mỗi lần sử dụng
          </div>
          <div>
            {{ dataLevelSpeci?.durabilityConsumption }}
          </div>
        </div>

        <div class="bg-[#e5e7eb] h-[1px] my-2"></div>

        <div class="flex gap-5">
          <div class="text-[#111827] font-[500]">Giá bán giày</div>
          <div>
            {{ dataLevelSpeci?.sellingPrice }}
          </div>
        </div>

        <div class="bg-[#e5e7eb] h-[1px] my-2"></div>

        <div class="flex gap-5">
          <div class="text-[#111827] font-[500]">Giá nâng cấp mỗi level</div>
          <div>
            {{ dataLevelSpeci?.sellingPrice }}
          </div>
        </div>

        <div class="bg-[#e5e7eb] h-[1px] my-2"></div>

        <div class="flex gap-5">
          <div class="text-[#111827] font-[500]">Giá nâng cấp mỗi level</div>
          <div>
            {{ dataLevelSpeci?.upgradePrice }}
          </div>
        </div>

        <div class="bg-[#e5e7eb] h-[1px] my-2"></div>

        <div class="flex gap-5">
          <div class="text-[#111827] font-[500]">
            Đơn vị giá nâng cấp mỗi level
          </div>
          <div>
            {{ dataLevelSpeci?.upgradePriceUnit }}
          </div>
        </div>

        <div class="bg-[#e5e7eb] h-[1px] my-2"></div>

        <div class="flex gap-5">
          <div class="text-[#111827] font-[500]">
            Giá sửa chưa (độ bền như ban đầu)
          </div>
          <div>
            {{ dataLevelSpeci?.repairPrice }}
          </div>
        </div>

        <div class="bg-[#e5e7eb] h-[1px] my-2"></div>

        <div class="flex gap-5">
          <div class="text-[#111827] font-[500]">Đơn vị giá sửa chữa</div>
          <div>
            {{ dataLevelSpeci?.repairPriceUnit }}
          </div>
        </div>

        <div class="bg-[#e5e7eb] h-[1px] my-2"></div>

        <div class="flex gap-5">
          <div class="text-[#111827] font-[500]">Giá phục hồi năng lượng</div>
          <div>
            {{ dataLevelSpeci?.energyRecoverPrice }}
          </div>
        </div>

        <div class="bg-[#e5e7eb] h-[1px] my-2"></div>

        <div class="flex gap-5">
          <div class="text-[#111827] font-[500]">
            Đơn vị giá phục hồi năng lượng
          </div>
          <div>
            {{ dataLevelSpeci?.energyRecoverPriceUnit }}
          </div>
        </div>

        <div class="bg-[#e5e7eb] h-[1px] my-2"></div>

        <div class="flex gap-5">
          <div class="text-[#111827] font-[500]">
            Số bước chân tối đa mỗi lần sử dụng giày
          </div>
          <div>
            {{ dataLevelSpeci?.stepsPerTime }}
          </div>
        </div>

        <div class="bg-[#e5e7eb] h-[1px] my-2"></div>

        <div class="flex gap-5">
          <div class="text-[#111827] font-[500]">
            Số khoảng cách tối đa mỗi lần sử dụng giày (km)
          </div>
          <div>
            {{ dataLevelSpeci?.distancePerTime }}
          </div>
        </div>

        <div class="bg-[#e5e7eb] h-[1px] my-2"></div>

        <div class="flex gap-5">
          <div class="text-[#111827] font-[500]">
            Level mặc định của giày lúc ban đầu
          </div>
          <div>
            {{ dataLevelSpeci?.defaultLevel?.value }}
          </div>
        </div>

        <div class="bg-[#e5e7eb] h-[1px] my-2"></div>

        <div class="flex gap-5">
          <div class="text-[#111827] font-[500]">Level tối đa của giày</div>
          <div>
            {{ dataLevelSpeci?.maxLevel?.value }}
          </div>
        </div>

        <div class="bg-[#e5e7eb] h-[1px] my-2"></div>
      </div>
    </div>
  </div>
</template>
