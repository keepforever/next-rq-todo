/* eslint-disable react/prop-types */
import React from 'react';
import axios from 'axios';
import { useQuery } from 'react-query';
import cn from 'classnames';
import { format, compareAsc } from 'date-fns';
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

const TodoItem = (props) => {
    const router = useRouter();

    return (
        <div
            className={cn('grid grid-cols-12 p-2 cursor-pointer hover:bg-green-200', {
                'border-gray-200 border-b-2': props.isLastTodo
            })}
        >
            {/* Action Button */}

            <div className="col-span-2 border-r-2 border-gray-200 flex justify-center px-2 ">
                <select
                    className={cn('rounded-full py-1 px-2 text-xs w-10/12', {
                        'border-blue-400 text-blue-400': props.taskStatus === 'InProgress',
                        'border-gray-400 text-gray-400': props.taskStatus === 'ToDo',
                        'bg-green-500 text-white': props.taskStatus === 'Done'
                    })}
                    name="taskStatus"
                    id="taskStatus"
                >
                    <option value="ToDo">To Do</option>
                    <option value="InProgress">In Progress</option>
                    <option value="ToDo">Done</option>
                </select>
            </div>

            {/* Title, Description */}

            <div
                className="col-span-8 pl-4"
                onClick={() => {
                    router.push(`/edit/${props.id}`);
                }}
            >
                <span className="font-bold mr-2">{props.id}</span>
                <span className="font-bold mr-4">{props.title}</span>
                <span className="text-xs hidden sm:inline-block">{props.description}</span>
            </div>

            {/* Status Indicator */}

            <div
                className="col-span-2 flex justify-center items-center"
                onClick={() => {
                    router.push(`/edit/${props.id}`);
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
                <span className="text-xs mr-4">Due</span>
                <span className="text-xs">{format(new Date(props.dueDate), 'MM/dd/yy')}</span>
            </div>
        </div>
    );
};

const index = () => {
    const todosQuery = useQuery('todos', getTodos, { refetchOnWindowFocus: false });
    // console.log('\n', '\n', `todosQuery = `, todosQuery, '\n', '\n');

    return (
        <Layout>
            <div className="flex items-center justify-center p-5 text-black">
                <div className="container">
                    <div className="flex justify-start items-center mb-4 text-xl font-bold text-black">To Dos</div>

                    <Link href="/create-todo">
                        <a className="table">
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
                    <div className="flex justify-center items-center content-center w-full mt-3">
                        <div className="flex-col justify-center items-center content-center w-full shadow-lg px-4">
                            {todosQuery?.data?.data.map((td, index) => {
                                return (
                                    <TodoItem
                                        {...td}
                                        key={td.id}
                                        isLastTodo={todosQuery?.data?.data.length - 1 !== index}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default index;
