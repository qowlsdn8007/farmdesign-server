var express = require('express');
var router = express.Router();
var dbc = require('../config/database')();
var connection = dbc.init();
const sens = require('node-sens');
const multer = require('multer');
const path = require('path');

dbc.test_open(connection);

const upload = multer({     // 이미지 업로드 폴더에 저장하는 객체 생성
    storage: multer.diskStorage({
      // set a localstorage destination
      destination: (req, file, cb) => {
        cb(null, 'uploads/');
      },
      // convert a file name
      filename: (req, file, cb) => {
        cb(null, new Date().valueOf() + path.extname(file.originalname));
      },
    }),
  });


//글 목록
router.get('/info', function (req, res, next) {
    let inputId = req.query['inputId'];
    console.log(inputId);
    let inputarr = ['inputNm', 'inputId', 'inputPw', 'inputCityNm', 'inputAddr']
    let input = [];
    for (i = 0; i < 5; i++)
        input[i] = req.query[inputarr[i]];
    input = [input];
    console.log(input);
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
                    res.send({
                        resName: rows[0]['FARM_NM'],
                        resMyIntro: rows[0]['MyIntro'],
                        resFarmIntro: rows[0]['FarmIntro'],
                        resPhoto: rows[0]['PHOTO'],
                 });
            }
            else
                res.send('fail');
        } else {
            console.log('query error : ' + error);
        }
    });
});

//아이디 중복 검사
router.get('/duplication', function (req, res, next) {
    let inputId = req.query['inputId'];
    let sql = `SELECT * FROM farm_info WHERE USER_ID = ?`;
    connection.query(sql, [inputId], function (error, rows, fields) {
        if (!error) {
            console.log(rows)
            console.log(rows.length)
            if(rows.length === 0)
                res.send('success');
            else
                res.send('fail')  
        } else {
            console.log(error);
        }
    });
});


//문자 인증
 router.get('/sms', async function (req, res, next) {
    let phonenum = req.query['phonenum'];
    let authnum = "";
    for (i = 0; i < 6; i++) {
        authnum += parseInt(Math.random() * 10) 
    }
    console.log(phonenum);
    console.log(authnum);
    const ncp = new sens.NCPClient({
        phoneNumber: '01030112620',
        serviceId: 'ncp:sms:kr:260698668059:farmdesign',
        secretKey: 'n8sRxOwu2PehTBtCKpN6iD0JokLPqhb906kBfn6d',
        accessKey: 'NoQXH1GDPUBkbCFdlZEa',
    })
    const { success, msg, status } = await ncp.sendSMS({
        to: phonenum,
        content: '[한우팡] 인증번호 [' + authnum + ']를 입력해주세요.',
        countryCode: '82',
      }, () => {console.log(status)});
    res.send(authnum); // 어플로 수신번호 보내기  인증 확인 위해서   
});

//사진 업로드
router.post('/upload', upload.single('img'), function (req, res, next) {

    console.log(req);
    res.status(200).json({ imageID: 1});
    console.log(res);
});

//프로필
router.get('/profile', function (req, res, next) {
    let email = req.query['email'];
    console.log(email);
    let sql = `SELECT * FROM farm_info WHERE USER_ID = ?`;
    connection.query(sql, [email], function (error, rows, fields) {
        if(!error) { 
            console.log(rows[0]['FARM_NM']);
            res.send({
                resPhoto: rows[0]['PHOTO'],
                resName: rows[0]['FARM_NM'],
                resMyIntro: rows[0]['MyIntro'],
                resFarmIntro: rows[0]['FarmIntro'],
            });
        } else {
            console.log(error);
        }        
    });
});
//게시판 데이터
router.get('/getBoardUsers', function (req, res, next) {
    let sql = `SELECT * FROM farm_Community`;
    connection.query(sql, function (error, rows, fields) {
        console.log(rows);
        res.send(rows);
    });
});
router.get('/getBoardImages', function (req, res, next) {
    let sql = `SELECT * FROM farm_Community`;
    connection.query(sql, function (error, rows, fields) {
        console.log(rows);
        res.send(rows);
    });
});

module.exports = router;
