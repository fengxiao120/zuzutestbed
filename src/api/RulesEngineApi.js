const API_ROOT = window.location.protocol + '//' + window.location.hostname + ':8080'

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

const FetchGet1 = async function (url, params) {
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
            'Content-Type': 'application/json',
        }
    };

    return fetch(API_ROOT + url, request)
        .then((response)=>{
            return response;
        }, (error)=>{
            return error
        });
}

export default {
	getRulesEngineData: (params) => {
        return FetchGet('/revenue-management/rule-engine/get-data', params)
	},
    getRecommendedPrices: (params) => {
        return FetchGet1('/base-price/calculate', params)
    },    
    getRevenueManagementRules: (params) => {
        return FetchGet('/revenue-management/rule-engine/revenue-management-rules', params)
    },
    update: (params) => {
        return FetchGet('/revenue-management/rule-engine/update', params)    	
    }
}