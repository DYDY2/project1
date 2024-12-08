<template>
	<div><h1 class="user-qna" style="margin-left:450px; margin-top:50px">고객문의 내역</h1>
		<form>
			<div class="form-container">
				<div v-for="item in content" :key="item.qna_no" class="post">
					<div class=text>
						<label class="head_writer" style="font-size: 17px; font-weight: bold;">작성자</label>&nbsp;&nbsp;<label
							class="writer" style="font-size: 18px; font-style: bold;">{{ content[0].user_nick }}</label>
						<ul></ul>
						<div class=t2><label class="head_title" style="font-size: 17px; font-weight: bold;">제목</label></div>
						<div class=t1><textarea class="text2" :disabled="editable === false" v-model="content[0].qna_tit"
								style="font-size: 17px;" readonly></textarea></div>
						<label class="head_text" style="font-size: 17px; font-weight: bold;">내용</label>
						<ul></ul>
						<textarea class="text1" :disabled="editable === false" v-model="content[0].qna_content"
							style="font-size: 17px;" readonly></textarea>
						
						<button type="button" class="main_btn" onclick="location.href='/admin/qna?page=1'">목록으로</button>
						<button type="button" class="btn" @click="moveToWrite(item)">답변 작성</button>
						<div class="area" v-for="item in content" :key="item.qna_no">
							<form v-if="content[0].qna_ans != null" class="answer">
								<label class="head_answer" style="font-size: 17px; font-weight: bold;">답변</label>

								<div class="wirte_A">
									<textarea class="text3" v-model="content[0].qna_ans" style="font-size: 17px;"
										readonly></textarea>
								</div>
							</form>
						</div>

					</div>

				</div>
			</div>
		</form>
	</div>
</template>
  
	
<script>
import axios from 'axios';

export default {
	data() {
		return {
			content: [],
			editable: true,
		}
	},
	computed: {
		user() {
			return this.$store.state.user; 
		},
	},
	mounted() {
		axios({
			url: "http://localhost:3000/admin/qnacontent",
			method: "POST",
			data: {
				qna_no: this.$route.query.qna_no
			},
		}).then(res => {
			this.content = res.data;
		}).catch(err => {
			alert(err);
		});
	},
	methods: {

		deleteContent(qna_no) {
			axios({
				url: "http://localhost:3000/admin/delete",
				method: "POST",
				data: {
					qnano: qna_no
				},
			}).then(res => {
				this.content = res.data;
				this.$router.push('/qnamain?page=1');
			}).catch(err => {
				alert(err);
			});

		},
		editContent() {
			if (this.user.user_no != this.content[0].user_no) {
				this.$swal("본인이 작성한 글만 수정 가능합니다.")
			} else {

				this.editable = true;
			}

		},
		navigateToQnaMain() {
			this.$router.push('/qnamain?page=1');
		},

		confirmEditContent() {
			axios.post("http://localhost:3000/admin/edit", {
				content: this.content[0].qna_content,
				tit: this.content[0].qna_tit,
				qnano: this.content[0].qna_no,
			})
				.then(response => {
					console.log(response.data);
				})
				.catch(error => {
					console.log(error);
				});
			this.$swal("수정완료");
			this.$router.push('/qnamain?page=1');
		},
		QnaMain() {
			this.$router.push({ path: '/admin/qna?page=1' })
		},
		moveToWrite(item) {
			window.location.href = window.location.pathname + '/write?qna_no=' + item.qna_no
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


div {
	font-family: 'GmarketSansMedium';


}

.form {

	resize: none;
	padding: 20px;
}

.text {
	position: relative;
	margin-bottom: 100px;
	text-align: left;
	font-family: 'GmarketSansMedium';

}

.text1 {
	resize: none;
	width: 800px;
	height: 200px;

	font-family: 'GmarketSansMedium';
}

.text2 {
	resize: none;
	width: 800px;
	height: 25px;
	font-family: 'GmarketSansMedium';

}

.btn_all {
	position: relative;
	top: -38px;
}

.btn {
	display: block;
	width: 10%;
	height: 41px;
	padding: 10px;
	background-color: #dfdede;
	color: black;
	border: black;
	border-radius: 4px;
	cursor: pointer;
	position: relative;
	left: 725px;
	top: -40px;
	font-family: 'GmarketSansMedium';
}

.btn1 {
	display: block;
	width: 7%;
	padding: 10px;
	background-color: skyblue;
	color: black;
	border: black;
	border-radius: 4px;
	cursor: pointer;
	position: relative;
	left: 680px;
	top: -36px;
	font-family: 'GmarketSansMedium';
}

.btn2 {
	display: block;
	width: 10%;
	padding: 10px;
	background-color: skyblue;
	color: black;
	border: black;
	border-radius: 4px;
	cursor: pointer;
	position: relative;
	left: 655px;
	top: -36px;
	font-family: 'GmarketSansMedium';
}

.main_btn {
	display: block;
	width: 10%;
	padding: 12px;
	background-color: #dfdede;
	color: black;
	border: black;
	border-radius: 4px;
	cursor: pointer;

	font-family: 'GmarketSansMedium';

}

.main_btn2 {
	display: block;
	width: 10%;
	padding: 10px;
	background-color: rgb(255, 225, 160);
	color: black;
	border: black;
	border-radius: 4px;
	cursor: pointer;
	position: relative;
	top: -70px;
	font-family: 'GmarketSansMedium';
}

.form-container {

	display: flex;
	justify-content: center;
	align-items: center;
	height: 720px;
	position: relative;
	top: 50px;
}

.btn:hover {
	background-color: #aeaeae;
}

.btn1:hover {
	background-color: rgb(29, 170, 226);
}

.btn2:hover {
	background-color: rgb(29, 170, 226);
}

.btn3:hover {
	background-color: rgb(53, 174, 222);
}

.t1 {
	margin-bottom: 0px;
}

.t2 {
	margin-bottom: 5px;
}

label.head_text {
	position: relative;
	top: 10px;
}

.text3:focus {
	outline: none;
}

.text2:focus {
	outline: none;
}

.text1:focus {
	outline: none;
}

form.answer {

	justify-content: center;
	position: relative;



}

.text3 {
	resize: none;
	width: 800px;
	height: 100px;

	font-family: 'GmarketSansMedium';
}

div.wirte_A {
	width: 80%;
}
</style>