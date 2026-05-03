import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { ChevronDownIcon, UserCircleIcon, ArrowRightEndOnRectangleIcon } from '@heroicons/react/20/solid'
import { NavLink } from 'react-router';

function signOut() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("accessTokenExpiry");
    window.location.href = "/login";
}

const userMenuItems = [
    { id: 1, text: "Profile", url: "https://opsweb.gsoc.dlr.de/UserProfile.aspx" },
    { id: 2, text: "Sign out", url: "/signout" },
];

export default function UserDropDown({ userName }: { userName?: string }) {
    return (
        <Listbox>
            <div className="relative mr-0">
                <ListboxButton className={"cursor-pointer inline-flex w-full grid-cols-1 rounded-md py-1.5 pr-2 pl-3 text-left text-lg hover:text-gray-200 "}>
                    <UserCircleIcon className="size-8" />
                </ListboxButton>
                <div className="absolute top-12 right-40 z-20 ">
                    <ListboxOptions
                        transition
                        className="absolute z-20 mt-1 max-h-56 w-40 overflow-auto rounded-md bg-white py-1 text-base shadow-lg outline-1 outline-black/5 data-leave:transition data-leave:duration-100 data-leave:ease-in data-closed:data-leave:opacity-0 sm:text-sm"
                    >
                        <NavLink to={"https://opsweb.gsoc.dlr.de/UserProfile.aspx"}>
                            <ListboxOption
                                key={"1"}
                                value="1"
                                className="group relative cursor-default py-2 pr-9 pl-3 text-gray-900 select-none data-focus:bg-indigo-600 data-focus:text-white data-focus:outline-hidden"
                            >
                                <div className="flex items-center">
                                    <span className="ml-3 block truncate font-normal group-data-selected:font-semibold">Profile</span>
                                </div>
                            </ListboxOption>
                        </NavLink>
                        <ListboxOption
                            key={"2"}
                            value="2"
                            onClick={signOut}
                            className="group relative cursor-default py-2 pr-9 pl-3 text-gray-900 select-none data-focus:bg-indigo-600 data-focus:text-white data-focus:outline-hidden"
                        >
                            <div className="flex items-center">
                                <span className="ml-3 block truncate font-normal group-data-selected:font-semibold">Sign out</span>
                            </div>
                        </ListboxOption>
                    </ListboxOptions>
                </div>
            </div>
        </Listbox >
    )
}
