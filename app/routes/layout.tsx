/*
  * This is the top-level layout for the multi-mission OpsWeb. It provides the header and contains an Outlet 
  * where the content of the different pages will be rendered.
*/
import { NavLink, Outlet } from "react-router";
import { useLoaderData } from "react-router";
import type { Route } from '../+types/root';
import { getClient } from '../apollo';
import { gql, type TypedDocumentNode } from "@apollo/client";
import type { IProject } from "~/models/project";
import { useState } from 'react';
import Clock from "~/components/clock";
import ProjectSelector from "~/components/projectSelector";
import Breadcrumbs from "~/components/breadcrumbs";
import type { IUser } from "~/models/user";
import UserDropDown from "~/components/userDropDown";
import type { IUserPreferences } from "~/models/userPreferences";
import { useNavigate } from 'react-router';
import type { INavMenuGroup } from "~/models/navMenuGroup";
import SidebarNavMenu from "~/components/sidebarNavMenu";

export async function clientLoader({
  params,
}: Route.ClientLoaderArgs) {
  let apolloClient = getClient();
  const { data } = await apolloClient.query({
    query: GET_PROJECTS_FOR_USER,
  });
  return data;
}

// TypedDocumentNode definition with types
const GET_PROJECTS_FOR_USER: TypedDocumentNode<
  { currentUser: IUser; projects: [IProject] }
> = gql`
  query {
    currentUser {
      name
      ldapAuthentication
      ldapName
      defaultProject
      displayName
    }
    projects {
      id
      name
      launchDate
      logoFile
    }
  }
`;

const mockMenus = new Map<string, INavMenuGroup[]>([
  ["EMP", [
    {
      title: "Operations",
      items: [
        {
          id: 1,
          parentId: 0,
          text: "Next contacts",
          url: "scheduled-passes/:EN1"
        }
      ]
    }
  ]],
  ["EUC", [
    {
      title: "Operations",
      items: [
        {
          id: 1,
          parentId: 0,
          text: "Next contacts",
          url: "scheduled-passes/:EUC"
        },
        {
          id: 3,
          parentId: 0,
          text: "Recommendations",
          url: "https://opsweb.gsoc.dlr.de/Recommendations.aspx"
        }
      ]
    },
    {
      title: "Tools",
      items: [
        {
          id: 2,
          parentId: 0,
          text: "Minutes",
          url: "scheduled-passes/:EUC"
        }
      ]
    }
  ]]
]);

export function HydrateFallback() {
  return <div>Loading...</div>;
}

export default function Layout() {
  const [selectedProject, setSelectedProject] = useState<IProject | undefined>(undefined);
  const [menuGroups, setMenuGroups] = useState<INavMenuGroup[]>([]);
  const data = useLoaderData() as { currentUser: IUser; projects: IProject[] };

  // if (!selectedProject) {
  //   const defaultProject = data.projects.find(p => p.id === data.currentUser?.defaultProject);
  //   setSelectedProject(defaultProject || undefined);
  // }

  if (!selectedProject) {
    const selectedProjectId = localStorage.getItem("selectedProject");
    if (selectedProjectId) {
      const proj = data.projects.find(p => p.id === selectedProjectId);
      if (proj)
        handleProjectSelect(proj);
    }
  }

  // if (!selectedProject && data.currentUser?.defaultProject) {
  //   const defaultProject = data.projects.find(p => p.id === data.currentUser?.defaultProject);
  //   setSelectedProject(defaultProject || undefined);
  // }

  // let userPreferences: IUserPreferences = {
  //   selectedProject: selectedProject?.id,
  // };

  function handleProjectSelect(project: IProject) {
    setSelectedProject(project);
    setMenuGroups(mockMenus.get(project.id) || []);
    localStorage.setItem("selectedProject", project.id);
  }

  return (
    <div>
      <div className="w-full h-24">
        <div className={"fixed top-0 z-10 w-full h-14 flex items-center justify-items-stretch px-1 " + selectedProject?.id + "-primary"}>
          <div className="flex items-center">
            <div className="w-18 h-14 flex items-center justify-center">
              <NavLink to="/">
                <img className="logo" src={"https://opsweb.gsoc.dlr.de/images/" + selectedProject?.logoFile} />
              </NavLink>
            </div> <ProjectSelector projects={data.projects} selectedProject={selectedProject} onProjectSelect={handleProjectSelect} />
          </div>
          <div className="flex items-center justify-end flex-1">
            <div className="p-10"><Clock missionStart={selectedProject?.launchDate} /></div>
            <div className="pr-4"><UserDropDown userName={data.currentUser?.displayName} /></div>
          </div>
        </div>
        <div className={"fixed top-14 z-9 w-full h-10 items-center flex " + selectedProject?.id + "-secondary"}>
          <Breadcrumbs />
        </div>
      </div>
      <div className="w-full">
        {/* <div className={" w-64 h-screen fixed top-24  border-t border-r border-gray-400 " + selectedProject?.id + "-secondary"}> */}
            <SidebarNavMenu navGroups={menuGroups} />
        {/* </div> */}
        <div className="ml-80 p-3">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
