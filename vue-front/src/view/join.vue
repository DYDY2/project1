<template>
    <div class="join_box">
        <div class="background" @submit.prevent="onSubmitForm">

            <form id="sendForm">
                <input type="text" v-model="user_id" placeholder="아이디">
                <input type="text" v-model="user_nick" placeholder="닉네임">
                <input type="email" v-model="user_email" placeholder="이메일">
                <input type="password" v-model="user_passwd" placeholder="비밀번호">
                <input type="password" v-model="user_passwd_ck" placeholder="비밀번호 확인">
                <input type="tel" @input="validatePhoneNumber" v-model="user_num" placeholder="전화번호">

                <br />
                <button class="btn" type="button" v-on:click="zipload">우편번호 찾기</button>
                <span v-show="zipinput" class="addinput">{{ user_zipcode }}</span>
                <span v-show="zipinput" class="addinput">{{ user_adr1 }}</span>
                <input type="text" v-show="zipinput" v-model="user_adr2" placeholder="상세주소 입력">

                <br />
                <button width="100px" class="btn" type="submit">가입</button>
            </form>
             <img src="../assets/kakaoLogin.png" class="btn_kakao" style="scale:55%; margin-top:-40px; margin-left:-39px" @click="kakaoLogin">
                <div id="naverIdLogin" style="scale:55%; margin-top:-40px; margin-left:-30px" @click="naverlogin" img src="../assets/naverLogin.png"></div>
            </div>
        </div>
               <!-- <img src="../assets/naverLogin.png" class="btn_naver" @click="naverLogin">
              <div id="naverIdLogin" @click="naverlogin" img src="../assets/naverLogin.png"></div>-->
        
    
</template>

<style scoped>
@font-face {
    font-family: 'GmarketSansMedium';
    src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2001@1.1/GmarketSansMedium.woff') format('woff');
    font-weight: normal;
    font-style: normal;
}

.input-error {
    line-height: 16px;
    font-size: 11px;
    color: red;
}

.title-danger {
    color: red;
}

.input-danger {
    border-bottom: 1px solid red !important;
}


.background {
    background: linear-gradient(180deg, rgb(253, 238, 204), rgb(253, 245, 221));
    height: auto;
    width: 90%;
    max-width: 450px;
    padding: 10px;
    margin: 0 auto;
    border-radius: 30px;
    box-shadow: 0px 1px 30px 2px rgb(238, 238, 238);
    text-align: center;
    position: relative;
    top: 50px;

}

div.join_box{
    position: padding;
    height: 750px;
    
}
form {
    align-items: center;
    display: flex;
    padding: 30px;
    flex-direction: column;
   
}

input,
.addinput {
    border: none;
    border-bottom: 2px solid #d49f00;
    background: none;
    padding: 10px;
    font-weight: 700;
    transition: .2s;
    width: 75%;
    font-family: 'GmarketSansMedium';
}

input:active,
input:focus,
input:hover {
    outline: none;
    border-bottom-color: #473500;
    
}

.btn {
    border: none;
    width: 75%;
    border: solid 2px rgb(255, 204, 122);
    border-radius: 8px;
    background-color: rgb(255, 210, 107);
    color: rgb(0, 0, 0);
    padding: 15px 0;
    font-weight: 600;

    cursor: pointer;
    transition: .2s;
    font-family: 'GmarketSansMedium';
}

