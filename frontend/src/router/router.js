import Vue from 'vue'
import Router from 'vue-router'
import LoginPage from '@/components/LoginPage.vue'
import FeedPage from '@/components/FeedPage.vue'
import PostView from '@/components/PostView.vue'
import CreatePost from '@/components/CreatePost.vue'
import ProfilePage from '@/components/ProfilePage.vue'
// 1. Import the RegisterPage
import RegisterPage from '@/components/RegisterPage.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    { path: '/', name: 'Login', component: LoginPage },
    { path: '/feed', name: 'Feed', component: FeedPage },
    { path: '/post/:id', name: 'PostView', component: PostView },
    { path: '/create', name: 'CreatePost', component: CreatePost },
    { path: '/profile', name: 'Profile', component: ProfilePage },

    // 2. Add a register route
    { path: '/register', name: 'Register', component: RegisterPage }
  ]
})
