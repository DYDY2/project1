const express = require('express');
const db = require('../db');
const sql = require('../sql');
// const fs = require('fs');

const router = express.Router();
// const multer = require('multer');
// const path = require('path');

router.get('/regions/:regionid', function (req, res) { // 지역별 여행지 리스트
    const regionid = req.params.regionid
    db.query(sql.tv_list, [regionid], (err, results, fields) => {
        if (err) {
            console.error(err);
            return res.status(500).json({err: '에러'});
        }
        res.json(results);
    });
});

router.get('/regions/api/:regionid', function(req, res) {
    const regionid = req.params.regionid
    db.query(sql.fs_list, [regionid], (err, results, fields) => {
        if(err) {
            console.error(err);
            return res.status(500).json({ err: '에러' });
        }
        res.json(results);
    });
});



// 특정 tv_no를 가진 축제 정보 가져오기
router.get('/trip/:trip_no', (req, res) => {
    const trip_no = req.params.trip_no;
    db.query(sql.review_detail, [trip_no], (err, results) => {
        if (err) {
            console.error('Error fetching festival details:', err);
            res.status(500).send(err);
        } else {
            res.json(results);
        }
    });
});

// 특정 tv_no에 리뷰 추가하기
router.post('/trip/:trip_no/reviews', (req, res) => {
    const trip_no = req.params.trip_no;
    const { user_no, user_id, review_goat, review_content } = req.body;
    db.query(sql.review_write, [trip_no, user_no, user_id, review_goat, review_content], (err, results) => {
        if (err) {
            console.error('Error adding review:', err);
            res.status(500).send(err);
        } else {
            res.json({ id: results.insertId });
        }
    });
});

// 특정 tv_no에 해당하는 리뷰 가져오기
router.get('/trip/:trip_no/reviews', (req, res) => {
    const trip_no = req.params.trip_no;
    db.query(sql.get_review, [trip_no], (err, results) => {
        if (err) {
            console.error('Error fetching reviews:', err);
            res.status(500).send(err);
        } else {
            res.json(results);
        }
    });
});

router.get('/regions/api/:regionid', function(req, res) {
    const regionid = req.params.regionid
    db.query(sql.fs_list, [regionid], (err, results, fields) => {
        if(err) {
            console.error(err);
            return res.status(500).json({ err: '에러' });
        }
        res.json(results);
    });
});

// 특정 fs_no를 가진 축제 정보 가져오기
router.get('/festivals/:trip_no', (req, res) => {
    const trip_no = req.params.trip_no;
    db.query(sql.review_detail2, [trip_no], (err, results) => {
        if (err) {
            console.error('Error fetching festival details:', err);
            res.status(500).send(err);
        } else {
            res.json(results);
        }
    });
});

// 특정 fs_no에 리뷰 추가하기
router.post('/festivals/:trip_no/reviews', (req, res) => {
    const trip_no = req.params.trip_no;
    const { user_no, user_id, review_goat, review_content } = req.body;
    db.query(sql.review_write2, [trip_no, user_no, user_id, review_goat, review_content], (err, results) => {
        if (err) {
            console.error('Error adding review:', err);
            res.status(500).send(err);
        } else {
            res.json({ id: results.insertId });
        }
    });
});

// 특정 fs_no에 해당하는 리뷰 가져오기
router.get('/festivals/:trip_no/reviews', (req, res) => {
    const trip_no = req.params.trip_no;
    db.query(sql.get_review2, [trip_no], (err, results) => {
        if (err) {
            console.error('Error fetching reviews:', err);
            res.status(500).send(err);
        } else {
            res.json(results);
        }
    });
});

// 좋아요 추가
router.post('/likeInsert/:trip_no/:user_no', function (request, response, next) {
    const user_no = request.params.user_no;
    const trip_no = request.params.trip_no;

    db.query(sql.like_check, [user_no, trip_no], function (error, results, fields) {
        if (error) {
            console.error(error);
            return response.status(500).json({ error: '에러' });
        }

        if (results.length > 0) {
            return response.status(200).json({ message: 'complete', isLiked: true });
        } else {
            db.query(sql.like_insert, [user_no, trip_no], function (error, results, fields) {
                if (error) {
                    console.error(error);
                    return response.status(500).json({ error: '에러' });
                }

                return response.status(200).json({ message: 'complete', isLiked: false });
            });
        }
    });
});

