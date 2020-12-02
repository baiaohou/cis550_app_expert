import React from 'react';
import { GoogleLogout } from 'react-google-login';

const clientId =
  '610587898387-d02phqvl7l6v4bt9lm4ml3f2apg5g019.apps.googleusercontent.com';

function eraseCookie(name) {   
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

export function Logout() {
  const onSuccess = () => {
    eraseCookie("date");
    eraseCookie("email");
    eraseCookie("first_name");
    eraseCookie("last_name");
    eraseCookie("isVisit");
    eraseCookie("G_ENABLED_IDPS");
    eraseCookie("G_AUTHUSER_H");

    console.log('Logout OK');
    alert('See You Next Time!');
    window.location.replace(`http://localhost:3000/`);
  };

  return (
    <div>
      <GoogleLogout
        clientId={clientId}
        buttonText="Logout"
        onLogoutSuccess={onSuccess}
      ></GoogleLogout>
    </div>
  );
}

export default Logout;