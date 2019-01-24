export function getObjectURLFromArray(array) {
  const buffer = new window.Uint8Array(array);
  const blob = new window.Blob([buffer]);
  return window.URL.createObjectURL(blob);
}

export function downloadFile(url, name) {
  const a = document.createElement('a');

  document.body.appendChild(a);
  a.style = 'display: none';
  a.href = url;
  a.download = name;
  a.click();
  window.URL.revokeObjectURL(url);
}
