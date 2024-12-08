<template>
    <div class="form">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
        <div class="pwupdate-form">
            <div class="logo">
                <img src="../assets/logo.png" alt="로고 이미지">
            </div>

            <div class="pass">
                <input type="password" class="form-control" placeholder="기존 비밀번호" v-model="user_pw" />
                <label for="floatingPassword"></label>
                <div class="pw" @click="oneyes('pass')">
                    <i class="bi bi-key"></i>
                </div>
            </div>

            <div class="npass">
                <input type="password" class="form-control" placeholder="새 비밀번호" v-model="user_npw" />
                <label for="fa floatingPassword"></label>
                <div class="pw" @click="oneyes('npass')">
                    <i class="bi bi-key"></i>
                </div>
            </div>
            <div class="confirm">
                <input type="password" class="form-control" placeholder="비밀번호 확인" v-model="user_pw_ck" />
                <label for="fa floatingPassword"></label>
                <div class="pw" @click="oneyes('confirm')">
                    <i class="bi bi-key"></i>
                </div>
            </div>
            <div>
                <button class="btn" type="button" @click="onSubmitForm">비밀번호 변경</button>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
    return {
        user_pw: '',
        user_npw: '',
        user_pw_ck: '',
        user_no: ''
    };
}, 
    mounted() {
        if (this.user.user_no === '') {
            this.$swal('로그인을 해주세요');
            this.$router.push({ path: '/login' });
        } else {
            this.user_no = this.user.user_no;

            console.log("유저 번호:", this.user_no);
        }
    },
    computed: {
        user() {
            return this.$store.state.user;
        }
    },
    methods: {
        async onSubmitForm() {

         try { 
                if( this.user_pw === "" || this.user_npw === "" || this.user_pw_ck === "") {
                    this.$swal("모든 항목을 입력해주세요");
                } else if (this.user_npw !== this.user_pw_ck) {
                    this.$swal("새 비밀번호와 비밀번호 확인이 일치하지 않습니다.");
                } else {
                    const response = await axios.post('http://localhost:3000/mypage/passupdate', {
                        user_no: this.user_no,
                        user_pw: this.user_pw,
                        user_npw: this.user_npw,
                        user_pw_ck: this.user_pw_ck
                    });

                    if(response.data.message === 'success') {

                        this.$swal("수정이 완료되었습니다.");
                        console.log("비밀번호:", response.data);
                        this.$router.push({ path: '/mypage' });

                    } else if (response.data.message === 'pw_ck') {
                        console.log("비밀번호:", response.data);
                        this.$swal("비밀번호가 틀립니다.");
                    } else {
                        this.$swal("알 수 없는 오류가 발생했습ㅂ니다.")
                    }
            }} catch(err) {
                console.log(err);
                this.$swal("수정에 실패했습니다.")
            }
        },
        oneyes(field) {
            //field는 클래스명
            const passwordInput = document.querySelector(`.${field} input`);
            const eyeIcon = document.querySelector(`.${field} .pw`);
            let isMouseDown = false;

            eyeIcon.addEventListener('mousedown', () => {
                passwordInput.type = 'text';
                isMouseDown = true;
            });

            document.addEventListener('mouseup', () => {
                passwordInput.type = 'password';
                isMouseDown = false;
            });

            passwordInput.addEventListener('blur', () => {
                passwordInput.type = 'password';
                isMouseDown = false;
            });

            passwordInput.addEventListener('focus', () => {
                if (isMouseDown) {
                    passwordInput.type = 'text';
                }
            });
        }
    }
};
</script>

<style scoped>
@font-face {
    font-family: 'GmarketSansMedium';
    src: url("https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2001@1.1/GmarketSansMedium.woff") format('woff');
    font-weight: normal;
    font-style: normal;
}

* {
    padding: 0;
    margin: 0;
}

i {
    position: relative;
    display: flex;
    scale: 160%;
    left: 30%;
    top: 17%;
}

.logo img {
    width: auto;
    height: auto;
    max-width: 300px;
    display: block;
    margin: auto;
    position: relative;
    top: 40px;
    right: -4px;
    box-shadow: 0 1px 1px #ccc;
}

.pwupdate-form {
    width: 400px;
    height: 500px;
    margin: 8% auto;
    border-radius: 30px;
}

.pwupdate-form .form-control {
    height: 48px;
    width: 240px;
    font-size: 16px;
    display: inline;
    margin-left: 20%;
    margin-bottom: 10px;
    border: solid 1.5px rgb(230, 230, 230);
    text-align: center;
    border-radius: 8px;
    position: relative;
    top: 90px;
    font-family: 'GmarketSansMedium';
}

input:focus {
    outline: 2px solid #ffc905;
}

.pwupdate-form .pass input, .pwupdate-form .npass input, .pwupdate-form .confirm input {
    position: relative;
    display: flex;
    float: left;
}

.form-control input {
    position: relative;
    left: 0;
    top: 0;
    resize: none;
    -moz-appearance: textfield;
    -webkit-appearance: textfield;
}

.pass .pw {
    display: inline-block;
    position: relative;
    height: 40px;
    top: 90px;
    width: 30px;
    padding: 10px 8px 0px 8px;
    font-size: 20px;
    cursor: pointer;
    color: #a1a1a1;
}

.npass .pw {
    display: inline-block;
    position: relative;
    height: 40px;
    top: 100px;
    width: 30px;
    padding: 10px 8px 0px 8px;
    font-size: 20px;
    cursor: pointer;
    color: #a1a1a1;
}

.confirm .pw {
    display: inline-blcok;
    position: relative;
    height: 40px;
    top: 110px;
    width: 30px;
    padding: 10px 8px 0px 8px;
    font-size: 20px;
    cursor: pointer;
    color: #a1a1a1;
}

.pwupdate-form .btn {
    height: 48px;
    width: 242px;
    font-size: 16px;
    display: inline;
    margin-left: 20%;
    margin-bottom: 40px;
    border: solid 2px rgb(255, 204, 122);
    border-radius: 8px;
    background-color: rgb(255, 210, 107);
    position: relative;
    top: 110px;
    font-family: 'GmarketSansMedium'; 
}

.pwupdate-form .btn:hover {
    cursor: pointer;
}
</style>