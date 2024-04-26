module.exports = {
  purge: ['./public/**/*.html', './src/**/*.{vue,js,ts,jsx,tsx}', './components/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    minHeight: {
     '0': '0',
     '1/4': '25%',
     '1/2': '50%',
     '3/4': '75%',
     'full': '100%',
     '100': '100px',
     '200': '200px',
     '300': '300px',
     '400': '400px',
    }
  },
  // prefix: 'ldt-', // text-center => ldt-text-center
  variants: {
    extend: {}
  },
  // corePlugins: {
  //   preflight: false
  // }
}