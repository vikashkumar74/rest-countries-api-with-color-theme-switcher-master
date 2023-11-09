"use strict";
const countriesContainer = document.querySelector(".countries");
const mode = document.querySelector(".mode");
const input = document.querySelector(".searchCountry");
const select = document.getElementById("select");
const modeIcon = document.querySelector(".mode-icon");
const inputField = document.querySelector(".input-field");
const error = document.querySelector(".error");
const container = document.querySelector(".container");
const modeText = document.querySelector(".mode_text");

let countries;

allCountries("all");
const getData = function (data) {
  const html = `
  
  <article onclick="visit(this)" class="country">
    <img class="country__img" src="${data.flag}" />
    <div class="country__data">
      <h3 class="country__name">${data.name}</h3>
      <p class="country__row country__region"><span>Region:</span>
        ${data.region}
      </p>
    
      <p class="country__row"><span>Population:</span>${data.population.toLocaleString()}</p>
      <p class="country__row"><span>Capital:</span>${data.capital}</p>
      
     
    </div>
  </article>
  `;
  countriesContainer.insertAdjacentHTML("beforeend", html);
  countriesContainer.style.opacity = 1;
};

function getCountryDetails(data) {
  countriesContainer.innerHTML = "";
  inputField.classList.add("hidden");
  const countryDetails = document.createElement("div");
  countryDetails.className = "country_details";
  countryDetails.innerHTML = `
  <button  onclick="prevPage()" class="back_btn">&larr; Back</button>
  
            <div class="flag-image">
                <img src="${data.flag}" alt="country_image">
            </div>
            <div class="country_values">
                <h3 class="country__name ">${data.name}</h3>   
            <div class="details">
               
                <div class="countries_information">
                   
                    <p><span>Native Name:</span> ${data.nativeName}</p>
                    <p><span>Population:</span> ${data.population.toLocaleString()}</p>
                    <p> <span> Region:</span> ${data.region}</p>
                    <p> <span>Sub Region:</span> ${data.subregion}</p>
                    <p> <span> Capital:</span> ${data.capital}</p>
                </div>
                <div class="countries_information">
                    <p><span>Top Level Domain:</span>  ${
                      data.topLevelDomain
                    }</p>
                    
                    <p ><span> Currencies:</span> ${
                      data.currencies[0].name
                    }  </p>
                    <p><span> Languages:</span> ${data.languages[0].name} </p>
                </div>
            </div>
            <div class="borders">Border countries: <span class="border"> </span>  </div>
            </div>  
  `;

  countriesContainer.append(countryDetails);
  getBorder(data);
}

//function to get all border
function getBorder(data) {
  if (!data.borders) return;
  const borderContainer = document.querySelector(".border");
  data.borders.forEach((border) => {
    fetch(`https://restcountries.com/v2/alpha/${border}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Border not found (${res.status})`);
        return res.json();
      })
      .then((data) => {
        const countryBorder = document.createElement("a");
        countryBorder.href = "#";
        countryBorder.innerHTML = data.name;
        borderContainer.append(countryBorder);
      })
      .catch((err) => {
        renderError(`${err.message}. Try again! 😒`);
      });
  });
}

// to fatch all countries

function allCountries(c) {
  fetch(`https://restcountries.com/v2/${c}`)
    .then((responce) => {
      if (!responce.ok) {
        throw new Error(`Country not found (${res.status})`);
      }
      return responce.json();
    })
    .then((data) => {
      countries = data;
      for (let i = 0; i < data.length; i++) {
        getData(data[i]);
      }
    })
    .catch((err) => {
      renderError(`😞 ${err.message}. Try again! `);
    });
}

//to search country
function searchCountry(e) {
  countriesContainer.innerHTML = select.value = "";

  const findCountry = countries.filter((country) =>
    country.name.toLowerCase().includes(e.target.value.toLowerCase())
  );
  for (let i = 0; i < findCountry.length; i++) {
    getData(findCountry[i]);
  }
}

//to select regions
function selectRegion(e) {
  countriesContainer.innerHTML = input.value = "";
  fetch(`https://restcountries.com/v2/region/${select.value}`)
    .then((responce) => {
      if (!responce.ok)
        throw new Error(`Region not found (${responce.status})`);
      return responce.json();
    })
    .then((data) => {
      for (let i = 0; i < data.length; i++) {
        getData(data[i]);
      }
    })
    .catch((err) => renderError(`😒 ${err.message} .Try again!.`));
}
//  country details
function visit(e) {
  input.value = "";
  let countryDetails = e.children[1].children[0].textContent;
  fetch(`https://restcountries.com/v2/name/${countryDetails}`)
    .then((record) => {
      if (!record.ok) throw new Error(`Something went wrongs ${record.status}`);
      return record.json();
    })
    .then((details) => {
      getCountryDetails(details[0]);
    })
    .catch((err) => renderError(` 😞${err.message} .Try again!.`));
}

//back to main page
function prevPage() {
  const countryDetails = document.querySelector(".country_details");
  countryDetails.classList.add("hidden");
  inputField.classList.remove("hidden");
  allCountries("all");
}

const switchMode = function () {
  document.body.classList.toggle("darkmode");
};

//renderError function
function renderError(msg) {
  error.style.display = "flex";
  container.classList.add("hidden");
  error.insertAdjacentText("beforeend", msg);
  countriesContainer.style.opacity = 1;
}

//event call
mode.addEventListener("click", switchMode);
input.addEventListener("input", searchCountry);
select.addEventListener("change", selectRegion);
