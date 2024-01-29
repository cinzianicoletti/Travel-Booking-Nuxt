<script setup lang="ts">

const mode = ref('date');
const rules = ref([
  {
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  },
  {
    hours: 23,
    minutes: 59,
    seconds: 59,
    milliseconds: 999,
  }
]);

const columns = [{
  key: 'id',
  label: 'ID'
}, {
  key: 'name',
  label: 'Name',
  sortable: true
}, {
  key: 'startDate',
  label: 'Start date',
  sortable: true
}, {
  key: 'endDate',
  label: 'End Date',
  sortable: true
}, {
  key: 'image',
  label: 'Picture',
  sortable: false,
}, {
  key: 'description',
  label: 'Description',
  sortable: false,
  direction: 'desc'
}, {
  key: 'price',
  label: 'Price (€)',
  sortable: true,
  direction: 'desc'
}, {
  key: 'actions'
}]

const actions = (row: any) => [
  [{
    label: 'Edit',
    icon: 'i-heroicons-pencil-square-20-solid',
    click: () => openModal(row.id)
  }, {
    label: 'Delete',
    icon: 'i-heroicons-trash-20-solid',
    click: () => onDelete(row.id)
  }]
]

let modalIsOpen = ref(false)
const travelsData = useState('travels');
const travels: any = travelsData?.value;

let travelForm = reactive({
  id: undefined,
  name: "",
  startDate: "",
  endDate: "",
  image: "",
  description: "",
  price: ""
})

let range = reactive({
  start: new Date(),
  end: new Date()
});

const apiKey = useRuntimeConfig().public.cloudinary.apiKey;
const upload_preset = useRuntimeConfig().public.cloudinary.uploadPreset;

const options = {
  sources: ["local"],
  multiple: false,
  maxFiles: 1
}

// ---------- FUNCTIONS
function openModal(id: any) {
  modalIsOpen.value = true;
  const travel = travels.find((item: any) => item.id === id);

  if (id !== "") {
    travelForm.id = id;
    travelForm.name = travel.name;
    travelForm.description = travel.description;
    travelForm.image = travel.image;
    travelForm.price = travel.price;
    range.start = new Date(travel.startDate);
    range.end = new Date(travel.endDate);
  }
}

async function onSubmitTravel() {
  modalIsOpen.value = false;
  travelForm.startDate = range.start.toLocaleDateString();
  travelForm.endDate = range.end.toLocaleDateString();

  if (travelForm.id !== undefined) {
    await useFetch('http://localhost:10/api/travels/' + travelForm.id, {
      method: 'PUT',
      body: travelForm
    });
  } else {
    await useFetch('http://localhost:10/api/travels', {
      method: 'POST',
      body: travelForm
    });
  }
}

async function onDelete(id: any) {
  await useFetch('http://localhost:10/api/travels/' + id, {
    method: 'DELETE'
  });
}

async function onUpload(result: any, widget: any) {
  travelForm.image = result.value.info.public_id;
}

</script>

<template>
  <UTable :rows="travels" :columns="columns">
    <template #image-data="{ row }">
      <CldImage
          v-if="row?.image !== ''"
          :src="row?.image"
          width="100"
          height="100"
          class="h-20 rounded-sm ring-1"
          :api-key="apiKey"
          :uploadPreset="upload_preset"
          alt="My Awesome Image"/>
    </template>

    <template #actions-data="{ row }">
      <UDropdown :items="actions(row)">
        <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid"/>
      </UDropdown>
    </template>

    <template #empty-state>
      <div class="flex flex-col items-center justify-center py-6 gap-3">
        <span class="italic text-sm">Oh no!</span>
      </div>
    </template>
  </UTable>

  <UButton label="Add travel" @click="openModal('')"/>

  <UModal v-model="modalIsOpen">
    <div class="p-4">
      <UFormGroup label="Name" name="name">
        <UInput v-model="travelForm.name"/>
      </UFormGroup>
      <UFormGroup label="Description" name="description" class="mt-2">
        <UInput v-model="travelForm.description"/>
      </UFormGroup>
      <UFormGroup label="Price" name="price" class="mt-2">
        <UInput v-model="travelForm.price"/>
      </UFormGroup>
      <UFormGroup label="Date" class="mt-2">
        <VDatePicker v-model.range="range" :mode="mode" :rules="rules" locale="it-IT"/>
      </UFormGroup>
      <UFormGroup label="Image" class="mt-2">
        <CldImage
            v-if="travelForm?.image !== ''"
            :src="travelForm?.image"
            width="987"
            height="987"
            alt="My Awesome Image"
        />
        <CldUploadWidget
            :onUpload="onUpload"
            v-slot="{open}"
            :uploadPreset="upload_preset"
            :options="options">
          <UButton type="button"
                   class="btn btn-info mt-3"
                   @click="open">
            Upload travel picture
          </UButton>
        </CldUploadWidget>
      </UFormGroup>

      <UButton type="submit" @click="onSubmitTravel" color="black" class="mt-3">
        Save travel
      </UButton>
    </div>
  </UModal>

</template>
