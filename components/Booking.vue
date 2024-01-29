<script setup lang="ts">
import CreateBooking from "~/components/CreateBooking.vue";
import type {FormError} from "#ui/types";

const columns = [{
  key: 'id',
  label: 'ID'
}, {
  key: 'customer',
  label: 'Customer',
  sortable: true
}, {
  key: 'customer_email',
  label: 'Email',
  sortable: true
}, {
  key: 'customer_phone',
  label: 'Phone',
  sortable: true
}, {
  key: 'custumer_birth_date',
  label: 'Birth',
  sortable: true
}, {
  key: 'custumer_gender',
  label: 'Gender',
  sortable: true
}, {
  key: 'payment',
  label: 'Payment',
  sortable: true
}, {
  key: 'notes',
  label: 'Notes',
  sortable: false,
}, {
  key: 'travel',
  label: 'Travel',
  sortable: false,
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

let modalIsOpen = ref(false);
const idBookingSelected = ref();

const bookingsData = useState('bookings');
const bookings: any = bookingsData?.value;

const paymentsData = useState('payments');
const payments: any = paymentsData?.value;

const travelsData = useState('travels');
const travels: any = travelsData?.value;

const openCreateBookingModal: any = useState('openCreateBookingModal');

let bookingForm = reactive({
  id: undefined,
  customer: "",
  customer_email: "",
  customer_phone: "",
  custumer_birth_date: "",
  custumer_gender: "",
  payment: "",
  notes: "",
  travel: ""
});

function openModal(id: any) {
  modalIsOpen.value = true;
  const booking = bookings.find((item: any) => item.id === id);

  if (id !== "") {
    idBookingSelected.value = id;
    bookingForm.id = id;
    bookingForm.customer = booking.customer;
    bookingForm.customer_email = booking.customer_email;
    bookingForm.customer_phone = booking.customer_phone;
    bookingForm.custumer_birth_date = booking.custumer_birth_date;
    bookingForm.custumer_gender = booking.custumer_gender;
    bookingForm.payment = booking.payment;
    bookingForm.notes = booking.notes;
    bookingForm.travel = booking.travel;
  }
}

const validate = (state: any): FormError[] => {
  const errors = []
  if (!state.travel) errors.push({path: 'email', message: 'Required'})
  if (!state.payment) errors.push({path: 'password', message: 'Required'})
  return errors
}

function openCreateModal() {
  openCreateBookingModal.value = true;
}

async function onSubmitBooking() {
  modalIsOpen.value = false;

  if (bookingForm.id !== undefined) {
    await useFetch('http://localhost:10/api/bookings/' + bookingForm.id, {
      method: 'PUT',
      body: bookingForm
    });
  } else {
    await useFetch('http://localhost:10/api/bookings', {
      method: 'POST',
      body: bookingForm
    });
  }
}

async function onDelete(id: any) {
  await useFetch('http://localhost:10/api/bookings/' + id, {
    method: 'DELETE'
  });
}

</script>

<template>
  <NuxtLoadingIndicator/>
  <UTable :rows="bookings" :columns="columns">
    <template #travel-data="{ row }">
      {{ travels.find((item: any) => item.id === row.id)?.name }}
    </template>
    <template #payment-data="{ row }">
      {{ payments.find((item: any) => item.id === row.id)?.name }}
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

  <!--  CREATE BOOKING-->
  <UButton label="Add booking" @click="openCreateModal()"/>
  <CreateBooking/>

  <!--  UPDATE BOOKING-->
  <UModal v-model="modalIsOpen">
    <UForm :validate="validate" :state="bookingForm" class="space-y-4" @submit="onSubmitBooking">

      <div class="p-4">
        <UFormGroup label="Name" name="customer" class="mb-3">
          <UInput v-model="bookingForm.customer"/>
        </UFormGroup>
        <UFormGroup label="Payment">
          <USelectMenu
              v-model="bookingForm.payment"
              :options="payments"
              placeholder="Select payment"
              value-attribute="id"
              option-attribute="name"
          />
        </UFormGroup>
        <UFormGroup label="Notes" name="notes">
          <UInput v-model="bookingForm.notes"/>
        </UFormGroup>
        <UFormGroup label="Travel" name="travel">
          <USelectMenu
              v-model="bookingForm.travel"
              :options="travels"
              :name="travels.name"
              placeholder="Select travel"
              :value-attribute="travels.id"
              :option-attribute="travels.name"
          />
        </UFormGroup>
        <UButton type="submit" color="black" class="mt-3">
          Save booking
        </UButton>
      </div>
    </UForm>
  </UModal>

</template>
