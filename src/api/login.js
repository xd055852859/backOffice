import api from './index';
const Login = {
    login(params) {
        return api.requests.get(api.requests.APIURL+'login', params);
    },
}
export default Login