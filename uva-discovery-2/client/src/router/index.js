import Vue from 'vue';
import VueRouter from 'vue-router';

import UsersList from '../views/UsersList.vue';
import Calendar from '../views/Calendar.vue';
import PrinterList from '../views/PrinterList.vue';
import ReservationList from '../views/ReservationList.vue';
import Configuration from '../views/Configuration.vue';

Vue.use(VueRouter);

const routes = [
  { path: '/users', component: UsersList },
  { path: '/list', component: PrinterList },
  { path: '/calendar', component: Calendar },
  { path: '/config', component: Configuration },
  { path: '/reservations', component: ReservationList },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  const publicPages = ['/login'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem('user');

  if (authRequired && !loggedIn) return next('/login');

  next();
});

export default router;
