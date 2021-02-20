import React from 'react';
import { Transition } from '@headlessui/react';
import VisuallyHidden from '@reach/visually-hidden';

const syntheticEvent = { target: { id: 'close' }, preventDefault: () => {} };

const Modal = ({ isVisible = false, children = null, onClose = () => {} }) => {
    return (
        <Transition
            show={isVisible}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
        >
            <div className="fixed z-10 inset-0 overflow-y-auto">
                <div className="block items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center p-0">
                    {/* Modal Backdrop */}
                    <div
                        onClick={() => {
                            onClose(syntheticEvent);
                        }}
                        className="fixed inset-0 transition-opacity"
                        aria-hidden="true"
                    >
                        <div className="absolute inset-0 bg-gray-800 opacity-75" />
                    </div>

                    <span className="inline-block align-middle h-screen" aria-hidden="true"></span>

                    <div
                        className="inline-block rounded-lg px-4 pt-5 pb-4 overflow-hidden shadow-xl transform transition-all my-8 align-middle max-w-xl w-full p-6 text-gray-300 bg-opacity-70 bg-black"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="modal-headline"
                    >
                        <button
                            className="cursor-pointer absolute top-2 right-4 text-2xl"
                            onClick={() => {
                                onClose(syntheticEvent);
                            }}
                        >
                            <VisuallyHidden>Close</VisuallyHidden>
                            <span aria-hidden>&times;</span>
                        </button>
                        {children}
                    </div>
                </div>
            </div>
        </Transition>
    );
};

export default Modal;
