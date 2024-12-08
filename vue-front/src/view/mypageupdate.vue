<template>
    <div class="container">
        <h2>내 정보 수정</h2>
        <div class="form">
            <label class="m_content">아이디</label>
            <div class="put">
                <input type="text" v-if="user.user_id === loginuser.user_id&&loginuser.user_login_ty == 0" class="form-control" v-model="loginuser.user_id" />
                <div v-else>
                    <span>{{ loginuser.user_id }}</span>
                    <p>소셜 계정은 변경이 불가능합니다</p>
                </div>
            </div>
        </div>
        <div class="form">
            <label class="m_content">닉네임</label>
            <div class="put">
                <input type="text" class="form-control" v-model="loginuser.user_nick">
            </div>
        </div>
        <div class="form">
            <label class="m_content">이메일</label>
            <div class="put">
                <input type="email" class="form-control" v-model="loginuser.user_email" />
            </div>
        </div>

    <div class="form">
        <label class="m_content">휴대전화번호</label>
        <div class="put">
            <input type="tel" class="form-control" @input="validatePhoneNumber" v-model="loginuser.user_num" />
        </div>
    </div>

    <div class="form2">
        <label class="m_content2">우편번호</label>
        <div class="put3">
            <input type="text" class="form-control" v-model="loginuser.user_zipcode" />
            <button class="btn" type="button" @click="zipload">우편번호찾기</button>
        </div>
    </div>

    <div class=form3>
        <input type="text" class="put2" v-model="loginuser.user_adr1" />
        <input type="text" class="put2" v-model="loginuser.user_adr2" />
    </div>

    <div class="passwd" @click="goToPass">비밀번호 수정</div>

    <div class="form" @click="onSubmitForm">
        <button type="submit" class="btn">수정하기</button>
    </div>
</div>
</template>

<script>

import axios from 'axios';
export default {
    data() {
    return {
        loginuser: {},
    }
}, 
    mounted() {
        if(this.user.user_no === '') {
            this.$swal('로그인이 필요합니다');
            this.$router.push({ path: '/login'});
        } else {
            axios.get(`http://localhost:3000/mypage/${this.user.user_no}`, {
                params: {
                    user_no: this.user.user_no,
                }
            })
            .then((res) => {
                if (res.data.length > 0) {
                    this.loginuser = res.data[0];
                    console.log(this.loginuser);
                }
            }).catch((err) => {
                console.log(err);
            });
        }
    },
    computed: {
        user() {
            return this.$store.state.user;
        }
    },
    unmounted() {},
    methods: {
      
        async onSubmitForm() {
            
            try {
                if (this.loginuser.user_id === "" || this.loginuser.user_nick === "" || this.loginuser.user_email === "" || this.loginuser.user_num === "" || this.loginuser.user_zipcode === "" || this.loginuser.user_adr1 === "" || this.loginuser.user_adr2 === ""){
                
                this.$swal('모든 항목을 입력해주세요');

            } else {

                const response = await axios.post('http://localhost:3000/mypage/mypageupdate', {
                    user_no: this.user.user_no,
                    user_id: this.loginuser.user_id,
                    user_nick: this.loginuser.user_nick,
                    user_email: this.loginuser.user_email,
                    user_num: this.loginuser.user_num,
                    user_zipcode: this.loginuser.user_zipcode,
                    user_adr1: this.loginuser.user_adr1,
                    user_adr2: this.loginuser.user_adr2,

                });

                if (response.data) {

                    console.log(response.data.message);
                    this.$swal('수정 완료!');
                    this.loginuser = response.data;
                    this.$router.push({ path: '/mypage' });
                } else {
                    console.log(response.data.message);
                    this.$swal('수정 실패');
                }
            }
            } catch (error) {
                console.error({ error: '수정실패, 오류가 일어났습니다.'});
            }
                
        //    axios.get('http://localhost:3000/mypage/mypageupdate', {
        //             user_no: this.user.user_no,

        //             user_id: this.loginuser.user_id,
        //             user_nick: this.loginuser.user_nick,
        //             user_email: this.loginuser.user_email,
        //             user_num: this.loginuser.user_num,
        //             user_zipcode: this.loginuser.user_zipcode,
        //             user_adr1: this.loginuser.user_adr1,
        //             user_adr2: this.loginuser.user_adr2,

        //         })
        //         .then((res) => {
        //             if (res.data.message === 'success') {
        //                 console.log(res.data);
        //                 this.$swal('수정 완료!');
        //                 this.$router.push({ path: '/mypage' });
        //             } else {
        //                 console.log(res.data);
        //                 this.$swal('수정 실패!');
        //             }
        //         })
        //         .catch((err) => {
        //             console.log(err);
        //             this.$swal('수정 실패, 오류가 일어났습니다');
        //         });
        //     }
        },
        zipload() {
            new window.daum.Postcode({
                oncomplete: (data) => {
                    let addr = '';
                    let extraAddr = '';

                    if (data.userSelectedType === 'R') {
                        addr = data.roadAddress;
                    } else {
                        addr = data.jibunAddress;
                    }

                    if (data.userSelectedType === 'R') {

                        if(data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
                            extraAddr += data.bname;
                        }

                        if (data.buildngName !== '' && data.apartment === 'Y') {
                            extraAddr += (extraAddr !== '' ? ',' + data.buildngName : data.buildingName);
                        }
                    }
                    this.loginuser.user_zipcode = data.zonecode;
                    this.loginuser.user_adr1 = addr;
                    this.loginuser.user_adr2 = extraAddr;
                    this.loginuser.zipinput = true;
                }
            }).open();
        },

        validatePhoneNumber() {
            this.loginuser.user_num = this.loginuser.user_num.replace(/\D/g, ''); // 숫자 이외의 문자 제거
        },
        goToPass() {
            this.$router.push({ path: '/mypage/passwd'});
        },
        async userinfo() {
            const response = await axios.post(`http://localhost:3000/mypage/${this.user.user_no}`);
            this.logininfo = response.data[0];
        }
        
    }
}
</script>
<style scoped>
* {
    margin: 0;
    padding: 0;
}

