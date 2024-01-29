<script setup lang="ts">
import type {FormError} from "#ui/types";

const paymentsData = useState('payments');
const payments: any = paymentsData?.value;

const travelsData = useState('travels');
const travels: any = travelsData?.value;

let isTabCustumerDeactive = ref(true);
let selected = ref(0);

const bookingForm = reactive({
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

const validate = (state: any): FormError[] => {
  const errors = []
  if (!state.travel) errors.push({path: 'travel', message: 'Required'})
  if (!state.payment) errors.push({path: 'payment', message: 'Required'})
  return errors
}

const openCreateBookingModal: any = useState('openCreateBookingModal');

const tabs_create_booking = [{
  slot: 'Tab1',
  label: 'Select a Travel'
}, {
  slot: 'Tab2',
  label: 'Customer'
}, {
  slot: 'Tab3',
  label: 'Payment'
}];

async function onSubmitTravel() {
  if (bookingForm.travel !== "") {
    isTabCustumerDeactive.value = false;
    selected.value = 1
  }
}

async function onSubmitCustumer() {
    selected.value = 2;
}

async function onSubmitBooking() {
  openCreateBookingModal.value = false;
  await useFetch('http://localhost:10/api/bookings', {
    method: 'POST',
    body: bookingForm
  });
}

</script>

<template>
  <UModal v-model="openCreateBookingModal">
    <UForm :validate="validate" :state="bookingForm" @submit="onSubmitBooking">
      <UTabs :items="tabs_create_booking" v-model="selected" class="mb-10">
        <template #Tab1="{ item }" >
          <div class="p-4">
            <UFormGroup label="Travels" required>
              <USelectMenu
                  v-model="bookingForm.travel"
                  :options="travels"
                  name="travel"
                  placeholder="Select travel"
                  value-attribute="id"
                  option-attribute="name"
                  required
              />
            </UFormGroup>
            <UButton @click="onSubmitTravel" color="gray" variant="solid" class="mt-3">
              Continue
            </UButton>
          </div>
        </template>

        <template #Tab2="{ item }">
          <div class="p-4">
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Please fill in the following fields
            </p>
            <UFormGroup label="Name" name="customer" class="mb-3" required>
              <UInput v-model="bookingForm.customer" required/>
            </UFormGroup>
            <UFormGroup label="Email" name="customer_email" class="mb-3" required>
              <UInput v-model="bookingForm.customer_email" required/>
            </UFormGroup>
            <UFormGroup label="Phone" name="customer_phone" class="mb-3" required>
              <UInput v-model="bookingForm.customer_phone" required/>
            </UFormGroup>
            <UFormGroup label="Birthdate" name="custumer_birth_date" class="mb-3" required>
              <UInput type="date" v-model="bookingForm.custumer_birth_date" required/>
            </UFormGroup>
            <UFormGroup label="Gender" name="custumer_gender" class="mb-3" required>
              <UInput v-model="bookingForm.custumer_gender" required/>
            </UFormGroup>
            <UButton @click="onSubmitCustumer" color="gray" variant="solid" class="mt-3">
              Continue
            </UButton>
          </div>
        </template>

        <template #Tab3="{ item }">
          <div class="p-4">
            <UFormGroup label="Notes" name="notes" class="mb-3" required>
              <UInput v-model="bookingForm.notes" required/>
            </UFormGroup>
            <UFormGroup label="Payment">
              <USelectMenu
                  v-model="bookingForm.payment"
                  :options="payments"
                  placeholder="Select a payment"
                  value-attribute="id"
                  option-attribute="name"
                  required
              />
              <UButton type="submit" color="black" class="mt-3">
                Save booking
              </UButton>
            </UFormGroup>
          </div>
        </template>
      </UTabs>
    </UForm>

  </UModal>
</template>
