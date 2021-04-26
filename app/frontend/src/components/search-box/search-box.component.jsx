import React from "react";
import "./search-box.styles.scss";
const SearchBox = ({ ...props }) => {
  return (
    <div className="search-box">
      <input
        type="search"
        onChange={props.handleChange}
        placeholder={props.placeholder}
      />
      {props.filteredStocks.map((stock) => (
        <span key={stock.scrip}>{stock.name}</span>
      ))}
    </div>
  );
};

export default SearchBox;
