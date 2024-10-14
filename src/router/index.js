import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      props: (route) => ({ query: route.query.q }),
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/LoginView.vue"),
    },
    {
      path: '/reset-password',
      name: 'ChangePassword',
      component: () => import('../views/ChangeView.vue')
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('../views/ResetView.vue')
    },

    {
      path: "/create",
      name: "create",
      component: () => import("../views/CreateView.vue"),
    },
    {
      path: "/posts/:id",
      name: "post",
      component: () => import("../views/PostView.vue"),
    },

    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/AboutView.vue"),
    },
  ],
});

export default router;
