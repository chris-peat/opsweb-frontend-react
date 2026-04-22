import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon, UserCircleIcon, ArrowRightEndOnRectangleIcon } from '@heroicons/react/20/solid'

export default function UserDropDown({ userName }: { userName?: string }) {
    return (
        <div>
            <Menu>
                <MenuButton className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 ">
                    {userName || ''}
                    <UserCircleIcon className="size-8 fill-white/60" />
                </MenuButton>

                <MenuItems anchor="bottom" className="z-10 absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <MenuItem>
                        <a className="block data-focus:bg-blue-100" href="https://opsweb.gsoc.dlr.de/UserProfile.aspx">
                            Profile
                        </a>
                    </MenuItem>
                    <MenuItem>
                        <a className="block data-focus:bg-blue-100" href="/support">
                            Change password
                        </a>
                    </MenuItem>
                    <MenuItem>
                        <a className="block data-focus:bg-blue-100" href="/license">
                            <ArrowRightEndOnRectangleIcon className="size-5" />
                            Logout
                        </a>
                    </MenuItem>
                </MenuItems>
            </Menu>
        </div>
    )
}
