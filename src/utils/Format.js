const mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const formatDate = (dateObject, placeholder, seperator) => {
	if(dateObject)
		return (seperator?seperator:'') + dateObject.getDate() + ' ' + mon[dateObject.getMonth()] + ' '  + dateObject.getFullYear()
	else
		return placeholder
}

const formatTime = (dateObject) => {
	if(dateObject)
		return dateObject.getUTCDate() + ' ' + mon[dateObject.getUTCMonth()] + ' '  + dateObject.getUTCFullYear() + ' '
			+ dateObject.getUTCHours().toString().padStart(2,0) + ':' + dateObject.getUTCMinutes().toString().padStart(2,0) + ':' + dateObject.getUTCSeconds().toString().padStart(2,0)
	else
		return ''
}

const calcDayDiff = ( end_date, start_date, inclusive ) => {
  return (inclusive?1:0) + ( new Date(end_date.getFullYear(), end_date.getMonth(), end_date.getDate()) - 
    new Date(start_date.getFullYear(), start_date.getMonth(), start_date.getDate()) ) / 86400000 //this is the count of miniseconds in a day    
}

const formatCurrency = (amount, currency_code, currency_symbol, force_return_original) => {
	if(isNaN(amount)){
		if(force_return_original)
			return amount
		else
			return ''
	}
	let superscript = ''
	let body = ''
	let decimal_length = 2
	if( currency_code == 'ID' || currency_code == 'IDR' ){
		decimal_length = 0
		superscript = amount%1000
		amount = parseInt(amount/1000)
		if(amount){
			superscript = '<sup style="font-size: 75%">' + parseInt(Math.abs(superscript)).toString().padStart(3,0) + '</sup>'
		} else {
			amount = ''
			superscript = parseInt(superscript)
		}
	} 

	amount = amount && parseFloat(parseFloat(amount).toFixed(decimal_length)).toLocaleString('en-US', { minimumFractionDigits: decimal_length })

    return currency_symbol + amount + superscript
}

const formatRequestDate = (dateObject) => {
	if(dateObject)
		return dateObject.getFullYear() + '-' + (dateObject.getMonth() + 1).toString().padStart(2,0) + '-'  + dateObject.getDate().toString().padStart(2,0)
	else
		return ''
}

const formatDBTime = (dateObject, placeholder) => {
    if(dateObject)
        return dateObject.getFullYear() + '-' + (dateObject.getMonth() + 1).toString().padStart(2,0) + '-'  + dateObject.getDate().toString().padStart(2,0)
            + ' ' + dateObject.getHours().toString().padStart(2,0) + ':' + dateObject.getMinutes().toString().padStart(2,0) + ':' + dateObject.getSeconds().toString().padStart(2,0)
    else
        return placeholder
};

const addDays = (date, days) => {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

export { formatDate, calcDayDiff, formatTime, formatCurrency, formatRequestDate, formatDBTime, addDays }
