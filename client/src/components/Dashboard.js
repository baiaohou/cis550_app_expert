import React from 'react';
import '../style/Dashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';
import GenreButton from './GenreButton';
import DashboardMovieRow from './DashboardMovieRow';
import AppDetail from './AppDetail';
import { BrowserRouter as Router, Route, NavLink, Switch, Redirect } from "react-router-dom";
// import { Switch } from 'antd';

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    // The state maintained by this React Component. This component maintains the list of genres,
    // and a list of movies for a specified genre.
    this.state = {
      genres: [],
      apps: []
    }

    this.showMovies = this.showMovies.bind(this);
  }

  // React function that is called when the page load.
  componentDidMount() {
    // Send an HTTP request to the server.
    fetch("http://localhost:8081/genres", {
      method: 'GET' // The type of HTTP request.
    })
      .then(res => res.json()) // Convert the response data to a JSON.
      .then(genreList => {
        if (!genreList) return;
        // Map each genreObj in genreList to an HTML element:
        // A button which triggers the showMovies function for each genre.
        let genreDivs = genreList.map((genreObj, i) =>
          <GenreButton id={"button-" + genreObj.genre} onClick={() => this.showMovies(genreObj.genre)} genre={genreObj.genre} />
        );

        // Set the state of the genres list to the value returned by the HTTP response from the server.
        this.setState({
          genres: genreDivs
        })
      })
      .catch(err => console.log(err))	// Print the error if there is one.
  }


  /* ---- Q1b (Dashboard) ---- */
  /* Set this.state.movies to a list of <DashboardMovieRow />'s. */
  showMovies(genre) {
    fetch("http://localhost:8081/genres/"+genre, {
      method: 'GET' // The type of HTTP request.
    })
  
      .then(res => res.json()) // Convert the response data to a JSON.
      .then(appList => {
        
        if (!appList) return;
        // Map each genreObj in genreList to an HTML element:
        // A button which triggers the showMovies function for each genre.
        let appDivs = appList.map((app, i) =>

        <div key={i} className="app">
        {/* <div className="App">{}</div> */}
        {/* <Router> */}
        <NavLink to = {"/app_detail/:"+ app.App}  replace > {app.App}</NavLink>
        <div className="Rating">{app.Rating}</div>
        <div className="Installs">{app.Installs}</div>

        {/* <Switch>
        <Route
							path={"/app_deatil/:"+ app.App}
							render={() => (
								<AppDetail app_name={app.App}/>
							)}
						/>
        </Switch>
        </Router> */}
        </div>
        );
        console.log(appList);

        // Set the state of the genres list to the value returned by the HTTP response from the server.
        this.setState({
          apps: appDivs
        })
      })
      .catch(err => console.log(err))	// Print the error if there is one.
  }

  render() {    
    return (
      <div className="Dashboard">

        <PageNavbar active="dashboard" />

        <br></br>
        <div className="container movies-container">
          <div className="jumbotron">
            <div className="h5">Top Apps </div>
            <div className="genres-container">
              {this.state.genres}
            </div>
          </div>

          <br></br>
          <div className="jumbotron">
            <div className="movies-container"> 
              <div className="movies-header">
                <div className="header-lg"><strong>App</strong></div>
                <div className="header"><strong>Rating</strong></div>
                <div className="header"><strong>Installs</strong></div>
              </div>
              <div className="results-container" id="results">
                {this.state.apps}
              </div>
         
            </div>
          </div>
        </div>
      </div>
    );
  }
}