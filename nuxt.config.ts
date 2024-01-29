// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: {
    enabled: true,
    timeline: {
      enabled: true
    }
  },
  modules: [
    '@nuxt/ui',
    '@samk-dev/nuxt-vcalendar',
    '@nuxt/test-utils/module',
    "@nuxtjs/cloudinary"
  ],
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.API_KEY,
    uploadPreset: process.env.UPLOAD_PRESET
  }
})