import React from "react";
import { BrowserRouter, Route, Switch, Link } from "react-router-dom";
import './App.css'
import './FontAwesome.css'

import Dashboard from './scenes/Dashboard'
import RulesEngine from './scenes/RulesEngine'
import YourHotelToday from './scenes/YourHotelToday'
import AllBookings from './scenes/AllBookings'
import Promotions from './scenes/Promotions'
import Payment from './scenes/Payment'
import MarketPricing from './scenes/MarketPricing'
import Hotel from './scenes/Hotel'
import NotFound from './scenes/NotFound'

import './api'


class App extends React.Component {
  constructor() {
    super();
    this.state = {
      spinning: false,
      width: 70,
      in_focus: 'Dashboard',
    };
  }

  toggleNavWidth = () => {
    this.setState({width:369 - this.state.width})
  }

  render() {
    return (
      <BrowserRouter>
          <Switch>
            <Route path="/" exact 
              render={(props) => <Dashboard {...props} 
                width={this.state.width} 
                toggleWidth={this.toggleNavWidth}  
              />}
            />
            <Route path="/dashboard" exact 
              render={(props) => <Dashboard {...props} 
                width={this.state.width} 
                toggleWidth={this.toggleNavWidth}  
              />}
            />            
            <Route path="/payments" exact 
              render={(props) => <Payment {...props} 
                width={this.state.width} 
                toggleWidth={this.toggleNavWidth}  
              />}
            />
            <Route path="/rules-engine" 
              render={(props) => <RulesEngine {...props}
                width={this.state.width} 
                toggleWidth={this.toggleNavWidth}  
              />}
            />
            <Route path="/hotel/bookings" 
              render={(props) => <AllBookings {...props} 
                width={this.state.width} 
                toggleWidth={this.toggleNavWidth}  
              />}
            />            
            <Route path="/your-hotel-today" 
              render={(props) => <YourHotelToday {...props}
                width={this.state.width} 
                toggleWidth={this.toggleNavWidth}  
              />}
            />
            <Route path="/revenue-management/market-pricing" 
              render={(props) => <MarketPricing {...props}
                width={this.state.width} 
                toggleWidth={this.toggleNavWidth}  
              />}
            />
            <Route path="/revenue-management/promotions" 
              render={(props) => <Promotions {...props}
                width={this.state.width} 
                toggleWidth={this.toggleNavWidth}  
              />}
            /> 
            <Route path="/hotel" 
              render={(props) => <Hotel {...props}
                width={this.state.width} 
                toggleWidth={this.toggleNavWidth}  
              />}
            />
            <Route render={(props) => <NotFound {...props} 
                width={this.state.width} 
                toggleWidth={this.toggleNavWidth} />}
            />
          </Switch> 
      </BrowserRouter>
    );
  }
}

export default App;
