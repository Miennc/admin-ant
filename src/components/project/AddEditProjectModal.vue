<script setup>
import { reactive, ref, watch } from "vue";
import { notification } from "ant-design-vue";

const { modalInstance } = defineProps({
  modalInstance: {
    type: Object,
    default: () => {
      return {
        visible: true,
        title: "",
        projectModel: undefined,
      };
    },
  },
});
const emits = defineEmits(["afterSuccessSaveProject"]);

const formState = reactive({
  title: "",
  desc: "",
  defaultLanguage: "",
  otherLanguages: [],
});

const formRef = ref(null);
const modalLoading = ref(false);
const addProject = () => {
  console.log("form", formRef.value);
  formRef.value
    .validateFields()
    .then((values) => {
      console.log("values", values);
    })
    .catch(() => {
      notification.error({
        message: "Error",
        description: "Please fill in all required fields.",
        onClick: () => {
          console.log("Notification Clicked!");
        },
      });
    });
};

const closeModal = () => {
  // eslint-disable-next-line vue/no-mutating-props
  modalInstance.visible = false;
};
watch(modalInstance, () => {
  if (modalInstance.visible) {
    formState.title = modalInstance.projectModel?.title;
    formState.desc = modalInstance.projectModel?.desc;
    formState.defaultLanguage = modalInstance.projectModel?.defaultLanguage;
    formState.otherLanguages = modalInstance.projectModel?.otherLanguages;
  } else {
    formRef.value.resetFields();
  }
});
</script>

<template>
  <a-modal
    :title="modalInstance.title"
    :closable="null"
    :visible="modalInstance.visible"
    @ok="addProject"
    @cancel="closeModal"
    :confirm-loading="modalLoading"
  >
    <a-form
      ref="formRef"
      :model="formState"
      name="basic"
      label-align="left"
      :label-col="{ span: 7 }"
      autocomplete="off"
    >
      <a-form-item
        label="Title"
        name="title"
        :rules="[{ required: true, message: 'Please input title!' }]"
      >
        <a-input v-model:value="formState.title" />
      </a-form-item>

      <a-form-item
        label="Description"
        name="desc"
        :rules="[{ required: true, message: 'Please input description!' }]"
      >
        <a-textarea v-model:value="formState.desc" />
      </a-form-item>

      <a-form-item
        label="Default language"
        name="defaultLanguage"
        :rules="[
          { required: true, message: 'Please input prefer default language!' },
        ]"
      >
        <a-select v-model:value="formState.defaultLanguage">
          <a-select-option value="">English</a-select-option>
          <a-select-option value="en">English</a-select-option>
          <a-select-option value="vi">English</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="Other languages" name="otherLanguages">
        <a-select v-model:value="formState.otherLanguages" mode="multiple">
          <a-select-option value="">English</a-select-option>
          <a-select-option value="en">English</a-select-option>
          <a-select-option value="en1">English</a-select-option>
          <a-select-option value="en2">English</a-select-option>
          <a-select-option value="en3">English</a-select-option>
          <a-select-option value="en4">English</a-select-option>
          <a-select-option value="en5">English</a-select-option>
          <a-select-option value="vi">English</a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
