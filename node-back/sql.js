module.exports = {

  // auth
  join: `INSERT INTO trip_user (user_id, user_nick, user_email, user_passwd, user_num, user_zipcode, user_adr1, user_adr2) VALUES(?,?,?,?,?,?,?,?)`,

  id_check: `SELECT * FROM trip_user WHERE user_id = ?`,
  get_user_no: `SELECT user_no FROM trip_user WHERE user_id = ?`,
  login: `SELECT user_passwd FROM trip_user WHERE user_id = ?`,
  //카카오 로그인
  kakaoJoin: `INSERT INTO trip_user (user_id, user_nick, user_email, user_login_ty) VALUES(?,?,?,1)`,
  kakao_check: `SELECT * FROM trip_user WHERE user_id = ?`,

  //네이버 로그인
  naverlogin: `INSERT INTO trip_user (user_email, user_id, user_nick, user_login_ty) VALUES (?, ?, ?, 2)`,
  naver_id_check: `SELECT * FROM trip_user WHERE user_id = ?`,

  // admin 기능 

   admin_ck: `SELECT user_type FROM trip_user WHERE user_no = ?`,
   //마이페이지 좋아요 리스트 조회
//    mylike: `SELECT
//    g.user_no,
//    g.good_cate,
//    g.good_day,
//    COALESCE(t.tv_tit, f.fs_tit) as title,
//    COALESCE(t.tv_img, f.fs_img) as image,
//    COALESCE(t.tv_no, f.fs_no) as number
// FROM
//    trip_good as g
// LEFT JOIN
//    trip_tv_info as t ON g.good_cate = 1 AND g.tv_no = t.tv_no
// LEFT JOIN
//    trip_fs_info as f ON g.good_cate = 2 AND g.fs_no = f.fs_no
// WHERE
//    g.user_no = ?`,
// mylike: `SELECT
// g.user_no,
// g.good_cate,
// g.good_day,
// COALESCE(t.trip_tit) as title,
// COALESCE(t.trip_img) as image,
// COALESCE(t.trip_no) as number
// FROM
// trip_good as g
// LEFT JOIN
// trip_info as t ON g.good_cate = 1 and 2 AND g.trip_no = t.trip_no
// WHERE
// g.user_no = ?`,
mylike: `SELECT
    g.user_no,
    g.good_cate,
    g.good_day,
    COALESCE(t.trip_tit, '') as title,
    COALESCE(t.trip_img, '') as image,
    COALESCE(t.trip_no, '') as number
FROM
    trip_good as g
 JOIN
    trip_info as t ON g.trip_no = t.trip_no
WHERE
    g.user_no = ?
    AND g.good_cate IN (2, 1);`,


//사용자 정보 조회
user_info: `SELECT user_id, user_nick, user_email, user_num, user_zipcode, user_adr1, user_adr2, user_login_ty
FROM trip_user
WHERE user_no = ?`,
   // 사용자 정보 수정
  user_update: `update trip_user set user_id = ?, user_nick = ?, user_email = ?, user_num = ?, user_zipcode = ?, user_adr1 = ?, user_adr2 = ? 
  where user_no = ?`,
    //계정 삭제
  user_delete: `delete from trip_user where user_no = ?`,
  //pass
  pass_info: `select user_passwd from trip_user where user_no = ?`,
  pass_update: 'UPDATE trip_user SET user_passwd = ? WHERE user_no = ?', 

    // 아이디 비번 찾기
    id_find: `SELECT user_id FROM trip_user WHERE user_email = ?`,
    user_check: `SELECT user_no FROM trip_user WHERE user_email = ? AND user_id = ?`,
    pass_update_tem: `UPDATE trip_user SET user_passwd = ? WHERE user_id = ?`,
    
//메인 베스트
// tv_best:`SELECT g.*, IFNULL(t.total_good, 0) AS total_good
// FROM trip_tv_info g
//  JOIN (
//     SELECT tv_no, COUNT(*) AS total_good
//     FROM trip_good
//     WHERE user_no
//     GROUP BY tv_no
// ) AS t ON g.tv_no = t.tv_no
// WHERE g.tv_category IN (1, 2, 3, 4)
// ORDER BY total_good DESC;

// `,
// fs_best:`SELECT h.*, IFNULL(t.total_good, 0) AS total_good
// FROM trip_fs_info h
// JOIN (
//     SELECT fs_no, COUNT(*) AS total_good
//     FROM trip_good
//     WHERE user_no
//     GROUP BY fs_no
// ) AS t ON h.fs_no = t.fs_no
// WHERE h.fs_category IN (1, 2, 3, 4)
// ORDER BY total_good DESC;

// `,

tv_best:`SELECT g.*, IFNULL(t.total_good, 0) AS total_good
FROM trip_info g
JOIN (
    SELECT *
    FROM trip_good
) AS t ON g.trip_no = t.trip_no
 where g.trip_category = 1
ORDER BY total_good DESC;
`,

fs_best:`SELECT h.*, IFNULL(t.total_good, 0) AS total_good
FROM trip_info h
JOIN (
    SELECT *
    FROM trip_good
) AS t ON h.trip_no = t.trip_no
  where h.trip_category = 2
ORDER BY total_good DESC;
`, 
  
   /**추가 지도 리스트 */
   tv_list:`select * from trip_info where trip_id = ? and trip_category = 1`,
   fs_list:`select * from trip_info where trip_id = ? and trip_category = 2`,

   //qna
   qnaContent: `SELECT * FROM trip_qna JOIN trip_user 
                WHERE trip_qna.user_no=trip_user.user_no AND qna_no = ?;`,
  qnaWrite: `INSERT INTO trip_qna (user_no, qna_tit, qna_content, qna_secret) VALUES (?, ?, ?, ?)`, 
//   qna: `SELECT * FROM trip_qna JOIN trip_user 
//                 WHERE trip_qna.user_no=trip_user.user_no 
//                 ORDER BY qna_no LIMIT ? OFFSET ?;`,//1  
 
qna: `SELECT * FROM trip_qna JOIN (select * from trip_user
) as u on trip_qna.user_no=u.user_no
ORDER BY qna_no LIMIT ? OFFSET ?;`,//1   수정본
  
  deleteContent: `DELETE FROM trip_qna WHERE qna_no = ?`, 
  qnaEdit: `UPDATE trip_qna  SET qna_content = ?, qna_tit = ? WHERE qna_no = ?;`, 

  qnaCheck: `SELECT user_ty FROM trip_user WHERE user_no =?;`,
  ansWrite: `UPDATE trip_qna  SET qna_ans = ?  WHERE qna_no = ?;`,
  qnacnt: `SELECT COUNT(*) FROM trip_qna;`,
  /**리뷰추가 */
  
  review_write: `INSERT INTO trip_review (trip_no, user_no, user_id, review_goat, review_content, review_cate) VALUES (?, ?, ?, ?, ?, 1);`,
  review_detail: `SELECT trip_tit, trip_ads, trip_content, trip_img, trip_sb_img, trip_sb_img2, trip_sb_img3, trip_sb_img4, trip_price FROM trip_info WHERE trip_no = ?;`,
  get_review: `SELECT * FROM trip_review WHERE trip_no = ?;`,

  review_write2: `INSERT INTO trip_review (trip_no, user_no, user_id, review_goat, review_content, review_cate) VALUES (?, ?, ?, ?, ?, 2);`, //리뷰 작성
  review_detail2: `SELECT trip_tit, trip_ads, trip_content, trip_img, trip_sb_img, trip_sb_img2, trip_sb_img3, trip_sb_img4, trip_price FROM trip_info WHERE trip_no = ?;`,  //여행지, 축제 정보 가져오기
  get_review2: `SELECT * FROM trip_review WHERE trip_no = ?;`, //등록된 리뷰

  // get_my_review: `SELECT review_cate, COALESCE(t.tv_img, f.fs_img) AS image, review_goat, review_content, COALESCE(t.tv_no, f.fs_no) as number, review_no
  //               FROM trip_review AS r
  //               LEFT JOIN trip_tv_info AS t ON r.review_cate = 1 AND r.tv_no = t.tv_no
  //               LEFT JOIN trip_fs_info AS f ON r.review_cate = 2 AND r.fs_no = f.fs_no
  //               WHERE user_no = ? 
  //               ORDER BY review_no DESC 
  //               LIMIT ? OFFSET ?;`,
  get_my_review: `SELECT review_cate, COALESCE(t.trip_img, f.trip_img) AS image, review_goat, review_content, COALESCE(t.trip_no, f.trip_no) as number, review_no
  FROM trip_review AS r
  LEFT JOIN trip_info AS t ON r.review_cate = 1 AND r.trip_no = t.trip_no
  LEFT JOIN trip_info AS f ON r.review_cate = 2 AND r.trip_no = f.trip_no
  WHERE user_no = ? 
  ORDER BY review_no DESC 
  LIMIT ? OFFSET ?;`,
  get_my_review_count: `SELECT COUNT(*) AS count FROM trip_review WHERE user_no = ?;`,
  myqna: `SELECT * FROM trip_qna WHERE user_no = ? ORDER BY qna_no DESC LIMIT ? OFFSET ?`,
  my_qnacnt: `SELECT COUNT(*) AS count FROM trip_qna WHERE user_no = ?`,
  myboard_cnt: `SELECT COUNT(*) AS count FROM trip_board WHERE user_no = ?`,

  myboard: `select * from trip_board join trip_user 
        where trip_board.user_no=trip_user.user_no and trip_board.user_no = ? ORDER BY board_no DESC LIMIT ? OFFSET ?;`,
  deletereview: 'DELETE FROM trip_review WHERE review_no = ?',
 // 상세페이지 좋아요
        like_insert: `INSERT INTO trip_good (user_no, trip_no, good_cate) VALUES (?, ?, 1)`,
        like_delete: `DELETE FROM trip_good WHERE user_no = ? AND trip_no = ?`,
        like_check: `SELECT * FROM trip_good WHERE user_no = ? AND trip_no = ?`,
        like_count: `SELECT COUNT(*)  FROM trip_good WHERE  good_cate = 1`,

        like_insert2: `INSERT INTO trip_good (user_no, trip_no, good_cate) VALUES (?, ?, 2)`,
        like_delete2: `DELETE FROM trip_good WHERE user_no = ? AND trip_no = ?`,
        like_check2: `SELECT * FROM trip_good WHERE user_no = ? AND trip_no = ?`,
        like_count2: `SELECT COUNT(*)  FROM trip_good WHERE good_cate = 2`,
  /**검색 */
  tv_searchlist: `SELECT trip_category, trip_no, trip_tit, trip_img, trip_price, trip_ads, trip_local_nm, trip_id
  FROM trip_info
  WHERE trip_category=1 and trip_tit LIKE ?`,
  fs_searchlist: `SELECT trip_category, trip_no, trip_tit, trip_img, trip_price, trip_ads, trip_local_nm, trip_date, trip_id
  FROM trip_info
  WHERE trip_category=2 and trip_tit LIKE ?`,
  all_searchlist:`SELECT *
FROM 
    trip_info
WHERE 
    trip_tit LIKE ?
ORDER BY day desc;

`,
//오래된순
all_searchlist2:`SELECT *
FROM 
    trip_info
WHERE 
    trip_tit LIKE ?
ORDER BY day;

`,

//전체목록(여행지, 축제)
  all_tv_list: `SELECT trip_no, trip_tit, trip_img, trip_local_nm, day
  FROM trip_info where trip_category=1 ORDER BY day desc;`,
  all_fs_list: `SELECT trip_no, trip_tit, trip_img, trip_local_nm, trip_date, day
  FROM trip_info where trip_category=2 ORDER BY day desc;`,
//최신순
  all_list: `SELECT *
FROM trip_info 
ORDER BY day desc;

`,
//오래된순
all_list2: `SELECT *
FROM trip_info
ORDER BY day;

`,

//관리자
trip_write: `INSERT INTO trip_info (trip_tit, trip_ads, trip_date, trip_content, trip_img, trip_sb_img, trip_sb_img2, trip_sb_img3, trip_sb_img4, trip_local_nm, trip_id, trip_category) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
  // fs_write: `INSERT INTO trip_info (trip_tit, trip_ads, trip_content, trip_img, trip_sb_img, trip_sb_img2, trip_sb_img3, trip_sb_img4, trip_local_nm) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?);`,

//차트
liketrip: `SELECT 
  t.trip_tit, 
  IFNULL(g.total_good, 0) AS total_good
