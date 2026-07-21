import { type TypedDocumentNode, gql } from "@apollo/client";

export const SELECT_GENERIC_REPORT_BY_PROJECT_TYPE_NUMBER: TypedDocumentNode<
  { project: { id: string, genericReport: any } }
> = gql`
  query ($projectId: String!, $type: String!, $number: Int!) {
    project(id: $projectId) {
        id
        genericReport(type: $type, number: $number) {
            id
            number
            overview
            creationDate
            creator {
              id
              name
            }
            detail
      }
    }
}
`;

export const SELECT_GENERIC_REPORTS: TypedDocumentNode<
  { project: { id: string, genericReports: { total: number, reports: any[] } } }
> = gql`
  query ($projectId: String!, $input: GenericReportSelectionInput!) {
    project(id: $projectId) {
        genericReports(input: $input) {
          total
          reports {
            id
            number
            detail
            projectId
            creator {
              id
              name
            }
            creationDate
        }
      }
    }
}
`;

export const USERS_IN_ROLE: TypedDocumentNode<
  { project: { roles: { users: { name: string, id: string }[] }[] } }
> = gql`
  query ($projectId: String!, $roleName: String!) {
  project(id: $projectId) {
    roles(names: [$roleName]) {
      users {
        id
        name
      }
    }
  }
}
`;

export const CREATE_GENERIC_REPORT: TypedDocumentNode<
  { gdsSchedule: { scheduledEvents: any } }
> = gql`
  mutation CreateGenericReport($input: GenericReportInput!) {
    createGenericReport(input: $input) {
        status {
            succeeded
            code
            message
            count
        }
        report {
            projectId
            type
            number
            overview
            detail
            creationDate
        }
    }
}
`;
