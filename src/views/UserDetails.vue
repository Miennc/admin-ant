<script setup>
import {userServices} from "@/services/userServices";
import {useRoute} from "vue-router";
import {onMounted, ref} from "vue";
import {ExclamationCircleOutlined} from '@ant-design/icons-vue';
import {createVNode, defineComponent} from 'vue';
import {Modal} from 'ant-design-vue';
import {useToast} from "vue-toastification";

const route = useRoute();
const dataUserById = ref({});
const toast = useToast();

const getUserById = async () => {
  try {
    const res = await userServices.findByIdUser(route.query.id);
    dataUserById.value = res.data;
  } catch (e) {
    console.log(e)
  }
}


const acceptAccount = () => {
  Modal.confirm({
    title: 'Bạn có chắc chắn muốn phê duyệt tài khoản này không ?',
    icon: createVNode(ExclamationCircleOutlined),
    async onOk() {
      try {
        await userServices.acceptUser({
          id: route.query.id,
          status: 'ACTIVE'
        })
        await getUserById()
        toast.success('Phê duyệt tài khoản thành công')
      } catch (e) {
        toast.error('Phê duyệt tài khoản thất bại')
      }
    },
    onCancel() {
    },
  });
};


const backListUser = () => {
  window.history.back()
}

onMounted(() => {
  getUserById()
})

</script>

<template>
  <div class=" px-3  py-3">
    <div class="bg-white shadow-lg rounded-lg overflow-hidden">
      <div class="px-4 py-2 bg-gray-200">
        <div class="flex  gap-2 items-center ">
          <i @click="backListUser" class="fa-solid text-xl  cursor-pointer  fa-circle-chevron-left"></i>
          <div class="text-xl font-bold">Chi tiết người dùng</div>
        </div>
      </div>
      <div class="px-4 py-2">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="font-semibold text-gray-600">Tên Đăng nhập:</p>
            <p class="text-gray-800">{{ dataUserById.username }}</p>
          </div>
          <div>
            <p class="font-semibold text-gray-600">Email:</p>
            <p class="text-gray-800">{{ dataUserById.email }}</p>
          </div>
          <div>
            <p class="font-semibold text-gray-600">Số điện thoại:</p>
            <p class="text-gray-800">{{ dataUserById.phoneNumber }}</p>
          </div>

          <div>
            <p class="font-semibold text-gray-600">Trạng thái:</p>
            <p v-if="dataUserById?.status== 'ACTIVE' "
               class="text-sm  font-medium text-gray-900 font-light   whitespace-nowrap">
              <a-tag color="green"> Hoạt động</a-tag>
            </p>
            <p v-if="dataUserById?.status== 'PENDING' "
               class="text-sm font-medium text-black font-light   whitespace-nowrap">
              <a-tag color="yellow">Chờ phê duyệt</a-tag>
            </p>
            <p v-if="dataUserById?.status== 'INACTIVE' "
               class="text-sm font-medium  text-gray-900 font-light   whitespace-nowrap">
              <a-tag color="green"> Bị khóa</a-tag>
            </p>
          </div>

          <div>
            <p class="font-semibold text-gray-600">Số điện thoại:</p>
            <p class="text-gray-800">{{ dataUserById.phoneNumber }}</p>
          </div>


          <div>
            <p class="font-semibold text-gray-600">Quyền người dùng:</p>
            <p class="text-gray-800">{{ dataUserById.roleName }}</p>
          </div>

                    <div>
                      <p class="font-semibold text-gray-600">Chứng minh nhân dân:</p>
                      <div class="flex gap-4">
                        <div>
                          <p class="font-semibold text-gray-600">Mặt trước:</p>
                          <div class="w-[100%] h-[230px] overflow-hidden">
                            <img :src="dataUserById?.identification?.identificationImageFrontUrl" alt=""
                                 class="w-full h-full object-contain">
                          </div>

                        </div>

                        <div>
                          <p class="font-semibold text-gray-600">Mặt Sau:</p>
                          <div class="w-[100%] h-[230px] overflow-hidden">
                            <img :src="dataUserById?.identification?.identificationImageFrontUrl" alt=""
                                 class="w-full h-full object-contain">
                          </div>
                        </div>
                      </div>
                    </div>


                    <div class="mt-[2.1rem]">
                      <p class="font-semibold text-gray-600">Ảnh chân dung:</p>
                      <div class="w-[230px] h-[230px] overflow-hidden bg-red-500">
                        <img :src="dataUserById?.identification?.identificationImageSelfieUrl" alt="" class="w-[230px] h-[230px]">
                      </div>
                    </div>

        </div>
      </div>

      <div class="flex justify-end items-center p-5">
        <a-button type="primary" @click="acceptAccount" :disabled="dataUserById?.status== 'ACTIVE'">Phê duyệt tài khoản</a-button>
      </div>
    </div>


  </div>
</template>


<style scoped>

</style>