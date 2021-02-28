/* eslint-disable no-empty */
/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import { useRouter } from 'next/router';
import { useMutation } from 'react-query';
import axios from 'axios';

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
    dueDate: String(new Date().toISOString()),
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

const handleCreateTodo = async (data) => {
    let createTodoResp = null;

    try {
        createTodoResp = await axios.post('/api/todos', data);
    } catch (error) {}
    return createTodoResp;
};

const CreateTodo = () => {
    const [state, dispatch] = React.useReducer(reducer, initialState);
    const [startDate, setStartDate] = React.useState(new Date());
    const router = useRouter();

    const { mutateAsync: createTodo, isLoading: isCreateTodoLoading } = useMutation(handleCreateTodo, {
        refetchOnWindowFocus: false
    });

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
    const handleAction = async (e) => {
        e.preventDefault();
        const action = e.target.getAttribute('button-case');

        if (action === 'create') {
            try {
                await createTodo({
                    title: state.title,
                    description: state.description,
                    dueDate: startDate.toISOString(),
                    notes: state.notes,
                    userId: 1
                });
                router.push('/');
            } catch (error) {}
        }

        if (action === 'cancel') {
            router.push('/');
        }
    };
    return (
        <Layout>
            <div className="flex items-center justify-center text-black">
                <div className="container">
                    <div className="flex justify-start items-center mb-4 text-xl font-bold text-black pl-4 sm:pl-0">
                        Create To Do
                        {isCreateTodoLoading && <span className="spin-circle-small" />}
                    </div>
                    <form>
                        <div className="w-11/12 sm:w-7/12">
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
                                        value={state.description}
                                        onChange={handleOnChange}
                                        rows={3}
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
                                        id="notes"
                                        name="notes"
                                        placeholder="Notes"
                                        value={state.notes}
                                        onChange={handleOnChange}
                                        rows={3}
                                        className="w-full rounded-md border-gray-400"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-center items-center mt-6">
                            <button
                                id="cancel"
                                button-case="cancel"
                                onClick={handleAction}
                                className="rounded-full py-3 px-6 mr-3 text-blue-400 bg-white"
                            >
                                Cancel
                            </button>
                            <button
                                id="create"
                                button-case="create"
                                onClick={handleAction}
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
