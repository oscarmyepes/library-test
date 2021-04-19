import classnames from 'classnames';
import * as React from 'react';
import LoadingIndicator from '../../common/LoadingIndicator/LoadingIndicator';
import CrossIcon from '../../icons/CrossIcon';
import { RenderListData, SearchBarProps } from './models';
import SearchBarSuggestions from './SearchBarSuggestions';
import styles from './styles/searchBar.scss';

export const KEY_STROKE_DELAY = 400;

const SearchBar = ({
  className,
  linkEl = 'a',
  noResultsText,
  placeholder = 'Enter keyword',
  searchButtonText = 'Search',
  showCloseIcon,
  styled,
  onSubmit,
  showNoResultsMsg = true,
  searchValue: searchString = '',
  isLoading,
  onChange,
  onClear,
  renderNoResults,
  sections,
  renderList,
  onItemClick,
}: SearchBarProps) => {
  const [searchValue, setSearchValue] = React.useState(searchString);
  // Flag to control if suggestions should be visible or not, this is useful
  // when user clicks oustside the search bar container, so we can hide the result list.
  const [shouldShowSuggestions, setShowSuggestions] = React.useState(false);
  // When user is navigating using the keyboard we track the index of the selected result item to
  // trigger the click event when user hits enter key
  const [focusedItemIndex, setFocusedItemIndex] = React.useState<number>(null);
  const resultItemRefs: HTMLElement[] = [];
  const formRef = React.useRef(null);
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  const escapeListener = React.useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  }, []);

  const clickListener = React.useCallback(
    (e: MouseEvent) => {
      // This happens when user clicks outside the SearchBar component
      if (!formRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    },
    [formRef.current]
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

  React.useEffect(() => {
    setSearchValue(searchString);
  }, [searchString]);

  const onContainerKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const { key } = event;

    switch (key) {
      case 'ArrowDown':
        showSuggestionsOnArrowKeyDown();
        event.preventDefault();
        break;
    }
  };

  const onChangeInternal = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    setSearchValue(value);
    setShowSuggestions(true);
    onChange?.(value);
  };

  const showSuggestionsOnArrowKeyDown = () => {
    if (searchValue) {
      setShowSuggestions(true);
    }
  };

  const onInputFocus = () => {
    setFocusedItemIndex(-1);
    if (searchValue) {
      setShowSuggestions(true);
    }
  };

  const clear = () => {
    setSearchValue('');
    onClear?.();
    searchInputRef.current.focus();
  };

  const _onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!resultItemRefs[focusedItemIndex]) {
      onSubmit?.(searchValue);
      setShowSuggestions(false);
    }
  };

  const showSuggestions = () =>
    sections.reduce((acc, item) => acc + (item?.data?.list?.length || 0), 0) &&
    shouldShowSuggestions;

  const renderErrorOrNoResultsMessage = () => {
    if (renderNoResults) {
      return renderNoResults();
    }
    return noResultsText ? <p>{noResultsText}</p> : null;
  };

  const renderLoadingIndicator = () => (
    <LoadingIndicator
      type="linear"
      className="Sui-SearchBar--loading-indicator"
    />
  );

  const renderSuggestions = () =>
    renderList ? (
      renderList(
        sections.reduce(
          (acc, item) => ({
            ...acc,
            [item.type]: { data: item?.data, title: item.title },
          }),
          {}
        ) as RenderListData
      )
    ) : (
      <SearchBarSuggestions
        styled={styled}
        sections={sections}
        linkEl={linkEl}
        onItemClick={onItemClick}
      />
    );

  return (
    <div
      className={classnames(styles.searchBarRoot, className)}
      role="button"
      tabIndex={0}
      onKeyDown={onContainerKeyDown}
    >
      <form
        ref={formRef}
        className={classnames(styles.searchBarContainer)}
        onSubmit={_onSubmit}
      >
        {isLoading && styled ? renderLoadingIndicator() : null}
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
              ref={searchInputRef}
              id="sui-search-bar-input"
              name="sui-search-bar-input"
              autoComplete="off"
              placeholder={placeholder || ''}
              aria-label="search-input"
              value={searchValue}
              onChange={onChangeInternal}
              onFocus={onInputFocus}
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
                [`SuiButton primary ${styles.styledButton}`]: styled,
              },
              'Sui-SearchBar--search-button'
            )}
            type="submit"
          >
            {searchButtonText}
          </button>
        </div>
        {showNoResultsMsg && renderErrorOrNoResultsMessage()}
        {showSuggestions() ? renderSuggestions() : null}
      </form>
    </div>
  );
};

export default SearchBar;
