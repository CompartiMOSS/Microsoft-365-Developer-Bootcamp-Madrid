import { IHeroe } from "../../../model";
import styles from './MarvelHeroes.module.scss';

import * as React from 'react';
import HeroeDetail from './HeroeDetail';

export interface IHeroesListProps {
  heroes: IHeroe[];
}

export interface IHeroesListState {}

export default class HeroesList extends React.Component<IHeroesListProps, IHeroesListState> {
  public render(): React.ReactElement<IHeroesListProps> {

    const heroes = this.props.heroes.map(heroe => {
      return <HeroeDetail heroe={heroe} />;
    });

    return (
      <div className={styles.marvelHeroes}>
        <div className={styles.cards}>
          {heroes}
        </div>
      </div>
    );
  }
}
