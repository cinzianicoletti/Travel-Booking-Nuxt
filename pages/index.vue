<script setup lang="ts">
const route = useRoute();

const sections = [{
  slot: 'travels',
  label: 'Travel'
}, {
  slot: 'bookings',
  label: 'Booking'
}];

const travels = useState('travels');
const bookings = useState('bookings');
const payments = useState('payments');

try {
  const dataTravels = await useAsyncData('travels', () => $fetch('http://localhost:10/api/travels'));
  const dataBookings = await useAsyncData('bookings', () => $fetch('http://localhost:10/api/bookings'));
  const dataPayments = await useAsyncData('payments', () => $fetch('http://localhost:10/api/payments'));

  travels.value = dataTravels.data;
  bookings.value = dataBookings.data;
  payments.value = dataPayments.data;

} catch (e) {
  console.error("FETCH DATA", e);
}

</script>

<template>
  <UTabs :items="sections" class="w-full">
    <template #travels="{ item }">
      <UCard>
        <template #header>
          <h1 class="text-3xl font-semibold leading-6 text-gray-900 dark:text-white">
            {{ item.label }}
          </h1>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            See and make changes to your travels here.
          </p>
          <NuxtPage/>
        </template>
        <Travel></Travel>
      </UCard>
    </template>

    <template #bookings="{ item }">
      <UCard>
        <template #header>
          <h1 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
            {{ item.label }}
          </h1>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            See and make changes to your bookings here.
          </p>
        </template>
        <Booking></Booking>
      </UCard>
    </template>
  </UTabs>
</template>
