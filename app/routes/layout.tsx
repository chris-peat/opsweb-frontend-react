/*
  * This is the top-level layout for the multi-mission OpsWeb. It provides the header and contains an Outlet 
  * where the content of the different pages will be rendered.
*/
import { Link, NavLink, Outlet, useMatches } from "react-router";
import { useLoaderData, useParams } from "react-router";
import type { Route } from '../+types/root';
import { getClient } from '../apollo';
import { gql, type TypedDocumentNode } from "@apollo/client";
import type { IProject } from "~/models/project";
import { useContext, useState } from 'react';
import Clock from "~/components/clock";
import ProjectSelector from "~/components/projectSelector";
import Breadcrumbs from "~/components/breadcrumbs";
import type { IUser } from "~/models/user";
import UserDropDown from "~/components/userDropDown";
import SidebarNavMenu from "~/components/sidebarNavMenu";
import { ApolloProvider } from "@apollo/client/react";
import { Button } from "@headlessui/react";
import { Bars3Icon } from '@heroicons/react/20/solid'
import { createContext } from "react";

export const ProjectContext = createContext({ project: "EMP", user: "peat" });

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

export const handle = {
  breadcrumb: {
    path: "/project/:projectId",
    text: "Project Home"
  }
};

export default function Layout() {
  const [selectedProject, setSelectedProject] = useState<IProject | undefined>(undefined);
  const [showSidebar, setShowSidebar] = useState(true);
  const { project, user } = useContext(ProjectContext);
  let params = useParams();
  const data = useLoaderData() as { currentUser: IUser; projects: IProject[] };
  const matches = useMatches();
  
  if (params.projectId) {
    const projectId = params.projectId.replace(":", "");
    if (!selectedProject || selectedProject.id !== projectId) {
      const proj = data.projects.find(p => p.id === projectId);
      if (proj)
        handleProjectSelect(proj);
    }
  }

  function toggleSidebar() {
    setShowSidebar(!showSidebar);
  };

  function handleProjectSelect(project: IProject) {
    setSelectedProject(project);
    localStorage.setItem("selectedProject", project.id);
  }

  return (
    <ApolloProvider client={getClient()}>
      <div>
        <div className="w-full h-24">
          <div className={"fixed top-0 z-25 w-full h-14 flex items-center justify-items-stretch px-1 " + selectedProject?.id + "-primary"}>
            <div className="flex items-center">
              <div className="w-18 h-14 flex items-center justify-center">
                <NavLink to={"/project/:" + (selectedProject?.id || "")}>
                  <img className="logo" src={"https://opsweb.gsoc.dlr.de/images/" + selectedProject?.logoFile} />
                </NavLink>
              </div> <ProjectSelector projects={data.projects} selectedProject={selectedProject} />
            </div>
            <div className="flex items-center justify-end flex-1">
              <div className="p-10"><Clock missionStart={selectedProject?.launchDate} /></div>
              <div className="pr-2">{data.currentUser?.displayName || ''}</div>
              <div className="pr-4"><UserDropDown userName={data.currentUser?.displayName} /></div>
            </div>
          </div>
          <div className={"fixed top-14 z-9 w-full h-10 items-center flex " + selectedProject?.id + "-secondary"}>
            <Button className="ml-2 mr-4 px-3 py-1.5 cursor-pointer hover:text-gray-200 text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group" onClick={toggleSidebar}>
              <Bars3Icon className="size-5 " />
            </Button>
            <Breadcrumbs />
          </div>
        </div>
        <div className="w-full flex flex-row">
          {showSidebar ? <SidebarNavMenu projectId={selectedProject?.id ?? ""} /> : null}
          <div className="w-full p-4">
            <ProjectContext.Provider value={{ project: selectedProject?.id || "", user: data.currentUser?.name || "" }}>
              <Outlet />
            </ProjectContext.Provider>
          </div>
        </div>
      </div>
    </ApolloProvider>
  );
}
