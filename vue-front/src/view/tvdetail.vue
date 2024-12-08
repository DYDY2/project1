<template>
  <div class="container">
    <!-- Bootstrap 및 Font Awesome 링크 -->
    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css"
      rel="stylesheet"
      integrity="sha384-giJF6kkoqNQ00vy+HMDP7azOuL0xtbfIcaT9wjKHr8RbDVddVHyTfAAsrekwKmP1"
      crossorigin="anonymous"
    />
    <link
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
      rel="stylesheet"
    /><br>

    <!-- 페이지 제목 -->
    <h1 class="text-center">여행지</h1>

    <!-- 등록된 리뷰 리스트 -->
    <div class="review-list">
      <div class="row">
        <div
          class="col-xl-6 col-lg-6 col-md-12 mb-3"
          v-for="(item, index) in contentList"
          :key="index"
        >
          <div class="card d-flex flex-row">
            <!-- 이미지 칸 -->
            <div class="main-image text-center" style="margin-top:40px"> <!-- 가운데 정렬 추가 -->
              <img
                v-if="!item.trip_img"
                src="../assets/img_notReady.png"
                alt="..."
                width="50%"
              />
              <img
                v-else
                :src="require(`../../../node-back/uploads/${item.trip_img}`)"
                alt="..."
                width="50%"
                height="100%"
              />
            </div>

            <!-- 서브 이미지 칸 -->
            <div class="sub-images d-flex flex-wrap justify-content-between align-items-center mt-3">
              <div
                v-for="(subImage, subIndex) in item.subImages"
                :key="subIndex"
                class="sub-image"
              >
                <div style="pointer-events: none;">
                  <img
                    v-if="!subImage"
                    src="../assets/img_notReady.png"
                    alt="..."
                    width="100%"
                    height="100%"
                  />
                  <img
                    v-else
                    :src="require(`../../../node-back/uploads/${subImage}`)"
                    alt="..."
                    width="185px"
                    height="185px"
                    
                  />
                </div>
              </div>
            </div>

            <!-- 좋아요 버튼 -->
            <div class="card-footer d-flex justify-content-center align-items-center flex-column">
              <h2>{{ item.trip_no }}</h2>
              <button
                v-if="user.user_no === ''"
                class="heart-button"
                @click="likeInsert"
              >
                <i class="far fa-heart heart-icon"></i>
              </button>
              <button
                v-else-if="!isLiked"
                class="heart-button"
                @click="likeInsert"
              >
                <i class="far fa-heart heart-icon"></i>
              </button>
              <button v-else class="heart-button" @click="likeDelete">
                <i class="fas fa-heart like-heart-icon"></i>
              </button>
              <h4 class="text-center">{{ like }}</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
        <br>
    <br>

    <!-- 축제 정보 및 리뷰 작성 섹션 -->
    <div class="festival-info mt-4">
      <!-- 축제 정보 -->
      <div class="festival-details">
        <h2>여행 정보</h2>
        <ul>
          <li v-for="(item, index) in contentList" :key="index">
            <p><strong>{{ item.title }}</strong></p>
            <!-- 주소 및 상세 내용 -->
            <p><strong>주소:</strong> {{ item.address }}</p>
            <p><strong>요금:</strong> {{ item.price }}</p>
            <p><strong>상세 내용:</strong> {{ item.detail }}</p>
          </li>
        </ul>
      </div>
    </div>

    <!-- 리뷰 작성 섹션 -->
    <div class="review-section mt-4">
      <!-- 별점 선택 -->
      <div class="star-rating mb-4">
        <span
          v-for="star in 5"
          :key="star"
          class="star"
          @click="selectStars(star)"
          :style="{ color: star <= selectedStars ? 'gold' : 'gray' }"
        >
          <i class="fas fa-star"></i>
        </span>
      </div>
      <!-- 리뷰 입력 -->
      <div class="review-input text-center mb-4">
        <input
          type="text"
          v-model="reviewText"
          class="form-control"
          placeholder="리뷰를 입력해주세요"
        />
        <div v-if="user.user_id == ''">
          <button @click="login" class="btn btn-primary mt-3">등록</button>
        </div>
        <div v-else>
          <button @click="submitReview" class="btn btn-primary mt-3">등록</button>
        </div>
      </div>
    </div>

    <!-- 등록된 리뷰 표시 -->
    <div class="review-display mt-4">
      <h3>등록된 리뷰</h3>
      <ul v-if="reviewList.length > 0">
        <li v-for="(review, index) in reviewList" :key="index" class="review">
          <div class="review-content">
            <div class="stars">
              <span v-for="n in 5" :key="n" class="star">
                <i
                  :class="['fas', 'fa-star', { 'text-warning': n <= review.review_goat, 'text-secondary': n > review.review_goat }]"
                ></i>
              </span>
            </div>
            <div class="user-id">{{ review.user_id }}</div>
            <div class="review-text">{{ review.review_content }}</div>
          </div>
        </li>
      </ul>
      <p v-else>등록된 리뷰가 없습니다.</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      contentList: [], // 축제 정보 리스트 초기값 추가
      selectedStars: 0, // 선택된 별점 초기값
      reviewText: "", // 리뷰 입력 초기값
      reviewList: [], // 등록된 리뷰 리스트 초기값
      isLiked: false,
      like: 0,
    };
  },
  computed: {
    user() {
      return this.$store.state.user; // user 정보가 바뀔 때마다 자동으로 user() 갱신
    },
  },
  created() {
    this.getLike();
    this.likeCheck();
  },
  methods: {
    // 별점 선택 시 호출되는 메서드
    selectStars(stars) {
      this.selectedStars = stars;
    },
    login() {
      this.$swal({
        title: "로그인 하신 후에 작성하실 수 있습니다.",
        showConfirmButton: true,
      }).then(() => {
        window.location.href = "http://localhost:8080/login";
      });
    },
    // 리뷰 등록 버튼 클릭 시 호출되는 메서드
    async submitReview() {
      if (this.reviewText.trim() !== "" && this.selectedStars > 0) {
        const newReview = {
          user_no: this.user.user_no, // 사용자 번호
          user_id: this.user.user_id, // 사용자 아이디
          review_goat: this.selectedStars,
          review_content: this.reviewText,
        };
        try {
          const trip_no = this.$route.params.trip_no; // 현재 페이지의 tv_no 가져오기
          const response = await axios.post(
            `http://localhost:3000/trip/trip/${trip_no}/reviews`,
            newReview
          );
          if (response.status === 200) {
            this.fetchReviews(); // 리뷰 리스트 새로고침
            this.reviewText = "";
            this.selectedStars = 0;
          } else {
            console.error("Error submitting review:", response.statusText);
          }
        } catch (error) {
          console.error("Error submitting review:", error);
        }
      } else {
        alert("리뷰 내용과 별점을 선택해주세요.");
      }
    },
    // 특정 tv_no의 축제 정보 및 리뷰 가져오기
    async fetchFestival(trip_no) {
      try {
        console.log(`Fetching festival with trip_no: ${trip_no}`);
        const response = await axios.get(
          `http://localhost:3000/trip/trip/${trip_no}`
        );
        console.log("Festival response data:", response.data);
        this.contentList = response.data.map((item) => ({
          title: item.trip_tit,
          detail: item.trip_content,
          address: item.trip_ads,
          price: item.trip_price,
          trip_img: item.trip_img,
          subImages: [
            item.trip_sb_img,
            item.trip_sb_img2,
            item.trip_sb_img3,
            item.trip_sb_img4,
          ],
        }));
      } catch (error) {
        console.error("Error fetching festivals:", error);
      }
    },
    async likeCheck() {
      const user_no = this.user.user_no || null;
      const response = await axios.post(
        `http://localhost:3000/trip/likeCheck/${this.$route.params.trip_no}/${user_no}`
      );
      if (response.data.message === "complete") {
        this.isLiked = response.data.isLiked;
      } else {
        this.isLiked = false;
      }
    },
    async likeInsert() {
      if (this.user.user_no === "") {
        this.$swal("로그인해주세요");
        this.$router.push({ path: "/login" });
      } else {
        await axios.post(
          `http://localhost:3000/trip/likeInsert/${this.$route.params.trip_no}/${this.user.user_no}`
        );
        this.isLiked = true;
        await this.getLike();
      }
    },
    async likeDelete() {
      if (this.user.user_no === "") {
        this.$swal("로그인해주세요");
        this.$router.push({ path: "/login" });
      } else {
        await axios.post(
          `http://localhost:3000/trip/likeDelete/${this.$route.params.trip_no}/${this.user.user_no}`
        );
        this.isLiked = false;
        await this.getLike();
      }
    },
    async getLike() {
      try {
        const trip_no = this.$route.params.trip_no;
        const response = await axios.get(
          `http://localhost:3000/trip/likeCount/${trip_no}`
        );
        this.like = response.data;
        if (this.like === null) {
          this.like = 0;
        }
      } catch (error) {
        console.error(error);
      }
    },
    // 특정 tv_no의 리뷰 가져오기
    async fetchReviews() {
      try {
        const trip_no = this.$route.params.trip_no; // 현재 페이지의 tv_no 가져오기
        const response = await axios.get(
          `http://localhost:3000/trip/trip/${trip_no}/reviews`
        );
        this.reviewList = response.data;
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    },
  },
  mounted() {
    const trip_no = this.$route.params.trip_no; // 현재 페이지의 tv_no 가져오기
    console.log(`Mounted component with trip_no: ${trip_no}`);
    this.fetchFestival(trip_no);
    this.fetchReviews();
  },
};
</script>


