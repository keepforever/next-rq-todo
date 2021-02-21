/* eslint-disable no-empty */
/* eslint-disable react/prop-types */
import React from 'react';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import cn from 'classnames';
import { format } from 'date-fns';
import Link from 'next/link';
import { useRouter } from 'next/router';

import Layout from '../comps/Layout';

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

const TodoItem = (props) => {
    const router = useRouter();
    const { mutateAsync: updateTodo, isLoading: isUpdateLoading } = useMutation(handleUpdateTodo, {});
    const queryClient = useQueryClient();

    const onUpdateTaskStatus = async (e) => {
        try {
            const updateTodoPayload = {
                ...props,
                taskStatus: e.target.value
            };
            await updateTodo(updateTodoPayload);
            queryClient.invalidateQueries('todos');
        } catch (error) {}
    };
    return (
        <div
            className={cn('grid grid-cols-12 p-2 cursor-pointer hover:bg-gray-100', {
                'border-gray-200 border-b-2': props.isLastTodo
            })}
        >
            {/* Action Button */}
            <div className="col-span-5 sm:col-span-3 md:col-span-2 border-r-2 border-gray-200 flex justify-center">
                <select
                    className={cn('rounded-full py-1 px-4 text-xs w-10/12', {
                        'border-blue-400 text-blue-400': props.taskStatus === 'InProgress',
                        'border-gray-400 text-gray-400': props.taskStatus === 'ToDo',
                        'bg-green-500 text-white': props.taskStatus === 'Done'
                    })}
                    onChange={onUpdateTaskStatus}
                    name="taskStatus"
                    id="taskStatus"
                    value={props.taskStatus}
                >
                    <option value="ToDo">To Do</option>
                    <option value="InProgress">In Progress</option>
                    <option value="Done">Done</option>
                </select>
            </div>

            {/* Title, Description */}
            <div
                className="col-span-5 sm:col-span-6 md:col-span-7 pl-4 max-h-6 truncate"
                onClick={() => {
                    router.push(`/detail/${props.id}`);
                }}
            >
                <div className="inline-block">
                    {isUpdateLoading && <span className="spin-circle-small" />}
                    <span className="font-bold mr-4 text-xs sm:text-base">{props.title}</span>
                    <span className="hidden sm:inline-block text-xs">{props.description}</span>
                </div>
            </div>

            {/* Status Indicator */}

            <div
                className="col-span-2 sm:col-span-3 flex justify-end items-center"
                onClick={() => {
                    router.push(`/detail/${props.id}`);
                }}
            >
                <span
                    className={cn('h-3 w-3 rounded-md mr-4', {
                        'bg-red-500': new Date(props.dueDate).getTime() - new Date().getTime() < 0,
                        'bg-yellow-500':
                            new Date(props.dueDate).getTime() - new Date().getTime() < 60 * 60 * 24 * 1000 * 2 &&
                            new Date(props.dueDate).getTime() - new Date().getTime() > 0,
                        'bg-green-500':
                            new Date(props.dueDate).getTime() - new Date().getTime() > 60 * 60 * 24 * 1000 * 2
                    })}
                />
                <span className="hidden sm:inline-block text-xs mr-4">Due</span>
                <span className="hidden sm:inline-block text-xs">{format(new Date(props.dueDate), 'MM/dd/yy')}</span>
                <span className="inline-block sm:hidden text-xl">&#8250;</span>
            </div>
        </div>
    );
};

const index = () => {
    const { data, isLoading } = useQuery('todos', getTodos, { refetchOnWindowFocus: false });

    return (
        <Layout>
            <div className="flex items-center justify-center text-black">
                <div className="container ">
                    <div className="flex justify-start items-center mb-4 text-xl font-bold text-black px-5">
                        To Dos
                        {isLoading && <span className="spin-circle-small" />}
                    </div>

                    <Link href="/create-todo">
                        <a className="table px-5">
                            <div className="flex items-center">
                                <img
                                    className="h-5 md:h-5 mr-3"
                                    layout="intrinsic"
                                    src="/plus-square.png"
                                    alt="Task Manager logo"
                                />
                                <span className="text-black">Create</span>
                            </div>
                        </a>
                    </Link>
                    <div className="flex justify-center items-center content-center w-full mt-3 mb-4">
                        <div className="flex-col justify-center items-center content-center w-full shadow-lg pr-2">
                            {data?.data.map((td, index) => {
                                return <TodoItem {...td} key={td.id} isLastTodo={data?.data.length - 1 !== index} />;
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default index;
