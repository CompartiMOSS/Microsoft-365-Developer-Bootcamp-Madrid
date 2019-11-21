import * as React from 'react';
import styles from './TeamChannelReport.module.scss';
import { ITeamChannelReportProps } from './ITeamChannelReportProps';
import { escape } from '@microsoft/sp-lodash-subset';

import { MSGraphClient } from '@microsoft/sp-http';

import { PivotItem, Pivot } from 'office-ui-fabric-react/lib/Pivot';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { PrimaryButton } from 'office-ui-fabric-react';

export interface ILastItem {
  messageDate: Date;
  webUrl: string;
}

export interface ITeamChannelReportState {
  selectedTab: string;
  numberOfMessages: number;
  lastMessage: ILastItem;
  numberOfFiles: number;
  lastFileUploaded: ILastItem;
  isCurrentUserFirstMessageCreator: Boolean;
}

export default class TeamChannelReport extends React.Component<ITeamChannelReportProps, ITeamChannelReportState> {

  constructor(props: ITeamChannelReportProps) {
    super(props);
    this.state = {
      selectedTab: "MESSAGES",
      numberOfMessages: 0,
      lastMessage: { messageDate: new Date(), webUrl: "" },
      numberOfFiles: 0,
      lastFileUploaded: { messageDate: new Date(), webUrl: "" },
      isCurrentUserFirstMessageCreator: false
    };
  }

  public componentDidMount() {
    this.updateNumberOfMessages();
  }

  private updateNumberOfMessages = () => {
    this.props.factory
      .getClient()
      .then((client: MSGraphClient): void => {
        client
          .api('https://graph.microsoft.com/beta/teams/' + this.props.groupId + '/channels/' + this.props.channelId + '/messages')
          .get((error, response: any, rawResponse?: any) => {
            if (response) {
              let currentUserMessages = response.value.filter(message => message.from.user.id === this.props.userObjectId);
              this.setState({
                ...this.state,
                numberOfMessages: currentUserMessages.length,
                lastMessage: this.getLastMessageData(currentUserMessages),
                selectedTab: "MESSAGES"
              })
            }
            else {
              console.log(error);
            }
          });
      });
  }

  private getLastMessageData = (messages: any): ILastItem => {
    if (messages.length > 0) {
      let parsedMessages = messages.map((message) => {
        return {
          createdDateTime: message.createdDateTime,
          webUrl: message.webUrl,
        };
      });
      parsedMessages.sort((a, b) => (a.createdDateTime < b.createdDateTime) ? 1 : ((b.createdDateTime < a.createdDateTime) ? -1 : 0));
      return { messageDate: new Date(parsedMessages[0].createdDateTime), webUrl: parsedMessages[0].webUrl };
    }
    return { messageDate: new Date(), webUrl: "" };
  }

  private updateFileInformation = () => {
    this.props.factory
      .getClient()
      .then((client: MSGraphClient): void => {
        client
          .api('https://graph.microsoft.com/beta/teams/' + this.props.groupId + '/channels/' + this.props.channelId + '/messages')
          .get((error, response: any, rawResponse?: any) => {
            if (response) {
              let currentUserMessages = response.value.filter(message => message.from.user.id === this.props.userObjectId);
              let fileParsedMessages = this.getFileMessages(currentUserMessages);

              this.setState({
                ...this.state,
                numberOfFiles: fileParsedMessages.length,
                lastFileUploaded: this.getLastFileData(fileParsedMessages),
                selectedTab: "FILES"
              })
            }
            else {
              console.log(error);
            }
          });
      });
  }

  private getFileMessages = (messages: any): any[] => {
    let attachmentMessages = messages.filter(message => message.attachments.length > 0);
    let parsedMessages = attachmentMessages.map((message) => {
      return message.attachments.map((attachment) => {
        return {
          contentType: attachment.contentType,
          createdDateTime: message.createdDateTime
        }
      })
    });
    return parsedMessages.flat().filter(parsedMessage => parsedMessage.contentType === "reference");
  }

  private getLastFileData = (messages: any): ILastItem => {
    if (messages.length > 0) {
      messages.sort((a, b) => (a.createdDateTime < b.createdDateTime) ? 1 : ((b.createdDateTime < a.createdDateTime) ? -1 : 0));
      return { messageDate: new Date(messages[0].createdDateTime), webUrl: messages[0].webUrl };
    }
    return { messageDate: new Date(), webUrl: "" };
  }

