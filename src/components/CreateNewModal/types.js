/**
 * Copyright 2016 Dialog LLC <info@dlg.im>
 * @flow
 */

import type { SelectorState } from '../../entities';
import type { Contact } from '@dlghq/dialog-types';

export type Request = {
  type: 'group' | 'channel',
  title: string,
  shortname: string,
  about: string,
  avatar: ?File,
  members: SelectorState<Contact>,
};

export type Step = 'type' | 'info' | 'members';

export type Props = {
  className?: string,
  step: Step,
  request: Request,
  onClose: () => any,
  onSubmit: (request: Request) => any,
  onStepChange: (step: Step) => any,
  onRequestChange: (request: Request) => any
}
