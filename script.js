const userListElement = document.getElementById('user-list');
const categoriesElement = document.getElementById('categories-list');
const fetchMoreButton = document.getElementById('fetch-more');
const loadingText = document.getElementById('loading-text');

const CATEGORIES_LIST = ["Category 1", "Category 2", "Category 3"];

let selectedCategories = [];

function handleCategoryClick(e) {
  const category = e.target.textContent;

  const isSelected = selectedCategories.find((item) => item === category);

  if (isSelected) {
    e.target.classList.remove('selected');
    selectedCategories = selectedCategories.filter((item) => item !== category);
  } else {
    e.target.classList.add('selected');
    selectedCategories = [...selectedCategories, category];
  }

  renderUsersList();
}

function initiateCategories() {
  CATEGORIES_LIST.forEach(categoryItem => {
    const category = document.createElement('div');

    category.className = 'category clickable-category';
    category.textContent = categoryItem;

    category.addEventListener('click', handleCategoryClick);

    categoriesElement.appendChild(category);
  })
}

function handleLoadingStart() {
  fetchMoreButton.disabled = true;
  loadingText.style.display = "unset";
}

function handleLoadingFinish() {
  fetchMoreButton.disabled = false;
  loadingText.style.display = "none";
}

function createAvatarElement(user) {
  const avatar = document.createElement('div');

  const avatarText = user.fname.split('')[0] + user.lname.split('')[0];

  avatar.className = 'user-avatar';
  avatar.textContent = avatarText;

  return avatar;
}

function createCategoryElement(user) {
  const category = document.createElement('div');

  category.className = 'category user-category';
  category.textContent = user.category;

  return category;
}

function createUsernameElement(user) {
  const userName = document.createElement('span');

  userName.className = 'user-name';
  userName.textContent = `${user.fname} ${user.lname}`;

  return userName;
}

let usersList = [];

function renderUsersList() {
  // Clear the existing user list
  userListElement.innerHTML = '';

  // Create a user card for each user
  usersList.forEach(user => {
    if (!selectedCategories.find(category => user.category === category) && selectedCategories.length !== 0) return;

    // create user card element
    const userCard = document.createElement('div');
    userCard.className = 'user-card';

    // create user avatar element
    const avatar = createAvatarElement(user);
    userCard.appendChild(avatar);

    // create user category element
    const userName = createUsernameElement(user);
    userCard.appendChild(userName);

    // create user name element
    const category = createCategoryElement(user);
    userCard.appendChild(category);

    userListElement.appendChild(userCard);

    handleLoadingFinish();
  });
}

function fetchUsers() {
  handleLoadingStart();

  const API_URL = `https://filltext.com/?rows=10&fname={firstName}&lname={lastName}&category=["Category 1", "Category 2", "Category 3"]&pretty=true`

  // Make an API request to get the users list
  fetch(API_URL)
    .then(response => response.json())
    .then(data => {
      // add the new users to the existing users list
      usersList = [...usersList, ...data];

      renderUsersList();
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

initiateCategories();

fetchUsers();

fetchMoreButton.addEventListener('click', fetchUsers);
