import { createApp } from "vue";
import App from "./App.vue";
import PrimeVue from "primevue/config";
import Noir from "./presets/Noir";
import Tooltip from "primevue/tooltip";
import ToastService from "primevue/toastservice";
import router from "./router/index.js";

const app = createApp(App);

app.use(PrimeVue, {
  theme: {
    preset: Noir,
    options: {
      prefix: "p",
      darkModeSelector: ".p-dark",
      cssLayer: false,
    },
  },
});
app.directive("tooltip", Tooltip);
app.use(ToastService);
app.use(router);

app.mount("#app");

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        if (registration.waiting) {
          registration.waiting.postMessage({ env: process.env.VUE_APP_ENV });
        } else if (registration.active) {
          registration.active.postMessage({ env: process.env.VUE_APP_ENV });
        } else if (registration.installing) {
          registration.installing.addEventListener("statechange", (event) => {
            if (event.target.state === "activated") {
              registration.active.postMessage({ env: process.env.VUE_APP_ENV });
            }
          });
        }
      })
      .catch((error) => {
        console.error("Service Worker registration failed:", error);
      });
  });
}
