const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require('../db.js');
const sql = require('../sql.js');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// 업로드 할 디렉토리 설정
const uploadDirectory = 'myImg/';

// 디렉토리가 없으면 생성
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory);
}

// 업로드에 필요한 multer 설정
const storage = multer.diskStorage({
  // destination은 파일이 저장될 경로
  destination: function(req, file, cb) {
    cb(null, uploadDirectory);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage});

router.post('/upload', upload.single('image'), (req, res) => {
  // 업로드 완료 후 처리 로직
  // console.log(res);
  try {
    
    res.json({ filename: req.file.filename });
  
  } catch(error) {
    console.error(error);
  }

});


// 내 게시글 목록 불러오기
router.post('/getMyReview', (req, res) => {
    const { userno, page, limit } = req.body;
    
    // 기본값 설정
    let pageNum = parseInt(page, 10) || 1;
    let limitNum = parseInt(limit, 10) || 10;
    const offset = (pageNum - 1) * limitNum;
  
    db.query(sql.get_my_review, [userno, limitNum, offset], function (error, result) {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'error' });
      } else {
        res.send(result);
      }
    });
  });
  
  // qna 글 갯수 불러오기
  router.post('/my_review_count', (req, res) => {
    const { userno } = req.body;
  
    db.query(sql.get_my_review_count, [userno], (error, results, fields) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: '에러' });
      }
      return res.status(200).json(results[0].count);
    });
  });

// 게시글 삭제 라우트
router.post('/reviewdelete', (req, res) => {
  const { reviewno } = req.body;
  console.log('Received review_no:', reviewno); // review_no 값 로그 출력

  db.query(sql.deletereview, [reviewno], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    console.log('Delete Result:', result); // 쿼리 결과 로그 출력
    res.json(result);
  });
});
  
  // qna목록 불러오기
  router.post('/myqna_list', (req, res) => {
    let { userno, page, limit } = req.body;
    
    // 기본값 설정
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);
    
    if (isNaN(page) || page < 1) page = 1;  // page가 유효하지 않으면 기본값 1로 설정
    if (isNaN(limit) || limit < 1) limit = 10;  // limit가 유효하지 않으면 기본값 10으로 설정
    
    const offset = (page - 1) * limit;
  
    db.query(sql.myqna, [userno, limit, offset], function (error, result) {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'error' });
      } else {
        res.send(result);
      }
    });
  });
    
  // qna 글 갯수 불러오기
  router.post('/qna_count', (req, res) => {
    const { userno } = req.body;
  
    db.query(sql.my_qnacnt, [userno], (error, results, fields) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: '에러' });
      }
      return res.status(200).json(results[0].count);
    });
  });
  
  // 내 게시글 목록 불러오기
  router.post('/myboard_list', (req, res) => {
    const { userno, page, limit } = req.body;
    
    // 기본값 설정
    let pageNum = parseInt(page, 10) || 1;
    let limitNum = parseInt(limit, 10) || 10;
    const offset = (pageNum - 1) * limitNum;
  
    db.query(sql.myboard, [userno, limitNum, offset], function (error, result) {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'error' });
      } else {
        res.send(result);
      }
    });
  });
  
  // 내 게시글 갯수 불러오기
  router.post('/myboard_count', (req, res) => {
    const { userno } = req.body;
  
    db.query(sql.myboard_cnt, [userno], (error, results, fields) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: '에러' });
      }
      return res.status(200).json(results[0].count);
    });
  });

// 사용자 정보 조회
// router.post('/:user_no', function (req, res) {
//     const userno = req.params.user_no;
//     db.query(sql.user_info, [userno], function(error, results, fields) {
//         if(error) {
//             return res.status(500).json({ error: '없는 사용자입니다'});
//         }
        
//         return res.json(results);
//     });
// })
// 사용자 정보 조회
router.get('/:user_no', function (req, res) {
  const userno = req.params.user_no;
  console.log(userno);
  db.query(sql.user_info, [userno], function(error, results, fields) {
      if(error) {
          return res.status(500).json({ error: '없는 사용자입니다'});
      }
      console.log(results);
      return res.json(results);
  });
})


// 계정 삭제
// router.delete('/delete/:user_no', function (req, res) {
//   const userno = req.params.user_no;
//   db.query(sql.user_delete, [userno], function(error, results, fields) {
//       if(error) {
//           return res.status(500).json({ error: '삭제 실패' });
//       }
//       console.log(results);
//       return res.json(results);
//   });
// });

router.post('/delete/:user_no', async (req, res) => {
  const userno = req.params.user_no;
  await db.query(sql.soft_Dele, [userno], function(error, results, fields) {
      if(error) {
          return res.status(500).json({ error: '삭제 실패' });
      }
      console.log(results);
      return res.json(results);
  });
});

//카카오 탈퇴
// router.delete('/kakaoDelete', function(req, res) {
// const kakao = req.body;

// db.query(sql.kakao_delete, [kakao.user_no, kakao.user_id], function(error, results) {
//     if (error) {
//         console.error(error);
//         return res.status(500).json({ error: '삭제실패' });
//     }
//     return res.status(200).json({ message: '성공적으로 삭제되었습니다' });
// });
// });

// 사용자 정보 수정
router.post('/mypageupdate', function (req, res) {
    const update = req.body;
    db.query(sql.user_update, [update.user_id, update.user_nick, update.user_email, update.user_num, update.user_zipcode, update.user_adr1, update.user_adr2, update.user_no], function (error, results, fields) {
        if (error) {
            
            return res.status(500).json({ error: '실패' });
        }
        return res.json(results);
    });
});

//사용자 비밀번호 변경
router.post('/passupdate', function(req, res) {
  const pass = req.body;

  db.query(sql.pass_info, [pass.user_no], function (error, results, fields) {
      if (results.length <= 0) {
          if (error) {
              return res.status.json({ message: '에러'});
          }
      } else {
          const same = bcrypt.compareSync(pass.user_pw, results[0].user_passwd);
          if (!same) { // 비밀번호 틀릴 시
              return res.status(200).json({ message: 'pw_ck' });
          }

          const encryptedNewPW = bcrypt.hashSync(pass.user_npw, 10);

          db.query(sql.pass_update, [encryptedNewPW, pass.user_no], function (error, results, fields) {
              if(error) {
                console.log(results);
                  return res.status(500).json({ message: '에러' });
              }
              console.log(results);
              return res.status(200).json({ message: 'success'});
          });
      }
  });
});


// 좋아요 목록 조회

router.post('/like/:user_no', function (req, res) {
    const userno = req.params.user_no;

        db.query(sql.mylike, [userno], function (error, results, fields) {
            if (error) {
                console.error(error);
            }
            console.log(results);
            return res.json(results);
        })
    

    // if (mylike_tv.good_cate) {
    //     db.query(sql.mylike_tv, [userno], function (error, results, fields) {
    //         if(error) {
    //             console.log(error);
    //         }
    //         console.log(results);
    //         return res.json(results);
    //     });
    // } else if(mylike_fs.good_cate) {
    //     db.query(sql.mylike_fs, [userno], function (error, results, fields) {
    //         if(error) {
    //             console.log(error);
    //         }
    //         console.log(results);
    //         return res.json(results);
            
    //     });
    // }
    
})



module.exports = router;