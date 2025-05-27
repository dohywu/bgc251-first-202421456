export function saveCurrentDream() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  saveCanvas(`dream-${timestamp}`, 'png');
}
