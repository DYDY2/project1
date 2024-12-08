<template>
    <div class="mypage-container">
        <!-- <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet"
integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM" crossorigin="anonymous"> -->
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
        <h1 class="myinfo">내 정보</h1>
        <table class="mypage-info">
            <tr class="box">
                <td  rowspan="6" class="box-body">
                    <img style="width:100%;" :src="ImageSrc">
                    <input type="file" class="form-controller" @change="uploadImage">
                </td>
            </tr>
            <tr>
                <td class="user-id">아이디:</td>
                <td class="infodata">{{ loginuser.user_id }}</td>
             </tr>   
            <tr>
                <td class="user-nick">닉네임:</td>
                <td class="infodata">{{ loginuser.user_nick }}</td>
            </tr>
            <tr>
                <td class="user-email">이메일:</td>
                <td class="infodata">{{ loginuser.user_email }}</td>
            </tr>
            <tr>
                <td class="user-adr">주소:</td>
                 <td class="infodata">{{ loginuser.user_adr1 }}</td>
             </tr>
        </table>
        <button class="btn btn-info btn-update" @click=goToUpdate()>회원정보 수정</button>
        <button class="btn btn-danger btn-delete" @click="confirmDelete(loginuser)">회원탈퇴</button>
    </div>
</template>

<script>
import axios from 'axios';

