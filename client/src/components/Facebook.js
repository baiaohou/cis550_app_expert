import React from 'react';
import FacebookLoginWithButton from 'react-facebook-login';
import { Constants } from './Constants';

const componentClicked = () => {
  console.log( "Clicked!" )
}

const LoginButton = ({facebookResponse}) => (
  <FacebookLoginWithButton
    appId="492603935040033"
    fields="name,email,picture"
    onClick={componentClicked}
    callback={facebookResponse}
    icon="fa-facebook"/>
  )

function setCookie(name,value,days) {
  var expires = "";
  if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days*24*60*60*1000));
      expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for(var i=0;i < ca.length;i++) {
      var c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1,c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
}


const UserScreen = ({user}) => {
  var first_name = user.name;
  var last_name = "";
  var email = user.email;
  
  setCookie('isVisit', '1', 1);
  setCookie('email', email, 1);
  setCookie('first_name', first_name, 1);
  setCookie('last_name', last_name, 1);
  setCookie('date', ((new Date()).getFullYear()) + "/" + ((new Date()).getMonth() + 1) + "/" + (new Date()).getDate(), 1);

  alert(
    `😍 Welcome to AppExpert, ${getCookie('first_name')}!`
  );
  // direct to home page
  window.location.replace(`${Constants.frontend_prefix}/home`);
};

class App extends React.Component {
  state = {user:false}
  facebookResponse = (response) => { console.log( response ); this.setState( {...this.state, user: response } ) }

  render() {
    return (
      <div style={{ margin: "auto", textAlign: "center", paddingTop: "2em" }}>
        { this.state.user ? <UserScreen user={this.state.user}/> :
          <LoginButton facebookResponse={this.facebookResponse}/>
        }
      </div>
    )
  }
}

export default App