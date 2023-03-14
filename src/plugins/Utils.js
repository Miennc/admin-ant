const readFileBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const debounce = (func, delay = 500) => {
  let debounceTimer;
  return function () {
    // @ts-ignore
    const context = this;
    // eslint-disable-next-line prefer-rest-params
    const args = arguments;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => func.apply(context, args), delay);
  };
};
const color = [
  "orange",
  "pink",
  "green",
  "cyan",
  "blue",
  "purple",
  "#108ee9",
  "#f50",
  "#2db7f5",
  "#87d068",
  "default",
];

export default {
  install: (app) => {
    app.provide("readFileBase64", readFileBase64);
    app.provide("debounce", debounce);
    app.provide(
      "getRandomColor",
      () => color[Math.floor(Math.random() * color.length)]
    );
  },
};
