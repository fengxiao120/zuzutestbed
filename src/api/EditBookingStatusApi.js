import {FetchGet, FetchPost, FakeFetchGet, FakeFetchPost} from './Api'

export default {  
    getBookingStatus: ( params ) => {
        return FakeFetchGet('/booking-status', params)
    },
    getSmallCardData: ( params ) => {
        return FetchGet('/hotel/reservations/small-card-data', params)
    },    
    updateBookingStatus: (params) => {
        return FetchPost('/booking-status/update', params)
    },
    getCVV: ( params ) => {
        return FakeFetchGet('/get-cvv', params)
    },
    updateTravellerDetails: ( params ) => {
        return FakeFetchPost('/update-traveller-details', params)
    },
    updateBookingStatus: ( params ) => {
        return FakeFetchPost('/update-booking-status', params)
    },    
}