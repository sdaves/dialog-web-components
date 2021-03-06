/**
 * Copyright 2017 dialog LLC <info@dlg.im>
 * @flow
 */

import type { MessageMediaInteractiveActionGroup } from '@dlghq/dialog-types';
import React, { PureComponent } from 'react';
import classNames from 'classnames';
import styles from './MessageMediaInteractiveGroup.css';
import Markdown from '../../Markdown/Markdown';
import MessageMediaInteractiveAction from '../MessageMediaInteractiveAction/MessageMediaInteractiveAction';

export type Props = {
  className?: string,
  group: MessageMediaInteractiveActionGroup,
  onSubmit?: (id: string, value: string) => mixed
};

class MessageMediaInteractiveGroup extends PureComponent {
  props: Props;

  renderTitle() {
    if (this.props.group.title) {
      return (
        <Markdown
          inline
          className={styles.title}
          text={this.props.group.title}
          tagName="h5"
        />
      );
    }

    return null;
  }

  renderDescription() {
    if (this.props.group.description) {
      return (
        <Markdown
          className={styles.description}
          text={this.props.group.description}
          tagName="p"
        />
      );
    }

    return null;
  }

  renderHeader() {
    const title = this.renderTitle();
    const description = this.renderDescription();

    if (title || description) {
      return (
        <header className={styles.header}>
          {title}
          {description}
        </header>
      );
    }

    return null;
  }

  renderActions() {
    const children = this.props.group.actions.map((action) => {
      return (
        <MessageMediaInteractiveAction
          key={action.id}
          action={action}
          onSubmit={this.props.onSubmit}
        />
      );
    });

    return (
      <div className={styles.actions}>
        {children}
      </div>
    );
  }

  render() {
    const className = classNames(styles.container, this.props.className);

    return (
      <div className={className}>
        {this.renderHeader()}
        {this.renderActions()}
      </div>
    );
  }
}

export default MessageMediaInteractiveGroup;
