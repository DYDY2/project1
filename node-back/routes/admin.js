var express = require('express');
const router = express.Router();
var db = require('../db.js');
var sql = require('../sql.js');
const fs = require('fs');
const path = require("path");
const multer = require('multer');

// 계정 삭제
router.delete('/delete', function (req, res) {
  const userno = req.body;
  console.log(userno.user_no);
  db.query(sql.user_delete, [userno.user_no], function(error, results, fields) {
      if(error) {
          return res.status(500).json({ error: '삭제 실패' });
      }
      console.log(results);
      return res.json(results);
  });
});

// 게시글 삭제
router.post('/delete', (req, res) => {
  const qnanum = req.body.qnano;

  db.query(sql.deleteContent, [qnanum], function (error, result) {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'error' });
    } else {
      res.send(result);

    }
  })

});

// qna게시글 수정
router.post('/edit', (req, res) => {
  const editQna = req.body;
  db.query(sql.qnaEdit, [editQna.content, editQna.tit, editQna.qnano], function (error, result) {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'error' });
    } else {
      res.send(result);

    }
  })

});

// 답변 작성
router.post('/write_ans', (req, res) => {
  const writeAns = req.body;
  db.query(sql.ansWrite, [writeAns.qna_ans, writeAns.qna_no], function (error, result) { 
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'error' });
    } else {
      res.send(result);

    }
  })

});

// qna 상세 내용
router.post('/qnacontent', (req, res) => {
  const qnano = req.body.qna_no;

  db.query(sql.qnaContent, [qnano], function (error, result1) {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'error' });
    } else {
      res.send(result1);


    }
  });
})

// qna 작성
router.post('/write', function (req, res) {
  const writeQna = req.body;

  db.query(sql.qnaWrite, [writeQna.user_no, writeQna.qna_tit, writeQna.qna_content, writeQna.qna_secret], function (error, result) {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'error' });
    } else {
      res.send(result);

    }
  })

});

// qna목록
router.post('/qna_list', (req, res) => {
  const qnapage = req.body;

  const offsetPage = 0 + (req.body.page - 1) * 10;
  db.query(sql.qna, [qnapage.pagesize, offsetPage], (err, result, fields) => {
    res.send(result);
  });
});

// 관리자 qna목록
router.post('/qna_admin_list', (req, res) => {

  db.query(sql.qnaAdmin, (err, result, fields) => {

    res.send(result);
  });
});

//qna 글 갯수 불러오기
router.post('/boardlistcnt', (req, res) => {
  db.query(sql.qnacnt, (error, results, fields) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: '에러' });
    }
    return res.status(200).json(results[0]['COUNT(*)']);
  });
});

