import { createRouter, createWebHistory } from "vue-router";
import AdminLayout from "../layouts/AdminLayout.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: AdminLayout,
      children: [
        {
          path: "",
          name: "project page",
          component: () => import("../views/ProjectView.vue"),
        },
        {
          path: "translation",
          name: "Translation page",
          component: () => import("../views/TranslationView.vue"),
        },
        {
          path: "languages",
          name: "Language page",
          component: () => import("../views/LanguagesView.vue"),
        },
      ],
    },
  ],
});

export default router;
