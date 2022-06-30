import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Main",
    meta: {layout: 'main'},
    component: () => import('@/views/Crash.vue'),
  },{
    path: "/login",
    name: "Login",
    meta: {layout: 'empty'},
    component: () => import('@/views/Login.vue'),
  },{
    path: "/register",
    name: "Register",
    meta: {layout: 'empty'},
    component: () => import('@/views/Register.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
