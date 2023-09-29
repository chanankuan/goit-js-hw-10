import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { catInfoDiv, loader, selection } from './refs';
import { getBreeds, getCatByBreed } from './cat-api';
import { progressBar } from './progressBar';

createOptions();
selection.addEventListener('change', onSelect);

async function createOptions() {
  loader.classList.remove('hidden');
  try {
    const breedData = await getBreeds();
    const markup = breedData
      .map(breed => {
        return `
        <option value=${breed.id}>${breed.name}</option>
      `;
      })
      .join('');

    selection.insertAdjacentHTML('beforeend', markup);
  } catch (error) {
    console.error(error);
    Notify.failure('Oops! Something went wrong! Try reloading the page!');
  } finally {
    loader.classList.add('hidden');
    selection.classList.remove('hidden');
  }
}

async function onSelect(event) {
  loader.classList.remove('hidden');
  const selectedBreedId = event.target.value;

  try {
    const objData = await getCatByBreed(selectedBreedId);
    if (objData.length === 0) {
      loader.classList.add('loader-hidden');
      catInfoDiv.innerHTML = `<h3>We could not find anything. Maybe you should change your search query?</h3>`;
      return;
    }

    const catData = objData[0];
    loader.classList.add('hidden');
    displayData(catData);
  } catch (error) {
    console.error(error);
    Notify.failure('Oops! Something went wrong! Try reloading the page!');
  }
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
