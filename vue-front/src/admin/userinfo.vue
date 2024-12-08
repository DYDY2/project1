<template>
    <div class="container">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
            <div class="userPage">
                <h2>회원정보</h2>
            </div>

        
            <table class="userinfo">
                <colgroup>
                    <col width="14%" />
                    <col width="14%" />
                     <col width="20%" />
                    <col width="20%" />
                    <col width="12%" />
                     <col width="18%" />
                 </colgroup>
                 <thead>
                    <tr>
                        <th class="user_title id">아이디</th>
                        <th class="user_title nick">닉네임</th>
                        <th class="user_title img">이미지</th>
                        <th class="user_title email">이메일</th>
                        <th class="user_title logty">로그인타입</th>
                        <th class="user_title date">가입일</th>
                    </tr>
                 </thead>
                 <tbody>
                    <tr v-for="(item, i) in filterUserList" :key="i">
                        <td class="users">{{ item.user_id }}</td>
                        <td class="nick">{{ item.user_nick }}</td>
                        <td class="image">
                            <img style="width:80%;" :src="getImageSrc(item.user_no)">
                        </td>
                        <td>{{ item.user_email }}</td>
                        <td>{{ item.user_login_ty }}</td>
                        <td>{{ formatDate(item.user_day) }}</td>
                        <td><button class="del_btn" @click="confirmDeleteContent(item)">삭제</button></td>
                    </tr>
                 </tbody>
            </table>

            <div class="btn-cover">
                <button @click="movetoprveiouspage" class="page-btn">이전</button>
                <span class="page-count">{{ currentPage }}/{{ totalpage }}페이지</span>
                <button @click="movetonextpage" class="page-btn">다음</button>
            </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
    return {
        userList:[],
        image: {},
        contentlist: [],
        pageSize: 10,
        cnt: 0, // 현재 게시글 수
        ImageSrcMap: {},
        currentPage: 1
    }
}, 
    created() {
        this.info();
        this.currentPage = parseInt(this.$route.query.page || 1);
    },
    mounted() {
    },
    computed: {
        user() {
            return this.$store.state.user
        },
        filterUserList() {
            return this.userList.filter(item => item.user_type !== 1);
        },
        totalpage() {
            if (this.cnt == 0) {
                return 1;
            } else {
                return Math.ceil(this.cnt / 10);
            }
        }
        
    },
    methods: {
        async info() {
            try {
                const response = await axios.get(`http://localhost:3000/admin/userinfo`);       
                this.userList = response.data;
                this.loadImage();
                console.log(this.userList);
            } catch(error) {
                console.error(error);
            }
        },
        formatDate(date) {
            return date ? date.split('T')[0] : '';
        },

        movetoprveiouspage() {
            if (this.$route.query.page <= 1) {
                this.$swal('첫번째 페이지입니다');
            } else {
                let pp = parseInt(this.$route.quert.page) - 1;
                window.location.href = window.location.pathname + '?page=' + pp
            }
        },
        movetonextpage() {
            if (this.$route.query.page >= Math.ceil(this.cnt / 10)) {
                this.$swal('마지막 페이지입니다.');

            } else {
                let pp = parseInt(this.$route.query.page) + 1;
                window.location.href = window.location.pathname + '?page=' + pp
            }
        },

        loadImage() {

            try {
                // 사용자 목록을 순회하면서 이미지 로드
                for (const users of this.userList) {
                    
                    const userNo = users.user_no; // 각 사용자의 번호 가져오기
                    const profileData = localStorage.getItem(`profileImage_${userNo}`); // 해당 사용자의 이미지 가져오기
                    console.log(profileData);
                    if (profileData) {

                        const { imageName } = JSON.parse(profileData); // 이미지 이름 추출
                        if (imageName&&userNo) {
                            // 이미지 이름이 존재하면 해당 이미지 경로 설정
                            this.ImageSrcMap[userNo] = `http://localhost:3000/mypage/images/${imageName}`;
                            
                            
                        } else {
                            // 이미지 이름이 없으면 기본 이미지로 변경
                            this.ImageSrcMap[userNo] = require(`/goodsempty.jpg`);
                        }
                    } else {
                        // 프로필 데이터가 없으면 기본 이미지 경로 설정
                        this.ImageSrcMap[userNo] = require(`/goodsempty.jpg`);
                    }
                }
            } catch (error) {

                console.error('이미지를 로드하는 도중 오류가 발생했습니다:', error);
            }
            // try {
            //     const userNo = this.item.user_no;
            //     const profileData = localStorage.getItem(`profileImage_${userNo}`);

            //     if(profileData) {

            //         const { imageName, userNo } = JSON.parse(profileData);

            //         if(imageName && userNo === this.item.user_no) {

            //             this.ImageSrc = `http://localhost:3000/mypage/images/${imageName}`;
            //         } else {

            //             this.ImageSrc[this.item.user_no] = require(`/goodsempty.jpg`);
            //         }
            //     } else {

            //         this.ImageSrc[this.item.user_no] = require(`/goodsempty.jpg`);
            //     }
            // } catch(error) {

            //     console.error(error);
            // }

        },
        getImageSrc(userNo) {
            if (this.ImageSrcMap[userNo]) {

                return this.ImageSrcMap[userNo]; // 이미지가 로드된 경우 해당 이미지 경로 반환
            
            } else {
                
                return require(`/goodsempty.jpg`);
            }
        },
        confirmDeleteContent(user) {

                this.$swal({
                    title: `${user.user_nick} 회원을 삭제 하시겠습니까?`,
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonText: '삭제',
                    cancelButtonText: '취소',
                    reversButtons: true

                }).then(result => {
                    if(result.value && user.user_login_ty === 0) {
                        console.log(result.value);
                        this.userDele(user.user_no);
                    }
                    else if (result.value && user.user_login_ty === 1) {
                        console.log(result.value);
                        this.deleteKakaoAccount(user.user_no);
                    }
                });
        },
        async userDele(userNo) {
            try {
                const response = await axios.delete(`http://localhost:3000/admin/delete`, {
                    data: {
                        user_no: userNo
                    }

                });
                if (response.status === 200) {
                    this.$swal({
                    position:'top',
                    icon: 'success',
                    title: '회원탈퇴 성공',
                    showConfirmButton: false,
                    timer: 1500
                    });
                }
                this.info();

            } catch (err) {
                console.error('err');
                this.$swal({
                icon: 'error',
                title: '삭제 실패',
                text: '계정 삭제에 실패했습니다.'
                });
            }
                },
       async deleteKakaoAccount(userNo) {

            try{ 
                const response = await axios.delete('http://localhost:3000/mypage/kakaoDelete', {

                    data: {
                        user_no: userNo
                    }
                });
                if (response.data.message === '성공적으로 삭제되었습니다.') {
                    return response.data;
                }
            } catch (err) {
                console.error(err);
                this.$swal({
                    icon: 'error',
                    title: '삭제 실패',
                    text: '계정 삭제에 실패했습니다.'
                });
            }
           const user_id = this.$store.state.user.user_id;
            const user_no = this.$store.state.user.user_no;
            axios({
                url: "http://localhost:3000/mypage/kakaoDelete",
                method: "DELETE",
                data: {
                    user_id: user_id,
                    user_no: user_no
                }
            }).then(res => {
                if (res.data.message === '성공적으로 삭제되었습니다.') {
                    this.$swal({
                        position: 'top',
                        icon: 'success',
                        title: '카카오 계정 삭제 완료!',
                        showConfirmButton: false,
                        timer: 1000
                    }).then(() => {

                        this.info();

                    });
                }
            }).catch(err => {
                console.log(err);
            });
        }
        // requestUserInfo() {
        //     Kakao.API.request({
        //     url: '/v2/user/me',
        //     })
        //     .then(function(res) {
        //         alert(JSON.stringify(res));
        //     })
        //     .catch(function(err) {
        //         alert(
        //         'failed to request user information: ' + JSON.stringify(err)
        //         );
        //     });
        // },
        
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

.userPage {
    position: relative;
    text-align: center;
}

/* .userinfo {
    position: relative;
    justify-content: center;
    text-align: center;
} */

table {
    margin: auto;
    position: relative;
    width: 90%;
}

 .userinfo th {
    border-top: 1px solid #888;
    background-color: #eee;
 }

 .userinfo th, td {
    border-bottom: 1px solid #eee;
    padding: 5px 0;
    height: 100%;
 }

 td {
    text-align: center;
 }

 thead {
    background-color: #e2e1e0
 }

 .page-btn {
    height: 25px;
    width: 50px;
    border: none;

    background-color: #aeaeae;
    font-family: 'GmarketSansMedium';
    font-size: 14px;
    box-shadow: 0px 1px 10px 0.1px rgb(240, 240, 240);
 }

 button.page-btn:hover {
    cursor: pointer;
    background-color: rgb(161, 161, 161);
 }

 .page-count {
    padding: 0 20px 0 20px;
 }

 .btn-cover {
    position: relative;
    top: 20px;
 }

 .del_btn {
    height: 23px;
    width: 50px;
    border: none;
    background-color: #aeaeae;
    font-family: 'GmarketSansMedium';
    font-size: 14px;
 }

 button.del_btn:hover {
    cursor: pointer;
    background-color: rgb(161, 161, 161);
 }
</style>