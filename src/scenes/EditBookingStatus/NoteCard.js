import React from "react"

const t = str => str

const TYPE_COLOR_MAPPING = {
	note: 'blue',
	cancel_policy: 'red',
	modification_history: 'yellow',
}

class NoteCard extends React.Component {
  state = {
    floating: false,
  }

  componentDidMount = () => { 
    //window.addEventListener('click', this.collapsePercentageSelector)
  }

  componoentWillUnmount = () => {
    //window.removeEventListener('click', this.collapsePercentageSelector) 
  }

  render() {
    return (
    	<React.Fragment>
    	<div className={this.state.floating?'note-card-placeholder':''}></div>
		<div className={'note-card-background' + (this.state.floating?' floating':'')}>

			<div className='note-card'
				onClick={ () => this.setState( {floating: true } ) }>
				<div className='cancel' onClick={ (e) => {
						this.setState( {floating: false } ) 
						e.stopPropagation()
					}}>
					&times;
				</div>				
				<div className={ 'color-bar ' + TYPE_COLOR_MAPPING[this.props.type] }>
				</div>
				{ this.props.type == 'note' &&
					<div className='note'>
						<div className='note-header'>
							{t('Booking notes')}
						</div>
						{ this.props.data.map( note => 
							<div className='note-content'>
								<div style={{display: 'flex'}}>
									<div className='user-name'>
										{note.user_name}
									</div>
									<div className='date'>
										{note.date}
									</div>
								</div>
								{note.content}
							</div>							
						)}		
					</div>					
				}
				{ this.props.type == 'cancel_policy' &&
					<div className='note'>
						<div className='note-header'>
							{t('Cancellation policy')}
						</div>
						<div className='note-content'>
							{this.props.data.cancel_policy}
						</div>		

						<div className='note-header'>
							{t('Current cancellation status:')}
						</div>
						<div className='note-content'>
							{this.props.data.cancel_status}
						</div>	

						<div className='note-header'>
							{t('Cancellation policy remarks')}
						</div>
						<div className='note-content'>
							{this.props.data.remarks}
						</div>			

						<div className='note-header'>
							{t('No-show policy')}
						</div>
						<div className='note-content'>
							{this.props.data.no_show_policy}
						</div>						
					</div>					
				}
				{ this.props.type == 'modification_history' &&
					<div className='note'>
						<div className='note-header'>
							{t('Booking modifications')}
						</div>
						{ this.props.data.map( modification =>  
							<div className='note-content'>
								<div style={{display: 'flex'}}>
									<div className='user-name'>
										{modification.modified_by}
									</div>
									<div className='date'>
										{modification.modified_at}
									</div>
								</div>
								{ modification.changed_field + ' was changed from ' + modification.before_change
									+ ' to ' + modification.after_change }
							</div>
						)}		
					</div>					
				}		
				<div className='gradient-blocker'></div>
			</div>
		</div>
    	</React.Fragment>
    )
  }
}

export default NoteCard