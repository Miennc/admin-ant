import {createRouter, createWebHistory} from "vue-router";
import AdminLayout from "../layouts/AdminLayout.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [

        {
            path: "/",
            name: "Login",
            component: () => import("../views/Login.vue"),
        },
        {
            path: "/home",
            name: "home",
            component: AdminLayout,

            children: [
                {
                    path: "",
                    name: "Product",
                    component: () => import("../views/Product.vue"),
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
                },
                {
                    path: "news",
                    name: "News",
                    component: () => import("../views/News.vue"),
                },
                {
                    path: "product-detail",
                    name: "ProductDetail",
                    component: () => import("../views/ProductDetails.vue"),
                },
                {
                    path: "detail-news",
                    name: "DetailNews",
                    component: () => import("../views/DetailNew.vue"),
                },
                {
                    path: "levelSpecification",
                    name: "levelSpecification",
                    component: () => import("../views/levelSpecification.vue"),
                },
                {
                    path: "level-specification-detail",
                    name: "levelSpecificationDetail",
                    component: () => import("../views/DetailLevelSpecification.vue"),
                }
            ],
        },


    ],
});

export default router;
