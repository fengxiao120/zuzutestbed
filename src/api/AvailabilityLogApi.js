const API_ROOT = 'http://localhost:8080'

const FetchGet = async function (url, params) {
    if(params)
        url += ('?' + Object.keys(params).map(item=>item+'='+params[item]).join('&'))

    let request = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    };

    return fetch(API_ROOT + url, request)
        .then((response)=>{
            return response.json();
        }, (error)=>{
            return error
        });
}




export default {
    getList: (params) => {
        return FetchGet('/revenue-management/availability-log/list', params)
    },
}