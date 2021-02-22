/* eslint-disable no-empty */
/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import { useRouter } from 'next/router';
import { useMutation, useQuery } from 'react-query';
import cn from 'classnames';
import { format } from 'date-fns';

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
    let updateTodoResp = null;
    try {
        updateTodoResp = await axios.put('/api/todos', data);
    } catch (error) {}
    return updateTodoResp;
};
const handleDeleteTodo = async (data) => {
    let deleteTodoResp = null;
    try {
        deleteTodoResp = await axios.delete('/api/todos', { data });
    } catch (error) {}
    return deleteTodoResp;
};

const UpdateTodo = () => {
    const [state, dispatch] = React.useReducer(reducer, initialState);
    const [mode, setMode] = React.useState('detail');
    const router = useRouter();
    const { id: todoId } = router.query;

    useQuery('todos', getTodos, {
        onSuccess: (resp) => {
            const targetTodo = resp.data.find((d) => String(d.id) === todoId);

            dispatch({
                type: actions.SET_STATE,
                payload: {
                    ...targetTodo
                }
            });
            // setStartDate(targetTodo.dueDate);
        },
        refetchOnWindowFocus: false,
        enabled: true
    });

    const { mutateAsync: updateTodo, isLoading: isUpdateLoading } = useMutation(handleUpdateTodo, {});

    const { mutateAsync: deleteTodo, isLoading: isDeleteLoading } = useMutation(handleDeleteTodo, {});

    const handleDateOnChange = (date) => {
        dispatch({
            type: actions.FIELD,
            fieldName: 'dueDate',
            payload: date.toISOString()
        });
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

        if (action === 'delete') {
        }
        switch (action) {
            case 'cancel':
                router.push('/');
                break;
            case 'edit':
                setMode((m) => (m === 'detail' ? 'edit' : 'detail'));
                break;
            case 'delete':
                setMode('delete');
                break;
            case 'cancel-delete':
                setMode('detail');
                break;
            case 'save':
                try {
                    const updateTodoPayload = {
                        ...state,
                        title: state.title,
                        description: state.description,
                        dueDate: state.dueDate,
                        notes: state.notes
                    };
                    await updateTodo(updateTodoPayload);
                    setMode('detail');
                } catch (error) {}
                break;
            case 'confirm-delete':
                try {
                    const deleteTodoPayload = {
                        id: state.id
                    };
                    await deleteTodo(deleteTodoPayload);
                    router.push('/');
                } catch (error) {}
                break;
            default:
            // code block
        }
    };

    return (
        <Layout>
            <div className="flex items-center justify-center text-black">
                <div className="container">
                    {/* Read Only Mode */}

                    {mode === 'detail' && (
                        <>
                            <div className="flex justify-start items-center mb-4 text-xl font-bold text-black pl-4 sm:pl-0">
                                To Do Details
                            </div>
                            <div className="mt-4 mb-4">
                                <select
                                    id="taskStatus"
                                    name="taskStatus"
                                    value={state.taskStatus}
                                    onChange={handleOnChange}
                                    disabled={true}
                                    className={cn('rounded-full py-1 px-2 text-xs w-6/12 sm:w-4/12 md:w-2/12 ', {
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

                            <div className="grid grid-cols-12 w-full sm:w-10/12 md:w-8/12 lg:w-6/12 mb-4">
                                <div className="col-span-4">
                                    <p className="font-bold">Title</p>
                                </div>
                                <div className="col-span-8">{state.title}</div>
                            </div>
                            <div className="grid grid-cols-12 w-full sm:w-10/12 md:w-8/12 lg:w-6/12 mb-4">
                                <div className="col-span-4">
                                    <p className="font-bold">Description</p>
                                </div>
                                <div className="col-span-8">{state.description}</div>
                            </div>
                            <div className="grid grid-cols-12 w-full sm:w-10/12 md:w-8/12 lg:w-6/12 mb-4">
                                <div className="col-span-4">Due Date</div>
                                <div className="col-span-8">
                                    {state.dueDate && format(new Date(state.dueDate), 'MM/dd/yy')}
                                </div>
                            </div>
                            <div className="grid grid-cols-12 w-full sm:w-10/12 md:w-8/12 lg:w-6/12 mb-4">
                                <div className="col-span-4">Notes</div>
                                <div className="col-span-8">{state.notes}</div>
                            </div>

                            <div className="grid grid-cols-12 w-full sm:w-10/12 md:w-8/12 lg:w-6/12 mb-4 text-sm sm:text-base pr-2 sm:pr-0">
                                <div className="col-span-4">
                                    <button
                                        id="delete"
                                        button-case="delete"
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
                                <div className="col-span-4 items-center">
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

                    {mode === 'delete' && (
                        <>
                            <div className="flex justify-start items-center mb-4 text-xl font-bold text-black pl-4 sm:pl-0">
                                Delete To Do
                            </div>
                            <div className="mt-4 mb-4">
                                <select
                                    id="taskStatus"
                                    name="taskStatus"
                                    value={state.taskStatus}
                                    onChange={handleOnChange}
                                    disabled={true}
                                    className={cn('rounded-full py-1 px-2 text-xs w-6/12 sm:w-4/12 md:w-2/12 ', {
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

                            <div className="grid grid-cols-12 w-full sm:w-10/12 md:w-8/12 lg:w-6/12 mb-4">
                                <div className="col-span-4">
                                    <p className="font-bold">Title</p>
                                </div>
                                <div className="col-span-8">{state.title}</div>
                            </div>
                            <div className="grid grid-cols-12 w-full sm:w-10/12 md:w-8/12 lg:w-6/12 mb-4">
                                <div className="col-span-4">
                                    <p className="font-bold">Description</p>
                                </div>
                                <div className="col-span-8">{state.description}</div>
                            </div>
                            <div className="grid grid-cols-12 w-full sm:w-10/12 md:w-8/12 lg:w-6/12 mb-4">
                                <div className="col-span-4">Due Date</div>
                                <div className="col-span-8">
                                    {state.dueDate && format(new Date(state.dueDate), 'MM/dd/yy')}
                                </div>
                            </div>
                            <div className="grid grid-cols-12 w-full sm:w-10/12 md:w-8/12 lg:w-6/12 mb-4">
                                <div className="col-span-4">Notes</div>
                                <div className="col-span-8">{state.notes}</div>
                            </div>

                            <div className="w-full sm:w-10/12 md:w-8/12 lg:w-6/12 flex justify-end">
                                <button
                                    id="cancel-delete"
                                    button-case="cancel-delete"
                                    onClick={handleAction}
                                    className="rounded-full mr-8 py-1 sm:py-2 md:py-3 px-6 text-blue-400 bg-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    id="confirm-delete"
                                    button-case="confirm-delete"
                                    onClick={handleAction}
                                    className="rounded-full py-1 sm:py-2 md:py-3 px-10 text-white bg-red-500"
                                >
                                    Delete
                                </button>
                                {isDeleteLoading && <span className="spin-circle-small" />}
                            </div>
                        </>
                    )}

                    {/* Delete Mode View */}
                    {mode === 'edit' && (
                        <form>
                            <div className="w-full sm:w-10/12 md:w-8/12 lg:w-6/12">
                                <div className="flex justify-start items-center mb-4 text-xl font-bold text-black pl-4 sm:pl-0">
                                    Edit To Do
                                </div>
                                <div className="mt-2">
                                    <select
                                        id="taskStatus"
                                        name="taskStatus"
                                        value={state.taskStatus}
                                        onChange={handleOnChange}
                                        className={cn('rounded-full py-1 px-2 text-xs w-6/12 sm:w-4/12 md:w-2/12 ', {
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
                                <div className="mt-2">
                                    <label htmlFor="title" className="block text-sm ">
                                        Title
                                    </label>
                                    <div>
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

                                <div className="mt-2">
                                    <label htmlFor="description" className="block text-sm ">
                                        Description
                                    </label>

                                    <div>
                                        <textarea
                                            id="description"
                                            name="description"
                                            value={state.description}
                                            placeholder="Description"
                                            onChange={handleOnChange}
                                            rows={3}
                                            className="w-full rounded-md border-gray-400"
                                        />
                                    </div>
                                </div>

                                {/* Phone */}

                                <div className="mt-2">
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

                                <div className="mt-2">
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
                                            rows={3}
                                            className="w-full rounded-md border-gray-400"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end items-center mt-2">
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
                                    {isUpdateLoading && <span className="spin-circle-small" />}
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
