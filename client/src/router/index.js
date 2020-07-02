import Vue from 'vue';
import VueRouter from 'vue-router';

import UsersList from '../views/UsersList.vue';
import Login from '../views/Login.vue';
import Calendar from '../views/Calendar.vue';
import Location from '../views/Location.vue';
import PrinterList from '../views/PrinterList.vue';
import ReservationList from '../views/ReservationList.vue';
import Configuration from '../views/Configuration.vue';

Vue.use(VueRouter);

const routes = [
  { path: '/login', component: Login },
  { path: '/users', component: UsersList },
  { path: '/list', component: PrinterList },
  { path: '/location', component: Location },
  { path: '/calendar', component: Calendar },
  { path: '/config', component: Configuration },
  { path: '/reservations', component: ReservationList },
  { path: '*', redirect: '/list' },
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
