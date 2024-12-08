<template>
    <div>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
        <div class="icon-bar admin-bar">
            <i></i>
           <router-link to="/">
                <i class="fa fa-home"></i>
                <p>홈페이지</p>
            </router-link> 
            <router-link to="/admin/user">
                <i class="fa fa-user-circle"></i> 
                <p>회원 관리</p>
            </router-link> 
            <router-link to="/admin/admintrip">
                <i class="fa fa-shopping-bag"></i>
                <p>등록 관리</p>
            </router-link>
            <router-link to="/admin/board?page=1">
                <i class="fa fa-question"></i>
                <p>자유게시판 관리</p>
            </router-link>       
            <router-link to="/admin/qna?page=1">
                <i class="fa fa-question"></i>
                <p>고객센터 답변</p>
            </router-link>    
            <router-link to="/admin/test">
                <i class="fa fa-question"></i>
                <p>차트</p>
            </router-link>   
        </div>
    </div>
</template>

<style>

@font-face {
    font-family: 'ONE-Mobile-Regular';
    src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2105_2@1.0/ONE-Mobile-Regular.woff') format('woff');
    font-weight: normal;
    font-style: normal;
}

.admin-bar p {
    font-family: ONE-Mobile-Regular;
    margin: auto;
    font-size: 14px;
    color:black
}

.admin-bar {
    height: 100%;
    width: 100px;
    background-color: #ffaeae;
    position: fixed; 
    /*z-index: 1;*/ /* Stay on top */
    top: 0; /* Stay at the top */
    left: 0;
    overflow-x: hidden; /* Disable horizontal scroll */
  }

  .admin-bar a {
    display: block;
    text-align: center;
    padding-top: 18px;
    padding-bottom: 18px;
    transition: all 0.3s ease;
    color: white;
    text-decoration: none;
    font-size: 18px;
  }


  .admin-bar a:hover {
    background-color: #da9a9a;
  }

  .active {
    background-color: #5eaf13;
  }

</style>