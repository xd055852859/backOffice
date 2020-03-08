// const Mock = require('mockjs');
// const Random = Mock.Random;
// const roleData = function (opt) {
//   let arr = [];
//   for (let i = 0; i < 10; i++) {
//     arr.push({
//       avatar: Random.dataImage(),
//       nickName: Random.first(),
//       homeId: Random.natural(1, 100000),
//       phone: '123456789',
//       email: Random.email(),
//       role: Random.boolean(),
//       status: Random.boolean(),
//     })
//   }
//   return {
//     data: arr,
//     msg: 'OK'
//   }
// }
// const userData = function (opt) {
//   let arr = [];
//   for (let i = 0; i < 10; i++) {
//     arr.push({
//       avatar: Random.dataImage(),
//       homeId: Random.natural(1, 100000),
//       area: '+86',
//       phone: '123456789',
//       surname: Random.cfirst(),
//       name: Random.clast(),
//       nickName: Random.first(),
//       slogan: Random.csentence(5, 20),
//       flash: Random.datetime('yyyy-MM-dd'),
//       about: 'home+',
//       regist: Random.datetime('yyyy-MM-dd'),
//       ip: Random.ip(),
//       address: Random.city(true),
//       genealogy: Random.float(0, 100, 0, 2),
//       wallet: Random.float(0, 100, 0, 2),
//       level: Random.natural(1, 10),
//       online: Random.boolean(),
//       status: Random.boolean()
//     })
//   }
//   return {
//     data: arr,
//     msg: 'OK'
//   }
// }
// const userSetData = function (opt) {
//   let arr = [];
//   for (let i = 0; i < 10; i++) {
//     arr.push({
//       userSetId: Random.natural(1, 100000),
//       logo: Random.dataImage(),
//       userSetName: Random.cword(4),
//       userSetUnit: Random.cword(2) + '%' + Random.cword(2),
//       userTableName: Random.csentence(5, 20),
//       searchTableName: Random.csentence(5, 20),
//     })
//   }
//   return {
//     data: arr,
//     msg: 'OK'
//   }
// }

// const articleData = function (opt) {
//   let arr = [];
//   for (let i = 0; i < 10; i++) {
//     arr.push({
//       articleContainer: Random.csentence(5, 100),
//       picture: Random.dataImage(),
//       user: Random.cname(),
//       readNum: Random.natural(1, 10),
//       agreeNum: Random.natural(1, 10),
//       commentNum: Random.natural(1, 10),
//       createTime: Random.datetime('yyyy-MM-dd'),
//       status: Random.boolean()
//     })
//   }
//   return {
//     data: arr,
//     msg: 'OK'
//   }
// }
// const testRoleData = function (opt) {
//   let arr = [];
//   for (let i = 0; i < 10; i++) {
//     arr.push({
//       roleName: Random.cname(),
//       role: Random.csentence(5, 20),
//       status: Random.boolean()
//     })
//   }
//   return {
//     data: arr,
//     msg: 'OK'
//   }
// }

// //管理权限管理
// // Mock.mock(RegExp('/role' + ".*"), /post|get/i, roleData);
// //用户管理
// // Mock.mock(RegExp('/user?' + ".*"), /post|get/i, userData);
// //看板管理
// Mock.mock(RegExp('/set' + ".*"), /post|get/i, userSetData);
// //文章管理
// Mock.mock(RegExp('/article' + ".*"), /post|get/i, articleData);
// //用户权限管理
// Mock.mock(RegExp('/testRole' + ".*"), /post|get/i, testRoleData);
