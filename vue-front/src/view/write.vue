<template>
    <div>
      <h1>글 작성</h1>
      <div class="AddWrap">
        <form @submit.prevent="savePost">
          <table class="tbAdd">
            <colgroup>
              <col width="15%" />
              <col width="*" />
            </colgroup>
            <tr>
              <th>제목</th>
              <td class="left-align">
                <input type="text" v-model="boards.boardTitle" class="large-input" placeholder="제목을 입력해주세요">
              </td>
            </tr>
            <tr>
              <th>내용</th>
              <td class="left-align">
                <textarea v-model="boards.boardContent" class="large-textarea" placeholder="내용을 입력해주세요"></textarea>
              </td>
            </tr>
          </table>
          <div class="btn">
            <button type="submit" class="write_btn">글 작성</button>
          </div>
          <div class="goodsbox">
            <div class="upload-label">
              <label class="form-label">사진등록</label>
              <input type="text" class="form-control3" :value="fileName" placeholder="이미지를 업로드 하세요" disabled>
            </div>
            <div class="input-img">
              <label for="upload-file">파일선택</label>
              <input type="file" name="upload" id="upload-file" @change="handleFileUpload">
            </div>
          </div>
          <div v-if="imageUrl" class="preview-img">
            <img :src="imageUrl" alt="Image Preview">
          </div>
        </form>
      </div>
      <div class="btn-back">
        <button @click="movetoboard" class="back_btn">뒤로가기</button>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        fileName: '이미지를 업로드 하세요',
        imageUrl: '',
        boards: {
          boardTitle: '',
          boardContent: '',
          boardImg: '',
        }
      }
    },
    computed: {
      user() {
        return this.$store.state.user; // 로그인 확인
      }
    },
    methods: {
      savePost() {
        axios.post('http://localhost:3000/bd/write', {
          user_no: this.user.user_no,
          board_tit: this.boards.boardTitle,
          board_content: this.boards.boardContent,
          board_img: this.boards.boardImg,
        })
        .then(response => {
          console.log('글 작성 성공:', response.data);
          this.boards.boardTitle = '';
          this.boards.boardContent = '';
          this.boards.boardImg = '';
          this.imageUrl = '';
          this.$router.push('/board?page=1');
          this.$parent.fetchContentList();
        })
        .catch(error => {
          console.error('글 작성 실패:', error);
        });
      },
      movetoboard() {
        this.$router.back();
      },
      async handleFileUpload(event) {
        const formData = new FormData();
        const file = event.target.files[0];
        this.boards.boardImg = file.name;
        if (!file) return;
        formData.append('upload', file);
        this.fileName = file ? file.name : '이미지를 업로드 하세요';
  
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imageUrl = e.target.result;
        };
        reader.readAsDataURL(file);
  
        await axios({
          method: 'post',
          url: 'http://localhost:3000/bd/upload',
          headers: { "Content-Type": "multipart/form-data" },
          data: formData
        });
      },
    }
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
  </style>