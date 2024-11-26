/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    'postcss-preset-env': {
      stage: 1,
      features: {
        'custom-properties': true,
        'color-functional-notation': true,
      },
    },
  },
};

export default config;
