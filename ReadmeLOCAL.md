# Copy build into testing project
cd /home/omym/Documents/WeshopManager/sunhammer-test-library/node_modules
rm -rf /home/omym/Documents/WeshopManager/sunhammer-test-library/node_modules/sunhammer-ui && \
mkdir /home/omym/Documents/WeshopManager/sunhammer-test-library/node_modules/sunhammer-ui && \
cp -R build /home/omym/Documents/WeshopManager/sunhammer-test-library/node_modules/sunhammer-ui && \
cp package.json /home/omym/Documents/WeshopManager/sunhammer-test-library/node_modules/sunhammer-ui



TODOs

Story book custom Examples:
https://workday.github.io/canvas-kit/?path=/docs/testing-react-labs-color-picker--input-interaction
https://bbc.github.io/psammead/?path=/docs/components-brand--with-brand-link

Docker playground

Cerate stories
1. Create default theme to show components styled
2. Configure code splitting so users can import styles and components per file
3. test importing the app using CJS, AMD, UMD, and ESM
4. pacakge in one line
5. cirlce ci only PR



https://api.wsmservice.com/v1/products?site=psu&incomplete=1&search=eng&trimthreshold=0


// SEARCHBAR


/*
Notes:
*. "Show results for" must show the last sucess input search ✓
*. When there are no results a message Not reslts found should be displayed ✓
*. On click outside hide ✓
*. Configure loading indicator ✓
*. Configure scroll and height to fit the rest of the page ✓
*. Keyboard events
* Error menssage
*/




      {/* <div>
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={onSuggestionsFetchRequested}
          onSuggestionsClearRequested={onSuggestionsClearRequested}
          getSuggestionValue={() => 'value'}
          renderSuggestion={renderSuggestion}
          inputProps={inputProps}
        />
      </div> */}



        // const onSuggestionsFetchRequested = ({ value }) => loadData(value);
  // const onSuggestionsClearRequested = () => setSuggestions([]);
  // function renderSuggestion(suggestion) {
  //   return <SearchResultItem data={suggestion} styled={true} />;
  // }
  // const onChange = (event, { newValue }) => {
  //   setSearchValue(newValue);
  // };
  // const inputProps = {
  //   placeholder: "Type 'c'",
  //   value: searchValue,
  //   onChange: onChange,
  // };


// Styled classes

/******************************************************************/
/******************************************************************/
/******************************************************************/

:global .react-autosuggest__container {
  position: relative;
}

:global .react-autosuggest__input {
  width: 100%;
  box-sizing: border-box;
  height: 30px;
  padding: 10px 20px;
  font-family: Helvetica, sans-serif;
  font-weight: 300;
  font-size: 16px;
  border: 1px solid #aaa;
  border-radius: 4px;
}

:global .react-autosuggest__input--focused {
  outline: none;
}

:global .react-autosuggest__input--open {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

:global .react-autosuggest__suggestions-container {
  display: none;
}

:global .react-autosuggest__suggestions-container--open {
  display: block;
  position: absolute;
  top: 51px;
  border: 1px solid #aaa;
  background-color: #fff;
  font-family: Helvetica, sans-serif;
  font-weight: 300;
  font-size: 16px;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  z-index: 2;
  background-color: #dedede;
}

:global .react-autosuggest__suggestions-list {
  margin: 0;
  padding: 0;
  list-style-type: none;
}

:global .react-autosuggest__suggestion {
  cursor: pointer;
  padding: 10px 20px;
}

:global .react-autosuggest__suggestion--highlighted {
  background-color: #ddd;
}
