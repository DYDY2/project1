<template>
  <main class="mt-3">
    <div class="container">
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
      
      <h3>나의 리뷰</h3>
      <table v-if="reviewList.length > 0" class="tbList">
        <colgroup>
          <col width="10%" />
          <col width="20%" />
          <col width="15%" />
          <col width="*" />
        </colgroup>
        <thead>
          <tr>
            <th>카테고리</th>
            <th>이미지</th>
            <th>별점</th>
            <th>내용</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(review, i) in reviewList" :key="i">
            <td class="category">{{ getCategoryLabel(review.review_cate) }}</td>
            <td class="image" @click="goToDetail(review)">
              <img style="width:100%" :src="getImageUrl(review)" alt="이미지" />
            </td>
            <td>
              <div class="stars">
                <span v-for="n in 5" :key="n" class="star">
                  <i :class="['fas', 'fa-star', { 'text-warning': n <= review.review_goat, 'text-secondary': n > review.review_goat }]"></i>
                </span>
              </div>
            </td>
            <td class="review-text" @click="goToDetail(review)">{{ review.review_content }}</td>
            <td><button class="del_btn" @click="confirmDeleteContent(review.review_no)">삭제</button></td>
          </tr>
        </tbody>
      </table>
      <p v-else>등록된 리뷰가 없습니다.</p>
      <div class="btn-cover">
        <button @click="movetopreviouspage" class="page-btn" :disabled="page === 1">이전</button>
        <span class="page-count">{{ page }}/{{ totalpage }} 페이지</span>
        <button @click="movetonextpage" class="page-btn" :disabled="page >= totalpage">다음</button>
      </div>
    </div>
  </main>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      reviewList: [],
      page: 1,
      limit: 10,
      cnt: 0,
      review_cate: [1, 2],
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
    this.getReviews();
  },
  methods: {
    getCategoryLabel(review_cate) {
      return review_cate === 1 ? '여행지' : (review_cate === 2 ? '축제' : '');
    },
    goToDetail(review) {
            const url = this.getCategoryLabel(review.review_cate) === '여행지' ?
                `http://localhost:8080/tvdetail/${review.number}` :
                `http://localhost:8080/fsdetail/${review.number}`;
            window.location.href = url;
        },
    getImageUrl(review) {
      return review.image ? require(`../../../node-back/uploads/${review.image}`) : require('/goodsempty.jpg');
    },
    getReviews() {
      axios({
        url: "http://localhost:3000/mypage/getMyReview",
        method: "POST",
        data: {
          userno: this.user.user_no,
          page: this.page,
          limit: this.limit,
        },
      })
        .then(res => {
          this.reviewList = res.data;
          this.reviewList.sort((a, b) => b.board_no - a.board_no);
        })
        .catch(err => {
          alert(err);
        });
      axios({
        url: "http://localhost:3000/mypage/my_review_count",
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
    confirmDeleteContent(review_no) {
      this.$swal({
        title: '게시글을 삭제하시겠습니까?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: '삭제',
        cancelButtonText: '취소',
        reverseButtons: true
      }).then(result => {
        if (result.value) {
          this.deleteContent(review_no);
        }
      });
    },
    deleteContent(review_no) {
      axios({
        url: "http://localhost:3000/mypage/reviewdelete",
        method: "POST",
        data: {
          reviewno: review_no,
        },
      }).then(res => {
        console.log(res.data); // 서버 응답 로그 출력
        this.getReviews(); // 리뷰 목록 새로고침
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
      this.getReviews();
    },
  },
  created() {
    this.getReviews();
  },
};
</script>

<style scoped>
.tbList {
  width: 100%;
  border-collapse: collapse;
}

.tbList th, .tbList td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center; /* 가운데 정렬 추가 */
}

.tbList th {
  background-color: #f2f2f2;
}

.stars {
  display: flex;
  align-items: center; /* 별점 아이콘 세로 정렬 */
  justify-content: center; /* 별점 아이콘 가로 정렬 */
  margin-bottom: 5px;
}

.stars .star {
  font-size: 20px; /* 별 아이콘 크기 */
  margin-right: 5px; /* 별 아이콘 간격 */
}

.user-id {
  font-weight: bold;
  margin-bottom: 5px;
}

.review-text {
  margin-bottom: 5px;
  cursor: pointer; /* 클릭 가능한 요소임을 나타냄 */
}

.review-text:hover {
  text-decoration: underline; /* 마우스를 올렸을 때 밑줄 표시 */
}

.myinfo {
  margin-top: 30px;
  /* 배경색 설정 */
}

.container {
  margin: 40px 30px;
  font-family: GmarketSansMedium;
}

.btn-cover {
  margin-bottom: 50px;
  text-align: center; /* 가운데 정렬 */
  width: 100%; /* 너비 설정 */
}

.page-count {
  padding: 0 15px 0 20px;
  /* 위 오 아래 왼 간격 조절 */
}
</style>