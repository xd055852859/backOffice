import api from './index';
const Album = {
  getAlbumList(params) {
    return api.requests.get(api.requests.APIURL + 'personalSeriesList', params);
  },
  getAlbumTypeFilter(params) {
    return api.requests.get(api.requests.APIURL + 'typeFilter', params);
  },
  getAlbumTypeList(params) {
    return api.requests.get(api.requests.APIURL + 'typeList', params);
  },
  setAlbumType(params) {
    return api.requests.post(api.requests.APIURL + 'addSeriesType', params);
  },
  updateAlbumType(params) {
    return api.requests.patch(api.requests.APIURL + 'updateType', params);
  },
  deleteAlbumType(params) {
    return api.requests.delete(api.requests.APIURL + 'deleteType', params);
  },
  setAlbum(params) {
    return api.requests.post(api.requests.HOMEURL + 'series', params);
  },
  deleteAlbum(params) {
    return api.requests.delete(api.requests.APIURL + 'deleteSeries', params);
  },
}
export default Album