.btn:hover {
    background-color:  rgb(255, 184, 19);
}
</style>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            user_id: '',
            user_nick: '',
            user_email: '',
            user_passwd: '',
            user_num: '',
            user_zipcode: '',
            user_adr1: '',
            user_adr2: '',

            user_passwd_ck: '',
            zipinput: false,
            naverLogin: [],
        }
    },
    computed: {
        user() {
            return this.$store.state.user; // 로그인 확인
        }
    },

    mounted() {
        this.naverLogin = new window.naver.LoginWithNaverId({
            clientId: "PBtIjZe0JJYrTjvz13lR",
            callbackUrl: "http://localhost:8080/naverlogin",
            isPopup: false,
            loginButton: {
                color: "green", type: 3, height: 115
            },
        });
        this.naverLogin.init();
    },
    methods: {

         kakaoLogin() {
            window.Kakao.Auth.login({
                scope: "profile_nickname, account_email",
                success: this.getKakaoAccount,
            });
        },
        getKakaoAccount() {
            window.Kakao.API.request({
                url: "/v2/user/me",
                success: (res) => {
                    const kakao_account = res.kakao_account;
                    const email = kakao_account.email; //카카오 이메일
                    const nickname = kakao_account.profile.nickname;
                    // this.user_id = email

                    axios({
                        url: "http://localhost:3000/auth/kakaoJoinProcess",
                        method: "POST",
                        data: {
                            user_id: email,
                            user_nick: nickname
                        },
                    }).then(res => {
                        if (res.data.message == '저장완료') {
                            this.$swal({
                                position: 'top',
                                icon: 'success',
                                title: '회원가입 성공!',
                                showConfirmButton: false,
                                timer: 1000
                            })

                        }
                        else {
                            this.$swal({
                                position: 'top',
                                title: '이미 생성된 계정이 있습니다.',
                                showConfirmButton: false,
                                timer: 1000
                            })
                        }
                        this.$router.push("/login");

                    })
                        .catch(err => {
                            console.log(err);
                        })
                },
                fail: (error) => {
                    console.log(error);
                },
            });

        },
        naverlogin() {
            // 네이버 로그인 상태를 확인한 후 회원 정보 저장
            this.naverLogin.getLoginStatus((status) => {
                if (status) {

                    var email = this.naverLogin.user.getEmail();
                    if (email === undefined || email === null) {
                        alert("이메일은 필수임");
                        this.naverLogin.reprompt();
                        return;
                    }

                    // 회원 정보 저장
                    axios({
                        url: "http://localhost:3000/auth/naverlogin",
                        method: "POST",
                        data: {
                            naverlogin: this.naverLogin.user,
                        },
                    })
                        .then(res => {
                            if (res.data.message == '저장완료') {
                                this.$swal({
                                    position: 'top',
                                    icon: 'success',
                                    title: '회원가입 성공!',
                                    showConfirmButton: false,
                                    timer: 1000
                                });
                            } else {
                                this.$swal({
                                    position: 'top',
                                    title: '이미 생성된 계정이 있습니다.',
                                    showConfirmButton: false,
                                    timer: 1000
                                });
                            }
                        })
                        .catch(err => {
                            console.log(err);
                        });
                } else {
                    console.log("callback 처리 실패");
                }
            });
        },

        onSubmitForm() {
            if (!this.validationCheck()) {
                return;
            }
            axios({
                url: "http://localhost:3000/auth/join_process",
                method: "POST",
                data: {
                    user_id: this.user_id,
                    user_nick: this.user_nick,
                    user_email: this.user_email,
                    user_passwd: this.user_passwd,
                    user_num: this.user_num,
                    user_zipcode: this.user_zipcode,
                    user_adr1: this.user_adr1,
                    user_adr2: this.user_adr2,
                },
            })
                .then(res => {
                    if (res.data.message == 'already_exist_id') {
                        this.$swal("이미 존재하는 아이디입니다.")
                    }
                    else if (res.data.message == 'DB_error') {
                        this.$swal("DB 에러 발생")
                    }
                    else {
                        this.$swal({
                            position: 'top',
                            icon: 'success',
                            title: '회원가입이 완료되었습니다!',
                            showConfirmButton: false,
                            timer: 1000
                        })
                        this.$router.push({ path: '/login' }); // 로그인 화면으로 이동
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        },

        zipload() {
            new window.daum.Postcode({
                oncomplete: (data) => {
                    // 각 주소의 노출 규칙에 따라 주소를 조합한다.
                    // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
                    var addr = ''; // 주소 변수
                    var extraAddr = '';
                    //사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
                    if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
                        addr = data.roadAddress;
                    } else { // 사용자가 지번 주소를 선택했을 경우(J)
                        addr = data.jibunAddress;
                    }
                    // 사용자가 선택한 주소가 도로명 타입일때 참고항목을 조합한다.
                    if (data.userSelectedType === 'R') {
                        // 법정동명이 있을 경우 추가한다. (법정리는 제외)
                        // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
                        if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
                            // addr += ' ';
                            extraAddr += data.bname;
                        }
                        // 건물명이 있고, 공동주택일 경우 추가한다.
                        if (data.buildingName !== '' && data.apartment === 'Y') {
                            // addr += ' ';
                            extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
                        }
                    }
                    this.user_zipcode = data.zonecode;
                    this.user_adr1 = addr;
                    this.user_adr2 = extraAddr;
                    this.zipinput = true;
                }
            }).open();
        },
        validationCheck() {
            if (this.user_id == "") {
                this.$swal("아이디를 입력하세요.");
                return false;
            }

            if (this.user_nick == "") {
                this.$swal("닉네임을 입력하세요.");
                return false;
            }

            if (this.user_email == "") {
                this.$swal("이메일 주소를 입력하세요.");
                return false;
            }

            if (this.user_passwd == "") {
                this.$swal("비밀번호를 입력하세요.");
                return false;
            }

             // 비밀번호 유효성 검사: 특수문자 포함, 8자에서 12자 사이
    const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[a-zA-Z0-9]).{8,12}$/;
    if (!passwordRegex.test(this.user_passwd)) {
        this.$swal("비밀번호는 특수문자를 포함하여 8자 이상, 12자 이하여야 합니다.");
        return false;
    }

            if (this.user_passwd_ck !== this.user_passwd) {
                this.$swal("비밀번호가 일치하지 않습니다.");
                return false;
            }

            if (this.user_num == "") {
                this.$swal('전화번호를 정확히 입력해주세요.');
                return false;
            }

            if (!this.zipinput) {
                this.$swal("우편번호를 입력하세요.");
                return false;
            }
            return true;
        },
        validatePhoneNumber() {
            this.user_num = this.user_num.replace(/\D/g, ''); // 숫자 이외의 문자 제거
        },
    },
}


</script>