// 이미지 업로더 
const upload = multer({
  storage: multer.diskStorage({
      destination(req, file, cb) {
          cb(null, 'uploads');
      },
      filename(req, file, cb) {
          cb(null, file.originalname);
      },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

// 이미지 업로드
router.post('/upload', upload.single('upload'), function(request, response) {
  
  if(!request.file) {
      return response.status(404).json({ error: '이미지 업로드를 해주세요.'});
  }
  const imagePath = request.file.path
  console.log(imagePath)
  return response.json({ imagePath: imagePath})
}), 

// 게시글 작성
router.post('/tripwrite', function (req, res) {
  const { trip_tit, trip_ads, trip_date,trip_content, trip_img, trip_sb_img, trip_sb_img2, trip_sb_img3, trip_sb_img4, trip_local_nm, trip_id, trip_category } = req.body;

  db.query(sql.trip_write, [trip_tit, trip_ads,trip_date, trip_content, trip_img, trip_sb_img, trip_sb_img2, trip_sb_img3, trip_sb_img4, trip_local_nm,  trip_id, trip_category], function (error, result) {
    if (error) {
      console.error('글 작성 에러:', error);
      return res.status(500).json({ error: '글 작성 중 오류가 발생했습니다.' });
    }
    console.log('글 작성 성공:', result);
    // 적절한 응답 처리 (예시로 결과를 그대로 클라이언트에게 반환)
    res.json(result);
  });
});

// 게시글 작성
// router.post('/fswrite', function (req, res) {
//   const { trip_tit, trip_ads, trip_content, trip_img, trip_sb_img, trip_sb_img2, trip_sb_img3, trip_sb_img4, trip_local_nm, trip_date, trip_id, trip_category } = req.body;

//   db.query(sql.fs_write, [trip_tit, trip_ads, trip_content, trip_img, trip_sb_img, trip_sb_img2, trip_sb_img3, trip_sb_img4, trip_local_nm, trip_date, trip_id, trip_category], function (error, result) {
//     if (error) {
//       console.error('글 작성 에러:', error);
//       return res.status(500).json({ error: '글 작성 중 오류가 발생했습니다.' });
//     }
//     console.log('글 작성 성공:', result);
//     // 적절한 응답 처리 (예시로 결과를 그대로 클라이언트에게 반환)
//     res.json(result);
//   });
// });

//전체 여행 리스트1
router.get('/tv/:sortCase', function (request, response, next) {


  db.query(sql.all_tv_list , function (error, results, fields) {
      if (error) {
          console.error(error);
          return response.status(500).json({ error: 'search_error' });
      }
      response.json(results);
  });
});
//전체축제리스트
router.get('/fs/:sortCase', function (request, response, next) {


  db.query(sql.all_fs_list, function (error, results, fields) {
      if (error) {
          console.error(error);
          return response.status(500).json({ error: 'search_error' });
      }
      response.json(results);
  });
});
//최신순
router.get('/all/:sortCase', function (request, response, next) {
  
      db.query(sql.all_list, function (error, results, fields) {
          if (error) {
              console.error(error);
              return response.status(500).json({ error: 'search_error' });
          }
          response.json(results);
      });
  });
//오래된순
  router.get('/all2/:sortCase', function (request, response, next) {

      db.query(sql.all_list2, function (error, results, fields) {
          if (error) {
              console.error(error);
              return response.status(500).json({ error: 'search_error' });
          }
          response.json(results);
      });
  });

// 좋아요 목록 조회

router.post('/liketrip', function (req, res) {

      db.query(sql.liketrip, function (error, results, fields) {
          if (error) {
              console.error(error);
          }
          console.log(results);
          return res.json(results);
      })
})

//admin 계정을 제외한 모든 사용자 정보 가져오기
router.get('/userinfo', function (req, res) {
  db.query(sql.admin_search, function(error, results, fields) {
      if(error) {
        console.error(error);
          return res.status(500).json({ error: '서버 에러', details: error});
      }

      if (!results || results.length === 0) {
        console.log('No results found');
        return res.status(404).json({ error: '없는 사용자입니다' });
      }
      return res.json(results);
  });
})

// //여행지 삭제
// router.post('/tvdelete', function (request, response, next) {
//   const tvno = request.body.tv_no; // Array of tv_no

//   if (!Array.isArray(tvno)) {
//     return response.status(400).json({ error: 'Invalid input' });
//   }

//   db.query(sql.tv_list_delete, [tvno], function (error, results, fields) {
//     if (error) {
//       console.error(error);
//       return response.status(500).json({ error: 'delete_error' });
//     }
//     response.json(results);
//   });
// });

// //축제 삭제
// router.post('/fsdelete', function (request, response, next) {
//   const fsno = request.body.fs_no; // Array of fs_no

//   if (!Array.isArray(fsno)) {
//     return response.status(400).json({ error: 'Invalid input' });
//   }

//   db.query(sql.fs_list_delete, [fsno], function (error, results, fields) {
//     if (error) {
//       console.error(error);
//       return response.status(500).json({ error: 'delete_error' });
//     }
//     response.json(results);
//   });
// });


// router.post('/alldelete', function (request, response, next) {
  

//   db.query(sql.tv_list_delete,  function (error, results, fields) {
//     if (error) {
//       console.error(error);
//       return response.status(500).json({ error: 'delete_error' });
//     }
//     response.json(results);
//   });
// });

//
// 상품 제거1
router.post('/delete_goods', function (request, response, next) {
  const trip_no = request.body.trip_no;

  // 이미지 이름 불러오기
  console.log(trip_no);
  db.query(sql.get_img_nm, [trip_no], function (error, results, fields) {
      if (error) {
          return response.status(500).json({ error: 'goods_error' })
      }
      else {
          try {
              
              const trip_img = results[0].trip_img;
              
              // const tv_sb_img = results[0].tv_sb_img;

              // 이미지 제거
              
              fs.unlinkSync(`${__dirname}../../uploads/${trip_img}`);
              
              // fs.unlinkSync(`${__dirname}../../uploads/${tv_sb_img}`);

              // 상품 제거
              db.query(sql.delete_goods, [trip_no], function (error, results, fields) {
                  if (error) {
                      return response.status(500).json({ error: 'goods_error' })
                  }
                  else {
                      return response.status(200).json({
                          message: 'delete_complete'
                      })
                  }
              })
          }
          catch (error) {
              console.log("에러");
          }
      }
  })
})

//2
// 상품 제거1
router.post('/delete2_goods', function (request, response, next) {
  const trip_no = request.body.trip_no;

  // 이미지 이름 불러오기
  console.log(trip_no);
  db.query(sql.get_img_nm2, [trip_no], function (error, results, fields) {
      if (error) {
          return response.status(500).json({ error: 'goods_error' })
      }
      else {
          try {
              
              const trip_img = results[0].trip_img;
              
              // const fs_sb_img = results[0].fs_sb_img;

              // 이미지 제거
              
              fs.unlinkSync(`${__dirname}../../uploads/${trip_img}`);
              
              // fs.unlinkSync(`${__dirname}../../uploads/${fs_sb_img}`);

              // 상품 제거
              db.query(sql.delete2_goods, [trip_no], function (error, results, fields) {
                  if (error) {
                      return response.status(500).json({ error: 'goods_error' })
                  }
                  else {
                      return response.status(200).json({
                          message: 'delete_complete'
                      })
                  }
              })
          }
          catch (error) {
              console.log("에러");
          }
      }
  })
})

//차트
router.post('/viewcount', function (req, res) {

  db.query(sql.viewcount, function (error, results, fields) {
      if (error) {
          console.error(error);
      }
      console.log(results);
      return res.json(results);
  })
})

router.post('/likefs', function (req, res) {

  db.query(sql.likefs, function (error, results, fields) {
      if (error) {
          console.error(error);
      }
      console.log(results);
      return res.json(results);
  })
})

 // 내 게시글 목록 불러오기
 router.post('/board_list', (req, res) => {
  const { page, limit } = req.body;
  
  // 기본값 설정
  let pageNum = parseInt(page, 10) || 1;
  let limitNum = parseInt(limit, 10) || 10;
  const offset = (pageNum - 1) * limitNum;

  db.query(sql.adminboard, [limitNum, offset], function (error, result) {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'error' });
    } else {
      res.send(result);
    }
  });
});

// 내 게시글 갯수 불러오기
router.post('/board_count', (req, res) => {

  db.query(sql.boardcnt, (error, results, fields) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: '에러' });
    }
    return res.status(200).json(results[0].count);
  });
});

// 게시글 삭제
router.post('/boarddelete', (req, res) => {
  const { boardno } = req.body;
  db.query(sql.deleteboard, [boardno], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(result);
  });
});

module.exports = router;