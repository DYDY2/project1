<template>
    <div>
      <div class="content" v-for="board in content" :key="board.board_no">
        <div class="board_content">
          <label class="t2">작성자</label>&nbsp;&nbsp;
          <label class="writer" style="font-size: 17px; font-style: bold;">{{ content[0].user_nick }}</label>
  
          <div class="card d-flex flex-row">
            <!-- 이미지 칸 -->
            <div class="main-image text-center"> <!-- 가운데 정렬 추가 -->
              <img
                v-if="!board.board_img"
                src="../assets/img_notReady.png"
                alt="..."
                width="20%"
              />
              <img
                v-else
                :src="require(`../../../node-back/uploads/${board.board_img}`)"
                alt="..."
                width="20%"
              />
            </div>
          
          <div class="t2">제목</div>
          <textarea class="text2" :disabled="editable === false" v-model="content[0].board_tit" style="font-size: 17px;"></textarea>
  
          <div class="t2">내용</div>
          <textarea class="text1" :disabled="editable === false" v-model="content[0].board_content" style="font-size: 17px;"></textarea>
        </div>
  
        <div class="btn-area">
          <div v-if="this.user.user_no == this.content[0].user_no" class="right_btn">
            <button type="button" class="btn" @click="editContent()" v-if="editable === false">수정</button>
            <button type="button" class="btn" @click="confirmEditContent()" v-else>수정완료</button>
            <button type="button" class="btn" @click="confirmDeleteContent(board.board_no)">삭제</button>
          </div>
        </div>
  
        <!-- 댓글 작성 폼 -->
        <div @submit.prevent="commentwrite">
          <textarea v-model="newcomment" class="text3" placeholder="댓글을 작성해주세요"></textarea>
          <button type="button" class="commentwrite" @click="commentwrite">댓글 작성</button>
        </div>
  
        <!-- 댓글 목록 -->
        <div v-for="comment in comments" :key="comment.comment_id">
          <p>{{ comment.user_nick }} : {{ comment.comment_content }}</p> <button type="button" class="commentwrite" @click="commentwrite">댓글 삭제</button>
          <button @click="showReplyForm(comment.comment_id, $event)">대댓글</button>
           <button @click="showReplyForm(comment.comment_id, $event)">대댓글삭제</button>
          <div v-if="replyFormVisible === comment.comment_id">
            <textarea v-model="replyContent" class="text3" placeholder="대댓글을 작성해주세요"></textarea>
            <button @click="submitReply(comment.comment_id)">대댓글 작성</button>
          </div>
          <div v-if="comment.replies && comment.replies.length">
            <div v-for="reply in comment.replies" :key="reply.comment_id" style="margin-left: 20px;">
              <p>{{ reply.user_nick }} : {{ reply.comment_content }}</p>
            </div>
          </div>
        </div>
  
        <div class="btn_area">
          <button type="button" class="main_btn" @click="boardMain">목록으로</button>
        </div>
      </div>
    </div>
    </div>
  </template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      comments: [],
      content: [],
      board_no: this.$route.query.board_no,
      editable: false,
      newcomment: '',
      replyFormVisible: null,
      replyContent: ''
    }
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
  },
  mounted() {
    this.loadContent();
    this.loadComments();
  },
  methods: {
    confirmDeleteContent(board_no) {
			if (this.user.user_no != this.content[0].user_no) {
				this.$swal("본인이 작성한 글만 삭제 가능합니다.")
			} else {
				this.$swal({
					title: `${board_no}번 게시글을 삭제하시겠습니까?`,
					icon: 'board',
					showCancelButton: true,
					confirmButtonText: '삭제',
					cancelButtonText: '취소',
					reverseButtons: true
				}).then(result => {
					if (result.value) {
						this.deleteContent(board_no);
						this.$swal({
							position: 'top',
							icon: 'success',
							title: '삭제되었습니다',
							showConfirmButton: false,
							timer: 1500
						});
						this.$router.push('/boardmain?page=1');
					}
				});
			}
		},
		deleteContent(board_no) {
			axios({
				url: "http://localhost:3000/bd/delete",
				method: "POST",
				data: {
					boardno: board_no
				},
			}).then(res => {
				this.content = res.data;
				window.location.href = '/board?page=1';
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
		navigateToBoardMain() {
			this.$router.push('/board?page=1');
		},
		confirmEditContent() {
			axios.post("http://localhost:3000/bd/edit", {
				content: this.content[0].board_content,
				tit: this.content[0].board_tit,
				no: this.content[0].board_no
			})
			.then(() => {
				this.$swal("수정완료");
				this.editable = false;
			})
			.catch(error => {
				console.log(error);
			});
		},
		boardMain() {
			this.$router.push('/board?page=1');
		},
    loadContent() {
      axios.post("http://localhost:3000/bd/boardcontent", {
        board_no: this.board_no
      }).then(res => {
        this.content = res.data;
      }).catch(err => {
        alert(err);
      });
    },
    commentwrite() {
      axios.post('http://localhost:3000/bd/comment_write', {
        board_no: this.board_no,
        user_no: this.$store.state.user.user_no,
        comment_content: this.newcomment,
        parent_comment_id: null
      })
      .then(() => {
        this.newcomment = '';
        this.loadComments();
      })
      .catch(error => {
        console.log(error);
        alert('댓글 작성 중 오류가 발생했습니다.');
      });
    },
    showReplyForm(comment_id, event) {
      event.preventDefault();
      this.replyFormVisible = comment_id;
      this.replyContent = '';
    },
    submitReply(parent_comment_id) {
      axios.post('http://localhost:3000/bd/comment_write', {
        board_no: this.board_no,
        user_no: this.$store.state.user.user_no,
        comment_content: this.replyContent,
        parent_comment_id: parent_comment_id
      })
      .then(() => {
        this.replyFormVisible = null;
        this.replyContent = '';
        this.loadComments();
      })
      .catch(error => {
        console.error(error);
        alert('대댓글 작성 중 오류가 발생했습니다.');
      });
    },
    loadComments() {
      axios.post("http://localhost:3000/bd/comment_list", {
        board_no: this.board_no
      }).then(response => {
        const comments = response.data;
        const groupedComments = comments.reduce((acc, comment) => {
          if (comment.parent_comment_id === null) {
            acc.push({ ...comment, replies: [] });
          } else {
            const parentComment = acc.find(c => c.comment_id === comment.parent_comment_id);
            if (parentComment) {
              parentComment.replies.push(comment);
            }
          }
          return acc;
        }, []);
        this.comments = groupedComments;
      }).catch(error => {
        console.log(error);
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

* {
	margin: 0;
	padding: 0;
}

div {
	font-family: 'GmarketSansMedium';
}

.content {
	margin: auto;
	padding: 30px;
	max-width: 900px;
}


.content textarea {
	width: 100%;
}

.text1 {

    width: 85%;
	resize: none;
	height: 200px;
	font-family: 'GmarketSansMedium';
}

.text2 {
	resize: none;
	height: 25px;
	font-family: 'GmarketSansMedium';
}


.main_btn {
	font-size: 16px;
	width: 80px;
	height: 40px;
	background-color: rgb(255, 225, 160);
	border: black;
	border-radius: 4px;
	cursor: pointer;
	font-family: 'GmarketSansMedium';
	vertical-align: middle;
}

.right_btn {
	margin-left: auto;
	height: 85px;
	margin: 1px;
}

.btn {
	font-size: 16px;
	width: 80px;
	height: 50px;
	margin-left: auto;
	background-color: rgb(230, 168, 84);
	border: none;
	border-radius: 4px;
	cursor: pointer;
	font-family: 'GmarketSansMedium';
	margin: 3px
}

.btn:hover {
	background-color: rgb(230, 168, 84);
}

.t2 {
	margin: 20px 0px 5px 0px;
	font-size: 17px;
	font-weight: bold;
}

.t4{
	margin: 20px 0px 5px 0px;
	font-size: 13px;
	font-weight: bold;
}

.text3:focus {
	outline: none;
}

.btn_area {
	align-items: center;
	display: flex;
	vertical-align: middle;
	height: 100px;
	margin: auto;
	padding: auto;
	justify-content: flex-start;
}


.ans {
  margin-bottom: 20px;
}

.comment-box {
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  padding: 10px 0;
}

.text4 {
  margin: auto;
  font-family: 'GmarketSansMedium';
}

.text3 {
	resize: none;
	height: 100px;
	margin-bottom: 10px;
	font-family: 'GmarketSansMedium';
}


.commentwrite {
  resize: none;
  display: block;
  margin-top: 0px;
  height: 35px;
  width: 80px;
  border: none;
  border-radius: 4px;
  background-color: rgb(230, 168, 84);
  font-family: 'GmarketSansMedium';
  font-size: 16px;
  cursor: pointer;
}

.writeans:hover {
  background-color: rgb(210, 148, 64);
}
</style>