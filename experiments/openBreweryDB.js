document.addEventListener("DOMContentLoaded", function (event) {
    runner();
  });
function runner(){
    const Http = new XMLHttpRequest();
    const url='https://api.openbrewerydb.org/breweries';
    Http.open("GET", url);
    Http.send();
    
    Http.onreadystatechange = (e) => {
      console.log(Http.responseText);
      var ele = document.getElementById("dump");
      ele.innerHTML = Http.response;
    }
}
