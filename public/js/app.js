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

// Make table rows clickable to go to activity detail view
document.querySelectorAll('.data-table tbody tr').forEach((row) => {
  row.addEventListener('click', () => {
    // Find the "View" link inside this row and go to its URL
    const link = row.querySelector('a');
    if (link) window.location.href = link.href;
  });
});

// Autotab on time input
document.addEventListener('DOMContentLoaded', () => {
  const durationGroup = document.querySelector('.duration-input-group');

  if (durationGroup) {
    const inputs = durationGroup.querySelectorAll('input');

    inputs.forEach((input, index) => {
      input.addEventListener('input', (e) => {
        // If user types 2 characters, move to next input
        if (e.target.value.length >= 2 && index < inputs.length - 1) {
          inputs[index + 1].focus();
          inputs[index + 1].select(); // Select text for easy overwriting
        }
      });

      // Allow backspace to move to previous input
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
          inputs[index - 1].focus();
        }
      });
    });
  }
});

// CONFIRM DIALOG
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('generic-confirm-modal');
  const title = document.getElementById('modal-title');
  const body = document.getElementById('modal-body');
  const form = document.getElementById('modal-confirm-form');
  const confirmBtn = document.getElementById('modal-confirm-btn');
  const cancelBtn = document.getElementById('modal-cancel');

  document.querySelectorAll('[data-confirm]').forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();

      // Pull data from the clicked element
      const config = {
        title: trigger.getAttribute('data-modal-title') || 'Are you sure?',
        body:
          trigger.getAttribute('data-modal-body') ||
          'This action cannot be undone.',
        action: trigger.getAttribute('data-confirm'), // The URL
        btnText: trigger.getAttribute('data-modal-btn') || 'Confirm',
        btnClass: trigger.getAttribute('data-modal-class') || 'btn-primary',
      };

      // Update Modal content
      title.innerText = config.title;
      body.innerText = config.body;
      form.setAttribute('action', config.action);
      confirmBtn.innerText = config.btnText;

      // Clean up old classes and add new ones (for danger states)
      confirmBtn.className = `btn ${config.btnClass}`;

      modal.showModal();
    });
  });

  cancelBtn.addEventListener('click', () => modal.close());

  // Close when clicking the backdrop
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.close();
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const pills = document.querySelectorAll('.filter-pill');
  const cards = document.querySelectorAll('.activity-card');
  const countDisplay = document.getElementById('visible-count');

  pills.forEach((pill) => {
    pill.addEventListener('click', () => {
      const filterValue = pill.getAttribute('data-filter');

      // 1. Toggle Active Class
      pills.forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');

      // 2. Filter Cards
      let visibleCount = 0;
      cards.forEach((card) => {
        const cardKind = card
          .querySelector('.kind-tag')
          .innerText.toLowerCase();

        if (filterValue === 'all' || cardKind === filterValue) {
          card.classList.remove('is-hidden');
          visibleCount++;
        } else {
          card.classList.add('is-hidden');
        }
      });

      // 3. Update Stats
      countDisplay.innerText = visibleCount;
    });
  });
});
