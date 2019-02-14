/* eslint jsx-a11y/label-has-associated-control: "off",
jsx-a11y/label-has-for: "off" */ // These attributes are generated by the Downshift library

import React, { Component } from 'react';
import Downshift from 'downshift';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';

import theme from '../../theme/airways';

class Typeahead extends Component {
  state = {
    isFetchingList: false
  };

  fetchListOnInput = debounce(async value => {
    await this.props.fetchListOnInput(value);
    this.setState({ isFetchingList: false });
  }, 200);

  onInputValueChange = (value, downshiftState) => {
    const { fetchListOnInput, itemToString, minChars } = this.props;
    const { selectedItem } = downshiftState;

    if (
      fetchListOnInput &&
      value.length >= minChars &&
      value !== itemToString(selectedItem)
    ) {
      this.setState({ isFetchingList: true });
      this.fetchListOnInput(value);
    }
  };

  filterItems = (items, inputValue) => {
    const { itemToString, filterItems } = this.props;
    return filterItems
      ? filterItems(items, inputValue)
      : items.filter(item => {
          const regex = new RegExp(inputValue, 'gi');
          return regex.test(itemToString(item));
        });
  };

  renderItems = (
    getMenuProps,
    getItemProps,
    highlightedIndex,
    selectedItem,
    inputValue
  ) => {
    const { items, itemToString, fetchListOnInput } = this.props;
    const filteredItems = fetchListOnInput
      ? items
      : this.filterItems(items, inputValue);

    return (
      <ul {...getMenuProps()}>
        {filteredItems.map((item, index) => (
          <li
            key={itemToString(item)}
            {...getItemProps({
              index,
              item
            })}
            css={{
              backgroundColor:
                highlightedIndex === index
                  ? theme.colours.highlights
                  : theme.colours.transparent,
              borderBottom: '1px solid lightgrey',
              fontWeight: selectedItem === item ? 'bold' : 'normal',
              listStyleType: 'none',
              padding: '5px'
            }}
          >
            {itemToString(item)}
          </li>
        ))}
      </ul>
    );
  };

  render() {
    const {
      className,
      disabled,
      id,
      initialSelectedItem,
      itemToString,
      label,
      minChars,
      onBlur,
      onChange,
      message,
      placeholder,
      stateReducer,
      valid
    } = this.props;

    const { isFetchingList } = this.state;

    return (
      <Downshift
        initialSelectedItem={initialSelectedItem}
        itemToString={itemToString}
        onChange={onChange}
        onInputValueChange={this.onInputValueChange}
        onOuterClick={onBlur}
        stateReducer={stateReducer}
      >
        {({
          getInputProps,
          getItemProps,
          getLabelProps,
          getMenuProps,
          isOpen,
          inputValue,
          highlightedIndex,
          selectedItem
        }) => (
          <div>
            {label && <label {...getLabelProps()}>{label}</label>}
            <div
              css={{ width: '100%', maxWidth: '500px' }}
              className={className}
            >
              <input
                css={{
                  padding: '5px',
                  boxSizing: 'border-box',
                  '&:focus': {
                    outlineColor: theme.colours.highlights
                  },
                  width: '100%'
                }}
                {...getInputProps({
                  disabled,
                  id,
                  placeholder
                })}
              />
              <ul {...getMenuProps()}>
                {isOpen && !isFetchingList && inputValue.length >= minChars
                  ? this.renderItems(
                      getMenuProps,
                      getItemProps,
                      highlightedIndex,
                      selectedItem,
                      inputValue
                    )
                  : null}
                {isFetchingList && <span>Loading...</span>}
              </ul>
            </div>
            {message && !valid && <div>{message}</div>}
          </div>
        )}
      </Downshift>
    );
  }
}

Typeahead.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  fetchListOnInput: PropTypes.func,
  id: PropTypes.string,
  initialSelectedItem: PropTypes.shape(PropTypes.any),
  items: PropTypes.arrayOf(PropTypes.shape).isRequired,
  itemToString: PropTypes.func,
  label: PropTypes.string,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onInputValueChange: PropTypes.func,
  message: PropTypes.string,
  minChars: PropTypes.number,
  placeholder: PropTypes.string,
  stateReducer: PropTypes.func,
  valid: PropTypes.bool
};

Typeahead.defaultProps = {
  ...Downshift.propTypes,
  className: null,
  disabled: false,
  fetchListOnInput: undefined,
  id: null,
  initialSelectedItem: null,
  itemToString: item => (item ? String(item) : ''),
  label: '',
  onBlur: undefined,
  onChange: undefined,
  onInputValueChange: undefined,
  message: '',
  minChars: 0,
  placeholder: '',
  stateReducer: undefined,
  valid: true
};

export default Typeahead;
