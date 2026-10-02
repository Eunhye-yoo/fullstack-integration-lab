var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.send('GET 요청 테스트 성공');
});

router.post('/', function(req, res) {
  res.json({
    message: 'POST 요청 테스트 성공'
  });
});

router.get('/plus', function(req, res) {
  var num1 = Number(req.query.num1);
  var num2 = Number(req.query.num2);

  var result = num1 + num2;

  res.send(String(result));
});

router.get('/minus/:num1/:num2', function(req, res) {
  var num1 = Number(req.params.num1);
  var num2 = Number(req.params.num2);

  var result = Math.abs(num1 - num2);

  res.send(String(result));
});

router.post('/profile', function(req, res) {
  var name = req.body.name;
  var age = req.body.age;
  var city = req.body.city;

  res.json({
    name: name,
    age: age,
    city: city
  });
});

router.put('/update/:id', function(req, res) {
  var id = req.params.id;
  var name = req.body.name;

  res.json({
    message: id + '번 회원 이름 변경(' + name + ')'
  });
});

router.delete('/delete/:id', function(req, res) {
  var id = req.params.id;

  res.json({
    message: '데이터 삭제 성공(id:' + id + ')'
  });
});

module.exports = router;