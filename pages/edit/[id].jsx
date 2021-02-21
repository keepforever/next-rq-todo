/* eslint-disable no-empty */
/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import { useRouter } from 'next/router';
import { useMutation, useQuery } from 'react-query';
import cn from 'classnames';
import { format, compareAsc } from 'date-fns';

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
        createTodoResp = await axios.put('/api/todos', data);
        // console.log('\n', '\n', `createTodoResp = `, createTodoResp, '\n', '\n');
    } catch (error) {}
    return createTodoResp;
};

const UpdateTodo = () => {
    const [state, dispatch] = React.useReducer(reducer, initialState);
    const [startDate, setStartDate] = React.useState('');
    const [mode, setMode] = React.useState('detail');
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
            // setStartDate(targetTodo.dueDate);
        },
        refetchOnWindowFocus: false,
        enabled: true
    });

    const { mutateAsync: updateTodo, ...updateTodoInfo } = useMutation(handleUpdateTodo, {
        refetchOnWindowFocus: false
    });

    const handleDateOnChange = (date) => {
        console.log('\n', '\n', `date = `, date, '\n', '\n');
        dispatch({
            type: actions.FIELD,
            fieldName: 'dueDate',
            payload: date.toISOString()
        });
    };
    const handleOnChange = (e) => {
        e.preventDefault();
        console.log('\n', '\n', `e.target.id = `, e.target.id, '\n', '\n');
        console.log('\n', '\n', `e.target.value = `, e.target.value, '\n', '\n');

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
                const updateTodoPayload = {
                    ...state,
                    title: state.title,
                    description: state.description,
                    dueDate: state.dueDate,
                    notes: state.notes
                };
                console.log('\n', '\n', `updateTodoPayload = `, updateTodoPayload, '\n', '\n');
                updateTodoResp = await updateTodo(updateTodoPayload);
                // console.log('\n', '\n', `secondary updateTodoResp = `, updateTodoResp, '\n', '\n');
                // router.push('/');
            } catch (error) {
                // console.log('\n', '\n', `updateTodo error = `, error, '\n', '\n');
            }
        }

        if (action === 'cancel') {
            router.push('/');
        }

        if (action === 'edit') {
            setMode((m) => (m === 'detail' ? 'edit' : 'detail'));
        }
    };
    // console.log('\n', '\n', `todoQuery = `, todosQuery, '\n', '\n');
    console.log('\n', '\n', `state = `, state, '\n', '\n');
    console.log('\n', '\n', `startDate = `, startDate, '\n', '\n');
    console.log('\n', '\n', `new Date(state.dueDate) = `, new Date(state.dueDate), '\n', '\n');
    return (
        <Layout>
            <div className="flex items-center justify-center p-5 text-black">
                <div className="container">
                    {/* Read Only Mode */}

                    {mode === 'detail' && (
                        <>
                            <div className="flex justify-start items-center mb-4 text-xl font-bold text-black">
                                To Do Details
                            </div>
                            <div className="mt-4 w-4/12 mb-4">
                                <select
                                    id="taskStatus"
                                    name="taskStatus"
                                    value={state.taskStatus}
                                    onChange={handleOnChange}
                                    disabled={true}
                                    className={cn('rounded-full py-1 px-2 text-xs w-4/12', {
                                        'border-blue-400 text-blue-400': state.taskStatus === 'InProgress',
                                        'border-gray-400 text-gray-400': state.taskStatus === 'ToDo',
                                        'bg-green-500 text-white': state.taskStatus === 'Done'
                                    })}
                                >
                                    <option value="ToDo">To Do</option>
                                    <option value="InProgress">In Progress</option>
                                    <option value="Done">Done</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-12 w-full sm:w-10/12 md:w-8/12 lg:w-6/12 mb-6">
                                <div className="col-span-4">
                                    <p className="font-bold">Title</p>
                                </div>
                                <div className="col-span-8">{state.title}</div>
                            </div>
                            <div className="grid grid-cols-12 w-full sm:w-10/12 md:w-8/12 lg:w-6/12 mb-6">
                                <div className="col-span-4">
                                    <p className="font-bold">Description</p>
                                </div>
                                <div className="col-span-8">{state.description}</div>
                            </div>
                            <div className="grid grid-cols-12 w-full sm:w-10/12 md:w-8/12 lg:w-6/12 mb-6">
                                <div className="col-span-4">Due Date</div>
                                <div className="col-span-8">
                                    {state.dueDate && format(new Date(state.dueDate), 'MM/dd/yy')}
                                </div>
                            </div>
                            <div className="grid grid-cols-12 w-full sm:w-10/12 md:w-8/12 lg:w-6/12 mb-6">
                                <div className="col-span-4">Notes</div>
                                <div className="col-span-8">{state.notes}</div>
                            </div>

                            <div className="grid grid-cols-12 w-full sm:w-10/12 md:w-8/12 lg:w-6/12 mb-6 text-sm sm:text-base pr-2 sm:pr-0">
                                <div className="col-span-5">
                                    <button
                                        id="cancel"
                                        button-case="cancel"
                                        onClick={handleAction}
                                        className="rounded-full py-1 sm:py-2 md:py-3 px-6 text-red-600 bg-white"
                                    >
                                        Delete
                                    </button>
                                </div>
                                <div className="col-span-4">
                                    <button
                                        id="cancel"
                                        button-case="cancel"
                                        onClick={handleAction}
                                        className="rounded-full py-1 sm:py-2 md:py-3 text-blue-400 bg-white"
                                    >
                                        Back to list
                                    </button>
                                </div>
                                <div className="col-span-3 items-center">
                                    <button
                                        id="save"
                                        button-case="edit"
                                        onClick={handleAction}
                                        className="rounded-full py-1 sm:py-2 md:py-3 px-10 text-white bg-blue-400"
                                    >
                                        Edit
                                    </button>
                                </div>
                            </div>
                            <div className="flex justify-center items-center mt-6"></div>
                        </>
                    )}

                    {/* Edit Mode View */}
                    {mode === 'edit' && (
                        <form>
                            <div className="w-full sm:w-10/12 md:w-8/12 lg:w-6/12">
                                <div className="flex justify-start items-center mb-4 text-xl font-bold text-black">
                                    Edit To Do
                                </div>
                                <div className="mt-4">
                                    <select
                                        id="taskStatus"
                                        name="taskStatus"
                                        value={state.taskStatus}
                                        onChange={handleOnChange}
                                        className={cn('rounded-full py-1 px-2 text-xs w-4/12', {
                                            'border-blue-400 text-blue-400': state.taskStatus === 'InProgress',
                                            'border-gray-400 text-gray-400': state.taskStatus === 'ToDo',
                                            'bg-green-500 text-white': state.taskStatus === 'Done'
                                        })}
                                    >
                                        <option value="ToDo">To Do</option>
                                        <option value="InProgress">In Progress</option>
                                        <option value="Done">Done</option>
                                    </select>
                                </div>

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
                                            value={state.description}
                                            placeholder="Description"
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
                                        // selected={startDate}
                                        onChange={handleDateOnChange}
                                        selected={new Date(state.dueDate)}
                                    />
                                </div>

                                <div className="mt-4">
                                    <label htmlFor="notes" className="block text-sm ">
                                        Notes
                                    </label>

                                    <div>
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
                                <div className="flex justify-end items-center mt-8">
                                    <button
                                        id="edit"
                                        button-case="edit"
                                        onClick={handleAction}
                                        className="rounded-full mr-8 py-1 sm:py-2 md:py-3 px-6 text-blue-400 bg-white"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        id="save"
                                        button-case="save"
                                        onClick={handleAction}
                                        className="rounded-full py-1 sm:py-2 md:py-3 px-10 text-white bg-blue-400"
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default UpdateTodo;
