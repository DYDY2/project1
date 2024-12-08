<template>
    <main class="mt-5">
        <div class="login-form">
            <div class="logo">
                <img src='../assets/logo.png'>
            </div>
            <div>
                <input type="id" @keyup.enter="login()" class="form-control" placeholder="아이디" v-model="user_id" />
                <label for="floatingInput"></label>
            </div>

            <div>
                <input type="password" @keyup.enter="login()" class="form-control" placeholder="비밀번호" v-model="user_passwd" />
                <label for="floatingPassword"></label>
            </div>

            <div>
                <button type="button" class="btn" @click="login">로그인</button>
                <img src="../assets/kakaoLogin.png" class="btn_kakao" @click="kakaoLogin">
               <!-- <img src="../assets/naverLogin.png" class="btn_naver" @click="naverLogin">-->
              <div id="naverIdLogin" @click="naverlogin" img src="../assets/naverLogin.png"></div>
            </div>

            <div class="find" @click="goToFind">아이디 / 비밀번호 찾기 </div>
             <div class="find" style="margin-top: -48px; margin-left: 270px;" @click="goToJoin"> | 회원가입 </div>
        </div>
    </main>
</template>
    
<script>
import axios from 'axios';

export default {
    data() {
        return {
            user_id: '',
            naver_id: '',
            user_passwd: '',
            naverLogin: [],
        };
    },
    computed: {
        user() {
            return this.$store.state.user; 
        },
    },
   mounted() {
        console.log(this.naverLogin.user);
        this.naverLogin = new window.naver.LoginWithNaverId({
            clientId: "PBtIjZe0JJYrTjvz13lR",
            callbackUrl: "http://localhost:8080/",
            isPopup: true,
            loginButton: {
                color: "green", type: 3, height: 45,
            },
        });
        this.$store.commit("naverLogin", this.naverLogin);

        this.naverLogin.init();

        this.naverLogin.getLoginStatus((status) => {
            if (status) {
                console.log(status);
                console.log(this.naverLogin.user.nickname);

                const email = this.naverLogin.user.email;
                const id = this.naverLogin.user.id;
                const nick = this.naverLogin.user.nickname;

                this.naver_id = id;

                console.log(email)
                console.log(nick)

            } else {
                console.log("callback처리 실패");
            }
        });

    },
    methods: {
        login() {
            axios({
                url: "http://localhost:3000/auth/login_process",
                method: "POST",
                data: {
                    user_id: this.user_id,
                    user_passwd: this.user_passwd
                },
            })
                .then(res => {
                    if (res.data.message == 'undefined_id') {
                        this.$swal("존재하지 않는 아이디입니다.")
                    }
                    else if (res.data.message == 'incorrect_pw') {
                        this.$swal("비밀번호가 틀렸습니다.")
                    }
                    else {
                        this.$store.commit("user", { user_id: this.user_id, user_no: res.data.message })
                        this.$swal({
                            position: 'top',
                            icon: 'success',
                            title: '로그인 성공!',
                            showConfirmButton: false,
                            timer: 1000
                        })
                        this.$router.push({ path: '/' });  // 메인 화면으로 이동
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        },

        goToFind() {
            this.$router.push({ path: 'find' });
        },
        goToJoin() {
            this.$router.push({ path: 'join' });
        },
        //=====================================================카카오==========================================//0
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
                        url: "http://localhost:3000/auth/kakaoLoginProcess",
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
                            this.$store.commit("user", { user_id: email, user_no: res.data.message })
                            this.$swal({
                                position: 'top',
                                icon: 'success',
                                title: '로그인 성공!',
                                showConfirmButton: false,
                                timer: 1000


                            }).then(() => {
                                window.location.href = "http://localhost:8080";
                            })

                        }
                    })
                        .catch(err => {
                            console.log(err);
                        })


                },
                fail: (error) => {
                    // this.$router.push("/errorPage");
                    console.log(error);
                },
            });

        },


        //==========================================================네이버==========================================//
        naverlogin() {
            console.log("로그인함수 실행됨")
            axios({
                url: "http://localhost:3000/auth/naverlogin",
                method: "POST",
                data: {
                   //  naverlogin: this.naverLogin.accessToken.accessToken,
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
                            timer: 1500
                        });



                    } else {
                        this.$store.commit("user", { user_id: this.naver_id, user_no: res.data.message })

                        this.$swal({
                            position: 'top',
                            icon: 'success',
                            title: '로그인 성공!',
                            showConfirmButton: false,
                            timer: 1000,

                        }).then(() => {
                            window.location.href = "http://localhost:8080";
                        })


                    }
                })
                .catch(err => {
                    console.log(err);
                })
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


* {
    padding: 0;
    margin: 0;

}

.logo img {
    width: auto;
    height: auto;
    max-width: 300px;
    display: block;
    margin: auto;
    position: relative;
    top: 40px;
}

.login-form {
    display: grid;
    width: 450px;
    height: 600px;
    margin: 6% auto;
    border: solid 2px rgb(237, 237, 237);
    background-color: #fcf9db;
    background: linear-gradient(180deg, rgb(253, 238, 204), rgb(253, 245, 221));
    box-shadow: 0px 1px 30px 2px rgb(238, 238, 238);
    border-radius: 30px;
}

.login-form .form-control {
    height: 48px;
    width: 240px;
    font-size: 16px;
    display: inline;
    margin-left: 20%;
    margin-bottom: 10px;
    border: solid 2px rgb(237, 237, 237);
    text-align: center;
    border-radius: 8px;
    position: relative;
    top: 90px;
    font-family: 'GmarketSansMedium';
}

input::placeholder {
    color: #aaa;
}

input:focus {
    outline: 2px solid #ffc905;
}

.login-form .btn {
    height: 48px;
    width: 242px;
    font-size: 16px;
    display: inline;
    margin-left: 20%;
    margin-bottom: 50px;
    border: solid 2px rgb(255, 204, 122);
    border-radius: 8px;
    background-color: rgb(255, 210, 107);
    position: relative;
    top: 110px;
    font-family: 'GmarketSansMedium';
}

.login-form .btn:hover {
    cursor: pointer;
}

/* sns btn */
.login-form .btn_kakao {
    scale: 45%;
    position: relative;
    left: -37px;
    top: 30px;


}

.login-form .btn_naver {
    scale: 34%;
    position: relative;
    left: 33px;
    top: 0px;

}


.login-form .btn_kakao:hover {
    cursor: pointer;
}

.login-form .btn_naver:hover {
    cursor: pointer;
}

/* .login-form .img-fluid {
    width: 175px;
    height: 38px;
    cursor: pointer;
} */

.find {
    position: relative;
    bottom: 2px;
    height: 30px;
    margin-left: 125px;
    padding-top: 10px;
    font-size: 0.8rem;
    color: #aaa;
    cursor: pointer;
    /* border: 1px solid red; */
}

#naverIdLogin {
    scale: 114%;
    left: 144px;
    top: -1px;
    position: relative;
}</style>