export default {
components: {
},
data() {
return {
    loginuser: {},
    ImageSrc: {},

    }
}, 
created() {
    this.userInfo();
    this.loadImage();
},
mounted() {
    
},
computed: {
    user() {
        return this.$store.state.user; // 로그인 여부
    }
},
methods: {
    async userInfo() {
        try{
            const response = await axios.get(`http://localhost:3000/mypage/${this.user.user_no}`);
            this.loginuser = response.data[0];
        } catch(err) {
            console.error(err);
        }
        
    },
    goToUpdate() {
        this.$router.push({ path: '/mypage/update'});
    },
    confirmDelete(user) {
        this.$swal({
            title: `${user.user_nick} 회원을 삭제 하시겠습니까?`,
            icon: 'question',
            showCancelButton: true,
            confimButtonText: '삭제',
            cancelButtonText: '취소',
            reversButtons: true 
        }).then(result => {
            if (result.value) {
                this.userDele();
            }
        });
    },
    //데이터 5mb
    async uploadImage(event) {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        // console.log(file);

        try {
            const response = await axios.post('http://localhost:3000/mypage/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            const imageName = response.data.filename;
            const userNo = this.user.user_no;
            const profileData = JSON.stringify({ imageName, userNo });
            localStorage.setItem(`profileImage_${userNo}`, profileData);
            this.loadImage();
        } catch (error) {
            console.error(error);
        }
    },
    loadImage() {
        try {
            const userNo = this.user.user_no;
            const profileData = localStorage.getItem(`profileImage_${userNo}`);

         if (profileData) {

            const { imageName, userNo } = JSON.parse(profileData);
            if(imageName && userNo === this.user.user_no) {

                this.ImageSrc = `http://localhost:3000/mypage/images/${imageName}`;
                console.log("Image loaded:", this.ImageSrc);

            } else {

                this.ImageSrc = require(`/goodsempty.jpg`);

            }

         } else {

            this.ImageSrc = require(`/goodsempty.jpg`);

            }
        } catch(error) {
            console.error(error);
        }
    },

//     async userDele() {
//         try {
//     const response = await axios.delete(`http://localhost:3000/mypage/delete/${this.user.user_no}`);
//     if (response.status === 200) {
//         this.$swal({
//           position:'top',
//           icon: 'success',
//           title: '회원탈퇴 성공',
//           showConfirmButton: false,
//           timer: 1500
//         });
//     }
//     this.$store.commit("user", { user_id: '', user_no: '' });
//     this.$nextTick(() => {

//       this.$router.push({ path: '/' });
    
//     });

//   } catch (err) {
//     console.error('err');
//     this.$swal({
//       icon: 'error',
//       title: '삭제 실패',
//       text: '계정 삭제에 실패했습니다.'
//     });
//   }
//     },
    async userDele() {
        try {
    const response = await axios.post(`http://localhost:3000/mypage/delete/${this.user.user_no}`);
    if (response.status === 200) {
        this.$swal({
          position:'top',
          icon: 'success',
          title: '회원탈퇴 성공',
          showConfirmButton: false,
          timer: 1500
        });
    }
    this.$store.commit("user", { user_id: '', user_no: '' });
    this.$nextTick(() => {

      this.$router.push({ path: '/' });
    
    });

  } catch (err) {
    console.error('err');
    this.$swal({
      icon: 'error',
      title: '삭제 실패',
      text: '계정 삭제에 실패했습니다.'
    });
  }
    },
//    async deleteKakaoAccount() {

//         try{ 
//             const response = await axios.delete('http://localhost:3000/mypage/kakaoDelete', {

//                 data: {
//                     user_id: this.user.user_id,
//                     user_no: this.user.user_no
//                 }
//             });
//             if (response.data.message === '성공적으로 삭제되었습니다.') {
//                 return response.data;
//             }
//         } catch (err) {
//             console.error(err);
//             this.$swal({
//                 icon: 'error',
//                 title: '삭제 실패',
//                 text: '계정 삭제에 실패했습니다.'
//             });
//         }
//        const user_id = this.$store.state.user.user_id;
//         const user_no = this.$store.state.user.user_no;
//         axios({
//             url: "http://localhost:3000/mypage/kakaoDelete",
//             method: "DELETE",
//             data: {
//                 user_id: user_id,
//                 user_no: user_no
//             }
//         }).then(res => {
//             if (res.data.message === '성공적으로 삭제되었습니다.') {
//                 this.$swal({
//                     position: 'top',
//                     icon: 'success',
//                     title: '카카오 계정 삭제 완료!',
//                     showConfirmButton: false,
//                     timer: 1000
//                 }).then(() => {
//                     this.$store.commit("user", { user_id: '', user_no: '' });
//                     this.$nextTick(() => {

//                      this.$router.push({ path: '/' });

//                      });
//                 });
//             }
//         }).catch(err => {
//             console.log(err);
//         });
//     }
},
}
</script>
<style scoped>
@font-face {
font-family: 'GmarketSansMedium';
src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2001@1.1/GmarketSansMedium.woff') format('woff');
font-weight: normal;
font-style: normal;
}

/* * {
margin: 0;
padding: 0;
box-sizing: border-box;
} */


.mypage-container {
font-family: 'GmarketSansMedium';
position: relative;
width: 100%;
height: 100%;
overflow: hidden;
}


.mypage-info {
position:relative;
background-color: #DDC9BC;
box-shadow: 0 0.3px 1px;
width: 80%;
height: 100%;
left: 110px;
bottom:5px;
border:none;
}


.myinfo {
position: relative;
justify-content: center;
left: 800px;
}


.infodata {
position: relative;
align-content: center;
text-align: center;
height: 100%;
/* text-decoration: underline; */

/* left: 100px; */
/* bottom: 12px; */
background-color: #cfc0b6;
box-shadow: -0.4px 0.2px 0.2px; 
width: 100%;
}

.user-id, .user-nick, .user-email, .user-adr {
text-align: center;
width: 13%;
padding-top: 8px;
padding-left: 21px;
}

.btn-update {
position: relative;
align-content: center;
justify-content: center;
align-items: center;
left: 109px;
top: 2px;
scale: 100%;
border-radius: 3px;
background-color: #c2d7ff;
}

.btn-update:hover {

background-color: rgb(78, 148, 194)

}

.btn-delete {
position: relative;
align-content: center;
justify-content: center;
align-items: center;
left: 111px;
top: 2px;
scale: 100%;
border-radius: 3px;
background-color: rgb(255, 188, 161);
}

.btn-delete:hover {

background-color: rgb(190, 102, 98);
}

.box {
padding: 0;
margin: 0;
background-color: #cfc0b6;
border:none;

}
.box-body {
width:19%;
text-align: center;
vertical-align: middle;
border-spacing: 0;
border-style: none;
padding: 5px 13px 5px 10px;
position:relative;
left: 1px;
box-shadow: 0.3px 0px 0.5px;
}

img {
max-width: 100%;
height: auto;
border-radius: 4px;
box-shadow: 0 2px 4px rgb(0, 0, 0, 0.1);
}


input {
position: relative;
right: 8px;
}

.form-controller {

width:100%;
margin-top: 10px;
margin-bottom: 10px;
margin-left: 20px;
box-sizing: border-box;

}

.mypage-container p {
height: 16px;
margin: 0;
font-size: 14px;
color: #000000;
padding-top: 8px;
line-height: 16px;
}
</style>