ul, li {
    list-style: none;
}

a {
    text-decoration: none;
}

@font-face {
    font-family: 'GmarketSansMedium';
    src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2001@1.1/GmarketSansMedium.woff') format('woff');
    font-weight: normal;
    font-style: normal;
}

input:focus {
    outline: 2px solid #ffc905;
}

.container {
    display: block;
    margin-top: 170px;
    margin-left: 50px;
    font-family: GmarketSansMedium;
}

h2 {
    margin: 20px 0 40px 0;
}

.form {
    margin-bottom: 20px;
    display: flex;
}

.form .m_content {
    width: 140px;
    vertical-align: middle;
    padding: 10px 0;
    margin-right: 20px;
}

.form .in {
    display: flex;
    align-items: center;
    width: 74%;
    height: 40px;
    font-size: 1rem;
    font-family: GmarketSansMedium;
    padding-left: 20px;
    color: rgb(137, 137, 137);
    border: 2px solid rgb(221, 221, 221);
    border-radius: 10px;
}

.form2 {
    margin-bottom: 10px;
    display: flex;
    height: 50px;
}

.form2 .m_content2 {
    width: 140px;
    padding: 14px 0;
}

.form2 .put3 input {
    display: flex;
    align-items: center;
    width: 20vw;
    height: 40px;
    font-size: 1rem;
    font-family: GmarketSansMedium;
    padding-left: 20px;
    margin: 0 1px 0 30px;
    color: rgb(137, 137, 137);
    border: 2px solid rgv(221, 221, 221);
    border-radius: 10px;
}

.form2 .put3 {
    display: flex;
    width: 100%;
    height: 40px;

}

.form2 .btn {
    height: 42px;
    width: 10rem;
    position: relative;
    padding: 8px 10px;
    font-size: 14px;
    font-family: GmarketSansMedium;
    color: rgb(123, 123, 123);
    border: 2px solid rgb(221, 221, 221);
    border-radius: 10px;
    cursor: pointer;
}

.form3 {
    display: grid;
    align-items: center;
    position: relative;
    height: auto;
    margin: 0px 0px 10px 0px;
    padding: 0 0 0px 156px;
}

.form3 .put2 {
    display: block;
    align-items: center;
    width: 74%;
    height: 40px;
    font-size: 1rem;
    padding-left: 20px;
    font-family: GmarketSansMedium;
    color: rgb(137, 137, 137);
    border: 2px solid rgb(221, 221, 221);
    border-radius: 10px;
    margin-right: 0px;
}

.form3 input:nth-last-child(2) {
    margin-bottom: 10px;
}

.passwd {
    color: #807e7e;
    margin: 40px 0 10px 0;
    cursor: pointer;

}

.form button {
    width: 69vw;
    height: 50px;
    margin: 60px 0;
    font-family: GmarketSansMedium;
    font-size: 18px;
    color: #cc8c00;
    border: 2px solid #ffbc2b;
    background-color: #fff2c9;
    border-radius: 10px;
    cursor: pointer;
}

.form button:hover {
    color: #fff2c9;
    border: 2px solid #ffbc2b;
    background-color: #ffbc2b;
    border-radius: 10px;
    cursor: pointer;
}
</style>