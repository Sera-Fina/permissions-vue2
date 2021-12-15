import Vue from 'vue';
import VueRouter from 'vue-router';
import RolesGroups from '../views/RolesGroups/RolesGroups';
import Roles from '../views/Roles/Roles';
import NotFound from '../views/NotFound';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'main',
    redirect: '/roles-groups',
  },
  {
    path: '/roles-groups',
    name: 'Roles groups',
    component: RolesGroups,
  },
  {
    path: '/roles',
    name: 'Roles',
    component: Roles,
  },
  {
    path: '*',
    component: NotFound,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
