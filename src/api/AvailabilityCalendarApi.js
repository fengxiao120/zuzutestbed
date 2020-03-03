const API_ROOT = 'http://localhost:8080'

const FetchGet = async function (url, params, use_absolute_url) {
    if(params)
        url += ('?' + Object.keys(params).map(item=>item+'='+params[item]).join('&'))

    let request = {
        method: 'GET',
        mode: 'cors',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    };

    return fetch( use_absolute_url?url:API_ROOT + url, request)
        .then((response)=>{
            return response.json();
        }, (error)=>{
            return error
        });
}




export default {
    getAvailability: (hotel_id, params) => {
        return FetchGet(`http://zuzuhs-avail-svc-test-alb-1682325797.ap-northeast-1.elb.amazonaws.com/hotels/${hotel_id}/availability/v1`, params, true)
    },
    getRoomTypes: (hotel_id, params) => {
        return FetchGet(`http://zuzuhs-hotel-svc-test-alb-641570862.ap-northeast-1.elb.amazonaws.com/v1/hotels/${hotel_id}/`, params, true)
    },
    getRates: (hotel_id, params) => {
        return FetchGet(`https://rate-test.zuzuhs.com/hotels/${hotel_id}/rate/v1`, params, true)
    },    
}