<template>
  <div @submit.prevent="onSubmitWrite" class="form-container">
    <form  class="write-form">
      <div class="ALL">
        <label class="top" style="font-size: 40px; font-style: bold;">문의답변 작성</label>
        <div class="form-group2">
          <label for="qna_ans" class="form-label">내용</label>
          <textarea v-model="qna_ans" class="form" placeholder="내용을 입력해 주세요!"></textarea>
        </div>
        <div class="form-group">
 
</div>

        <button type="submit" class="submit-button" onclick="location.href='/admin/qna?page=1'">제출</button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      qna_ans: '',

    }
  },
  computed: {
    user() {
      return this.$store.state.user; 
    }
  },
  methods: {
    onSubmitWrite() {
      axios.post("http://localhost:3000/admin/write_ans", {
        qna_ans: this.qna_ans,
        qna_no: this.$route.query.qna_no

      })
        .then(response => {
          console.log(response.data);
          
        })
        .catch(error => {
          console.log(error);
          // 오류 처리
        });
    }
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

input {
  font-family: 'GmarketSansMedium';
  border: 2px solid rgb(175, 175, 175);
  position: relative;
  top: -16px;
  left: -1px;
}

div {
  font-family: 'GmarketSansMedium';
}

.form-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 750px;

}

.write-form {
  width: 300px;
  padding: 20px;
  background-color: white;
  border-radius: 4px;

}

.form-group {
  margin-bottom: 20px;
  position: relative;
  top: -35px;
  right: -3px;


}

.form-group2 {
  position: relative;
  top: -50px;
  right: -3px;

}

.form-label {
  display: block;
  margin-bottom: 20px;
  font-weight: bold;
}

.form-input {
  width: 100%;
  padding: 10px;
  border-radius: 4px;
}

.form {
  width: 800px;
  height: 200px;
  resize: none;
}

.submit-button {
  display: block;
  width: 30%;
  padding: 10px;
  background-color: #dfdede;
  color: black;
  border: black;
  border-radius: 4px;
  cursor: pointer;
  position: relative;
  left: 715px;
  top: -85px;
  font-family: 'GmarketSansMedium';
}

.submit-button:hover {
  background-color: #aeaeae;
}

.ALL {
  position: relative;
  left: -250px;
  top: 30px;

}

.top {
  position: relative;
  top: -50px;
}

textarea {
  font-size: 15px;
  font-family: 'GmarketSansMedium';
  border: 2px solid rgb(175, 175, 175);
  border-radius: 4px;
  position: relative;
  top: -16px;
  left: -1px;
}
.secret{
  position: relative;
  top: -26px;
  left: -1px;
}
.checkbox{
  position: relative;
  top: -24px;
  left: -1px;
}
</style>