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
      path: "/register",
      name: "register",
      component: () => import("../views/RegisterView.vue"),
    },
    {
      path: "/reset-password",
      name: "ChangePassword",
      component: () => import("../views/ChangeView.vue"),
      beforeEnter: (to, from, next) => {
        if (to.query.token) {
          next();
        } else {
          next({ name: "home" }); // oder zu einer anderen Seite umleiten
        }
      },
    },

    {
      path: "/forgot-password",
      name: "forgot-password",
      component: () => import("../views/ResetView.vue"),
    },

    {
      path: "/create",
      name: "create",
      component: () => import("../views/CreateView.vue"),
    },

    {
      path: "/post/:id/edit",
      name: "edit",
      component: () => import("../views/EditView.vue"),
    },

    {
      path: "/posts/:id",
      name: "post",
      component: () => import("../views/SinglePostView.vue"),
    },
    {
      path: "/my-posts",
      name: "myPosts",
      component: () => import("../views/MyPostsView.vue"),
    },

    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/AboutView.vue"),
    },

    {
      path: "/contact",
      name: "contact",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/ContactView.vue"),
    },

    {
      path: "/my-feed",
      name: "my-feed",
      component: HomeView,
    },
    {
      path: "/profile",
      name: "profile",
      component: () => import("../views/ProfileView.vue"),
    },
    {
      path: "/terms",
      name: "terms",
      component: () => import("../views/TermsView.vue"),
    },
    {
      path: "/bookmarks",
      name: "Bookmarks",
      component: HomeView,
    },
  ],
});

export default router;
