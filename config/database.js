var mysql = require('mysql');

module.exports = function () {
  return {
    init: function () {
      return mysql.createConnection({
        host: 'farmd.synology.me',
        port: '3306',
        user: 'farmdesign',
        password: 'HANwoo2020*',
        database: 'jcow_report'
      })
    },
    
    test_open: function (con) {
      con.connect(function (err) {
        if (err) {
          console.error('mysql connection error :' + err);
        } else {
          console.info('mysql is connected successfully.');
        }
      })
    }
  }
};
