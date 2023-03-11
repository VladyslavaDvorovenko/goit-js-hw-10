import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const searchEl = document.querySelector('#search-box');
const countryListEl = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');

searchEl.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput() {
  if (!searchEl.value.trim()) {
    countryInfo.innerHTML = '';
    countryList.innerHTML = '';
    return;
  }

  fetchCountries(searchEl.value.trim())
    .then(countries => {
      if (countries.length === 1) {
        createCountryCard(countries);
        countryListEl.innerHTML = '';
      } else if (countries.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        countryListEl.innerHTML = '';
        countryInfoEl.innerHTML = '';
      } else if (countries.length >= 2 && countries.length <= 10) {
        createCountryList(countries);
        countryInfoEl.innerHTML = '';
      }
    })
    .catch(err => {
      switch (err.message) {
        case '404': {
          Notify.failure('Oops, there is no country with that name');
          countryInfo.innerHTML = '';
          countryList.innerHTML = '';
          break;
        }
      }
    });
}

function createCountryCard(countries) {
  const markup = countries
    .map(country => {
      return `
        <div>
        <img src='${country.flags.svg}' alt='flag' width="40" height="20">
        <h1>${country.name.official}</h1>
        <p><span class='country-text'>Capital: </span> ${country.capital}</p>
        <p><span class='country-text'>Population: </span>${
          country.population
        }</p>
        <p><span class='country-text'>Languages: </span>${Object.values(
          country.languages
        )}</p>
        </div>`;
    })
    .join('');
  countryInfoEl.innerHTML = markup;
}

function createCountryList(countries) {
  const markup = countries
    .map(country => {
      return `
        <li>
        <img src='${country.flags.svg}' alt='flag' width="40" height="20">
        <p class='country-name-text'>${country.name.official}</p>
        </li>`;
    })
    .join('');
  countryListEl.innerHTML = markup;
}
