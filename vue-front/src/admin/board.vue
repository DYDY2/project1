<template>
    <div>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
      <h1>글 목록</h1>
      <table class="tbList">
        <colgroup>
          <col width="5%" />
          <col width="20%" />
          <col width="20%" />
          <col width="15%" />
          <col width="10%" />
          <col width="*" />
          <col width="10%" />
          <col width="10%" />
        </colgroup>
        <thead>
          <tr>
            <th>no</th>
            <th>메인 이미지</th>
            <th>제목</th>
            <th>작성일</th>
            <th>작성자</th>
            <th>내용</th>
            <th>조회수</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in contentlist" :key="item.board_no">
            <td>{{ item.board_no }}</td>
            <td>
              <img v-if="!item.board_img" src="../assets/img_notReady.png" alt="..." width="50%">
              <img v-else :src="require(`../../../node-back/uploads/uploadBoard/${item.board_img}`)" alt="..." width="50%">
            </td>
            <td>{{ item.board_tit }}</td>
            <td>{{ item.board_day.split('T')[0] }}</td>
            <td>{{ item.user_nick }}</td>
            <td>{{ item.board_content }}</td>
            <td>{{ item.board_view }}</td>
            <td><button class="del_btn" @click="confirmDeleteContent(item.board_no)">삭제</button></td>
          </tr>
        </tbody>
      </table>
      <div class="btn-cover">
        <button @click="movetopreviouspage" class="page-btn" :disabled="page === 1">이전</button>
        <span class="page-count">{{ page }}/{{ totalpage }} 페이지</span>
        <button @click="movetonextpage" class="page-btn" :disabled="page >= totalpage">다음</button>
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
      this.getBoard();
    },
    methods: {
      getBoard() {
        axios({
          url: "http://localhost:3000/admin/board_list",
          method: "POST",
          data: {
            userno: this.user.user_no,
            page: this.page,
            limit: this.limit,
          },
        })
          .then(res => {
            this.contentlist = res.data;
            this.contentlist.sort((a, b) => b.board_no - a.board_no);
          })
          .catch(err => {
            alert(err);
          });
        axios({
          url: "http://localhost:3000/admin/board_count",
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
      confirmDeleteContent(board_no) {
this.$swal({
    title: `${board_no}번 게시글을 삭제하시겠습니까?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: '삭제',
    cancelButtonText: '취소',
    reverseButtons: true
}).then(result => {
    if (result.value) {
        this.deleteContent(board_no);
        this.$router.go(0);
    }
});
},
deleteContent(board_no) {
axios({
    url: "http://localhost:3000/admin/boarddelete",
    method: "POST",
    data: {
        boardno: board_no
    },
}).then(res => {
    this.content = res.data;
    console.log(res.data)

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
        this.getBoard();
      },
      login() {
        this.$swal({
          title: '로그인 하신 후에 작성하실 수 있습니다.',
          showConfirmButton: true,
        }).then(() => {
          window.location.href = "http://localhost:8080/login";
        });
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
    
    
    }
    
    table {
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
    .del_btn{
    height: 23px;
  width: 50px;
  border: none;
  background-color: #aeaeae;
  font-family: 'GmarketSansMedium';
  font-size: 14px;
 
  
}
button.del_btn:hover {
  cursor: pointer;
  background-color:rgb(161, 161, 161);

}
    </style>