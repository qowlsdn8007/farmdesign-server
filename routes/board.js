var express = require('express');
var router = express.Router();
var dbc = require('../config/database')();
var connection = dbc.init();
const sens = require('node-sens');
const multer = require('multer');
const path = require('path');
const sharp = require('sharp');

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
    let token = "";
    for (i = 0; i < 6; i++) 
        token += parseInt(Math.random() * 10); 
    input.push(token);
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
        let sql = "INSERT INTO farm_info (FARM_NM, USER_ID, PASSWD, CITY_NM, FARM_ADDR, token) VALUES ?";
        connection.query(sql, [input], function (error, rows, fields) {
            if (!error) {      
                console.log(rows);
                res.send(token);                   
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
                        resToken: rows[0]['token'],
                 });
            }
            else
                res.send('fail');
        } else {
            console.log('query error : ' + error);
        }
    });
});

//글 쓰기 페이지
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

//글 쓰기 처리
router.post('/upload', upload.single('img'), function (req, res, next) {

    console.log(req);
    res.status(200).json({ imageID: 1});
    console.log(res);
});

//글 수정 페이지
router.get('/token', function (req, res, next) {
    let token = req.query['token'];
    console.log(farm)
    let sql = `SELECT * FROM farm_info WHERE token = ?`;
    connection.query(sql, [token], function (error, rows, fields) {
        if (!error) {
            res.send({
                resName: rows[0]['FARM_NM'],
                resMyIntro: rows[0]['MyIntro'],
                resFarmIntro: rows[0]['FarmIntro'],
                resPhoto: rows[0]['PHOTO'],
                resToken: rows[0]['token'],
                resEmail: rows[0]['USER_ID']
            });     
        } else {
            console.log('query error : ' + error);
        }
    });
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
//글 삭제 처리
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
router.get('/deleteProc/:id', function (req, res, next) {
    res.send(`board id : ${req.params.id}`);
});

module.exports = router;
