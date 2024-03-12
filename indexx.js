let user_tab = document.querySelector("[your_weather]");
let search_tab = document.querySelector("[search_weather]")
let user_cont = document.querySelector(".main_str") ;
let grantacess= document.querySelector(".grant_location")
let searchform= document.querySelector("[data_form]")
let loading= document.querySelector(".loading_screen")
let user_info = document.querySelector(".user_info")

// Variables have been assigned
let currentTab = user_tab;
const API_KEY ="3c8425edf8f3daf2931a096988e5f243";
currentTab.classList.add("currentTab");
getfromstorage();

function switch_tab(clicked_tab){
    if(clicked_tab!=currentTab){
        currentTab.classList.remove("currentTab")
        currentTab=clicked_tab;
        currentTab.classList.add('currentTab')
        // check for search tab visible or not
        if(!searchform.classList.contains("active")){
            user_info.classList.remove("active");
            grantacess.classList.remove("active");
            searchform.classList.add('active');

            
        }
        else{
            searchform.classList.remove("active");
            user_info.classList.remove("active")
            getfromstorage();

        }




    }

}

user_tab.addEventListener("click",function(){
    // this fucntion is called when user tab is clicked so call user tab
    switch_tab(user_tab);
} );
search_tab.addEventListener("click",function(){
    switch_tab(search_tab);
});


// For checking user location coordinates
function getfromstorage(){
    // for checking whether location information present or not
    const localcord= sessionStorage.getItem("user-coordinates");
    if(!localcord){
        grantacess.classList.add("active");
    }
    else{
        // call api with give info of localcord
        const coord= JSON.parse(localcord);
        fetchUserweather(coord);
    }

    


}
//  calling api
async function fetchUserweather(coord){
    const{lat, lon}=coord;
    // making grantlocation tab invisble if it is present 
    grantacess.classList.remove("active");

    // making loader visble that is a gif
    loading.classList.add("active");

    // now api call is made
    try{
        const request =  await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await request.json();

        // remove loading screen now
        loading.classList.remove("active");
        user_info.classList.add('active');
        getweatherinfo(data);

        // based on the data various information will be displayed
      


    }
    catch(err){
        loading.classList.remove("active");
        alert("Error while finding location "+err);
    }
      
}




function getweatherinfo(data){
    let city_name= document.querySelector("[data-cityName]");
    let country_icon = document.querySelector("[country_icon]");
    let weatherdesc = document.querySelector("[weather_desc]");
    let icon = document.querySelector("[weather_img]");
    let temp = document.querySelector("[data-temp]");
    let cloud = document.querySelector("[data-cloud]");
    let humidity = document.querySelector("[data-humidity]");
    let winspeed = document.querySelector("[data-windspeed]");


   // fetching values from weather info

//     we use the innertext or src method to tell the script to save data rendered in img form or text form.

   city_name.innerText= data?.name;
   country_icon.src= `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
   weatherdesc.innerText=data?.weather?.[0]?.description;
   icon.src= `https://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`
   temp.innerText = `${data?.main?.temp} °C`;
   winspeed.innerText=`${data?.wind?.speed} m/s`;
   humidity.innerText = `${data?.main?.humidity} %`;

   cloud.innerText = `${data?.clouds?.all} %`



}

function getlocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert("Unable to fetch user location")
    }


}
function showPosition(position){
    const usercoord={
        lat:position.coords.latitude,
        lon:position.coords.longitude,

    }
    sessionStorage.setItem("user-coordinates",JSON.stringify(usercoord))
    fetchUserweather(usercoord);



}

const accessButton = document.querySelector("[data_access]");
accessButton.addEventListener("click",getlocation);

const search= document.querySelector("[data_search]");
searchform.addEventListener("submit",function(e){
    e.preventDefault();
    let citynaam= search.value;
    if(citynaam===""){
        return;
    }
    else{
        fetchCityWeather(citynaam);
    }
})
async function fetchCityWeather(citynaam){
    loading.classList.add("active");
    user_info.classList.remove("active");

    try{
        const reuqest = await fetch (`https://api.openweathermap.org/data/2.5/weather?q=${citynaam}&appid=${API_KEY}&units=metric`)
        const data = await reuqest.json();
        loading.classList.remove("active");
        user_info.classList.add("active");
        getweatherinfo(data);

    

}
catch(err){
    loading.classList.remove("active")
    alert('Error while finding location '+err)
}
}













