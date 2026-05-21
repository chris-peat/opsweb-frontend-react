import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react'
import { useEffect, useState } from 'react';

const options = [
    { value: '',       bgClass: 'bg-white',      focusClass: 'data-focus:border-l-4 data-focus:border-gray-500'   },
    { value: 'green',  bgClass: 'bg-green-300',  focusClass: 'data-focus:border-l-4 data-focus:border-green-700'  },
    { value: 'yellow', bgClass: 'bg-yellow-300', focusClass: 'data-focus:border-l-4 data-focus:border-yellow-700' },
    { value: 'red',    bgClass: 'bg-red-300',    focusClass: 'data-focus:border-l-4 data-focus:border-red-700'    },
];

export default function StatusColorSelector({ name, value, required }: { name?: string, value?: string, required?: boolean }) {
    const [color, setColor] = useState(value ?? '');
    const [showError, setShowError] = useState(false);

    useEffect(() => {
        setColor(value ?? '');
        setShowError(false);
    }, [value]);
    const selected = options.find(o => o.value === color) ?? options[0];

    function handleChange(newColor: string) {
        setShowError(false);
        setColor(newColor);
    }

    return (
        <div className="w-40">
            <Listbox value={color} onChange={handleChange}>
                <ListboxButton className={`w-full h-5 ${selected.bgClass} border cursor-pointer flex items-center px-1`}>
                    {color === '' && <span className="text-gray-500 text-sm">Select status...</span>}
                </ListboxButton>
                <ListboxOptions anchor="bottom" className="w-40 bg-white border-gray-300 shadow-lg z-10">
                    {options.map(opt => (
                        <ListboxOption
                            key={opt.value}
                            value={opt.value}
                            className={`${opt.bgClass} ${opt.focusClass} h-6 cursor-pointer flex items-center px-1`}
                        >
                            {opt.value === '' && <span className="text-gray-500 text-sm">Select status...</span>}
                        </ListboxOption>
                    ))}
                </ListboxOptions>
            </Listbox>
            {showError && <p className="text-red-600 text-xs mt-0.5">Please select status</p>}
            <input
                type="text"
                name={name}
                value={color}
                required={required}
                onChange={() => {}}
                tabIndex={-1}
                className="absolute opacity-0 pointer-events-none w-0 h-0"
                onInvalid={(e: any) => { e.preventDefault(); setShowError(true); }}
            />
        </div>
    );
}
