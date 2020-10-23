import * as React from 'react';

import { FitmentSelector, SearchBar } from 'sunhammer-ui';
import 'sunhammer-ui/build/index.css';
import './index.scss';

const IndexPage = () => {
  return (
    <>
      <SearchBar site="wss" maxResults={8} styled showCloseIcon />
      <div>
        <h2>Sunhammer styled</h2>
        <div>
          <FitmentSelector
            className="sunhammer"
            clearButtonText="Reset"
            searchButtonText="Search"
            styled
          />
        </div>
      </div>
      <div>
        <h2>Riva Racing</h2>
        <FitmentSelector
          className="rivaracing"
          clearButtonText="Reset"
          searchButtonText="Search"
        />
      </div>
      <div>
        <h2>KT Performance</h2>
        <div className="ktperformance">
          <p className="label">
            Search by <span>Vehicle</span>
          </p>
          <FitmentSelector
            className="fitment-selector"
            clearButtonText="Clear"
            searchButtonText="Search"
          />
        </div>
      </div>
    </>
  );
};

export default IndexPage;
