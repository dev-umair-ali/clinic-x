/**
 * Global type declarations for the application
 */

// Allow importing CSS files
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

// Allow importing react-toastify CSS as a side effect
declare module 'react-toastify/dist/ReactToastify.css';