FROM 
  trip_info t
INNER JOIN (
  SELECT trip_no, COUNT(*) AS total_good
  FROM trip_good
  GROUP BY trip_no
) g ON t.trip_no = g.trip_no
 where t.trip_category=1;`,

likefs: `SELECT 
  f.trip_tit, 
  IFNULL(g.total_good, 0) AS total_good
FROM 
  trip_info f
INNER JOIN (
  SELECT trip_no, COUNT(*) AS total_good
  FROM trip_good
  GROUP BY trip_no
) g ON f.trip_no = g.trip_no
 where f.trip_category=2;`,

viewcount: `SELECT board_tit, board_view
          FROM trip_board;`,

  // 유저정보 조회
admin_search: `SELECT * FROM trip_user`,


// 관리자 등록관리 삭제
// tv_list_delete: `DELETE FROM trip_tv_info WHERE tv_no IN (?)`,
// fs_list_delete: `DELETE FROM trip_fs_info WHERE fs_no IN (?)`,

// all_list_delete: `DELETE FROM trip_tv_info
// WHERE tv_no IN (?)
// UNION
// DELETE FROM trip_fs_info
// WHERE fs_no IN (?);
// `,

delete_goods: `DELETE FROM trip_info WHERE trip_no = ?`,
delete2_goods: `DELETE FROM trip_info WHERE trip_no = ?`,
get_img_nm: `SELECT trip_img FROM trip_info WHERE trip_no = ?`,
get_img_nm2: `SELECT trip_img FROM trip_info WHERE trip_no = ?`,

    //게시판 기능
    board_write: `INSERT INTO trip_board(board_tit, board_content,user_no, board_img) VALUES(?, ?, ?, ?);`,
    show_board: `select * from trip_board join trip_user 
          where trip_board.user_no=trip_user.user_no and trip_board.user_no ORDER BY board_no DESC LIMIT ? OFFSET ?;`,
    board_cnt: `SELECT COUNT(*) FROM trip_board`,
    board_search: `SELECT * FROM trip_board WHERE board_tit LIKE ? ORDER BY board_no DESC`,
    board_admin: `SELECT * FROM trip_board JOIN trip_user WHERE trip_board.user_no = trip_user.user_no`, //1
    board_Detail: `SELECT * FROM trip_board JOIN trip_user WHERE trip_board.user_no=trip_user.user_no AND board_no = ?; `, //게시글 상세
    board_delete: `DELETE FROM trip_board WHERE board_no = ?`,
    board_Edit: `UPDATE trip_board SET board_content = ?, board_tit = ? WHERE board_no = ?;`,
    comment_list: `SELECT comment_id, comment_content, parent_comment_id, comment_at, user_no, board_no FROM board_comments WHERE board_no = ?`,
    comment_write: `INSERT INTO board_comments(user_no, comment_content) VALUES(?, ?)`,

    boardcnt: `SELECT COUNT(*) FROM trip_board`,

    adminboard: `select * from trip_board join trip_user 
          where trip_board.user_no=trip_user.user_no and trip_board.user_no ORDER BY board_no DESC LIMIT ? OFFSET ?;`,
    deleteboard: `DELETE FROM trip_board WHERE board_no = ?`,

    //
    soft_Dele : `update trip_user set deleted_at = now() where user_no=?`,
  
}