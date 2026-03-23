import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import CartView from '../views/CartView.vue'
import NotFoundView from '../views/NotFoundView.vue'

import ProductView from '../views/goods/ProductView.vue'
import ProductTabOverviewView from '../views/goods/ProductTabOverviewView.vue'
import ProductTabDetailsView from '../views/goods/ProductTabDetailsView.vue'
import ProductTabSellerView from '../views/goods/ProductTabSellerView.vue'

import AdminDashboardView from '../views/admin/DashboardView.vue'
import AdminGoodsListView from '../views/admin/AdminGoodsListView.vue'
import AdminGoodsAddView from '../views/admin/AdminGoodsAddView.vue'
import AdminGoodsEditView from '../views/admin/AdminGoodsEditView.vue'

import { useAuthStore } from '../stores/auth.js'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/cart',
      name: 'cart',
      component: CartView
    },
    {
      path: '/goods/:id',
      component: ProductView,
      children: [
        { path: '', redirect: 'overview' },
        { path: 'overview', name: 'goods.overview', component: ProductTabOverviewView },
        { path: 'details', name: 'goods.details', component: ProductTabDetailsView },
        { path: 'seller', name: 'goods.seller', component: ProductTabSellerView }
      ]
    },
    {
      path: '/admin',
      component: AdminDashboardView,
      meta: { requiresAdmin: true },
      children: [
        { path: '', redirect: 'goods' },
        {
          path: 'goods',
          name: 'admin.goods',
          component: AdminGoodsListView,
          meta: { requiresAdmin: true }
        },
        {
          path: 'goods/add',
          name: 'admin.goods.add',
          component: AdminGoodsAddView,
          meta: { requiresAdmin: true }
        },
        {
          path: 'goods/edit/:id',
          name: 'admin.goods.edit',
          component: AdminGoodsEditView,
          meta: { requiresAdmin: true }
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundView
    }
  ]
})

router.beforeEach((to, from, next) => {
  const requiresAdmin = to.matched.some((record) => record.meta?.requiresAdmin)
  const auth = useAuthStore()

  if (requiresAdmin && !auth.isAdmin) {
    return next({ name: 'login', query: { next: to.fullPath } })
  }

  // Если админ уже залогинен — лишний раз не показываем login/register.
  const authPage = to.name === 'login' || to.name === 'register'
  if (authPage && auth.isAdmin) {
    return next({ name: 'home' })
  }

  next()
})

export default router


