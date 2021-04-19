import {
  FitmentSelectorProps,
  Item,
  SelectedValues,
} from '../components/FitmentSelector/models';

function validateSelectedValues(
  selectedValues: SelectedValues,
  labelsData: FitmentSelectorProps['labelsData'],
  labels: Item[]
) {
  let validSelectedValues: SelectedValues = {};

  for (const label of labels) {
    const labelId = (selectedValues || {})[label.name];
    if (!labelId || !labelsData[label.name]) break;
    const selectedValueExists = labelsData[label.name].find(
      (item) => String(item.id) === String(labelId)
    );
    if (!selectedValueExists) {
      break;
    }
    validSelectedValues = {
      ...validSelectedValues,
      [label.name]: selectedValues[label.name],
    };
  }

  return validSelectedValues;
}

export { validateSelectedValues };
