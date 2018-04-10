import Vue from "vue";
import localEvent from "store";
import VueRouter from "vue-router";

import routes from "./routes";

Vue.use(VueRouter);

const router = new VueRouter({
  routes,
  // base: process.env.BASE_URL,
  base: "/",
  mode: "hash",
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        selector: to.hash
      };
    }
    if (savedPosition) {
      return savedPosition;
    } else {
      const { meta: { keepAlive = false, toTop = false } } = from;
      if (keepAlive && !toTop) {
        from.meta.savedPosition =
          document.body.scrollTop || document.documentElement.scrollTop;
      }
      return { x: 0, y: to.meta.savedPosition || 0 };
    }
  }
});

/**
 * 路由守卫 登录检测 islogin
 *
 * 需要登录的页面路由需要添加
 * 登录后不可访问的路由需要添加
 * meta.forGuest = true
 *
 */
router.beforeEach((to, from, next) => {
  const logged = !!(localEvent.get("CURRENTUSER") || {}).token;
  const forGuest = to.matched.some(record => record.meta.forGuest);
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (logged) {
    forGuest ? next({ path: "/feed/new" }) : next();
  } else {
    forGuest
      ? next()
      : requiresAuth
        ? next({ path: "/signin", query: { redirect: to.fullPath } })
        : next();
  }
});

export default router;
