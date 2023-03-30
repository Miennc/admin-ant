import {createRouter, createWebHashHistory} from "vue-router";
import AdminLayout from "../layouts/AdminLayout.vue";
import Login from "../views/Login.vue";
import Product from "../views/Product.vue";
import UserManager from "../views/UserManager.vue";
import UserDetails from "../views/UserDetails.vue";
import Profile from "../views/Profile.vue";
import Categories from "../views/Categories.vue";
import Level from "../views/Level.vue";
import News from "../views/News.vue";
import ProductDetails from "../views/ProductDetails.vue";
import DetailNew from "../views/DetailNew.vue";
import levelSpecification from "../views/levelSpecification.vue";
import DetailLevelSpecification from "../views/DetailLevelSpecification.vue";
import Mission from "../views/Mission.vue";
import DetailMission from "../views/DetailMission.vue";
import Test from "../views/Test.vue";

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: "/",
            name: "Login",
            component: Login,
        },
        {
            path: "/home",
            name: "home",
            component: AdminLayout,

            children: [
                {
                    path: "",
                    name: "Product",
                    component: Product,
                },
                {
                    path: "users",
                    name: "User page",
                    component: UserManager,
                },
                {
                    path: "user-detail",
                    name: "userDetail",
                    component: UserDetails,
                },
                {
                    path: "profile",
                    name: "Profile",
                    component: Profile,
                },
                {
                    path: "categories",
                    name: "Categories",
                    component: Categories,
                },
                {
                    path: "level",
                    name: "Level",
                    component: Level,
                },
                {
                    path: "news",
                    name: "News",
                    component: News,
                },
                {
                    path: "product-detail",
                    name: "ProductDetail",
                    component: ProductDetails,
                },
                {
                    path: "detail-news",
                    name: "DetailNews",
                    component: DetailNew,
                },
                {
                    path: "levelSpecification",
                    name: "levelSpecification",
                    component: levelSpecification,
                },
                {
                    path: "level-specification-detail",
                    name: "levelSpecificationDetail",
                    component: () => DetailLevelSpecification,
                },
                {
                    path: "mission",
                    name: "Mission",
                    component: () => Mission,
                },
                {
                    path: "mission-detail",
                    name: "DetailMission",
                    component: () => DetailMission,
                },
                {
                    path: "test",
                    name: "Test",
                    component: () => Test,
                }
            ],
        },
    ],
});

export default router;
