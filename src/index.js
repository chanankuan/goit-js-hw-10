import axios from 'axios';
import { API_KEY, catInfoDiv, loader, selection } from './refs';
import { fetchBreeds, fetchCatByBreed } from './cat-api';
import { progressBar } from './progressBar';

axios.defaults.headers.common['x-api-key'] = API_KEY;

createOptions();
selection.addEventListener('change', onSelect);

async function createOptions() {
  loader.classList.remove('loader-hidden');
  const breedData = await fetchBreeds();
  if (breedData === undefined) {
    loader.classList.add('loader-hidden');
    return;
  }
  const markup = breedData
    .map(breed => {
      return `
      <option value=${breed.id}>${breed.name}</option>
    `;
    })
    .join('');

  selection.innerHTML = markup;
  loader.classList.add('loader-hidden');
}

async function onSelect(event) {
  loader.classList.remove('loader-hidden');
  const selectedBreedId = event.target.value;
  const objData = await fetchCatByBreed(selectedBreedId);
  const catData = objData[0];

  displayData(catData);
  loader.classList.add('loader-hidden');
}

function displayData(data) {
  console.log(data);
  const {
    url,
    breeds: [{ name, description, temperament, affection_level, energy_level }],
  } = data;
  const breedCards = [
    {
      name: 'Playfulness',
      level: affection_level,
    },
    {
      name: 'Activity Level',
      level: energy_level,
    },
    {
      name: 'Friendliness To Other Pets',
      level: affection_level,
    },
    {
      name: 'Affection Towards Owners',
      level: affection_level,
    },
    {
      name: 'Intelligence',
      level: affection_level,
    },
    {
      name: 'Need For Attention',
      level: affection_level,
    },
  ];

  const breedCardModule = breedCards
    .map(card => {
      return `
        <li>
          <p>
            ${card.name}
            ${progressBar[card.level]}
          </p>
        </li>
      `;
    })
    .join('');

  // console.log(breedCardModule);

  const markup = `
    <img src="${url}" alt="${name}" />
    <div class="content">
      <h2>${name}</h2>
      <p>${description}</p>
      <p class="temperament">
        Temperament: <span>${temperament}</span>
      </p>
      <ul style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px 10px;">${breedCardModule}</ul>
    `;

  catInfoDiv.innerHTML = markup;
}
