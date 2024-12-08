var express = require('express');
const router = express.Router();
var db = require('../db.js');
var sql = require('../sql.js');
const fs = require('fs');
const path = require("path");
const multer = require('multer');


// 게시글 삭제
router.post('/delete', (req, res) => {
  const boardno = req.body.boardno;

  db.query(sql.board_delete, [boardno], function (error, result) {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'error' });
    } else {
      res.send(result);

    }
  })

});

// 게시글 수정
router.post('/edit', (req, res) => {
  const editboard = req.body;
  db.query(sql.board_Edit, [editboard.content, editboard.tit, editboard.no], function (error, result) {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'error' });
    } else {
      res.send(result);

    }
  })

});

// 게시글 상세 내용
router.post('/boardcontent', (req, res) => {
  const boardno = req.body.board_no;

  db.query(sql.board_Detail, [boardno], function (error, result1) {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'error' });
    } else {
      res.send(result1);

    }
  });
})

//댓글 작성
router.post('/comment_write', function (req, res) {
  const { board_no, user_no, comment_content, parent_comment_id } = req.body;
  
  const query = `
    INSERT INTO board_comments (board_no, user_no, comment_content, parent_comment_id)
    VALUES (?, ?, ?, ?)
  `;
  
  db.query(query, [board_no, user_no, comment_content, parent_comment_id], function (error, result) {
    if (error) {
      console.error('댓글 작성 에러:', error);
      return res.status(500).json({ error: '댓글 작성 중 오류가 발생했습니다.' });
    }
    console.log('댓글 작성 성공:', result);
    res.json(result);
  });
});

//댓글 리스트
router.post('/comment_list', (req, res) => {
  const board_no = req.body.board_no;

  const query = `
    SELECT c.comment_id, c.board_no, c.user_no, c.comment_content, c.parent_comment_id, c.comment_at, u.user_nick
    FROM board_comments c
    JOIN trip_user u ON c.user_no = u.user_no
    WHERE c.board_no = ?
    ORDER BY c.comment_at
  `;

  db.query(query, [board_no], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error retrieving comments');
    }
    res.send(result);
  });
});

// 게시글 작성
router.post('/write', function (req, res) {
  const { board_tit, board_content, user_no, board_img } = req.body;

  db.query(sql.board_write, [board_tit, board_content, user_no, board_img], function (error, result) {
    if (error) {
      console.error('글 작성 에러:', error);
      return res.status(500).json({ error: '글 작성 중 오류가 발생했습니다.' });
    }
    console.log('글 작성 성공:', result);
    // 적절한 응답 처리 (예시로 결과를 그대로 클라이언트에게 반환)
    res.json(result);
  });
});


// 게시글 목록 불러오기
router.post('/board', (req, res) => {
  const { page, pageSize } = req.body;
  const offsetPage = 0 + (page - 1) * pageSize;

  db.query(sql.show_board, [pageSize, offsetPage], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: '에러' });
    }
    res.send(result);
  });
});

// 게시글 갯수 불러오기
router.post('/boardcnt', (req, res) => {
  db.query(sql.board_cnt, (error, results) => {
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
          cb(null, 'uploads/uploadBoard');
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
}) 

router.post('/incrementBoardView', (req, res) => {
  const { board_no } = req.body;

  const sql = 'UPDATE trip_board SET board_view = board_view + 1 WHERE board_no = ?';
  db.query(sql, [board_no], (err, result) => {
    if (err) {
      console.error('게시글 조회수 증가 중 오류:', err);
      res.status(500).json({ message: 'Failed to increment board view' });
    } else {
      res.status(200).json({ message: 'Board view incremented successfully' });
    }
  });
});

//검색
router.post('/contentsearch', function (request, response, next) {
  const searchboard = '%' + request.body.searchboard + '%';
  // const sortCase = request.body.sortCase;

  // const order = sortCaseReplace(sortCase);
  

  db.query(sql.board_search, [searchboard], function (error, results, fields) {
      if (error) {
          console.error(error);
          return response.status(500).json({ error: 'search_error' });
      }
      response.json(results);
  });
});

module.exports = router; 