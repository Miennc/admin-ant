<script setup>
import { userServices } from "@/services/userServices";
import { onMounted, ref } from "vue";
import { useToast } from "vue-toastification";

const toast = useToast();
const dataProfile = ref({});
const oldPass = ref("");
const newPass = ref("");

const error = ref({
  oldPass: "",
  newPass: "",
});
const getProfile = async () => {
  try {
    const res = await userServices.getProfile();
    dataProfile.value = res.data;
  } catch (e) {
    console.log(e);
  }
};

const validate = () => {
  error.value.newPass = newPass.value ? "" : "Mật khẩu mới không được để trống";
  error.value.oldPass =
    oldPass.value === newPass.value ? "" : "Hai mật khẩu không khớp nhau";
  return error.value.newPass === "" && error.value.oldPass === "";
};

const changePass = async () => {
  if (validate()) {
    try {
      await userServices.changePassword({
        password: newPass.value,
      });
      oldPass.value = "";
      newPass.value = "";
      toast.success("Đổi mật khẩu thành công");
    } catch (e) {
      toast.error("Đổi mật khẩu thất bại");
    }
  }
};

onMounted(() => {
  getProfile();
});
</script>

<template>
  <div class="px-3 py-3">
    <div class="bg-white shadow-lg rounded-lg overflow-hidden">
      <div class="px-5 py-2">
        <div class="text-lg text-[#111827] font-[500]">Thông tin cá nhân</div>
        <div class="bg-[#e5e7eb] h-[1px] my-2"></div>

        <div class="flex gap-5">
          <div class="text-[#111827] font-[500]">Tên đăng nhập:</div>
          <div>
            {{ dataProfile?.username }}
          </div>
        </div>

        <div class="bg-[#e5e7eb] h-[1px] my-2"></div>

        <div class="flex gap-5">
          <div class="text-[#111827] font-[500]">Email:</div>
          <div>
            {{ dataProfile?.email }}
          </div>
        </div>

        <div class="bg-[#e5e7eb] h-[1px] my-2"></div>

        <div class="flex gap-5">
          <div class="text-[#111827] font-[500]">Quyền:</div>
          <div>
            {{ dataProfile?.roleName }}
          </div>
        </div>

        <div class="bg-[#e5e7eb] h-[1px] my-2"></div>

        <div class="flex gap-5">
          <div class="text-[#111827] font-[500]">Số điện thoại:</div>
          <div>
            {{ dataProfile?.phoneNumber }}
          </div>
        </div>

        <div class="bg-[#e5e7eb] h-[1px] my-2"></div>

        <div class="flex gap-5">
          <div class="text-[#111827] font-[500]">Trạng thái:</div>

          <td
            v-if="dataProfile?.status == 'ACTIVE'"
            class="text-sm font-medium text-black font-light whitespace-nowrap"
          >
            <a-tag color="green">Hoạt động</a-tag>
          </td>

          <td
            v-if="dataProfile?.status == 'PENDING'"
            class="text-sm font-medium text-black font-light whitespace-nowrap"
          >
            <a-tag color="yellow">Chờ phê duyệt</a-tag>
          </td>
          <td
            v-if="dataProfile?.status == 'INACTIVE'"
            class="text-sm font-medium text-gray-900 font-light whitespace-nowrap"
          >
            <a-tag color="black"> Bị khóa</a-tag>
          </td>
        </div>

        <div class="bg-[#e5e7eb] h-[1px] my-2"></div>

        <div>
          <a-input-password
            v-model:value="newPass"
            placeholder="mật khẩu mới"
          />
          <span class="text-red-500 italic text-sm">{{ error.newPass }} </span>
        </div>
        <div class="mt-2">
          <a-input-password
            v-model:value="oldPass"
            placeholder=" mật lại mật khẩu mới"
          />
          <span class="text-red-500 italic text-sm"> {{ error.oldPass }} </span>
        </div>

        <div class="mt-2">
          <a-button type="primary" @click="changePass"
            >Thay đổi mật khẩu</a-button
          >
        </div>
      </div>
    </div>
  </div>
</template>
