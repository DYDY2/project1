<template>
    <div class="container">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
        <div class="icon-bar menu">
            <router-link class="m" to="/mypage">
                <i class="bi bi-person-square"></i>
                <p>내 정보</p>
            </router-link>

            <router-link class="m" to="/mypage/likepage">
                <i class="bi bi-hand-thumbs-up"></i>
                <p >좋아요 목록</p>
            </router-link>

            <router-link class="m" to="/mypage/contentpage">
                <i class="bi bi-list-task"></i>
                <p>글 목록</p>
            </router-link>

            <router-link class="m" to="/mypage/reviewpage">
                <i class="bi bi-chat-right-text"></i>
                <p>리뷰 목록</p>
            </router-link>

            <router-link class="m" to="/mypage/qnapage">
                <i class="bi bi-question-square"></i>
                <p>문의내역</p>
            </router-link>
        </div>
    </div>
    
</template>

<script>
export default {
    method: {
        
    }
}
</script>
<style>
@font-face {
    font-family: 'GmarketSansMedium';
    font-family: 'GmarketSansLight';
    src : url('https://cdn.jsdelivr.net/gh/projectnoonu/noonfonts_2001@1.1/GmarketSansMedium.woff') format('woff');
    src : url('https://cdn.jsdelivr.net/gh/projectnoonu/noonfonts_2001@1.1/GmarketSansLight.woff') format('woff');
    font-weight: normal;
    font-style: normal;
}

.menu {
    background-color: #FFDC9F;
    height: 100%;
    position: fixed;
    width: 120px;
    left: 0;
    overflow-x: hidden;
    overflow-y: scroll;
    top: 150px;
}

.menu .m , .icon-bar p{
    color: #DDC9BC;
}

.menu::-webkit-scrollbar {
    display: none;
}

.menu a {
    display: block;
    text-align: center;
    height: 60px;
    padding-top: 18px;
    padding-bottom: 18px;
    transition: all 0.3s ease;
    text-decoration: none;
    top: 100px;
}

.menu p {
    margin: auto;
    font-size: 14px;
    color: #000000;
    padding-top: 4px;
    top: 100px;
}

.menu .m:hover {
    background-color: #8E7C68;
}

.active {
    background-color: #ffffff;
}

.bi {
    color: black;
}
/* .m {
    justify-content: center;
    text-align: center;
    color: #000000;
    font-size:  13px;
    padding-right: 7px;
    padding-top: 30px;
    margin-right: 1px;
    box-shadow: 0px 1px 3px 0;
    position: relative;
    width: 100%;
    top: 150px;
    
} */

</style>