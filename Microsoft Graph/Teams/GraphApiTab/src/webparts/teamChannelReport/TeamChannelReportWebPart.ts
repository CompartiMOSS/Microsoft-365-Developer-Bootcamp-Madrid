import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'TeamChannelReportWebPartStrings';
import TeamChannelReport from './components/TeamChannelReport';
import { ITeamChannelReportProps } from './components/ITeamChannelReportProps';

import * as microsoftTeams from '@microsoft/teams-js';

export interface ITeamChannelReportWebPartProps {
  description: string;
}

export default class TeamChannelReportWebPart extends BaseClientSideWebPart<ITeamChannelReportWebPartProps> {

  private _teamsContext: microsoftTeams.Context;

  protected onInit(): Promise<any> {
    let retVal: Promise<any> = Promise.resolve();
    if (this.context.microsoftTeams) {
      retVal = new Promise((resolve, reject) => {
        this.context.microsoftTeams.getContext(context => {
          this._teamsContext = context;
          resolve();
        });
      });
    }
    return retVal;
  }

  public render(): void {
    const element: React.ReactElement<ITeamChannelReportProps > = React.createElement(
      TeamChannelReport,
      {
        groupId: this._teamsContext.groupId,
        channelId: this._teamsContext.channelId,
        factory: this.context.msGraphClientFactory,
        userObjectId: this._teamsContext.userObjectId
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
