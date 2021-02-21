/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import Layout from '../comps/Layout';

import DatePicker from 'react-datepicker';

export const actions = {
    FIELD: 'FIELD',
    SET_STATE: 'SET_STATE'
};

const messageCharLimit = 500;

const initialState = {
    title: '',
    description: '',
    dueDate: '',
    notes: '',
    error: '',
    isShowConfirmSend: false,
    messageCharsRemaining: messageCharLimit,
    emailSentStatus: null
};

const reducer = (state = {}, action = null) => {
    switch (action.type) {
        case actions.FIELD: {
            return {
                ...state,
                [action.fieldName]: action.payload
            };
        }
        case actions.SET_STATE: {
            return {
                ...state,
                ...action.payload
            };
        }
        default:
            return state;
    }
};

const CreateTodo = () => {
    const [state, dispatch] = React.useReducer(reducer, initialState);
    const [startDate, setStartDate] = React.useState(null);

    const handleDateOnChange = (date) => {
        setStartDate(date);
    };

    const handleOnChange = (e) => {
        e.preventDefault();

        dispatch({
            type: actions.FIELD,
            fieldName: e.target.id,
            payload: e.target.value
        });
    };
    return (
        <Layout>
            <div className="flex items-center justify-center p-5 text-black">
                <div className="container">
                    <form>
                        <div className="w-6/12">
                            {/* Name */}
                            <div className="mt-4">
                                <label htmlFor="title" className="block text-sm ">
                                    Title
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="text"
                                        name="title"
                                        placeholder="Title"
                                        id="title"
                                        value={state.title}
                                        onChange={handleOnChange}
                                        className="w-full rounded-md border-gray-400"
                                    />
                                </div>
                            </div>

                            {/* Email */}

                            <div className="mt-4">
                                <label htmlFor="description" className="block text-sm ">
                                    Description
                                </label>

                                <div className="mt-1">
                                    <textarea
                                        id="description"
                                        name="description"
                                        placeholder="Description"
                                        aria-describedby="how_can_we_help_description"
                                        value={state.description}
                                        onChange={handleOnChange}
                                        rows={4}
                                        className="w-full rounded-md border-gray-400"
                                    />
                                </div>
                            </div>

                            {/* Phone */}

                            <div className="mt-4">
                                <div className="flex">
                                    <label htmlFor="due date" className="block text-sm ">
                                        Due Date
                                    </label>
                                </div>
                                <DatePicker
                                    placeholderText="MM/DD/YYYY"
                                    className="text-black rounded-md"
                                    selected={startDate}
                                    onChange={handleDateOnChange}
                                />
                            </div>

                            <div className="mt-4">
                                <div className="flex">
                                    <label htmlFor="notes" className="block text-sm ">
                                        Notes
                                    </label>
                                </div>
                                <div className="mt-1">
                                    <textarea
                                        id="Notes"
                                        name="Notes"
                                        placeholder="Notes"
                                        aria-describedby="how_can_we_help_description"
                                        value={state.notes}
                                        onChange={handleOnChange}
                                        rows={4}
                                        className="w-full rounded-md border-gray-400"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-center items-center mt-6">
                            <button
                                id="open"
                                onClick={() => {}}
                                className="rounded-full py-3 px-6 mr-3 text-blue-400 bg-white"
                            >
                                Cancel
                            </button>
                            <button
                                id="open"
                                onClick={() => {}}
                                className="rounded-full py-3 px-12 text-white bg-blue-400"
                            >
                                Create
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default CreateTodo;
