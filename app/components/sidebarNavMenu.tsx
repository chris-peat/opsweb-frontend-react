import type { INavMenuGroup } from "~/models/navMenuGroup";
import NavDropDownLevel2 from "./navDropDownLevel2";
import { type TypedDocumentNode, gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";

const GET_PROJECT_MENU: TypedDocumentNode<
    { project: { navMenu: { id: number, title: string, items: { id: number, parentId: number, text: string, url: string }[] }[] } }
> = gql`
  query($projectId: String!) {
    project(id: $projectId) {
        navMenu {
            id
            title
            items {
                id
                parentId
                text
                url
            }
        }
    }
}
`;

export default function SidebarNavMenu({ projectId }: { projectId: string }) {
    const { loading, error, data } = useQuery(GET_PROJECT_MENU, {
        variables: { projectId: projectId },
    });

    if (loading) return <p>Loading ...</p>;

    return (
        <aside id="default-sidebar"
            className="fixed top-24 left-0 z-10 w-64 h-full transition-transform -translate-x-full sm:translate-x-0"
            aria-label="Sidebar">
            <div className={"h-full px-3 py-4 overflow-y-auto border-t border-r border-gray-400 " + projectId + "-secondary"}>
                <ul className="space-y-2 font-medium">
                    {data?.project?.navMenu.map((group) => (
                        <li>
                            <NavDropDownLevel2 navGroup={group}></NavDropDownLevel2>
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    )
}