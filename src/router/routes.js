const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/IndexPage.vue'),
        meta: {
          requireAuth: true
        }
      }
    ]
  },

  {
    path: '/auth',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      {
        name: 'auth',
        path: '',
        component: () => import('pages/AuthPage.vue'),
        meta: {
          requireAuth: false
        }
      }
    ]
  },

  {
    path: '/ticket/:id',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        name: 'ticket',
        path: '',
        component: () => import('pages/TicketPage.vue'),
        meta: {
          requireAuth: true
        }
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
