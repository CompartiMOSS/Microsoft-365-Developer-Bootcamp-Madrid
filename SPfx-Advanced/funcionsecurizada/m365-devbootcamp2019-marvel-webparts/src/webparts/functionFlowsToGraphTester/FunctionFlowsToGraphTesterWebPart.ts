import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'FunctionFlowsToGraphTesterWebPartStrings';
import FunctionFlowsToGraphTester from './components/FunctionFlowsToGraphTester';
import { IFunctionFlowsToGraphTesterProps } from './components/IFunctionFlowsToGraphTesterProps';

export interface IFunctionFlowsToGraphTesterWebPartProps {
  description: string;
}

export default class FunctionFlowsToGraphTesterWebPart extends BaseClientSideWebPart<IFunctionFlowsToGraphTesterWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IFunctionFlowsToGraphTesterProps > = React.createElement(
      FunctionFlowsToGraphTester,
      {
        context: this.context
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
