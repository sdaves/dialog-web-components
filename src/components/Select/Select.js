/**
 * Copyright 2017 dialog LLC <info@dlg.im>
 * @flow
 */

import type { Props } from './types';
import React, { PureComponent } from 'react';
import { Text, LocalizationContextType } from '@dlghq/react-l10n';
import classNames from 'classnames';
import Icon from '../Icon/Icon';
import styles from './Select.css';

class Select extends PureComponent {
  props: Props;
  select: HTMLSelectElement;

  static defaultProps = {
    size: 'normal',
    theme: 'default'
  };

  static contextTypes = {
    l10n: LocalizationContextType
  };

  handleChange = (event: $FlowIssue): void => {
    this.props.onChange(event.target.value);
  };

  handleLabelMouseDown = (event: $FlowIssue): void => {
    event.preventDefault();

    if (this.select) {
      this.select.focus();
    }
  };

  setSelect = (select: HTMLSelectElement): void => {
    this.select = select;
  };

  focus(): void {
    if (this.select && document.activeElement !== this.select) {
      this.select.focus();
    }
  }

  renderOptions() {
    return this.props.options.map((option) => {
      return (
        <Text
          value={option.value}
          key={option.value}
          tagName="option"
          id={option.title}
        />
      );
    });
  }

  renderLabel() {
    const { id, label } = this.props;

    if (!label) {
      return null;
    }

    return (
      <Text
        value={label}
        tagName="label"
        htmlFor={id}
        id={label}
        className={styles.label}
        onMouseDown={this.handleLabelMouseDown}
      />
    );
  }

  render() {
    const { id, name, disabled, size, theme } = this.props;
    const className = classNames(styles.container, styles[size], styles[theme], {
      [styles.disabled]: disabled
    }, this.props.className);

    return (
      <div className={className}>
        {this.renderLabel()}
        <div className={styles.wrapper}>
          <select
            className={styles.select}
            id={id}
            name={name}
            disabled={disabled}
            value={this.props.value}
            defaultValue={this.props.defaultValue}
            ref={this.setSelect}
            onChange={this.handleChange}
          >
            {this.renderOptions()}
          </select>
          <Icon
            size={32}
            glyph="arrow_drop_down"
            className={styles.arrow}
          />
        </div>
      </div>
    );
  }
}

export default Select;
