<!--
<template>
  <body>
    <div class="header_wrapper">
      <nav class="navbar_top" aria-label="">
        <div class="navbar_logo title" @click="goToHome()">
          <img src="../assets/logo.png" alt="로고">
        </div>

        <div class="navbar_search">
          <input v-model="keyword" type="text" placeholder="여행지 또는 축제명을 입력하세요!" @keyup.enter="searchKeyword(keyword)">
          <button class="searchbtn" type="submit" @click="searchKeyword(keyword)"><img src="../assets/search.png"
              alt="search"></button>
        </div>

        <ul class="navbar_icons">
          <li class="myPage" @click="goToMypage()">마이페이지</li>
            <transition-group name="fade" mode="out-in">
            </transition-group>
          <li class="qna" @click="goToQna()">고객센터</li>
        </ul>

        <ul v-if="user.user_id == ''" class="join">
          <li @click="goToLogin">로그인</li>
          <li @click="goToJoin">회원가입</li>
        </ul>

        <ul v-else-if="adminCk == 1" class="join">
          <li @click="goToAdmin">관리 페이지</li>
          <li @click="logout">로그아웃</li>
        </ul>

        <ul v-else class="join">
          <li @click="logout">로그아웃</li>
        </ul>

      </nav>

      <nav class="navbar_bottom" aria-label="">
        <ul class="category">
           <li @click="goToTrip()">여행지</li>
            <li @click="goToFes()">축제</li>
            <li @click="goToBoard()">자유게시판</li>
            <li @click="goToList()">전체목록</li>
        </ul>

      </nav>
    </div>
  </body>
</template>
  
 <script>
import axios from 'axios';

export default {
  data() {
    return {
      adminCk: 0,
      keyword: this.$route.query.keyword,
    }
  },
  computed: {
    user() {
      return this.$store.state.user;
      
      
    }
    
  },  
  
  mounted() {
    
    if (this.user.user_id == '') {
      // 일단은 로그인 여부 체크 
      
    }
    else {
      axios({
        url: "http://localhost:3000/auth/admin_ck",
        method: "POST",
        data: {
          user_no: this.user.user_no,
        },
      })
        .then(res => {
          if (res.data.message == 'admin') {
            this.adminCk = 1;
          }
        })
        .catch(() => {
          this.$swal("접속 오류");
        })
    }
  },

watch: {
    'user.user_id'(newVal) {
      if (newVal) {
        axios({
          url: "http://localhost:3000/auth/admin_ck",
          method: "POST",
          data: {
            user_no: this.user.user_no,
          },
        })
          .then(res => {
            if (res.data.message == 'admin') {
              this.adminCk = 1;
            }
          })
          .catch(() => {
            this.$swal("접속 오류");
          });
      }
    }
  },
  
  methods: {

     goToTrip() {
            window.location.href = `http://localhost:8080/trip/서울특별시/1`;
        },
        goToFes() {
            window.location.href = `http://localhost:8080/festival/서울특별시/1`;
        },
    searchKeyword(keyword) {
      if (this.keyword) {
        window.location.href = 'http://localhost:8080/search?keyword=' + keyword;
      }
    },
   
    goToQna() {
      window.location.href = `http://localhost:8080/qna?page=1`;
    },
    goToList(){
       this.$router.push({ path: '/all' });
    },
  
    
    goToLogin() {
      this.$router.push({ path: '/login' });
    },
     goToJoin() {
       this.$router.push({ path: '/join' });
     },
    goToAdmin() {
       window.location.href = `http://localhost:8080/admin/user`;
    },
    goToMypage() {
      this.$router.push({ path: '/mypage' });
    },
    
    logout() {
      this.$store.commit("user", {});
      this.$swal({
        position: 'top',
        icon: 'success',
        title: '로그아웃되셨습니다.',
        showConfirmButton: false,
        timer: 1000
      })
        .then(() => {
          window.location.href = "http://localhost:8080";
        })
    },
    goToHome() {
      window.location.href = "http://localhost:8080";
    }
  }
}

 </script>
  
<style scoped>
.title {
  cursor: pointer;
}

* {
  margin: 0;
  padding: 0;
}

ul,
li {
  list-style: none;
}

a {
  text-decoration: none;
}

@font-face {
  font-family: 'GmarketSansMedium';
  src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2001@1.1/GmarketSansMedium.woff') format('woff');
  font-weight: normal;
  font-style: normal;
}

