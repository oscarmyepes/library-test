import classnames from 'classnames';
import * as React from 'react';
import CurrencyInput from '../../common/CurrencyInput/CurrencyInput';
import { Pair } from '../../models/generic';
import { FacetPriceSectionProps, FacetSectionProps } from './models';
import styles from './styles/facetPriceSection.scss';

const PRECISION = 0;

type PriceRange = { min: number; max: number };

interface FacetPriceRangeProps {
  className?: string;
  styled?: boolean;
  onSubmit: (range: PriceRange) => void;
  range: PriceRange;
}

const FacetPriceRange = ({
  className,
  styled,
  onSubmit,
  range,
}: FacetPriceRangeProps) => {
  const [internalRange, setInternalRange] = React.useState<PriceRange>(range);

  React.useEffect(() => {
    setInternalRange(range);
  }, [range]);

  const _onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit?.(internalRange);
  };

  const _onChange = (rangeProp: keyof PriceRange, value: number) => {
    setInternalRange({ ...internalRange, [rangeProp]: value });
  };

  return (
    <form className={className} onSubmit={_onSubmit}>
      <CurrencyInput
        className={styles.priceInput}
        onChange={(value) => _onChange('min', value)}
        styled={styled}
        placeholder="Min"
        value={internalRange.min}
      />
      <CurrencyInput
        className={styles.priceInput}
        onChange={(value) => _onChange('max', value)}
        styled={styled}
        placeholder="Max"
        value={internalRange.max}
      />
      <button
        className={classnames(
          { 'SuiButton primary': styled },
          styles.priceSubmitBtn
        )}
        type="submit"
      >
        Go
      </button>
    </form>
  );
};

const FacetPriceSection = ({
  className,
  onChange,
  styled,
  values,
  selectedValues,
}: FacetPriceSectionProps) => {
  const [rangesToShow, setRangesToShow] = React.useState<
    FacetSectionProps['values']
  >(getRangeToShow(values, selectedValues));
  const [inputRange, setInputRange] = React.useState<PriceRange>({
    max: null,
    min: null,
  });

  React.useEffect(() => {
    setRangesToShow(getRangeToShow(values, selectedValues));
  }, [selectedValues]);

  const onSubmit = async (range: PriceRange) => {
    const parsedRange = { ...range };
    if ((range.min || 0) > (range.max || Infinity)) {
      parsedRange.min = range.min;
      parsedRange.max = undefined;
      setInputRange({ max: null, min: range.min });
    }

    const filteredranges = values.filter((item) => {
      return (
        (parsedRange.min || 0) < (item[1] || Infinity) - PRECISION &&
        (parsedRange.max || Infinity) > (item[0] || 0) + PRECISION
      );
    }) as Array<[number, number]>;
    setRangesToShow(filteredranges);
    onChange([[parsedRange.min || 0, parsedRange.max]]);
  };

  const onSelectRange = (range: Pair<number, number>) => {
    setInputRange({ max: range[1], min: range[0] });
    onChange([[range[0] || 0, range[1]]]);
  };

  const showAllRanges = () => {
    setRangesToShow(values);
    setInputRange({ max: null, min: null });
    onChange([]);
  };

  if (!rangesToShow?.length) {
    return null;
  }

  return (
    <div
      className={classnames(className, 'Sui-FacetSection--container', {
        [styles.priceSectionContainerStyled]: styled,
      })}
    >
      {rangesToShow?.length !== values.length ? (
        <button className={styles.priceRangeItem} onClick={showAllRanges}>
          <span className="Sui-arrow prev">any price</span>
        </button>
      ) : null}
      {(rangesToShow || []).map((item) => (
        <button
          key={String(item)}
          className={styles.priceRangeItem}
          onClick={() => onSelectRange(item as Pair<number, number>)}
        >
          {getPriceRange(item as [number, number])}
        </button>
      ))}
      <FacetPriceRange
        className={styles.priceInputs}
        styled={styled}
        onSubmit={onSubmit}
        range={inputRange}
      />
    </div>
  );
};

export default FacetPriceSection;

export function getPriceRange(value: [number, number]) {
  if (value[0] && value[1]) {
    return `$${value[0]} to $${value[1]}`;
  } else if (!value[0]) {
    return `Under $${value[1]}`;
  } else if (!value[1]) {
    return `$${value[0]} & Above`;
  }
}

function getRangeToShow(
  values: FacetPriceSectionProps['values'],
  newSelectedValues: FacetPriceSectionProps['selectedValues']
) {
  if (newSelectedValues?.length) {
    const parsedSelectedValues = newSelectedValues.map<[number, number]>(
      (item: string) => {
        const [left, right] = item.split(',');
        const result = [];
        left && result.push(Number(left));
        right && result.push(Number(right));
        return result as Pair<number, number>;
      }
    );

    return values.filter((item) =>
      parsedSelectedValues.find(
        (selectedValue) =>
          (selectedValue[0] || 0) < (item[1] || Infinity - PRECISION) &&
          (selectedValue[1] || Infinity) > item[0] + PRECISION
      )
    );
  } else {
    return values;
  }
}
