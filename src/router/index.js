import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import MyPostsView from "@/views/MyPostsView.vue";
import BookmarkView from "@/views/BookmarkView.vue";
import ContactView from "../views/ContactView.vue";

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
      path: "/register",
      name: "register",
      component: () => import("../views/RegisterView.vue"),
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/LoginView.vue"),
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
      path: "/posts/:id",
      name: "post",
      component: () => import("../views/PostView.vue"),
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
      path: "/custom-feed",
      name: "customfeed",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/CustomFeedView.vue"),
    },
    {
      path: "/bookmarks",
      name: "bookmarks",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/BookmarkView.vue"),
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
  ],
});

export default router;
