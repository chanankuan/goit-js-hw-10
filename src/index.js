import { API_KEY, catInfoDiv, loader, selection } from './refs';
import { fetchBreeds, fetchCatByBreed } from './cat-api';
import { progressBar } from './progressBar';

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
  const {
    url,
    breeds: [
      {
        name,
        description,
        temperament,
        adaptability,
        affection_level,
        child_friendly,
        energy_level,
        grooming,
        intelligence,
        social_needs,
        stranger_friendly,
      },
    ],
  } = data;

  const breedCards = [
    {
      name: 'Adaptability',
      level: adaptability,
    },
    {
      name: 'Activity Level',
      level: energy_level,
    },
    {
      name: 'Friendliness To Other Pets',
      level: stranger_friendly,
    },
    {
      name: 'Friendliness To Children',
      level: child_friendly,
    },
    {
      name: 'Grooming Requirements',
      level: grooming,
    },
    {
      name: 'Affection Towards Owners',
      level: affection_level,
    },
    {
      name: 'Intelligence',
      level: intelligence,
    },
    {
      name: 'Need For Attention',
      level: social_needs,
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

  const markup = `
    <img src="${url}" alt="${name}" />
    <div class="content">
      <h2>${name}</h2>
      <p>${description}</p>
      <p class="temperament">
        Temperament: <span>${temperament}</span>
      </p>
      <ul class="progress-list">${breedCardModule}</ul>
    `;

  catInfoDiv.innerHTML = markup;
}