  private checkFirstMessageCreator = () => {
    this.props.factory
      .getClient()
      .then((client: MSGraphClient): void => {
        client
          .api('https://graph.microsoft.com/beta/teams/' + this.props.groupId + '/channels/' + this.props.channelId + '/messages')
          .get((error, response: any, rawResponse?: any) => {
            if (response) {
              let creators = [];
              let numberOfMessages = [];
              for (let i = 0; i < response.value.length; i++) {
                let user = response.value[i].from.user.id
                let creatorIndex = creators.indexOf(user);
                if (creatorIndex === -1) {
                  creators.push(user);
                  numberOfMessages.push(1);
                } else {
                  numberOfMessages[creatorIndex]++;
                }
              }
              let maxNumberOfMessages = Math.max(...numberOfMessages);
              let isCurrentUserFirstMessageCreator = false;
              for (let i = 0; i < numberOfMessages.length; i++) {
                if (numberOfMessages[i] === maxNumberOfMessages && creators[i] === this.props.userObjectId) {
                  isCurrentUserFirstMessageCreator = true;
                }
              }
              this.setState({
                ...this.state,
                isCurrentUserFirstMessageCreator: isCurrentUserFirstMessageCreator,
                selectedTab: "FIRSTCREATOR"
              })
            }
            else {
              console.log(error);
            }
          });
      });
  }

  private postMessage = () => {
    this.props.factory
      .getClient()
      .then((client: MSGraphClient): void => {
        client
          .api('https://graph.microsoft.com/beta/teams/' + this.props.groupId + '/channels/' + this.props.channelId + '/messages')
          .post({
            /*             body: {
                          content: "Hello World" */
            subject: null,
            body: {
              contentType: "html",
              content: "<attachment id=\"74d20c7f34aa4a7fb74e2b30004247c5\"></attachment>"
            },
            attachments: [
              {
                id: "74d20c7f34aa4a7fb74e2b30004247c5",
                contentType: "application/vnd.microsoft.card.thumbnail",
                contentUrl: null,
                content: "{\r\n  \"title\": \"Champion of the channel\",\r\n  \"subtitle\": \"<h3>Join me to celebrate</h3>\",\r\n  \"text\": \"I have been awarded as the most prolific message creator on this channel\", \r\n}",
                name: null,
                thumbnailUrl: null
              }
            ]

          },
            (error, response: any, rawResponse?: any) => {
              console.log(error);
              console.log(response);
              console.log(rawResponse);
              this.setState({
                ...this.state,
                isCurrentUserFirstMessageCreator: false,
                selectedTab: "MESSAGES"
              })
            });
      });
  }

  private onLinkClick = (item: PivotItem) => {
    console.log(item.props.itemKey);
    switch (item.props.itemKey) {
      case "FILES":
        this.updateFileInformation();
        break;
      case "MESSAGES":
        this.updateNumberOfMessages();
        break;
      case "FIRSTCREATOR":
        this.checkFirstMessageCreator();
        break;
    }
  };

  public render(): React.ReactElement<ITeamChannelReportProps> {
    return (
      <Pivot onLinkClick={this.onLinkClick} selectedKey={this.state.selectedTab} >
        <PivotItem itemKey="MESSAGES" headerText="Messages" itemCount={this.state.numberOfMessages} >
          <Label>You have posted {this.state.numberOfMessages} messages on this channel</Label>
          {this.state.numberOfMessages > 0 && <Label>You have posted your last message on {this.state.lastMessage.messageDate.toLocaleString()}</Label>}
        </PivotItem>
        <PivotItem itemKey="FILES" headerText="Files" itemCount={this.state.numberOfFiles} >
          <Label>You have uploaded {this.state.numberOfFiles} files on this channel</Label>
          {this.state.numberOfFiles > 0 && <Label>You have uploaded your last file on {this.state.lastFileUploaded.messageDate.toLocaleString()}</Label>}
        </PivotItem>
        <PivotItem itemKey="FIRSTCREATOR" headerText="First Creator" itemCount={this.state.isCurrentUserFirstMessageCreator ? 1 : 0} >
          {this.state.isCurrentUserFirstMessageCreator ? (
            <div>
              <Label>You are the user with more messages created on this channel</Label>
              <PrimaryButton text="Post award" onClick={this.postMessage} />
            </div>
          ) : (
              <Label>You are not the user with more messages created on this channel</Label>
            )}
        </PivotItem>
      </Pivot>
    );
  }
}
