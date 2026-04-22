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

export default function Layout() {
  const [selectedProject, setSelectedProject] = useState<IProject | undefined>(undefined);
  const data = useLoaderData() as { currentUser: IUser; projects: IProject[] };

  // if (!selectedProject) {
  //   const defaultProject = data.projects.find(p => p.id === data.currentUser?.defaultProject);
  //   setSelectedProject(defaultProject || undefined);
  // }

  if (!selectedProject) {
    const selectedProjectId = localStorage.getItem("selectedProject");
    if (selectedProjectId) {
      const proj = data.projects.find(p => p.id === selectedProjectId);
      setSelectedProject(proj);
    }
  }

  // if (!selectedProject && data.currentUser?.defaultProject) {
  //   const defaultProject = data.projects.find(p => p.id === data.currentUser?.defaultProject);
  //   setSelectedProject(defaultProject || undefined);
  // }

  // let userPreferences: IUserPreferences = {
  //   selectedProject: selectedProject?.id,
  // };

  if (selectedProject)
    localStorage.setItem("selectedProject", selectedProject.id);

  return (
    <div>
      <div className="w-full h-24">
        <div className={"fixed top-0 z-10 w-full h-14 flex items-center justify-items-stretch px-1 " + selectedProject?.id + "-primary"}>
          <div className="flex items-center">
            <div className="w-18 h-14 flex items-center justify-center">
              <NavLink to="/">
                <img className="logo" src={"https://opsweb.gsoc.dlr.de/images/" + selectedProject?.logoFile} />
              </NavLink>
            </div> <ProjectSelector projects={data.projects} selectedProject={selectedProject} onProjectSelect={(p) => { setSelectedProject(p) }} />
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
      <div className="p-3">
        <Outlet />
      </div>
    </div>
  );
}
