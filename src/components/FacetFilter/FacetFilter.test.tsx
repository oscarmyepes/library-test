import { act, fireEvent, render, waitFor } from '@testing-library/react';
import * as React from 'react';
import { FacetFiltersData } from '../../models/search';
import FacetFilter from './FacetFilter';
import { getPriceRange } from './FacetPriceSection';
import set from 'lodash/fp/set';
import styles from './styles/facetFilter.scss';

describe('FacetFilter', () => {
  const DEFAULT_DATA: FacetFiltersData = {
    section1: {
      order: 1,
      title: 'Sec One',
      values: ['A', 'B', 'C', 'D'],
    },
    section2: {
      collapsed: true,
      order: 2,
      title: 'Sec Two',
      values: ['E', 'F', 'G'],
    },
    section3: {
      order: 3,
      title: 'Sec Three',
      values: [
        [0, 1],
        [1, 2],
        [2, 3],
      ],
    },
  };

  const PRICE_RANGES: FacetFiltersData = {
    price: {
      order: 1,
      title: 'Price',
      type: 'priceRange',
      values: [[0, 25], [25, 50], [50, 100], [100, 200], [200]],
    },
  };

  const DATA_ALL_COLLAPSED = Object.keys(DEFAULT_DATA).reduce(
    (acc, item) => ({
      ...acc,
      [item]: { ...DEFAULT_DATA[item], collapsed: true },
    }),
    {}
  );

  it('Should show section collapsed based on the data received and collapsed property', async () => {
    const { container, rerender } = render(
      <FacetFilter data={DEFAULT_DATA} enableCollapse />
    );

    await waitFor(() =>
      expect(container.querySelectorAll(`.${styles.collapsed}`)).toHaveLength(1)
    );
    await waitFor(() =>
      expect(container.querySelectorAll(`.${styles.expanded}`)).toHaveLength(2)
    );

    rerender(<FacetFilter data={DATA_ALL_COLLAPSED} enableCollapse />);
    await waitFor(() =>
      expect(container.querySelectorAll(`.${styles.collapsed}`)).toHaveLength(3)
    );
    await waitFor(() =>
      expect(container.querySelectorAll(`.${styles.expanded}`)).toHaveLength(0)
    );
  });

  it('Should collapse/expand a section when user clicks the section title or the icon', async () => {
    const { findByText, container, getByText } = render(
      <FacetFilter
        data={DEFAULT_DATA}
        enableCollapse
        selectedValues={{ section2: ['A', 'B', 'C'] }}
      />
    );
    await waitFor(() =>
      expect(container.querySelectorAll(`.${styles.collapsed}`)).toHaveLength(1)
    );

    const firstSection = Object.keys(DEFAULT_DATA)[0];

    const firstSectionTitle = await findByText(
      DEFAULT_DATA[firstSection].title
    );
    firstSectionTitle.click();

    await waitFor(() =>
      expect(container.querySelectorAll(`.${styles.collapsed}`)).toHaveLength(2)
    );

    expect(getByText('3')).toBeInTheDocument();
  });

  it('Should keep previous collapsed state when data is updated and data[section].collapsed is undefined', async () => {
    /*
      In this test I'm checking we keep the prev state if the new data does not have collapsed flag 
      to change that state (if section.collapsed === undefined).
      Example:
      1. Render component with 1 section collapsed
      2. Collapse another section
      3. Check there are 2 sections collapsed
      4. Re-render component with new data but don't send collpased flag for the collapsed section in step 2
      5. Chek there are 2 sections collapsed
      6. Expand collapsed section in 2
      7. Check there is only one section collapsed
      8. Re-render with the same data we used in 3
      9. Check there is only one section collapsed
      10. Re-render component with new data sending collpased flag for the collapsed section in step 2
      11. Chek there are 2 sections collapsed
    */
    const firstSection = Object.keys(DEFAULT_DATA)[0];
    const { findByText, rerender, container } = render(
      <FacetFilter data={DEFAULT_DATA} enableCollapse />
    );

    const firstSectionTitle = await findByText(
      DEFAULT_DATA[firstSection].title
    );
    firstSectionTitle.click();

    rerender(<FacetFilter data={{ ...DEFAULT_DATA }} enableCollapse />);
    await waitFor(() =>
      expect(container.querySelectorAll(`.${styles.collapsed}`)).toHaveLength(2)
    );

    rerender(<FacetFilter data={{ ...DEFAULT_DATA }} enableCollapse />);

    await waitFor(() =>
      expect(container.querySelectorAll(`.${styles.collapsed}`)).toHaveLength(2)
    );

    firstSectionTitle.click();
    await waitFor(() =>
      expect(container.querySelectorAll(`.${styles.collapsed}`)).toHaveLength(1)
    );

    rerender(<FacetFilter data={{ ...DEFAULT_DATA }} enableCollapse />);
    await waitFor(() =>
      expect(container.querySelectorAll(`.${styles.collapsed}`)).toHaveLength(1)
    );

    rerender(
      <FacetFilter
        data={set('section1.collapsed', true)(DEFAULT_DATA)}
        enableCollapse
      />
    );
    await waitFor(() =>
      expect(container.querySelectorAll(`.${styles.collapsed}`)).toHaveLength(2)
    );
  });

  it('Should select a price range, hide non selected ranges and reset selection', async () => {
    const onChange = jest.fn();
    const { getByText, findByText, container } = render(
      <FacetFilter data={PRICE_RANGES} onChange={onChange} />
    );

    const range = getByText('Under $25');
    range.click();

    // Show selected range, button to show any price and inputs
    await waitFor(() =>
      expect(
        container.querySelector('.Sui-FacetSection--container').childNodes
      ).toHaveLength(3)
    );

    await waitFor(() =>
      expect(onChange).toHaveBeenCalledWith({
        isChecked: true,
        newValue: '0,25',
        section: 'price',
        selectedValues: { price: ['0,25'] },
      })
    );

    const anyPrice = await findByText('any price');
    anyPrice.click();

    await waitFor(() =>
      expect(
        container.querySelector('.Sui-FacetSection--container').childNodes
      ).toHaveLength(6)
    );

    expect(onChange).toHaveBeenCalledWith({
      isChecked: false,
      newValue: '',
      section: 'price',
      selectedValues: null,
    });
  });

  it('Should show price ranges for selected values', async () => {
    const selectedvalues = { price: ['0,25'] };
    const { container, queryByText } = render(
      <FacetFilter data={PRICE_RANGES} selectedValues={selectedvalues} />
    );

    expect(
      container.querySelector('.Sui-FacetSection--container').childNodes
    ).toHaveLength(3);
    await waitFor(() =>
      expect(queryByText(getPriceRange([0, 25]))).toBeInTheDocument()
    );
  });

  it('Should show ranges based in input fields', async () => {
    const onChange = jest.fn();
    const priceRanges = PRICE_RANGES.price.values;
    const {
      findByPlaceholderText,
      findByText,
      queryByText,
      container,
    } = render(<FacetFilter data={PRICE_RANGES} onChange={onChange} />);

    await setPriceInpuValues(findByPlaceholderText, findByText, 1, 10);
    await matchVisisbleRanges(container, queryByText, priceRanges, [0]);

    await setPriceInpuValues(findByPlaceholderText, findByText, 1, 1);
    await matchVisisbleRanges(container, queryByText, priceRanges, [0]);

    await setPriceInpuValues(findByPlaceholderText, findByText, 0, 55);
    await matchVisisbleRanges(container, queryByText, priceRanges, [0, 1, 2]);

    await setPriceInpuValues(findByPlaceholderText, findByText, null, 1);
    await matchVisisbleRanges(container, queryByText, priceRanges, [0]);

    await setPriceInpuValues(findByPlaceholderText, findByText, 100, 55);
    await matchVisisbleRanges(container, queryByText, priceRanges, [3, 4]);
  });

  it('Should select single items when isSingleSelect flag is TRUE', async () => {
    const onChange = jest.fn();
    const { findAllByRole } = render(
      <FacetFilter
        data={DEFAULT_DATA}
        isSingleSelect={true}
        onChange={onChange}
      />
    );

    const radioButtons = await findAllByRole('radio');
    radioButtons[0].click();
    expect(onChange).toHaveBeenCalledWith({
      isChecked: true,
      newValue: DEFAULT_DATA.section1.values[0],
      section: 'section1',
      selectedValues: { section1: [DEFAULT_DATA.section1.values[0]] },
    });

    radioButtons[1].click();
    expect(onChange).toHaveBeenCalledWith({
      isChecked: true,
      newValue: DEFAULT_DATA.section1.values[1],
      section: 'section1',
      selectedValues: { section1: [DEFAULT_DATA.section1.values[1]] },
    });
  });

  it('When receiving multiple selected values and isSingleSelect is TRUE, should clear selected values', async () => {
    const onChange = jest.fn();
    const { container } = render(
      <FacetFilter
        data={DEFAULT_DATA}
        isSingleSelect={true}
        onChange={onChange}
        selectedValues={{ section1: DEFAULT_DATA.section1.values as string[] }}
      />
    );

    expect(
      container.querySelectorAll('input[type=radio]:checked')
    ).toHaveLength(0);
  });
});

async function setPriceInpuValues(findByPlaceholderText, findByText, min, max) {
  const minInput = await findByPlaceholderText('Min');
  act(() => {
    fireEvent.change(minInput, { target: { value: min } });
  });
  const maxInput = await findByPlaceholderText('Max');
  act(() => {
    fireEvent.change(maxInput, { target: { value: max } });
  });
  const go = await findByText('Go');
  act(() => {
    go.click();
  });
}

async function matchVisisbleRanges(
  container,
  queryByText,
  values,
  visibsleRangesIndex: number[]
) {
  await waitFor(() =>
    expect(
      container.querySelector('.Sui-FacetSection--container').childNodes
    ).toHaveLength(
      values.length > visibsleRangesIndex.length
        ? visibsleRangesIndex.length + 2
        : visibsleRangesIndex.length + 1
    )
  );
  for (const index in values) {
    const rangeText = getPriceRange(values[index]);
    if (visibsleRangesIndex.includes(Number(index))) {
      await waitFor(() => expect(queryByText(rangeText)).toBeInTheDocument());
    } else {
      await waitFor(() =>
        expect(queryByText(rangeText)).not.toBeInTheDocument()
      );
    }
  }
}
