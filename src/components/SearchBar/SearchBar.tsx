import classnames from 'classnames';
import debounce from 'lodash/fp/debounce';
import * as React from 'react';
import CrossIcon from '../../icons/CrossIcon';
import restFactory from '../../utils/restFactory';
import { ResultItem, SearchBarProps } from './models';
import styles from './searchBar.scss';
import SearchBarSuggestions from './SearchBarSuggestions';
import { DEFAULT_VISIBLE_FIELDS } from './SearchResultItem';

const SearchBar = ({
  className,
  keystrokeDelay = 250,
  linkEl = 'a',
  listTitle,
  maxResults,
  minSearchCharacters = 3,
  noResultsText,
  placeholder = 'Enter keyword',
  resultsHeaderText,
  searchButtonText = 'Search',
  showCloseIcon,
  site,
  styled,
  visibleFields = DEFAULT_VISIBLE_FIELDS,
}: SearchBarProps) => {
  const [searchValue, setSearchValue] = React.useState('');
  // resultsFor is the last successful text searched
  const [resultsFor, setResultsFor] = React.useState('');
  const [suggestions, setSuggestions] = React.useState<ResultItem[]>([]);
  // Flag to control if suggestions should be visible or not, this is useful
  // when user clicks oustside the search bar container, so we can hide the result list.
  const [shouldShowSuggestions, setShowSuggestions] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  // When user is navigating using the keyboard we track the index of the selected result item to
  // trigger the click event when user hits enter key
  const [focusedItemIndex, setFocusedItemIndex] = React.useState<number>(null);
  const resultItemRefs: HTMLElement[] = [];
  const ref = React.useRef(null);

  const escapeListener = React.useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  }, []);

  const clickListener = React.useCallback(
    (e: MouseEvent) => {
      // This happens when user clicks outside the SearchBar component
      if (!ref.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    },
    [ref.current]
  );

  React.useEffect(() => {
    document.addEventListener('click', clickListener);
    document.addEventListener('keyup', escapeListener);

    return () => {
      document.removeEventListener('click', clickListener);
      document.removeEventListener('keyup', escapeListener);
    };
  }, []);

  React.useEffect(() => {
    if (!shouldShowSuggestions) {
      setFocusedItemIndex(null);
    }
  }, [shouldShowSuggestions]);

  const loadData = React.useCallback(
    debounce(keystrokeDelay)(async (value: string) => {
      try {
        if (value.length >= minSearchCharacters) {
          const query = {
            maxcount: maxResults,
            search: value,
            site,
          };
          setLoading(true);
          const response = await restFactory.get<{ result: ResultItem[] }>(
            `${process.env.SEARCH_API_URL}/products`,
            query
          );
          setError('');
          setSuggestions(response.result);
          setLoading(false);
          setResultsFor(value);
        } else {
          setSuggestions([]);
          setResultsFor('');
        }
      } catch (reqError) {
        setSuggestions([]);
        setLoading(false);
        setResultsFor(value);
        setError(reqError.message || 'Error');
      }
    }),
    [maxResults, site, keystrokeDelay]
  );

  const handleArrowKeys = (keyCode: number) => {
    setFocusedItemIndex((index) => {
      const currIndex = index ?? -1;
      if (keyCode === 40) {
        return (currIndex + 1) % suggestions.length;
      } else {
        return currIndex > 0 ? currIndex - 1 : suggestions.length - 1;
      }
    });
  };

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    setSearchValue(value);
    setShowSuggestions(true);
    await loadData(value);
  };

  const onInputFocus = () => setShowSuggestions(true);

  const onInputKeyDown = (event) => {
    const { keyCode } = event;

    switch (keyCode) {
      case 40: // DOWN
      case 38: // UP
        handleArrowKeys(keyCode);
        break;
      case 13: {
        // ENTER
        const selectedResult = resultItemRefs[focusedItemIndex];
        if (event.keyCode === 229 || !selectedResult) {
          break;
        }
        selectedResult.click();
        break;
      }
    }
  };

  const clear = () => {
    setSearchValue('');
    setSuggestions([]);
    setResultsFor('');
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const showResultsHeader = () => !!resultsHeaderText;

  const showSuggestions = () => suggestions.length && shouldShowSuggestions;

  const showNoResults = () =>
    !loading &&
    searchValue === resultsFor &&
    searchValue.length >= minSearchCharacters &&
    !suggestions.length;

  const renderNoResultsText = (message: string) => (
    <p
      className={classnames({
        [styles.StyledNoResults]: styled,
      })}
    >
      {message}
    </p>
  );

  const renderErrorOrNoResultsMessage = () => {
    if (error) {
      return renderNoResultsText(
        `${error}. Please check your stite property${
          site ? ` (${site}).` : '.'
        }`
      );
    } else if (showNoResults()) {
      return renderNoResultsText(
        noResultsText || `No results for: ${resultsFor}`
      );
    }
    return null;
  };

  const renderLoadingIndicator = () => (
    <div
      className={classnames(
        { [styles.StyledProgressBar]: styled },
        'Sui-SearchBar--loading-indicator'
      )}
    />
  );

  return (
    <>
      <form
        ref={ref}
        className={classnames(styles.searchBarContainer, className)}
        onSubmit={onSubmit}
      >
        {loading && styled ? renderLoadingIndicator() : null}
        <div className={styles.searchBarInputContainer}>
          <div className={styles.inputContainer}>
            <input
              className={classnames(
                styles.input,
                {
                  [`SuiInput`]: styled,
                },
                'Sui-SearchBar--search-input'
              )}
              id="sui-search-bar-input"
              name="sui-search-bar-input"
              autoComplete="off"
              placeholder={placeholder || ''}
              aria-label="search-input"
              value={searchValue}
              onChange={onChange}
              onFocus={onInputFocus}
              onKeyDown={onInputKeyDown}
            />
            {showCloseIcon && searchValue && (
              <button
                type="reset"
                aria-label="clear"
                className={styles.clearIcon}
                onClick={clear}
              >
                <CrossIcon />
              </button>
            )}
          </div>

          <button
            className={classnames(
              {
                [`SuiButton primary ${styles.StyledButton}`]: styled,
              },
              'Sui-SearchBar--search-button'
            )}
            type="submit"
          >
            {searchButtonText}
          </button>
        </div>
        {renderErrorOrNoResultsMessage()}
        {showSuggestions() ? (
          <SearchBarSuggestions
            showResultsHeader={showResultsHeader}
            styled={styled}
            resultsHeaderText={resultsHeaderText}
            resultsFor={resultsFor}
            listTitle={listTitle}
            suggestions={suggestions}
            linkEl={linkEl}
            focusedItemIndex={focusedItemIndex}
            resultItemRefs={resultItemRefs}
            visibleFields={visibleFields}
          />
        ) : null}
      </form>
    </>
  );
};

export default SearchBar;
