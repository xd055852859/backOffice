import api from './index';
const Home = {
  summaryStatistics(params) {
    return api.requests.get(api.requests.APIURL + 'summaryStatistics', params);
  },
  // getRegisterChart(params) {
  //   return api.requests.get(api.requests.APIURL+'userRegister', params);
  // },
  getStatisticalCharts(params) {
    return api.requests.get(api.requests.APIURL + 'statisticalCharts', params);
  },
  getUserLocation(params) {
    return api.requests.get(api.requests.APIURL + 'userLocation', params);
  },
}
export default Home
