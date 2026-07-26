import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react'
import { useEffect, useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/20/solid'

export default function StringSelector({ name, value, options, required, onChange, disabled, widthClass }:
    { name?: string, value?: string, options: string[], required?: boolean, onChange?: (value: string) => void, disabled?: boolean, widthClass?: string }) {
    const [str, setStr] = useState(value ?? '');
    const [showError, setShowError] = useState(false);

    useEffect(() => {
        setStr(str ?? '');
        setShowError(false);
    }, [str]);

    const selected = options.find(o => o === value) ?? options[0];

    function handleChange(newValue: string) {
        setShowError(false);
        setStr(newValue);
        onChange?.(newValue);
    }

    const width = widthClass ?? "w-full";

    return (
        <div className={width}>
            <Listbox value={value} onChange={handleChange} disabled={disabled}>
                <div className="relative mt-1">
                    <ListboxButton className={`w-full h-full cursor-pointer flex items-center px-1`}>
                        <span className='block truncate'>{str || "Select..."}</span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronDownIcon
                                className="h-5 w-5 text-gray-400"
                                aria-hidden="true"
                            />
                        </span>
                    </ListboxButton>
                    <ListboxOptions anchor="bottom"
                        className="w-[var(--button-width)] mt-1 max-h-60 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none">
                        {options.map(opt => (
                            <ListboxOption
                                key={opt}
                                value={opt}
                                className="cursor-pointer px-2 py-1 data-focus:bg-blue-100"
                            >
                                {opt}
                            </ListboxOption>
                        ))}
                    </ListboxOptions>
                </div>
            </Listbox>
            {showError && <p className="text-red-600 text-xs mt-0.5">Please select</p>}
            {/* the standard HTML input is invisible and used solely for validation checking */}
            <input
                type="text"
                name={name}
                value={value}
                required={required}
                onChange={() => { }}
                tabIndex={-1}
                className="absolute opacity-0 pointer-events-none w-0 h-0"
                onInvalid={(e: any) => { e.preventDefault(); setShowError(true); }}
            />
        </div>
    );
}
