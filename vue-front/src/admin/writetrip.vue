<template>
    <div>
      <h1>축제 추가</h1>
      <div class="AddWrap">
        <form @submit.prevent="savePost">
          <table class="tbAdd">
            <colgroup>
              <col width="15%" />
              <col width="*" />
            </colgroup>
            <tr>
              <th>이름</th>
              <td class="left-align">
                <input type="text" v-model="trip.tripTitle" class="large-input" placeholder="이름을 입력해주세요">
              </td>
            </tr>
            <tr>
              <th>주소</th>
              <td class="left-align">
                <input type="text" v-model="trip.tripAddress" class="large-input" placeholder="주소를 입력해주세요">
              </td>
            </tr>
            <tr>
              <th>내용</th>
              <td class="left-align">
                <textarea v-model="trip.tripContent" class="large-textarea" placeholder="내용을 입력해주세요"></textarea>
              </td>
            </tr>
            <tr>
              <th>지역</th>
              <td class="left-align">
                <input type="text" v-model="trip.tripLocalNm" class="large-input" placeholder="지역을 입력해주세요">
              </td>
            </tr>
            <tr>
              <th>기간</th>
              <td class="left-align">
                <input type="text" v-model="trip.tripDate" class="large-input" placeholder="기간을 입력해주세요">
              </td>
            </tr>
            <tr>
              <th>지역 아이디</th>
              <td class="left-align">
                <input type="text" v-model="trip.tripId" class="large-input" placeholder="지역 아이디를 입력해주세요">
              </td>
            </tr>
            <tr>
              <th>여행지/축체 번호</th>
              <td class="left-align">
                <input type="text" v-model="trip.Id" class="large-input" placeholder="지역 아이디를 입력해주세요">
              </td>
            </tr>
          </table>
  
          <div class="upload-section">
            <div class="upload-label">
              <label class="form-label">메인이미지 등록</label>
              <input type="text" class="form-control3" :value="fileName" placeholder="이미지를 업로드 하세요" disabled>
            </div>
            <div class="input-img">
              <label for="upload-file-main">파일선택</label>
              <input type="file" name="upload-main" id="upload-file-main" @change="handleFileUpload($event, 'main')">
              <!-- 이미지 미리보기 -->
              <div v-if="mainImageUrl" class="preview-img">
                <img :src="mainImageUrl" alt="Main Image Preview">
              </div>
            </div>
          </div>
  
          <!-- 서브 이미지 업로드 섹션 반복 -->
          <div v-for="(subImage, index) in subImages" :key="index" class="upload-section">
            <div class="upload-label">
              <label class="form-label">서브이미지 {{ index + 1 }} 등록</label>
              <input type="text" class="form-control3" :value="subImage.fileName" placeholder="이미지를 업로드 하세요" disabled>
            </div>
            <div class="input-img">
              <label :for="`upload-file-sub${index + 1}`">파일선택</label>
              <input :type="`file`" :name="`upload-sub${index + 1}`" :id="`upload-file-sub${index + 1}`" @change="handleFileUpload($event, `sub${index + 1}`)">
              <!-- 이미지 미리보기 -->
              <div v-if="subImage.url" class="preview-img">
                <img :src="subImage.url" :alt="`Sub Image ${index + 1} Preview`">
              </div>
            </div>
          </div>
  
          <div class="btn">
            <button type="submit" class="write_btn">글 작성</button>
          </div>
        </form>
      </div>
  
      <div class="btn-back">
        <button @click="movetolist" class="back_btn">뒤로가기</button>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        fileName: '이미지를 업로드 하세요',
        mainImageUrl: '',
        trip: {
          tripTitle: '',
          tripAddress: '',
          tripContent: '',
          tripLocalNm: '',
          tripImg: '',
          tripSubImg: [],
          tripDate: '',
          tripId: '',
          Id: '',
        },
        subImages: [
          { fileName: '이미지를 업로드 하세요', url: '' },
          { fileName: '이미지를 업로드 하세요', url: '' },
          { fileName: '이미지를 업로드 하세요', url: '' },
          { fileName: '이미지를 업로드 하세요', url: '' },
        ],
        user: null, // 사용자 정보
      };
    },
    computed: {
      userLoggedIn() {
        return this.$store.state.user; // 로그인 확인
      },
    },
    methods: {
        async savePost() {
  try {
    const formData = new FormData();
    formData.append('upload', this.trip.tripImg);

    // 사용자가 로그인한 상태인지 확인하고, user_no를 가져옵니다.
    if (!this.userLoggedIn) {
      throw new Error('사용자 인증이 필요합니다.');
    }
    const userNo = this.userLoggedIn.user_no;

    // TvSubImg 배열을 데이터베이스 삽입 쿼리의 형식에 맞게 조정
    const tripSubImages = [
      this.trip.tripSubImg[0] || null,
      this.trip.tripSubImg[1] || null,
      this.trip.tripSubImg[2] || null,
      this.trip.tripSubImg[3] || null
    ];

    const response = await axios.post('http://localhost:3000/admin/tripwrite', {
      user_no: userNo, // 사용자 번호 추가
      trip_tit: this.trip.tripTitle,
      trip_ads: this.trip.tripAddress,
      trip_date: this.trip.tripDate,
      trip_content: this.trip.tripContent,
      trip_local_nm: this.trip.tripLocalNm,
      trip_id: this.trip.tripId,
      trip_category: this.trip.Id,
      trip_img: this.trip.tripImg.name,
      trip_sb_img: tripSubImages[0],
      trip_sb_img2: tripSubImages[1],
      trip_sb_img3: tripSubImages[2],
      trip_sb_img4: tripSubImages[3],
    });

    console.log('글 작성 성공:', response.data);
    this.resetForm();
    this.$router.push('/admin/admintrip'); // 리스트 페이지로 이동
  } catch (error) {
    console.error('글 작성 실패:', error);
  }
},
      resetForm() {
        this.trip.tripTitle = '';
        this.trip.tripAddress = '';
        this.trip.tripContent = '';
        this.trip.tripLocalNm = '';
        this.trip.tripDate = '';
        this.trip.tripId = '';
        this.trip.Id = '';
        this.trip.tripImg = '';
        this.trip.tripSubImg = [];
        this.mainImageUrl = '';
        this.subImages.forEach((image) => {
          image.fileName = '이미지를 업로드 하세요';
          image.url = '';
        });
      },
      movetolist() {
        this.$router.back();
      },
      async handleFileUpload(event, type) {
  const file = event.target.files[0];
  const formData = new FormData();
  formData.append('upload', file);

  try {
    const response = await axios.post('http://localhost:3000/admin/upload', formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

    if (type === 'main') {
      this.trip.tripImg = file; // 파일 객체 자체를 TvImg에 저장
      this.mainImageUrl = URL.createObjectURL(file);
    } else if (type.startsWith('sub')) {
      const index = parseInt(type.slice(3)) - 1; // 서브 이미지 인덱스 계산
      this.trip.tripSubImg[index] = file.name;
      this.subImages[index].fileName = file.name;
      this.subImages[index].url = URL.createObjectURL(file);
    }

    console.log('이미지 업로드 성공:', response.data);
  } catch (error) {
    console.error('이미지 업로드 오류:', error);
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
  
  .btn {
    display: block;
    height: 70px;
    position: relative;
    top: 70px;
    left: 85.5%;
    width: 50px;
  }
  
  .btn-cover {
    margin-bottom: 50px;
    position: relative;
  }
  
  .page-count {
    padding: 0 20px 0 20px;
    /* 위 오 아래 왼 간격 조절 */
  }
  
  .write_btn {
    height: 35px;
    width: 80px;
    border: none;
    border-radius: 4px;
    background-color: rgb(230, 168, 84);
    font-family: 'GmarketSansMedium';
    font-size: 16px;
    box-shadow: 0px 1px 9px 1px rgb(221, 221, 221);
  }
  
  button.write_btn:hover {
    cursor: pointer;
    background-color: rgb(230, 168, 84);
  }
  
  .page-btn {
    height: 25px;
    width: 60px;
    border: none;
    background-color: #fde8cc;
    font-family: 'GmarketSansMedium';
    font-size: 16px;
    box-shadow: 0px 1px 10px 0.1px rgb(240, 240, 240);
  }
  
  button.page-btn:hover {
    cursor: pointer;
    background-color: #f9d3a1;
  }
  
  .btn-search {
    height: 25px;
    width: 60px;
    border: none;
    border-radius: 4px;
    background-color: rgb(230, 168, 84);
    font-family: 'GmarketSansMedium';
    font-size: 16px;
    box-shadow: 0px 1px 9px 1px rgb(221, 221, 221);
  }
  
  button.btn-search:hover {
    cursor: pointer;
    background-color: rgb(230, 168, 84);
  }
  
  .btn-back {
    display: block;
    height: 70px;
    position: relative;
    top: 10px;
    left: 14.5%;
    width: 50px;
  }
  
  .back_btn {
    height: 35px;
    width: 80px;
    border: none;
    border-radius: 4px;
    background-color: rgb(230, 168, 84);
    font-family: 'GmarketSansMedium';
    font-size: 16px;
    box-shadow: 0px 1px 9px 1px rgb(221, 221, 221);
  }
  
  button.back_btn:hover {
    cursor: pointer;
    background-color: rgb(230, 168, 84);
  }
  
  .large-input {
    width: 60%;
    height: 30px; /* 높이를 조정하고 싶다면 여기에 값을 입력하세요 */
    font-family: 'GmarketSansMedium';
  }
  
  .large-textarea {
    width: 85%;
    height: 400px; /* 높이를 조정하고 싶다면 여기에 값을 입력하세요 */
    resize: vertical; /* 사용자가 텍스트 영역 크기를 조정할 수 있게 하려면 이 속성을 유지하세요 */
    font-family: 'GmarketSansMedium';
  }
  
  .left-align {
    text-align: left;
  }
  
  .goodsbox {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
  }
  
  .upload-section {
    margin-bottom: 20px;
  }
  
  .upload-label {
    display: flex;
    align-items: center;
    margin-right: 10px;
  }
  
  .form-label {
    margin-right: 10px;
  }
  
  .form-control3 {
    width: 200px;
    height: 35px;
    padding-left: 10px;
    font-family: 'GmarketSansMedium';
  }
  
  .input-img {
    display: flex;
    align-items: center;
  }
  
  .input-img label {
    display: inline-block;
    padding: 6px 12px;
    cursor: pointer;
    background-color: rgb(230, 168, 84);
    color: white;
    border-radius: 4px;
    font-family: 'GmarketSansMedium';
  }
  
  .input-img input[type="file"] {
    display: none;
  }
  
  .input-img label:hover {
    background-color: rgb(210, 148, 64);
  }
  
  .preview-img {
    margin-top: 20px;
  }
  
  .preview-img img {
    max-width: 100%;
    height: auto;
  }

  .tbAdd {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
  }
  .tbAdd th {
    text-align: right;
    padding-right: 10px;
    font-weight: normal;
    width: 15%;
  }
  .tbAdd td {
    padding-left: 10px;
    text-align: left;
  }
  .upload-section {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }
  .upload-label {
    flex: 1;
    text-align: right;
    padding-right: 10px;
  }
  .input-img {
    flex: 2;
    display: flex;
    align-items: center;
  }
  .input-img label {
    margin-right: 10px;
  }
  .form-control3 {
    width: 100%;
    box-sizing: border-box;
  }
  .preview-img img {
    max-width: 200px;
    max-height: 200px;
    margin-top: 10px;
  }
  .btn {
    text-align: center;
    margin-top: 20px;
  }
  .btn-back {
    text-align: center;
    margin-top: 20px;
  }
  </style>