export const getObjectURLFromArray = (array: number[]) => {
  const buffer = new Uint8Array(array);
  const blob = new Blob([buffer]);
  return window.URL.createObjectURL(blob);
};

export const downloadFile = (url: string, name: string) => {
  const a = document.createElement('a');

  document.body.appendChild(a);
  a.style.display = 'none';
  a.href = url;
  a.download = name;
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
};
