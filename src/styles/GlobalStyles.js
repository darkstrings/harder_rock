import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
:root {
 &, &.light-mode{

  /* Grey */

  --color-grey-0: #fff; // background
  --color-grey-50: #f9fafb; //bookings outer border
  --color-grey-100: #f3f4f6; //border lines
  --color-grey-200: #e5e7eb; //Table border
  --color-grey-300: #d1d5db;//form text area border
  --color-grey-400: #9ca3af;//icon color
  --color-grey-500: #6b7280; //email and duration in bookings
  --color-grey-600: #4b5563; //headings for tables and nav
  --color-grey-700: #374151; //text
  --color-grey-800: #1f2937; //currently selected nav like
  --color-grey-900: #111827; //?
  
  --color-blue-100: #e0f2fe; //bookings backgroundcolor
  --color-blue-700: #0369a1; //bookings icon color
  --color-green-100: #dcfce7; // sales icon background color
  --color-green-700: #15803d; // sales icon color
  --color-yellow-100: #fef9c3;
  --color-yellow-700: #a16207;
  --color-silver-100: #e5e7eb;
  --color-silver-700: #374151;
  --color-indigo-100: #e0e7ff; //bg for check-ins in dash
  --color-indigo-700: #4338ca;//icon for check-ins in dash
  
  --color-red-100: #fee2e2; //delete button text
  --color-red-700: #b91c1c; //delete button background
  --color-red-800: #991b1b;
  
  --backdrop-color: rgba(255, 255, 255, 0.1);
  
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.04);
  --shadow-md: 0px 0.6rem 2.4rem rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 2.4rem 3.2rem rgba(0, 0, 0, 0.12);
  --image-grayscale: 0;
  --image-opacity: 100%;
}

&.dark-mode{
    --color-grey-0: #18212f; //main background
--color-grey-50: #111827; //background for sections
--color-grey-100: #1f2937; //inner border lines
--color-grey-200: #374151; //Table border
--color-grey-300: #4b5563; //form text area border
--color-grey-400: #6b7280; //icon color
--color-grey-500: #9ca3af; //email and duration in bookings
--color-grey-600: #d1d5db; //headings for tables and nav
--color-grey-700: #e5e7eb; //text
--color-grey-800: #f3f4f6; //currently selected nav like
--color-grey-900: #f9fafb; //?

--color-blue-100: #075985; // bg for dash num of bookings
--color-blue-700: #e0f2fe; //icon for bookings in dash
--color-green-100: #166534; //bg for sales in dash
--color-green-700: #dcfce7; //icon for sales in dash
--color-yellow-100: #854d0e; // graph?
--color-yellow-700: #fef9c3;
--color-silver-100: #374151;
--color-silver-700: #f3f4f6;
--color-indigo-100: #3730a3; //bg for check-ins in dash
--color-indigo-700: #e0e7ff; //icon for check-ins in dash

--color-red-100: #fee2e2;
--color-red-700: #b91c1c;
--color-red-800: #991b1b;

--backdrop-color: rgba(0, 0, 0, 0.3);

--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.4);
--shadow-md: 0px 0.6rem 2.4rem rgba(0, 0, 0, 0.3);
--shadow-lg: 0 2.4rem 3.2rem rgba(0, 0, 0, 0.4);

--image-grayscale: 10%;
--image-opacity: 90%;
  }

    /* Indigo */
  --color-brand-50: #f5ebec;
  --color-brand-100: #f5bfc4;
  --color-brand-200: #c52233;
  --color-brand-500: #a51c30;
  --color-brand-600: #a7333f; 
  --color-brand-700: #74121d;
  --color-brand-800: #74121d;
  --color-brand-900: #580c1f;
  --border-radius-tiny: 3px;
  --border-radius-sm: 5px;
  --border-radius-md: 7px;
  --border-radius-lg: 9px;


}

*,
*::before,
*::after {
  box-sizing: border-box;
  padding: 0;
  margin: 0;

  /* Creating animations for dark mode */
  transition: background-color 0.3s, border 0.3s;
}

html {
  font-size: 62.5%;
}

body {
 font-family: "Work Sans", sans-serif;
  color: var(--color-grey-700);
  transition: color 0.3s, background-color 0.3s;
  min-height: 100vh;
  line-height: 1.5;
  font-size: 1.6rem;
}

input,
button,
textarea,
select {
  font: inherit;
  color: inherit;
}

button {
  cursor: pointer;
}

*:disabled {
  cursor: not-allowed;
}

select:disabled,
input:disabled {
  background-color: var(--color-grey-200);
  color: var(--color-grey-500);
}

input:focus,
button:focus,
textarea:focus,
select:focus {
  outline: 2px solid var(--color-brand-600);
  outline-offset: -1px;
}

/* Parent selector, finally 😃 */
button:has(svg) {
  line-height: 0;
}

a {
  color: inherit;
  text-decoration: none;
}

ul {
  list-style: none;
}

p,
h1,
h2,
h3,
h4,
h5,
h6 {
  overflow-wrap: break-word;
  hyphens: auto;
}

img {
  max-width: 100%;

  /* For dark mode */
  filter: grayscale(var(--image-grayscale)) opacity(var(--image-opacity));
}

`;

export default GlobalStyles;
