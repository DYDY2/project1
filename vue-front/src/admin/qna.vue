<template>
    <div>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
        <h1>고객센터 관리</h1>
  
  
        <table class="tbList">
      <colgroup>
        <col width="6%" />
        <col width="*" />
        <col width="10%" />
        <col width="15%" />
        <col width="8%" />
        <col width="6%" />
      </colgroup>
      <thead>
        <tr>
          <th>no</th>
          <th>제목</th>
          <th>작성자</th>
          <th>작성일</th>
          <th>답변여부</th>
          <th></th>
          
        </tr>
      </thead>
            <tbody> <!--가져온 정보의 게시글 번호-->
  
                <tr v-for="item in contentlist" :key="item.qna_no">
                    <td>{{ item.qna_no }}</td> <!-- 글번호 -->
                    <td @click="movetocontent(item.qna_no)">{{ item.qna_tit }}</td>
  
                    <td>{{ item.user_nick }}</td><!-- 닉네임 -->
                    <td>{{ item.qna_day.split('T')[0] }}</td>
                    <td v-if="item.qna_ans != null">답변 완료</td>
                    <td v-else></td>
                    <td><button class="del_btn" @click="confirmDeleteContent(item.qna_no)">삭제</button></td>
                </tr>
  
            </tbody>
  
        </table>
  

          <!--페이징-->
        
        <div class="btn-cover">
        <button @click="movetopreviouspage" class="page-btn">이전</button>
        <span class="page-count">{{$route.query.page}}/{{totalpage}} 페이지</span>
        <button @click="movetonextpage" class="page-btn">다음</button>
        </div>
    </div>
  </template>
  
<script>
import axios from 'axios';

export default {
    data() {

        return {
            contentlist: [], //현재 게시판과 페이지에 맞는 글 리스트
            pageSize: 10,
            cnt: 0,
        }
    },
    computed: {
        user() {
            return this.$store.state.user;
        },
        totalpage() {
            if (this.cnt == 0) {   // 현재 게시판 글 갯수가 0개일때 총 페이지가 0이 되는거 방지
                return 1;
            } else {
                return Math.ceil(this.cnt / 10);    // (글 갯수/10)한 후 올림 연산을 통해 총 페이지 계산
            }
        }
    },
    mounted() {  
        axios({   
            url: "http://localhost:3000/admin/qna_list",
            method: "POST",
            data: {
                page: this.$route.query.page,
                pagesize: this.pageSize
            },
        }).then(res => {
            this.contentlist = res.data;
            this.contentlist.sort(function (a, b) {
                return b.qna_no - a.qna_no;
            });
        }).catch(err => {
            alert(err);
        });
        //글개수 가져오기
        axios({
            url: "http://localhost:3000/admin/boardlistcnt",
            method: "POST",
            data: {

            },
        }).then(res => {
            this.cnt = res.data;
        }).catch(err => {
            alert(err);
        });
    },

    methods: {
        confirmDeleteContent(qna_no) {

            this.$swal({
                title: `${qna_no}번 질문을 삭제하시겠습니까?`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: '삭제',
                cancelButtonText: '취소',
                reverseButtons: true
            }).then(result => {
                if (result.value) {
                    this.deleteContent(qna_no);
                    this.$router.go(0);

                }
            });


        },
        deleteContent(qna_no) {
            axios({
                url: "http://localhost:3000/admin/delete",
                method: "POST",
                data: {
                    qnano: qna_no
                },
            }).then(res => {
                this.content = res.data;
                console.log(res.data)

            }).catch(err => {
                alert(err);
            });
        },
        movetocontent(qna_no) {
            // if(this.item.is_secret == 0  ){
            window.location.href = window.location.pathname + '/qnacontent?qna_no=' + qna_no
            // } else {
            //   this.$swal("비밀글입니다")
            // }
        },
        movetoSecret(item) {
            if (this.user.user_ty == 1 || item.user_no == this.user.user_no) {
                window.location.href = window.location.pathname + '/qnacontent?qna_no=' + item.qna_no
            } else {
                this.$swal("비밀글입니다")
            }
        },
        //페이징
        movetopreviouspage() {
            if (this.$route.query.page == 1) {
                this.$swal('첫번째 페이지입니다!');
            } else {
                var pp = parseInt(this.$route.query.page) - 1;
                window.location.href = window.location.pathname + '?page=' + pp
            }
        },
        movetonextpage() {
            if (this.$route.query.page == Math.ceil(this.cnt / 10)) {
                this.$swal('마지막 페이지입니다!');
            } else {
                var pp = parseInt(this.$route.query.page) + 1;
                window.location.href = window.location.pathname + '?page=' + pp
            }
        },


    }
}

</script>

<style scoped>
@font-face {
    font-family: 'GmarketSansMedium';
    src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2001@1.1/GmarketSansMedium.woff') format('woff');
    font-weight: normal;
    font-style: normal;
}

div {
    font-family: 'GmarketSansMedium';
    text-align: center;


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

.page-btn{
  height: 25px;
  width: 50px;
  border: none;

  background-color:#aeaeae;
  font-family: 'GmarketSansMedium';
  font-size: 14px;
  box-shadow: 0px 1px 10px 0.1px rgb(240, 240, 240);
  
}
button.page-btn:hover {
  cursor: pointer;
  background-color:rgb(161, 161, 161);

}

.page-count{
  padding: 0 20px 0 20px; 

  /* 위 오 아래 왼 간격 조절 */

}

.btn-cover{
    position: relative;
  top: 20px;

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