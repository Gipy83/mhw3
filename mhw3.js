var Id_Team = new Map();
const Api_key = 'tf5uggvwfaw8ne8wv6ckurks';
const Gif_endpoint = 'https://api.giphy.com/v1/stickers/search?api_key='
const Gif_key = 'aboaoD2NgZU0jNkiO116DWGznAbRpI3I';
const team = '583ecda6-fb46-11e1-82cb-f4ce4684ea4c';
var flag = 0;
var flag2 = 0;

var Giocatore_search;
//Jakob Poeltl
//Carlik Jones

function sleep(ms) {
    var time = new Date().getTime();
    while (new Date().getTime() < time + ms);
}

function NessunRisultato(){
    const img=document.querySelector('.im');
    const h2 = document.querySelector('h2');
    h2.classList.remove('hidden');
    img.classList.add('hidden');
    console.log('FINE 2');
}


function ThirdJson(json){
    console.log(json);
    const article = document.querySelector('.art');
    article.classList.remove('hidden');
    console.log(article)
    const img = document.querySelector('.im');
    const div_esistente = document.querySelector('div.carica');
    console.log(div_esistente);
    const span1 = document.createElement('span');
    const span2 = document.createElement('span');
    const span3 = document.createElement('span');
    const span4 = document.createElement('span');
    const span5 = document.createElement('span');
    const span6 = document.createElement('span');
    const span7 = document.createElement('span');
    const altezza = parseInt(json.height)*0.0254;
    const peso = parseInt(json.weight)*0.453592;

    
    img.classList.add('hidden');

    div_esistente.innerHTML='';

    span1.textContent = json.birthdate;
    span2.textContent = json.birth_place;
    span3.textContent = json.jersey_number;
    span4.textContent = json.position;
    span5.textContent = json.rookie_year;
    span6.textContent = altezza;
    span7.textContent = peso;
    
    div_esistente.appendChild(span1);
    div_esistente.appendChild(span2);
    div_esistente.appendChild(span3);
    div_esistente.appendChild(span4);
    div_esistente.appendChild(span5);
    div_esistente.appendChild(span6);
    div_esistente.appendChild(span7);
}


function StampaGiocatore(id){
    Giocatore_search = "https://api.sportradar.com/nba/trial/v8/en/players/" + id + "/profile.json?api_key="+Api_key;
    sleep(500);
    fetch(Giocatore_search).then(OnResponse).then(ThirdJson);
}

function SecondJson(json, isToCheckFlag = false){
    const giocatore = document.querySelectorAll('label');
    const input = giocatore[0].childNodes[1].value;
    const player = json.players;
    let nome;
    for(let i of player){
        nome = i.full_name;
        if( nome == input){
            StampaGiocatore(i.id);
            flag = 1;
            flag2 = 1;
        }
    }
    if(isToCheckFlag && flag === 0){
        NessunRisultato();
    }
}


function CercaGiocatore(isToCheckFlag){
    const Team_endpoint_start = "https://api.sportradar.com/nba/trial/v8/en/teams/";
    const Team_endpoint_end = "/profile.json?api_key=";
    let Team_endpoint;
    const iterator = Id_Team[Symbol.iterator]();

    for(let i of iterator){
        Team_endpoint = Team_endpoint_start + i[1] + Team_endpoint_end + Api_key;
        fetch(Team_endpoint).then(OnResponse).then((res)=>{SecondJson(res, isToCheckFlag)});
        sleep(1000);
    }
    
}

function OnJson(json, isToCheckFlag = false){
    Id_Team.clear;
    const a = json.series;

    for(let j=0;j<a.length;j++){
        for(let i=0; i<2;i++){
            Id_Team.set(a[j].participants[i].team.name, a[j].participants[i].team.id);
        }
    }
    CercaGiocatore(isToCheckFlag);
}

function OnResponse(response){
    return response.json();
}


function MostraGif(json){
    console.log(json.data[0].images.original.url);
    const img = document.querySelector('.im');
    img.src = json.data[0].images.original.url;
    img.classList.remove('hidden');
}


function Buffering(){
    if(flag2===0){
        fetch(Gif_endpoint+Gif_key+'&q=buffering&limit=1&lang=en').then(OnResponse).then(MostraGif);
    }else{
        const img = document.querySelector('.im');
        const article = document.querySelector('.art');
        img.classList.remove('hidden');
        article.classList.add('hidden');
    }
}


function Apri(event){
    flag=0;
    const h2= document.querySelector('.h');
    
    h2.classList.add('hidden');
    event.preventDefault();
    Buffering();
    const anno = document.querySelectorAll('label');
    const Series_Schedule_start="https://api.sportradar.com/nba/trial/v8/en/series/";
    const Series_Schedule_end="/PST/schedule.json?api_key=";
    const Series_Schedule = Series_Schedule_start + anno[1].childNodes[1].value + Series_Schedule_end;
    
    fetch(Series_Schedule + Api_key).then(OnResponse).then((res)=>{OnJson(res,true)});

}



const form = document.querySelector('form');
form.addEventListener('submit', Apri);

