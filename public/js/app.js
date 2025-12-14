const DARKMODEKEY = 'Activitz.darkMode';

// Check if darkmode is enabled and set class
const darkMode = localStorage.getItem(DARKMODEKEY, '');
if (darkMode) {
  document.body.classList.add('dark-mode');
}

// Add event listener to theme toggle button and store preference
const btnThemeToggle = document.querySelector('#theme-toggle-btn');
btnThemeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  if (document.body.classList.contains('dark-mode')) {
    localStorage.setItem(DARKMODEKEY, 'Y');
  } else {
    localStorage.removeItem(DARKMODEKEY);
  }
});
