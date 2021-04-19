import classnames from 'classnames';
import * as React from 'react';
import CrossIcon from '../../icons/CrossIcon';
import SearchIcon from '../../icons/SearchIcon';
import { SpecificationSearchProps } from './models';
import styles from './styles/specificationSearch.scss';

const SpecificationSearch = ({
  placeholder,
  searchValue,
  showClearIcon,
  data,
  styled,
  className,
  noMatchesText = 'No Matches',
}: SpecificationSearchProps) => {
  const [searchValueInternal, setSearchValueInternal] = React.useState(
    searchValue || ''
  );
  const formRef = React.useRef(null);

  React.useEffect(() => {
    setSearchValueInternal(searchValue || '');
  }, [searchValue]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    setSearchValueInternal(value);
  };

  const clear = () => {
    setSearchValueInternal('');
  };

  const renderNoMatchesText = () => (
    <p className={styles.notMatches}>{noMatchesText}</p>
  );

  const filteredLList = filterProductData(data, searchValueInternal);

  return (
    <div
      className={classnames(
        styles.root,
        {
          [styles.specificationStyled]: styled,
        },
        className
      )}
      ref={formRef}
    >
      <form onSubmit={(e) => e.preventDefault()}>
        {styled ? (
          <SearchIcon
            className={classnames(
              styles.searchIcon,
              'Sui-SpecificationSearch--search-icon'
            )}
            size={12}
          />
        ) : null}
        <input
          className={classnames({ SuiInput: styled })}
          autoComplete="off"
          placeholder={placeholder || 'Search'}
          aria-label="search-match-input"
          value={searchValueInternal}
          onChange={onChange}
          onFocus={() => searchValueInternal}
        />
        {showClearIcon && searchValueInternal && (
          <button
            type="reset"
            aria-label="clear"
            className={classnames(
              styles.clearButton,
              'Sui-SpecificationSearch--clear-button'
            )}
            onClick={clear}
          >
            <CrossIcon />
          </button>
        )}
      </form>
      <div
        className={classnames(
          styles.suggestionsContainer,
          'Sui-SpecificationSearch--suggestions'
        )}
      >
        {filteredLList.length ? (
          <table>
            <tbody>
              {filteredLList.map(([key, value], index) => (
                <tr key={index} role="row">
                  <td className={styles.leftCol}>{key}</td>
                  <td>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          renderNoMatchesText()
        )}
      </div>
    </div>
  );
};

export default SpecificationSearch;

function filterProductData(tuple: [string, string][], query: string) {
  const queryParsed = query.toLowerCase();

  return tuple.filter(
    (item) =>
      String(item[0] || '')
        .toLowerCase()
        .includes(queryParsed) ||
      String(item[1] || '')
        .toLowerCase()
        .includes(queryParsed)
  );
}
