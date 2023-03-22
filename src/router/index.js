import {createRouter, createWebHistory} from "vue-router";
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
                    name: "Home page",
                    component: () => import("../views/HomePage.vue"),
                },
                {
                    path: "users",
                    name: "User page",
                    component: () => import("../views/UserManager.vue"),
                },
                {
                    path: "languages",
                    name: "Language page",
                    component: () => import("../views/LanguagesView.vue"),
                },
                {
                    path: "user-detail",
                    name: "userDetail",
                    component: () => import("../views/UserDetails.vue"),
                },
                {
                    path: "profile",
                    name: "Profile",
                    component: () => import("../views/Profile.vue"),
                },
                {
                    path: "categories",
                    name: "Categories",
                    component: () => import("../views/Categories.vue"),
                },
                {
                    path: "level",
                    name: "Level",
                    component: () => import("../views/Level.vue"),
                }
            ],
        },

        {
            path: "/login",
            name: "Login",
            component: () => import("../views/Login.vue"),
        }
    ],
});

export default router;