.header_wrapper {
  font-family: 'GmarketSansMedium';
  font-size: 15px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 20;
  width: 100%;
  background: #ffffff;
  box-shadow: 0 4px 5px -4px rgb(219, 219, 219);
}

.navbar_top {
  display: flex;
  height: 90px;
  justify-content: space-between;
  align-items: center;
  padding: 0;
  --bs-navbar-padding-x: 0;
}

/* ------------------------------------------------------ logo */
.navbar_logo {
  scale: 50%;
  position: relative;
  left: -120px;
  top: 31px;
  padding: 0 0 0 16px;
}

/* ------------------------------------------------------ search */
.navbar_search {
  display: flex;
  width: 30rem;
  max-width: 100%;
  border-radius: 200px;
  outline: rgb(134, 134, 134) solid 2px;
  background-color: rgb(251, 251, 251);
  position: relative;
  right: 6%;
  padding-left: 20px;
}

input[type='text'] {
  width: 100%;
  font-size: 1rem;
  outline: none;
  background-color: rgb(251, 251, 251);
  font-family: 'GmarketSansMedium';
  border: none;
  margin-right: 8px;
}

input[type='text']:focus {
  caret-color: rgb(0, 0, 0);
}

input::placeholder {
  color: #aaa;
}

.searchbtn {
  display: flex;
  border: 0;
  height: 38px;
  width: 50px;
  position: relative;
  background: none;
  cursor: pointer;
}

.searchbtn img {
  position: relative;
  top: -3px;
  scale: 70%;
}

/* --------------------------------- icon */
.navbar_icons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  scale: 80%;
  position: relative;
}

.myPage {
  cursor: pointer;
  margin-top: 16px;
  scale: 130%;
  margin-left: 16px;
}


.qna {
  font-size: 20px;
  cursor: pointer;
  scale: 95%;
  margin-left: 46px;
  margin-top: 15px;
}

