import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import Vuetify from 'vuetify'
import store from './store'

import defaultLayout from './layout/defaultLayout.vue'
import MainPage from './view/main'
import Login from './view/login.vue'
import Join from './view/join.vue'
import Find from './view/find.vue'

import Trip from './view/trip.vue';
import Festival from './view/festival.vue';

import qna from './view/qna.vue'
import qnaWrite from './view/qnaWrite.vue'
import qnaContent from './view/qnaContent'

import SearchPage from './view/search.vue'

import fsDetail from './view/fsdetail.vue'
import tvDetail from './view/tvdetail.vue'
import All from './view/all.vue'

import Test  from './admin/test.vue'
import Qna from './admin/qna.vue'
import QnaAns from './admin/qnaAns.vue'
import QnaContent from './admin/qnaContent.vue'
import UserInfo  from './admin/userinfo.vue'
import AdminTrip  from './admin/admintrip.vue'
import WriteTrip  from './admin/writetrip.vue'
import Board  from './admin/board.vue'
import BoardPage from './view/board.vue'
import WritePage from './view/write.vue'
import BoardDetail from './view/boardDetail.vue'


import AdminLayout from './layout/adminLayout.vue'

import MyPageLayout from './layout/mypageLayout'
import MyPage from './mypage/mypage.vue'
import myLike from './mypage/mylikepage.vue'
import myQna from './mypage/myQna.vue'
import myReview from './mypage/myReview.vue'
import Contentpage from './mypage/contentpage.vue'
import MyPageUpdate from './mypage/mypageupdate.vue'
import Pass from './mypage/passwd.vue'

import Chart from './view/chart.vue' //내가만든 차트

const routes = [
    {
        path: '/',
        component: defaultLayout,
        children: [
            {
                path: '/',
                component: MainPage,
            },
        {
            path: '/login',
            component: Login,
        }
        ,
        {
            path: '/join',
            component: Join,
        },
        {
            path: '/find',
            component: Find,
        },
        {
            path:'/trip/:name/:id',
            component: Trip
        },
        {
            path:'/festival/:name/:id',
            component: Festival
        },
        {
            path: '/qna',
            component: qna,
        },
        {
            path: '/qnawrite',
            component: qnaWrite,
        },
        {
            path: '/qna/qnacontent',
            component:qnaContent,
        },
        {
            path: '/search',
            name: 'search',
            component: SearchPage,
        },
        {
            path: '/fsdetail/:trip_no',
            component: fsDetail,
        },
        {
            path: '/tvdetail/:trip_no',
            component: tvDetail,
        },
        {
            path: '/all',
            component: All,
        },
        {
            path: '/chart',
            component: Chart,
        },
        {
            path: '/board',
            component: BoardPage,
        },
        {
            path: '/board/boardwrite',
            component: WritePage,
        },
        {
            path:'/board/boardDetail',
            component: BoardDetail,
        },
       
        
    ]},
    {
        path: '/admin/',
        component: AdminLayout,
        children: [
            {
                path:'qna',
                component: Qna,
            },
            {
                path:'qna/qnacontent/write',
                component:QnaAns
            },
            {
                path:'qna/qnacontent',
                component:QnaContent
            },
            {
                path:'user',
                component:UserInfo
            },
            {
                path:'admintrip',
                component:AdminTrip
            },
            {
                path:'writetrip',
                component:WriteTrip
            },
            {
                path:'test',
                component:Test
            },  
            {
                path:'board',
                component:Board
            },
        ]
    },
    {
    
        path: '/mypage/',
        name: 'mypagelayout',
        component: MyPageLayout,
        children: [
            {
                path: '',
                component: MyPage,
            },
            {
                path: 'qnapage',
                component: myQna,
            },
            {
                path: 'reviewpage',
                component: myReview,
            },
            {
                path: 'likepage',
                component: myLike,
            },
            {
                path: 'contentpage',
                component: Contentpage,
            },
            {
                path: 'update',
                component: MyPageUpdate,
            },
            {
                path: 'passwd',
                component: Pass,
            }
        ]}
]


window.Kakao.init('79eb0be4a08b223b4a5553fe99835470');

const router = createRouter({
    history: createWebHistory(),
    routes
});

const app = createApp(App)
app.use(router);
app.use(store);
app.use(VueSweetalert2);
app.use(Vuetify);
app.mount('#app')