<style scoped>
.card {
  height: 120%;
  width: 180%;
  margin-bottom: 10px;
  display: flex;
}

.main-image {
  width: 150%;
  margin: 30px auto 20px; /* 위쪽 마진 10px, 아래쪽 마진 20px로 설정 */
}

.sub-images {
  width: 800px;
  height: 50px;
  margin-left: -10%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: 10px; /* 서브 이미지 사이의 간격 설정 */
}

.sub-image {
  
  width: calc(50% - 0px);
   height: 140px;
   margin-left:0px;
  margin-bottom: 10px;
}

.star-rating {
  margin-bottom: 20px;
}

.star-rating .fa-star {
  font-size: 24px; /* 별 아이콘 크기 */
}

.review-input input {
  width: 100%; /* 입력 필드 너비 100% */
}

.review-list {
  margin-top: 20px;
}

.review {
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.stars {
  display: flex;
  align-items: center; /* 별점 아이콘 가운데 정렬 */
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
}

.tv-info {
  display: flex;
  flex-direction: column; /* 세로로 배치 */
}

.tv-details {
  margin-top: 20px;
}

.tv-details ul {
  padding-left: 20px; /* 목록 아이템 들여쓰기 */
}

.tv-details li {
  margin-bottom: 10px;
}

.heart-icon {
  font-size: 2em;
}

.like-heart-icon {
  font-size: 2em;
  color: red;
}
</style>