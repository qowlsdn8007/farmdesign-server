var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

//게시판 라우터 추가 **************
var boardRouter = require('./routes/board');
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');
var port = 3000;
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors()); // api 위에서 cors 사용,  같은 로컬이여도 송신 가능
app.use(bodyParser.json()); // request 받는 http body 값을 읽을 수 있게 해줌
app.use(express.static('uploads')); // uploads 폴더의 파일 정적으로 사용 가능
app.use('/', indexRouter);
app.use('/users', usersRouter);

//게시판 라우터 추가 **************
app.use('/board', boardRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

app.listen(port, () => {
    console.log("listening success!")
});

module.exports = app;
