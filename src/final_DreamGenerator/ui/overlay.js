const overlay = document.getElementById('overlay');

export function displayOverlay(message = 'Loading...') {
  overlay.innerHTML = `<div class="overlay-message">${message}</div>`;
  overlay.style.display = 'flex';
}

export function hideOverlay() {
  overlay.style.display = 'none';
}
