import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { useState } from 'react';
import { NavLink } from 'react-router';
import type { IProject } from "~/models/project";

export default function ProjectSelector({ projects, selectedProject }: { projects: IProject[]; selectedProject: IProject | undefined }) {
    // const [selected, setSelected] = useState<IProject | undefined>(undefined);
    return (
        <Listbox value={selectedProject} >
            <div className="relative ml-4">
                <ListboxButton className="grid min-w-50 w-full cursor-default grid-cols-1 rounded-md py-1.5 pr-2 pl-3 text-left outline-1 -outline-offset-1 outline-gray-300 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-indigo-600 text-lg">
                    <span className="col-start-1 row-start-1 flex items-center gap-3 pr-6">
                        <span className="block truncate">{selectedProject?.name}</span>
                    </span>
                    <ChevronUpDownIcon
                        className="col-start-1 row-start-1 size-5 self-center justify-self-end sm:size-4"
                    />
                </ListboxButton>

                <ListboxOptions
                    transition
                    className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg outline-1 outline-black/5 data-leave:transition data-leave:duration-100 data-leave:ease-in data-closed:data-leave:opacity-0 sm:text-sm"
                >
                    {projects.map((project) => (
                        <NavLink key={project.id} to={"/project/:" + project.id}>
                            <ListboxOption
                                key={project.id}
                                value={project}
                                className="group relative cursor-default py-2 pr-9 pl-3 text-gray-900 select-none data-focus:bg-indigo-600 data-focus:text-white data-focus:outline-hidden"
                            >
                                <div className="flex items-center">
                                    <span className="ml-3 block truncate font-normal group-data-selected:font-semibold">{project.name}</span>
                                </div>

                                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 group-not-data-selected:hidden group-data-focus:text-white">
                                    <CheckIcon className="size-5" />
                                </span>
                            </ListboxOption>
                        </NavLink> 
                    ))}
                </ListboxOptions>
            </div>
        </Listbox>
    );
}

