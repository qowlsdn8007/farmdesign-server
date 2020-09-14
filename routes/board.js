var express = require('express');
var router = express.Router();
var dbc = require('../config/database')();
var connection = dbc.init();

dbc.test_open(connection);

//글 목록
router.get('/info', function (req, res, next) {
    let inputId = req.query['inputId'];
    console.log(inputId);
    let arr = ['FARM_NM', 'USER_ID', 'PASSWD', 'CITY_NM', 'FARM_ADDR'];
    let inputarr = ['inputNm', 'inputId', 'inputPw', 'inputCityNm', 'inputAddr']
    let input = [];
    for (i = 0; i < 5; i++)
        input[i] = req.query[inputarr[i]];
    input = [input];
    console.log(input);
    let flag = " ";
   /* let sql = `SELECT * FROM farm_info WHERE USER_ID = ?`;
    connection.query(sql, [inputId],function(error, rows, fields) {
        if(!error) {
            console.log(rows.length);
            if(rows.lenth ==! 0) {
                console.log("ASDF");
                console.log(inputId);
                res.send("idExist");  // 아이디가 존재
                flag = "no";
                console.log(flag);
            }
            else {
                flag = "ok";
                console.log("미존재");
            }
        }
        else {
            console.log(error);
        }
    })*/
    //if (flag === "ok") {
        let sql = "INSERT INTO farm_info (FARM_NM, USER_ID, PASSWD, CITY_NM, FARM_ADDR) VALUES ?";
        connection.query(sql, [input], function (error, rows, fields) {
            if (!error) {      
                console.log(rows);
                res.send("success");                   
            } else {
                console.log('query error : ' + error);
                res.send("fail");
            }
        });
   // }    
});

//로그인
router.get('/login', function (req, res, next) {
    let inputId = req.query['inputId'];
    let inputPw = req.query['inputPw'];
    console.log(inputId);
    console.log(inputPw);
    let sql = `SELECT * FROM farm_info WHERE USER_ID = ?`;    
    connection.query(sql, [inputId], function (error, rows, fields) {
        if (!error) {
            if (rows.length > 0) {          
                console.log(rows);
                console.log(rows[0]['PASSWD']);
                if (rows[0]['PASSWD'] == inputPw)
                    res.send('success');
            }
            else
                res.send('fail');
        } else {
            console.log('query error : ' + error);
        }
    });
});

//글 쓰기 페이지
router.get('/write', function (req, res, next) {
   
});

//글 쓰기 처리
router.post('/writeProc', function (req, res, next) {

    const author = req.body.author;
    const title = req.body.title;
    const contents = req.body.contents;

    //입력할 데이터를 배열에 담아 준비합니다.
    var params  = [author, title, contents];

    //T_BOARD에 데이터를 입력합니다. 위에서 만든 params의 순서에 맞게 ? 에 변수가 들어갑니다.
    //NOW()를 통해 현재 시각을 입력합니다.
    //var sql = `INSERT INTO T_BOARD (TITLE, AUTHOR, CONTENTS, INPT_DTTM) VALUES (?, ?, ?, NOW())`;
    var sql = "INSERT INTO DUAL VALUES (?, ?, ?, NOW())";
    connection.query(sql, params, function (error, rows, fields) {
        if (!error) {            
            
        } else {
            console.log('query error : ' + error);
        }
    }); 
});

//글 수정 페이지
router.get('/update/:id', function (req, res, next) {
   
});

//글 수정 처리
router.put('/updateProc', function (req, res, next) {
    res.send('updateProc');
});

//글 삭제 처리
router.delete('/deleteProc/:id', function (req, res, next) {
    res.send(`board id : ${req.params.id}`);
});

module.exports = router;
