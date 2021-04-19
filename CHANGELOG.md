# CHANGELOG

## 0.0.6-pre-alpha.0

### New Features

- `FitmentSelector` with optional values and autocommit
- New components `FitmentSelectorVerifier`, `ProductList`, `ProductListWrapper`, `CategoryList`, `CategoryListWrapper`.
- Product page created to show `FitmentSelectorVerifier` and `Alert` components working together.
- `FacetFilter` updated to allow collapsible sections.

### Breaking changes

- For `FitmentSelector` the order of the paramaters were inverted in the **onChange** callback.

From:

```
onChange(newSelectedValues, labelId);
```

To:

```
onChange(labelId, newSelectedValues);
```

- For `FacetFilter`, `initialSelectedValues` and `values` property were replaced by `selectedValues`. Everytime this component receives that property changed, the component will sync the selected checkboxes with the new values in that property.

- `<List />` component removed and replaced to show ProductList or CategoryList.
