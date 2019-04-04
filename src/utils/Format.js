const mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const formatDate = (dateObject, placeholder, seperator) => {
	if(dateObject)
		return (seperator?seperator:'') + dateObject.getDate() + ' ' + mon[dateObject.getMonth()] + ' '  + dateObject.getFullYear()
	else
		return placeholder
}

const calcDayDiff = ( end_date, start_date ) => {
  return ( new Date(end_date.getFullYear(), end_date.getMonth(), end_date.getDate()) - 
    new Date(start_date.getFullYear(), start_date.getMonth(), start_date.getDate()) ) / 86400000 //this is the count of miniseconds in a day    
}

export { formatDate, calcDayDiff }
