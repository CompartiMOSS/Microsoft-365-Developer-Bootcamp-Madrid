import * as React from 'react';
import styles from './FunctionFlowsToGraphTester.module.scss';
import { IFunctionFlowsToGraphTesterProps } from './IFunctionFlowsToGraphTesterProps';
import { GraphService } from '../../../services';
import { IFunctionFlowsToGraphTesterState } from './IFunctionFlowsToGraphTesterState';
import { Shimmer, ShimmerElementType } from 'office-ui-fabric-react';
import { IPersonaSharedProps, Persona, PersonaSize, PersonaPresence } from 'office-ui-fabric-react/lib/Persona';

export default class FunctionFlowsToGraphTester extends React.Component<IFunctionFlowsToGraphTesterProps, IFunctionFlowsToGraphTesterState> {

  private _graphService: GraphService;

  constructor(props: IFunctionFlowsToGraphTesterProps) {
    super(props);  

    this._graphService = new GraphService(this.props.context.aadHttpClientFactory);

    this.state = {
      me: null
    };  
  }

  public componentDidMount(): void {
    this._graphService.getMe().then(me => {
      this.setState({
        me: me
      });
    });
  }

  public render(): React.ReactElement<IFunctionFlowsToGraphTesterProps> {

    if(this.state.me === null) {
      return(
        <Shimmer
          shimmerElements={[
            { type: ShimmerElementType.circle, width: 100, height: 100 },
            { type: ShimmerElementType.gap, width: '2%' },
            { type: ShimmerElementType.line, width: '100%', height: 100 }
          ]}
        />
      );
    }    

    const mePersona: IPersonaSharedProps = {
      text: this.state.me.displayName,
      secondaryText: this.state.me.jobTitle,
      tertiaryText: this.state.me.mail,
      optionalText: 'Available at 4:00pm'
    };

    return (
      <Persona {...mePersona} size={PersonaSize.large} hidePersonaDetails={false} />
    );
  }
}
