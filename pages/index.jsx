/* eslint-disable no-empty */
/* eslint-disable react/prop-types */
import React from 'react';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import cn from 'classnames';
import { format } from 'date-fns';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ensureEven100 } from '../utils';
import { PrismaClient } from '@prisma/client';

import Layout from '../comps/Layout';

const getTodos = async () => {
    let getTodosResp = null;
    try {
        getTodosResp = await axios.get('/api/todos');
    } catch (error) {}
    return getTodosResp?.data || [];
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
                id: props.id,
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
                        'border-blue-400 text-blue-400': props.taskStatus === 'IN_PROGRESS',
                        'border-gray-400 text-gray-400': props.taskStatus === 'TODO',
                        'bg-green-500 text-white': props.taskStatus === 'DONE'
                    })}
                    onChange={onUpdateTaskStatus}
                    name="taskStatus"
                    id="taskStatus"
                    value={props.taskStatus}
                >
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="DONE">Done</option>
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

const ProgressSummaryBar = ({ todos = [] }) => {
    const { red, yellow, green, total } = todos.reduce(
        (accumulator, t) => {
            if (new Date(t.dueDate).getTime() - new Date().getTime() < 0) {
                accumulator.red.push(t);
            }
            if (
                new Date(t.dueDate).getTime() - new Date().getTime() < 60 * 60 * 24 * 1000 * 2 &&
                new Date(t.dueDate).getTime() - new Date().getTime() > 0
            ) {
                accumulator.yellow.push(t);
            }
            if (new Date(t.dueDate).getTime() - new Date().getTime() > 60 * 60 * 24 * 1000 * 2) {
                accumulator.green.push(t);
            }

            return accumulator;
        },
        {
            red: [],
            yellow: [],
            green: [],
            total: todos?.length || 0
        }
    );

    if (!total) return null;

    const [redRounded, yellowRounded, greenRounded] = ensureEven100(
        [
            parseInt((red.length / total) * 100),
            parseInt((yellow.length / total) * 100),
            parseInt((green.length / total) * 100)
        ],
        100
    );

    return (
        <div className="w-full flex rounded-xl overflow-y-hidden mb-2">
            <span
                className="bg-red-500"
                style={{
                    width: `${redRounded}%`,
                    minHeight: '12px'
                }}
            />
            <span
                className="bg-yellow-500"
                style={{
                    width: `${yellowRounded}%`,
                    minHeight: '12px'
                }}
            />
            <span
                className="bg-green-500"
                style={{
                    width: `${greenRounded}%`,
                    minHeight: '12px'
                }}
            />
        </div>
    );
};

const index = (props) => {
    const { data, isLoading } = useQuery('todos', getTodos, { refetchOnWindowFocus: false, initialData: props.todos });
    // console.group(`index.jsx`);
    // console.log('\n', '\n', `props = `, props, '\n', '\n');
    // console.log('\n', '\n', `data = `, data, '\n', '\n');
    // console.groupEnd();
    return (
        <Layout>
            <div className="flex items-center justify-center text-black">
                <div className="container ">
                    <div className="flex justify-start items-center mb-4 text-xl font-bold text-black pl-4 sm:pl-0">
                        To Dos
                        {isLoading && <span className="spin-circle-small" />}
                    </div>

                    <Link href="/create-todo">
                        <a className="table pl-4 sm:pl-0 mb-4">
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

                    <ProgressSummaryBar todos={data || []} />

                    <div className="flex justify-center items-center content-center w-full mt-3 mb-4">
                        <div className="flex-col justify-center items-center content-center w-full shadow-lg pr-2">
                            {data
                                .sort((a, b) => a.id - b.id)
                                .map((td, index) => {
                                    return <TodoItem {...td} key={td.id} isLastTodo={data.length - 1 !== index} />;
                                })}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export const getServerSideProps = async () => {
    const prisma = new PrismaClient();
    const todos = await prisma.todo.findMany();
    return {
        props: {
            todos: todos.map((t) => {
                return {
                    ...t,
                    dueDate: new Date(t.dueDate).toJSON(),
                    createdAt: new Date(t.createdAt).toJSON(),
                    updatedAt: new Date(t.updatedAt).toJSON()
                };
            })
        }
    };
};

export default index;
