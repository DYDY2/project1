<template>
<div>
    <Header/>
        <div class="content">
            <MyPageSideBar></MyPageSideBar>
            <mypage-side-bar></mypage-side-bar>
            <topbar></topbar>
            <router-view></router-view>
        </div>
</div>
</template>

<script>
import MyPageSideBar from './mypagemenu.vue';
import Header from './header.vue';

export default {
    name: 'mypage',
    components: {
        MyPageSideBar, Header
    }
}
</script>

<style scoped>
.content {
    padding-left: 150px;
    margin: auto;
}

</style>