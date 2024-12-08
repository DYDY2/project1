const express = require('express');
const router = express.Router();
const db = require('../db.js');
const sql = require('../sql.js');
const fs = require('fs');

const multer = require('multer');
const path = require("path");

// 메인 상품 리스트 
router.get('/tvbest', function (request, response, next) {
    db.query(sql.tv_best, function (error, results, fields) {
        if (error) {
            console.error(error);
            return response.status(500).json({ error: '에러' });
        }
        response.json(results);
    });
});
// 메인 상품 리스트 2
router.get('/fsbest', function (request, response, next) {
    db.query(sql.fs_best, function (error, results, fields) {
        if (error) {
            console.error(error);
            return response.status(500).json({ error: '에러' });
        }
        response.json(results);
    });
});

router.get('/allSearch/:keyword/:sortCase', function (request, response, next) { //등록순
    const keyword = '%' + request.params.keyword + '%';

    db.query(sql.all_searchlist, [keyword, keyword], function (error, results, fields) {
        if (error) {
            console.error(error);
            return response.status(500).json({ error: 'search_error' });
        }
        response.json(results);
    });
});
router.get('/all2Search/:keyword/:sortCase', function (request, response, next) { //오래된순
    const keyword = '%' + request.params.keyword + '%';

    db.query(sql.all_searchlist2, [keyword, keyword], function (error, results, fields) {
        if (error) {
            console.error(error);
            return response.status(500).json({ error: 'search_error' });
        }
        response.json(results);
    });
});
// 여행 리스트1
router.get('/tvSearch/:keyword/:sortCase', function (request, response, next) {
    const keyword = '%' + request.params.keyword + '%';

    db.query(sql.tv_searchlist, [keyword], function (error, results, fields) {
        if (error) {
            console.error(error);
            return response.status(500).json({ error: 'search_error' });
        }
        response.json(results);
    });
});
//축제리스트2
router.get('/fsSearch/:keyword/:sortCase', function (request, response, next) {
    const keyword = '%' + request.params.keyword + '%';

    db.query(sql.fs_searchlist, [keyword], function (error, results, fields) {
        if (error) {
            console.error(error);
            return response.status(500).json({ error: 'search_error' });
        }
        response.json(results);
    });
});
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

//
    // router.get('/api/good-data', (req, res) => {
    //     const query = `
    //       SELECT DATE(good_day) as date, COUNT(*) as total_likes
    //       FROM trip_good
    //       GROUP BY DATE(good_day)
    //       ORDER BY DATE(good_day);
    //     `;
      
    //     db.query(query, (err, results) => {
    //       if (err) {
    //         return res.status(500).json({ error: err.message });
    //       }
      
    //       const labels = results.map(row => row.date);
    //       const dataset = results.map(row => row.total_likes);
      
    //       res.json({ labels, dataset });
    //     });
    //   });
   // 찜 제거
// router.post('/likeDelete/:tv_no/:user_no', function (request, response, next) {
//     const user_no = request.params.user_no;
//     const tvNo = request.params.tv_no;

//     db.query(sql.like_delete, [user_no, tvNo], function (error, results, fields) {
//         if (error) {
//             console.error(error);
//             return response.status(500).json({ error: '에러' });
//         }
//         return response.status(200).json({ message: 'complete' });
//     });
// });

// router.post('/likeDelete/:fs_no/:user_no', function (request, response, next) {
//     const user_no = request.params.user_no;
//     const fsNo = request.params.fs_no;

//     db.query(sql.like_delete2, [user_no, fsNo], function (error, results, fields) {
//         if (error) {
//             console.error(error);
//             return response.status(500).json({ error: '에러' });
//         }
//         return response.status(200).json({ message: 'complete' });
//     });
// });

// 좋아요 카운트 여행
router.get('/likeCount', function (request, response, next) {
   
    db.query(sql.like_count, function (error, results, fields) {
        if (error) {
            console.error(error);
            return response.status(500).json({ error: '에러' });
        }
        return response.status(200).json(results[0]['COUNT(*)']);
    });
});
//좋아요 카운트 축제
router.get('/likeCount2', function (request, response, next) {

    db.query(sql.like_count2,  function (error, results, fields) {
        if (error) {
            console.error(error);
            return response.status(500).json({ error: '에러' });
        }
        return response.status(200).json(results[0]['COUNT(*)']);
    });
});
      
module.exports = router;