.myPage:hover {
  filter: opacity(0.2) drop-shadow(0 0 0 #df7a00);
}

.cart:hover {
  filter: opacity(0.2) drop-shadow(0 0 0 #df7a00);
}

.qna:hover {
  filter: opacity(0.2) drop-shadow(0 0 0 #df7a00);
}

/* ----------------------------navbar_bottom */
.navbar_bottom {
  justify-content: space-between;
  align-items: center;
  display: flex;
  height: 60px;
  font-family: 'GmarketSansMedium';
}

.category {
  display: flex;
  position: relative;
  margin: auto;
}


.category li {
  font-size: 1rem;
  display: inline-block;
  margin-left: 30PX;
  width: 8rem;
  height: 30px;
  margin-top: 16px;
  text-align: center;
}

.category li:nth-last-child(4) {
  margin-left: 0px;
}

.category li:hover {
  cursor: pointer;
}

.category li:after {
  display: block;
  width: 4rem;
  content: '';
  border-bottom: solid 2px #fff;
  transform: scaleX(0);
  transition: transform 250ms ease-in-out;
  border: 1.5px solid #FFAF7D;
  margin: auto;
  margin-top: 6PX;
  border-radius: 30PX;
}

.category li:hover:after {
  transform: scaleX(1);
}


/* 관리, 로그아웃 */
.join {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.join li {
  margin-left: 30px;
  width: 120px;
  height: 6px;
  line-height: 0px;
  text-align: center;
  padding: 8px 0;
  margin-top: 14px;
}

.join li:nth-child(1) {
  margin-left: 0px;
}

.join li:hover {
  color: #ee8700;
  cursor: pointer;
}

/* --------------------------------------------------------------------------------------------------------------- */


@media screen and (max-width: 768px) {

  * {
    padding: 0;
    margin: 0;
  }

  /* --------- logo */

  .header_wrapper {
    min-height: 150px;
  }

  .navbar_top {
    display: flex;
    justify-content: space-between;
    padding: 0;
    --bs-navbar-padding-x: 0;
  }

  .navbar_logo {
    scale: 70%;
    position: relative;
  }

  .navbar_search {
    display: none;
  }

  .navbar_icons {
    scale: 70%;
  }

  .navbar_bottom {
    display: flex;
    margin-left: auto;
    justify-content: space-between;
  }

  .navbar_bottom .join {
    display: none;
  }
}</style>
-->
<template>
  <body>
    <div class="header_wrapper">
      <nav class="navbar_top" aria-label="">
        <div class="navbar_logo title" @click="goToHome()">
          <img src="../assets/logo.png" alt="로고">
        </div>

        <div class="navbar_search">
          <input v-model="keyword" type="text" placeholder="여행지 또는 축제명을 입력하세요!" @keyup.enter="searchKeyword(keyword)">
          <button class="searchbtn" type="submit" @click="searchKeyword(keyword)"><img src="../assets/search.png"
              alt="search"></button>
        </div>

        <ul class="navbar_icons">
          <li class="myPage" @click="goToMypage()">마이페이지</li>
            <transition-group name="fade" mode="out-in">
            </transition-group>
          <li class="qna" @click="goToQna()">고객센터</li>
        </ul>

        <ul v-if="this.user.user_id === ''&&this.user.user_no === ''" class="join">
          <li @click="goToLogin">로그인</li>
          <li @click="goToJoin">회원가입</li>
        </ul>

        <ul v-else-if="adminCk === 1" class="join">
          <li @click="goToAdmin">관리 페이지</li>
          <li @click="logout">로그아웃</li>
        </ul>

        <ul v-else-if="adminCk === 0" class="join">
          <li @click="logout">로그아웃</li>
        </ul>

      </nav>

      <nav class="navbar_bottom" aria-label="">
        <ul class="category">
           <li @click="goToTrip()">여행지</li>
            <li @click="goToFes()">축제</li>
            <li @click="goToBoard()">자유게시판</li>
            <li @click="goToList()">전체목록</li>
        </ul>

      </nav>
    </div>
  </body>
</template>
  
 <script>
import axios from 'axios';

export default {
  data() {
    return {
      adminCk: 0,
      keyword: this.$route.query.keyword,
      
    }
  },
  computed: {
    user() {
      return this.$store.state.user;
      
      
    }
    
  },
  created() {
  },
  
  mounted() {
    if (this.user.user_id == '') {
      // 일단은 로그인 여부 체크 
    }
    else {
      axios({
        url: "http://localhost:3000/auth/admin_ck",
        method: "POST",
        data: {
          user_no: this.user.user_no,
        },
      })
        .then(res => {
          if (res.data.message == 'admin') {
            this.adminCk = 1;
          }
        })
        .catch(() => {
          this.$swal("접속 오류");
        })
    }
  },

watch: {
    'user.user_id'(newVal) {
      if (newVal) {
        axios({
          url: "http://localhost:3000/auth/admin_ck",
          method: "POST",
          data: {
            user_no: this.user.user_no,
          },
        })
          .then(res => {
            if (res.data.message == 'admin') {
              this.adminCk = 1;
            }
          })
          .catch(() => {
            this.$swal("접속 오류");
          });
      }
    }
  },
  
  methods: {

     goToTrip() {
            window.location.href = `http://localhost:8080/trip/서울특별시/1`;
        },
        goToFes() {
            window.location.href = `http://localhost:8080/festival/서울특별시/1`;
        },
    searchKeyword(keyword) {
      if (this.keyword) {
        window.location.href = 'http://localhost:8080/search?keyword=' + keyword;
      }
    },
   
    goToQna() {
      window.location.href = `http://localhost:8080/qna?page=1`;
    },
    goToList(){
       this.$router.push({ path: '/all' });
    },
     goToBoard() {
      this.$router.push({ path: '/board' });
    },
  
    
    goToLogin() {
      this.$router.push({ path: '/login' });
    },
     goToJoin() {
       this.$router.push({ path: '/join' });
     },
    goToAdmin() {
       window.location.href = `http://localhost:8080/admin/user`;
    },
    goToMypage() {
      if(this.user.user_no) {

        this.$router.push({ path: '/mypage' });

      } else {
        this.$swal({
          title: '접근 실패.',
          text:'로그인이 필요한 작업입니다.',
          icon: 'error',
          showConfirmButton:'확인',
          timer: 1500
        });
        this.$router.push({ path: '/login'})
      }
    },
    
    logout() {
      this.$store.commit("user", {});
      this.$swal({
        position: 'top',
        icon: 'success',
        title: '로그아웃되셨습니다.',
        showConfirmButton: false,
        timer: 1000
      })
        .then(() => {

            window.location.href = "http://localhost:8080";

        });
    },

    goToHome() {
      window.location.href = "http://localhost:8080";
    },
  }
}

 </script>
  
<style scoped>
.title {
  cursor: pointer;
}

* {
  margin: 0;
  padding: 0;
}

ul,
li {
  list-style: none;
}

a {
  text-decoration: none;
}

@font-face {
  font-family: 'GmarketSansMedium';
  src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2001@1.1/GmarketSansMedium.woff') format('woff');
  font-weight: normal;
  font-style: normal;
}

.header_wrapper {
  font-family: 'GmarketSansMedium';
  font-size: 15px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 20;
  width: 100%;
  background: #ffffff;
  box-shadow: 0 4px 5px -4px rgb(219, 219, 219);
}

.navbar_top {
  display: flex;
  height: 90px;
  justify-content: space-between;
  align-items: center;
  padding: 0;
  --bs-navbar-padding-x: 0;
}

/* ------------------------------------------------------ logo */
.navbar_logo {
  scale: 50%;
  position: relative;
  left: -120px;
  top: 31px;
  padding: 0 0 0 16px;
}

/* ------------------------------------------------------ search */
.navbar_search {
  display: flex;
  width: 30rem;
  max-width: 100%;
  border-radius: 200px;
  outline: rgb(134, 134, 134) solid 2px;
  background-color: rgb(251, 251, 251);
  position: relative;
  right: 6%;
  padding-left: 20px;
}

input[type='text'] {
  width: 100%;
  font-size: 1rem;
  outline: none;
  background-color: rgb(251, 251, 251);
  font-family: 'GmarketSansMedium';
  border: none;
  margin-right: 8px;
}

input[type='text']:focus {
  caret-color: rgb(0, 0, 0);
}

input::placeholder {
  color: #aaa;
}

.searchbtn {
  display: flex;
  border: 0;
  height: 38px;
  width: 50px;
  position: relative;
  background: none;
  cursor: pointer;
}

.searchbtn img {
  position: relative;
  top: -3px;
  scale: 70%;
}

/* --------------------------------- icon */
.navbar_icons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  scale: 80%;
  position: relative;
}

.myPage {
  cursor: pointer;
  margin-top: 16px;
  scale: 130%;
  margin-left: 16px;
}


.qna {
  font-size: 20px;
  cursor: pointer;
  scale: 95%;
  margin-left: 46px;
  margin-top: 15px;
}

.myPage:hover {
  filter: opacity(0.2) drop-shadow(0 0 0 #df7a00);
}

.cart:hover {
  filter: opacity(0.2) drop-shadow(0 0 0 #df7a00);
}

.qna:hover {
  filter: opacity(0.2) drop-shadow(0 0 0 #df7a00);
}

/* ----------------------------navbar_bottom */
.navbar_bottom {
  justify-content: space-between;
  align-items: center;
  display: flex;
  height: 60px;
  font-family: 'GmarketSansMedium';
}

.category {
  display: flex;
  position: relative;
  margin: auto;
}


.category li {
  font-size: 1rem;
  display: inline-block;
  margin-left: 30PX;
  width: 8rem;
  height: 30px;
  margin-top: 16px;
  text-align: center;
}

.category li:nth-last-child(4) {
  margin-left: 0px;
}

.category li:hover {
  cursor: pointer;
}

.category li:after {
  display: block;
  width: 4rem;
  content: '';
  border-bottom: solid 2px #fff;
  transform: scaleX(0);
  transition: transform 250ms ease-in-out;
  border: 1.5px solid #FFAF7D;
  margin: auto;
  margin-top: 6PX;
  border-radius: 30PX;
}

.category li:hover:after {
  transform: scaleX(1);
}


/* 관리, 로그아웃 */
.join {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.join li {
  margin-left: 30px;
  width: 120px;
  height: 6px;
  line-height: 0px;
  text-align: center;
  padding: 8px 0;
  margin-top: 14px;
}

.join li:nth-child(1) {
  margin-left: 0px;
}

.join li:hover {
  color: #ee8700;
  cursor: pointer;
}

/* --------------------------------------------------------------------------------------------------------------- */


@media screen and (max-width: 768px) {

  * {
    padding: 0;
    margin: 0;
  }

  /* --------- logo */

  .header_wrapper {
    min-height: 150px;
  }

  .navbar_top {
    display: flex;
    justify-content: space-between;
    padding: 0;
    --bs-navbar-padding-x: 0;
  }

  .navbar_logo {
    scale: 70%;
    position: relative;
  }

  .navbar_search {
    display: none;
  }

  .navbar_icons {
    scale: 70%;
  }

  .navbar_bottom {
    display: flex;
    margin-left: auto;
    justify-content: space-between;
  }

  .navbar_bottom .join {
    display: none;
  }
}</style>