const mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const formatDate = (dateObject, placeholder, seperator) => {
	if(dateObject)
		return (seperator?seperator:'') + dateObject.getDate() + ' ' + mon[dateObject.getMonth()] + ' '  + dateObject.getFullYear()
	else
		return placeholder
}

export default {
	formatDate: formatDate
}