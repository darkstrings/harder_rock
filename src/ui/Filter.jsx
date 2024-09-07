import { useSearchParams } from "react-router-dom";
import styled, { css } from "styled-components";

const StyledFilter = styled.div`
  border: 1px solid var(--color-grey-100);
  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-sm);
  border-radius: var(--border-radius-sm);
  padding: 0.4rem;
  display: flex;
  gap: 0.4rem;
`;

const FilterButton = styled.button`
  background-color: var(--color-grey-0);
  border: none;

  ${(props) =>
    props.$active &&
    css`
      background-color: var(--color-brand-600);
      color: var(--color-brand-50);
    `}

  border-radius: var(--border-radius-sm);
  font-weight: 500;
  font-size: 1.4rem;
  /* To give the same height as select */
  padding: 0.44rem 0.8rem;
  transition: all 0.3s;

  &:hover:not(:disabled) {
    background-color: var(--color-brand-600);
    color: var(--color-brand-50);
  }
`;

function Filter({ filterField, options }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentFilter = searchParams.get(filterField) || options[0].value;

  function handleClick(value) {
    if (searchParams.get("page")) searchParams.set("page", 1);
    setSearchParams((prevSearchParams) => {
      const newSearchParams = new URLSearchParams(prevSearchParams);
      newSearchParams.set(filterField, value);
      return newSearchParams;
    });
  }

  return (
    <StyledFilter>
      {options.map((option) => (
        <FilterButton
          key={option.value}
          onClick={() => handleClick(option.value)}
          $active={option.value === currentFilter}
          $disabled={option.value === currentFilter}>
          {option.label}
        </FilterButton>
      ))}
    </StyledFilter>
  );
}

export default Filter;

/**
 In the context of the 
useSearchParams
 hook from React Router, 
searchParams.set
 and 
setSearchParams
 serve different purposes, but they work together to update the search parameters in the URL.

searchParams.set("discount", value)
:

This line updates the 
searchParams
 object with the new value for the "discount" parameter.

It modifies the 
searchParams
 object directly, but it does not update the URL in the browser's address bar.

setSearchParams(searchParams)
:

This line takes the updated 
searchParams
 object and sets it as the new search parameters in the URL.

It triggers a re-render of the component and updates the URL in the browser's address bar with the new search parameters.

So, the process of updating the search parameters involves two steps:

First, you update the 
searchParams
 object with the new value using 
searchParams.set
.

Then, you pass the updated 
searchParams
 object to 
setSearchParams
 to update the URL and trigger a re-render.

Here's a breakdown of what happens in the 
handleClick
 function:

function handleClick(value) {
  searchParams.set("discount", value); // Update the searchParams object with the new value
  setSearchParams(searchParams); // Update the URL and trigger a re-render
}

Copy

Insert at cursor
javascript
When you click one of the filter buttons, the 
handleClick
 function is called with the corresponding value ("all", "no-discount", or "with-discount"). Inside the function:

searchParams.set("discount", value)
 updates the 
searchParams
 object with the new value for the "discount" parameter.

setSearchParams(searchParams)
 takes the updated 
searchParams
 object and sets it as the new search parameters in the URL, triggering a re-render of the component.

This two-step process is necessary because 
searchParams.set
 only updates the object in memory, but it doesn't update the URL or trigger a re-render. To reflect the changes in the URL and trigger a re-render, you need to call 
setSearchParams
 with the updated 
searchParams
 object.

In summary, 
searchParams.set
 is used to update the 
searchParams
 object, while 
setSearchParams
 is used to update the URL and trigger a re-render with the new search parameters.

 */
