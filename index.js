const userTab=document.querySelector("#yLoc");
const searchTab=document.querySelector("#sLoc");
const searchbar=document.querySelector("#second");
const mainsec=document.querySelector("#main");
const grant=document.querySelector("#first");
const notfound=document.querySelector("#notFound");
const loading=document.querySelector("#load");
const grantBtn=document.querySelector("#button1");
const searchBtn=document.querySelector("#button2");
const searchname=document.querySelector("#searchName");
const loadingScreen=document.querySelector("#load");


let currentTab=userTab;
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
currentTab.style.backgroundColor="rgba(255,255,255, 0.4)";
loading.style.visibility = "hidden";
main.style.visibility = "hidden";
searchbar.style.visibility = "hidden";
notfound.style.visibility = "hidden";

function switchTab(newTab){

    if(newTab != currentTab){
       currentTab.style.removeProperty("background-color");
       currentTab=newTab;
    
       currentTab.style.backgroundColor="rgba(255,255,255, 0.4)";
       if(currentTab==userTab){
            
            searchbar.style.visibility = "hidden";
            main.style.visibility = "hidden";
            if(granted===1){
                getfromSessionStorage();
            }else{
                grant.style.visibility = "visible";
            }

       }
       else{
         searchbar.style.visibility = "visible";
         searchname.value="";
         main.style.visibility = "hidden";
         grant.style.visibility = "hidden";
         notfound.style.visibility = "hidden";
       }

    }
}

userTab.addEventListener("click", () => {
    //pass clicked tab as input paramter
    switchTab(userTab);
});

searchTab.addEventListener("click", () => {
    //pass clicked tab as input paramter
    switchTab(searchTab);
});

function getfromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates) {
        //agar local coordinates nahi mile
        grant.style.visibility = "visible";
        main.style.visibility = "hidden";
    }
    else {
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }

}

let granted=0;
grantBtn.addEventListener("click",()=>{
    main.style.visibility = "visible";
    grant.style.visibility = "hidden";
    granted=1;
    getLocation();
    getfromSessionStorage();
    
});


async function fetchUserWeatherInfo(coordinates) {
    const {lat, lon} = coordinates;
    // make grantcontainer invisible
    grant.style.visibility="hidden";
    //make loader visible
    main.style.visibility="hidden";
    loadingScreen.style.visibility = "visible";

    //API CALL
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
          );
        const  data = await response.json();

        loadingScreen.style.visibility = "hidden";
        notfound.style.visibility="hidden";
        main.style.visibility = "visible";
        renderWeatherInfo(data);
    }
    catch(err) {
        loadingScreen.style.visibility = "hidden";
        //HW
        notfound.style.visibility="visible";
        main.style.visibility="hidden";

    }

}

function renderWeatherInfo(weatherInfo) {
    const cityName = document.querySelector("#cityName");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("#atm");
    const weatherIcon = document.querySelector("#data-weatherIcon");
    const temp = document.querySelector("#temp");
    const windspeed = document.querySelector("#valueWind");
    const humidity = document.querySelector("#valueHumi");
    const cloudiness = document.querySelector("#valueCloud");

    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
}

function getLocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        main.style.visibility="hidden";
        loadingScreen.style.visibility = "hidden";
        notfound.style.visibility="visible";
        searchbar.style.visibility="hidden";
        
    }
}

function showPosition(position) {

    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);

}
searchbar.addEventListener("submit",(e)=>{
    e.preventDefault();
    let cityName=searchname.value;
    if(cityName === "")
        return;
    else 
        fetchSearchWeatherInfo(cityName); 
    
});
async function fetchSearchWeatherInfo(city) {
    
    loadingScreen.style.visibility = "visible";
    main.style.visibility="hidden";
    grant.style.visibility="hidden";


    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
          );
        const data = await response.json();
        searchname.value="";
            if(response.status=="404"){
            main.style.visibility="hidden";
            loadingScreen.style.visibility = "hidden";
            notfound.style.visibility="visible";
            }
            else{
            loadingScreen.style.visibility = "hidden";
            notfound.style.visibility="hidden";
            main.style.visibility="visible";
            renderWeatherInfo(data);
           }
        
    }
    catch(err) {
       
        main.style.visibility="hidden";
        loadingScreen.style.visibility = "hidden";
        notfound.style.visibility="visible";
    }
}