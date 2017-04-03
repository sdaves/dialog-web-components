/**
 * Copyright 2017 dialog LLC <info@dlg.im>
 * @flow
 */

import React, { PureComponent } from 'react';
import classNames from 'classnames';
import { Text } from '@dlghq/react-l10n';
import Modal from '../Modal/Modal';
import ModalClose from '../Modal/ModalClose';
import ModalHeader from '../Modal/ModalHeader';
import ModalBody from '../Modal/ModalBody';
import ModalFooter from '../Modal/ModalFooter';
import Button from '../Button/Button';
import Icon from '../Icon/Icon';
import Range from '../Range/Range';
import styles from './AvatarEditModal.css';
import Croppie from 'croppie';
import { listen } from '@dlghq/dialog-utils';

export type Props = {
  className?: string,
  image: string,
  onClose: () => any,
  onSubmit: (image: File) => any
};

export type State = {
  zoom: {
    min: number,
    max: number,
    current: number
  }
};

class AvatarEditModal extends PureComponent {
  props: Props;
  state: State;
  croppieElement: ?HTMLElement;
  croppie: ?Object;
  listeners: ?{ remove(): void }[];

  constructor(props: Props) {
    super(props);

    this.state = {
      zoom: {
        min: 0,
        max: 1.5,
        current: 0
      }
    };

    this.croppie = null;
    this.listeners = null;
  }

  componentWillUnmount() {
    this.removeListeners();
    if (this.croppie) {
      this.croppie.destroy();
    }
  }

  handleSubmit = (): void => {
    if (this.croppie) {
      this.croppie.result({
        type: 'blob',
        size: 'original',
        format: 'png',
        circle: false
      }).then((blob) => {
        this.props.onSubmit(new File([blob], 'avatar.png'));
      });
    }
  };

  handleRotateLeft = (): void => {
    if (this.croppie) {
      this.croppie.rotate(-90);
    }
  };

  handleRotateRight = (): void => {
    if (this.croppie) {
      this.croppie.rotate(90);
    }
  };

  handleCroppieUpdate = (event: $FlowIssue) => {
    this.setState({
      zoom: {
        ...this.state.zoom,
        current: event.detail.zoom
      }
    });
  };

  handleZoomChange = (value: number) => {
    if (this.croppie) {
      this.croppie.setZoom(value);
    }
  };

  setCropper = (cropper: ?HTMLElement): void => {
    if (cropper) {
      this.croppieElement = cropper;
      this.croppie = new Croppie(this.croppieElement, {
        viewport: {
          width: 250,
          height: 250,
          type: 'circle'
        },
        showZoomer: false,
        enableOrientation: true,
        customClass: styles.cropper
      });

      this.croppie.bind({
        url: this.props.image,
        zoom: 0
      }).then(() => {
        if (this.croppie) {
          this.setState({
            zoom: {
              ...this.state.zoom,
              min: this.croppie._currentZoom,
              current: this.croppie._currentZoom
            }
          });
        }
      });

      this.listeners = [
        listen(this.croppieElement, 'update', this.handleCroppieUpdate, { capture: false, passive: true })
      ];
    }
  };

  removeListeners = (): void => {
    if (this.listeners) {
      this.listeners.forEach((listener) => listener.remove());
      this.listeners = null;
    }
  };

  renderControls() {
    return (
      <div className={styles.controls}>
        <Icon
          size={30}
          glyph="rotate_left"
          onClick={this.handleRotateLeft}
          className={styles.rotateLeft}
        />
        <Icon
          size={30}
          glyph="rotate_right"
          onClick={this.handleRotateRight}
          className={styles.rotateRight}
        />
        <Range
          min={this.state.zoom.min}
          max={this.state.zoom.max}
          value={this.state.zoom.current}
          step={0.005}
          onChange={this.handleZoomChange}
          className={styles.zoom}
        />
      </div>
    );
  }

  renderBody(): React.Element<any> {
    return (
      <ModalBody className={styles.body}>
        <div ref={this.setCropper} />
        {this.renderControls()}
      </ModalBody>
    );
  }

  renderFooter(): React.Element<any> {
    return (
      <ModalFooter className={styles.footer}>
        <Button
          wide
          theme="primary"
          rounded={false}
          onClick={this.handleSubmit}
        >
          <Text id="AvatarEditModal.save" />
        </Button>
      </ModalFooter>
    );
  }

  render(): React.Element<any> {
    const className = classNames(styles.container, this.props.className);

    return (
      <Modal className={className} onClose={this.props.onClose}>
        <ModalHeader withBorder className={styles.header}>
          <Text id="AvatarEditModal.title" />
          <ModalClose onClick={this.props.onClose} />
        </ModalHeader>
        {this.renderBody()}
        {this.renderFooter()}
      </Modal>
    );
  }
}

export default AvatarEditModal;