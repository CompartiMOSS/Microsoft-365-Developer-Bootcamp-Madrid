import * as React from 'react';
import styles from './MarvelHeroes.module.scss';
import { IMarvelHeroesProps } from './IMarvelHeroesProps';
import { IMarvelHeroesState } from './IMarvelHeroesState';
import { HeroeService } from '../../../services';
import { IHeroe } from '../../../model';
import HeroesList from './HeroesList';
import { Link, MessageBar, MessageBarType, Shimmer, ShimmerElementType } from 'office-ui-fabric-react';

export default class MarvelHeroes extends React.Component<IMarvelHeroesProps, IMarvelHeroesState> {

  private _heroeService: HeroeService;

  constructor(props: IMarvelHeroesProps) {
    super(props);

    this._heroeService = new HeroeService(this.props.apiEndpoint, this.props.context.aadHttpClientFactory);

    this.state = {
      heroes: [],
      oops: null
    };
  }

  public componentDidMount(): void {
    this._heroeService.getHeroes().then((heroes: IHeroe[]) => {
      this.setState({
        heroes: heroes
      });
    }).catch(error => {
      console.log(error);
      this.setState({
        oops: 'Something went wrong... call the police!'
      });
    });
  }

  public render(): React.ReactElement<IMarvelHeroesProps> {

    if (this.state.oops !== null) {
      return (
        <MessageBar messageBarType={MessageBarType.error} isMultiline={false} dismissButtonAriaLabel="Close">
          {this.state.oops}
          <Link href="www.bing.com" target="_blank">
                Visit our website.
          </Link>
        </MessageBar>);
    }

    if(this.state.heroes.length <= 0) {
      return(
        <Shimmer
          shimmerElements={[
            { type: ShimmerElementType.line, width: 246, height: 246 },
            { type: ShimmerElementType.gap, width: '2%' },
            { type: ShimmerElementType.line, width: 246, height: 246 },
            { type: ShimmerElementType.gap, width: '2%' },
            { type: ShimmerElementType.line, width: 246, height: 246 },
            { type: ShimmerElementType.gap, width: '2%' },
            { type: ShimmerElementType.line, width: '100%', height: 246 }
          ]}
        />
      );
    }

    return (
      <HeroesList heroes={this.state.heroes} />
    );
  }
}
