import { MSGraphClientFactory } from "@microsoft/sp-http";

export interface ITeamChannelReportProps {
  groupId: string;
  channelId: string;
  factory: MSGraphClientFactory;
  userObjectId: string;
}
