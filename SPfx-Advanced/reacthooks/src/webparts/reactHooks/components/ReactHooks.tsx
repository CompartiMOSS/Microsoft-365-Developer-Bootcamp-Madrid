import * as React from 'react';
import styles from './ReactHooks.module.scss';
import { IReactHooksProps } from './IReactHooksProps';
import {MyComponent} from '.././hooks/demo1';
export default class ReactHooks extends React.Component<IReactHooksProps, {}> {
  public render(): React.ReactElement<IReactHooksProps> {
    return (
      <MyComponent />
    );
  }
}