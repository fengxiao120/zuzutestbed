const CONFIG = {}

CONFIG.API_ROOT = window.location.protocol + '//' + window.location.host

const FakeFetchGet = async function (url, params) {
    if(params)
        url += ('?' + Object.keys(params).map( key =>{
            if(Array.isArray(params[key]))
                return params[key].map( item => (key + '[]=' + item).trim() ).join('&')
            else
                return (key+'='+params[key]).trim()
        }).join('&'))

    let request = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    };

    return fetch('http://localhost:8080' + url, request)
        .then((response)=>{
            return response.json();
        }, (error)=>{
            return error
        });
}

const FakeFetchPost = async function (url, data) {
    let request = {
        method: 'POST',
        credentials: "same-origin",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    };

    if (data) 
        request.body = JSON.stringify(data);

    return fetch('http://localhost:8080' + url, request)
        .then((response)=>{
            return response.json();
        }, (error)=>{
            return error
        });
}

const FetchGet = async function (url, params) {
    if(params)
        url += ('?' + Object.keys(params).map( key =>{
            if(Array.isArray(params[key]))
                return params[key].map( item => (key + '[]=' + item).trim() ).join('&')
            else
                return (key+'='+params[key]).trim()
        }).join('&'))

    let request = {
        method: 'GET',
        credentials: "same-origin",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    };

    return fetch(CONFIG.API_ROOT + url, request)
        .then((response)=>{
            return response.json();
        }, (error)=>{
            return error
        });
}

const FetchPost = async function (url, data) {
    let token = document.getElementById('react-token').innerHTML
    if(!token)
        console.log('Missing Token! Post request will not work')
    let request = {
        method: 'POST',
        credentials: "same-origin",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': token
        }
    };

    if (data) 
        request.body = JSON.stringify(data);

    return fetch(CONFIG.API_ROOT + url, request)
        .then((response)=>{
            return response.json();
        }, (error)=>{
            return error
        });
}

const FetchPostWithToken = async function (url, data, token) { //Special fetch post for base-price/calculate
    let request = {
        method: 'POST',
        // credentials: "include",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        }
    };

    if (data) 
        request.body = JSON.stringify(data);

    return fetch(url, request)
        .then((response)=>{
            return response.json();
        }, (error)=>{
            return error
        });
}

const FetchGet1 = async function (url, params) { //Special fetch get where getting the json is handled by the function itself
    if(params)
        url += ('?' + Object.keys(params).map( key =>{
            if(Array.isArray(params[key]))
                return params[key].map( item => (key + '[]=' + item).trim() ).join('&')
            else
                return (key+'='+params[key]).trim()
        }).join('&'))

    let request = {
        method: 'GET',
        credentials: "same-origin",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    };

    return fetch(CONFIG.API_ROOT + url, request)
        .then((response)=>{
            return response
        }, (error)=>{
            return error
        });
}

export { FetchGet, FetchGet1, FetchPost, FetchPostWithToken, FakeFetchGet, FakeFetchPost }