// 좋아요 제거
router.post('/likeDelete/:trip_no/:user_no', function (request, response, next) {
    const user_no = request.params.user_no;
    const trip_no = request.params.trip_no;

    db.query(sql.like_delete, [user_no, trip_no], function (error, results, fields) {
        if (error) {
            console.error(error);
            return response.status(500).json({ error: '에러' });
        }
        return response.status(200).json({ message: 'complete' });
    });
});

// 좋아요 체크
router.post('/likeCheck/:trip_no/:user_no', function (request, response, next) {
    const user_no = request.params.user_no;
    const trip_no = request.params.trip_no;

    if (user_no == 'null') {
        return response.status(200).json({ message: 'complete', isLiked: false });
    }

    db.query(sql.like_check, [user_no, trip_no], function (error, results, fields) {
        if (error) {
            console.error(error);
            return response.status(500).json({ error: '에러' });
        }

        if (results.length > 0) {
            return response.status(200).json({ message: 'complete', isLiked: true });
        } else {
            return response.status(200).json({ message: 'complete', isLiked: false });
        }
    });
});

// 좋아요 카운트
router.get('/likeCount/:trip_no', function (request, response, next) {
    const trip_no = request.params.trip_no;

    db.query(sql.like_count, [trip_no], function (error, results, fields) {
        if (error) {
            console.error(error);
            return response.status(500).json({ error: '에러' });
        }
        return response.status(200).json(results[0]['COUNT(*)']);
    });
});

// ----------------------------축제//
// 좋아요 추가2
router.post('/likeInsert2/:trip_no/:user_no', function (request, response, next) {
    const user_no = request.params.user_no;
    const trip_no = request.params.trip_no;

    db.query(sql.like_check2, [user_no, trip_no], function (error, results, fields) {
        if (error) {
            console.error(error);
            return response.status(500).json({ error: '에러' });
        }

        if (results.length > 0) {
            return response.status(200).json({ message: 'complete', isLiked: true });
        } else {
            db.query(sql.like_insert2, [user_no, trip_no], function (error, results, fields) {
                if (error) {
                    console.error(error);
                    return response.status(500).json({ error: '에러' });
                }

                return response.status(200).json({ message: 'complete', isLiked: false });
            });
        }
    });
});

// 좋아요 제거
router.post('/likeDelete2/:trip_no/:user_no', function (request, response, next) {
    const user_no = request.params.user_no;
    const trip_no = request.params.trip_no;

    db.query(sql.like_delete2, [user_no, trip_no], function (error, results, fields) {
        if (error) {
            console.error(error);
            return response.status(500).json({ error: '에러' });
        }
        return response.status(200).json({ message: 'complete' });
    });
});

// 좋아요 체크
router.post('/likeCheck2/:trip_no/:user_no', function (request, response, next) {
    const user_no = request.params.user_no;
    const trip_no = request.params.trip_no;

    if (user_no == 'null') {
        return response.status(200).json({ message: 'complete', isLiked: false });
    }

    db.query(sql.like_check2, [user_no, trip_no], function (error, results, fields) {
        if (error) {
            console.error(error);
            return response.status(500).json({ error: '에러' });
        }

        if (results.length > 0) {
            return response.status(200).json({ message: 'complete', isLiked: true });
        } else {
            return response.status(200).json({ message: 'complete', isLiked: false });
        }
    });
});

// 좋아요 카운트
router.get('/likeCount2/:trip_no', function (request, response, next) {
    const fs_no = request.params.trip_no;

    db.query(sql.like_count2, [fs_no], function (error, results, fields) {
        if (error) {
            console.error(error);
            return response.status(500).json({ error: '에러' });
        }
        return response.status(200).json(results[0]['COUNT(*)']);
    });
});

module.exports = router;
