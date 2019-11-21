import { IHeroe } from "../../../model";
import styles from './MarvelHeroes.module.scss';

import * as React from 'react';

export interface IHeroeDetailProps {
  heroe: IHeroe;
}

export interface IHeroeDetailState {}

export default class HeroeDetail extends React.Component<IHeroeDetailProps, IHeroeDetailState> {

  public render(): React.ReactElement<IHeroeDetailProps> {
    return (
      <div className={styles.card}>
        <img className={styles.image} src={this.props.heroe.thumbnailUrl} alt="Avatar"></img>
        <div className={styles.container}>
          <h4><b>{this.props.heroe.name}</b> ({this.props.heroe.realName})</h4>
          <p>{this.props.heroe.shortBio}</p>
        </div>
      </div>
    );
  }
}
