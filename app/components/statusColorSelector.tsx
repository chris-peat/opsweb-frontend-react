import { Select } from '@headlessui/react'
import { ChevronDownIcon, UserCircleIcon, ArrowRightEndOnRectangleIcon } from '@heroicons/react/20/solid'

export default function StatusColorSelector({ name, value }: { name?: string, value?: string }) {
    
    return (
        <Select className={`block w-full appearance-none border-none bg-green-300 px-3 text-sm/6  data-hover:bg-white data-hover:cursor-pointer`}>
            <option value="green" className='bg-green-500'>green</option>
            <option value="yellow" className='bg-yellow-500'>yellow</option>
            <option value="red"  className='bg-red-500'>red</option>
        </Select >
    )
}
