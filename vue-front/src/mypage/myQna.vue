<template>
  <div>
     <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css"
        rel="stylesheet"
        integrity="sha384-giJF6kkoqNQ00vy+HMDP7azOuL0xtbfIcaT9wjKHr8RbDVddVHyTfAAsrekwKmP1"
        crossorigin="anonymous"
      />
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
        rel="stylesheet"
      />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <h1>내 문의 내역</h1><br>
    <table class="tbList">
      <colgroup>
        <col width="6%" />
        <col width="8%" />
        <col width="*" />
        <col width="20%" />
        <col width="6%" />
      </colgroup>
      <thead>
        <tr>
          <th>no</th>
          <th>비밀글</th>
          <th>제목</th>
          <th>작성일</th>
          <th>답변여부</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in contentlist" :key="item.qna_no"
          @click="item.qna_secret === 0 ? movetocontent(item.qna_no) : movetoSecret(item)">
          <td>{{ item.qna_no }}</td>
          <td><i v-if="item.qna_secret == 1" class="fa fa-lock"></i></td>
          <td>{{ item.qna_tit }}</td>
          <td>{{ item.qna_day.split('T')[0] }}</td>
          <td v-if="item.qna_ans != null">답변 완료</td>
          <td v-else></td>
        </tr>
      </tbody>
    </table>
    <div class="btn-cover">
      <button @click="movetopreviouspage" class="page-btn">이전</button>
      <span class="page-count">{{ page }}/{{ totalpage }} 페이지</span>
      <button @click="movetonextpage" class="page-btn">다음</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      contentlist: [],
      page: 1,
      limit: 10,
      cnt: 0,
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    totalpage() {
      return Math.ceil(this.cnt / this.limit) || 1;
    }
  },
  mounted() {
    this.page = parseInt(this.$route.query.page) || 1;
    this.getQnA();
  },
  methods: {
    getQnA() {
      axios({
        url: "http://localhost:3000/mypage/myqna_list",
        method: "POST",
        data: {
          userno: this.user.user_no,
          page: this.page,
          limit: this.limit,
        },
      }).then(res => {
        this.contentlist = res.data;
      }).catch(err => {
        alert(err);
      });

      axios({
        url: "http://localhost:3000/mypage/qna_count",
        method: "POST",
        data: {
          userno: this.user.user_no,
        },
      }).then(res => {
        this.cnt = res.data;
      }).catch(err => {
        alert(err);
      });
    },
    movetopreviouspage() {
      if (this.page === 1) {
        this.$swal('첫번째 페이지입니다!');
      } else {
        this.page--;
        this.updateUrl();
      }
    },
    movetonextpage() {
      if (this.page >= this.totalpage) {
        this.$swal('마지막 페이지입니다!');
      } else {
        this.page++;
        this.updateUrl();
      }
    },
    updateUrl() {
      this.$router.push({ query: { page: this.page } });
      this.getQnA();
    },
    movetocontent(QNA_NO) {
      window.location.href = "http://localhost:8080/qna" + '/qnacontent?qna_no=' + QNA_NO;
    },
    movetoSecret(item) {
      if (this.user.user_ty == 1 || item.user_no == this.user.user_no) {
        window.location.href = window.location.pathname + '/qnacontent?qna_no=' + item.qna_no;
      } else {
        this.$swal("비밀글입니다");
      }
    },
  },
};
</script>
  
  <style scoped>
  @font-face {
    font-family: 'GmarketSansMedium';
    src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2001@1.1/GmarketSansMedium.woff') format('woff');
    font-weight: normal;
    font-style: normal;
  }
  
  p {
    height: 10px;
  }
  
  div {
    font-family: 'GmarketSansMedium';
    text-align: center;
     margin-top: 50px;
  
  
  }
  
  table {
    cursor: pointer;
    margin: auto;
    width: 80%;
  
  
  }
  
  .tbList th {
   
    border-top: 1px solid #888;
    
  
  }
  
  .tbList th,
  .tbList td {
    border-bottom: 1px solid #eee;
    padding: 5px 0;
  }
  
  .tbList td.txt_left {
    text-align: left;
  }
  
  
  td {
    text-align: center;
  }
  
  thead {
    background-color: #e2e1e0
  }
  
  
  
  .btn {
    display: block;
    height: 70px;
    position: relative;
    top: 10px;
    left: 85.5%;
    width: 50px;
  
  }
  
  .btn-cover {
    margin-bottom: 50px;
    position: relative;
  
  }
  
  .page-count {
    padding: 0 15px 0 20px;
    /* 위 오 아래 왼 간격 조절 */
  
  }
  
  .write_btn {
    height: 28px;
    width: 70px;
    border: none;
    border-radius: 4px;
    background-color: rgb(220, 220, 220);
    font-family: 'GmarketSansMedium';
    font-size: 14px;
    box-shadow: 0px 1px 9px 1px rgb(234, 234, 234);
  
  }
  
  button.write_btn:hover {
    cursor: pointer;
    background-color: rgb(161, 161, 161);
  }
  
  .page-btn {
    height: 25px;
    width: 50px;
    border: none;
  
    background-color: #dfdede;
    font-family: 'GmarketSansMedium';
    font-size: 14px;
    box-shadow: 0px 1px 10px 0.1px rgb(240, 240, 240);
  
  }
  </style>