/* eslint-disable no-empty */
/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import { useRouter } from 'next/router';
import { useMutation, useQuery } from 'react-query';

import axios from 'axios';
import DatePicker from 'react-datepicker';

import Layout from '../../comps/Layout';

export const actions = {
    FIELD: 'FIELD',
    SET_STATE: 'SET_STATE'
};

const messageCharLimit = 500;

const initialState = {
    id: null,
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
const getTodos = async () => {
    let getTodosResp = null;
    try {
        getTodosResp = await axios.get('/api/todos');
    } catch (error) {}
    return getTodosResp;
};
const handleUpdateTodo = async (data) => {
    let createTodoResp = null;

    try {
        console.log('\n', `kill me please `, '\n');
        createTodoResp = await axios.put('/api/todos', data);
        console.log('\n', '\n', `createTodoResp = `, createTodoResp, '\n', '\n');
    } catch (error) {}
    return createTodoResp;
};

const CreateTodo = () => {
    const [state, dispatch] = React.useReducer(reducer, initialState);
    const [startDate, setStartDate] = React.useState(new Date());
    const router = useRouter();
    const { id: todoId } = router.query;

    const todosQuery = useQuery('todos', getTodos, {
        onSuccess: (resp) => {
            console.log('\n', '\n', `resp = `, resp, '\n', '\n');
            const targetTodo = resp.data.find((d) => String(d.id) === todoId);
            console.log('\n', '\n', `targetTodo = `, targetTodo, '\n', '\n');
            dispatch({
                type: actions.SET_STATE,
                payload: {
                    ...resp.data.find((d) => String(d.id) === todoId)
                }
            });
        },
        refetchOnWindowFocus: false,
        enabled: true
    });

    const { mutateAsync: updateTodo, ...updateTodoInfo } = useMutation(handleUpdateTodo, {
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

        if (action === 'save') {
            let updateTodoResp = null;
            try {
                updateTodoResp = await updateTodo({
                    ...state,
                    title: state.title,
                    description: state.description,
                    dueDate: startDate.toISOString(),
                    notes: state.notes
                });
                console.log('\n', '\n', `secondary updateTodoResp = `, updateTodoResp, '\n', '\n');
                // router.push('/');
            } catch (error) {
                // console.log('\n', '\n', `updateTodo error = `, error, '\n', '\n');
            }
        }

        if (action === 'cancel') {
            router.push('/');
        }
    };
    console.log('\n', '\n', `todoQuery = `, todosQuery, '\n', '\n');
    console.log('\n', '\n', `state = `, state, '\n', '\n');
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
                                        id="notes"
                                        name="notes"
                                        placeholder="Notes"
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
                                id="cancel"
                                button-case="cancel"
                                onClick={handleAction}
                                className="rounded-full py-3 px-6 mr-3 text-blue-400 bg-white"
                            >
                                Cancel
                            </button>
                            <button
                                id="save"
                                button-case="save"
                                onClick={handleAction}
                                className="rounded-full py-3 px-12 text-white bg-blue-400"
                            >
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default CreateTodo;
