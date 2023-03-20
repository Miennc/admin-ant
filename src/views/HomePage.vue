<script setup>

import {ref, watch} from "vue";

const visible = ref(false)
const textSearch = ref('')

const showModal = () => {
  visible.value = true
}
const handleOk = () => {
  visible.value = false
}

watch(textSearch, (val) => {
  console.log(val)
})


const getValueMenuItem = (e)=>{
  console.log(e.key)
}

</script>

<template>
  <a-page-header
    style="border: 1px solid rgb(235, 237, 240); padding: 10px"
    title="Product"
  >
    <template #tags>
      <a-button type="primary" @click="showModal">Add</a-button>
    </template>

    <template #extra>
      <a-space>
        <input v-model="textSearch" type="text" class="w-[20rem] p-1  outline-1 outline-[#1890ff]"
               placeholder="Tìm kiếm...">

        <a-dropdown placement="bottomRight">
          <a-button>Sort</a-button>
          <template #overlay>
            <a-menu @click="getValueMenuItem">
              <a-menu-item key="1"> Latest </a-menu-item>
              <a-menu-item key="2"> From A - Z </a-menu-item>
              <a-menu-item key="3"> From Z-A </a-menu-item>
              <a-menu-item key="4"> Oldest </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </a-space>
    </template>


    <div>
      <a-modal v-model:visible="visible" width="1000px" title="Basic Modal" @ok="handleOk">
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
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
                  First
                </th>
                <th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                  Last
                </th>
                <th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                  Handle
                </th>
                <th scope="col" class="text-sm font-medium flex justify-end text-gray-900 px-6 py-4 text-left">
                  Hành động
                </th>
              </tr>
              </thead>
              <tbody v-for="(item,index) in 10" :key="index">
              <tr class="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900" >  {{index +1}}  </td>
                <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                  Jacob
                </td>
                <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                  Thornton
                </td>
                <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                  @fat
                </td>
                <td class="text-sm flex justify-end text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                  <div class="flex justify-start items-center">

                           <span><i class="
                              fa-solid fa-pen-to-square
                              text-xl text-blue-500
                              mr-2
                              cursor-pointer
                            "></i></span>


                    <span data-bs-toggle="modal"
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
      <a-pagination v-model:current="current" :total="50" show-less-items />
    </div>




  </a-page-header>



</template>
