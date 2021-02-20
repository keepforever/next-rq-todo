import axios from 'axios';
import { useQuery } from 'react-query';

import Layout from '../comps/Layout';

const getTodos = async () => {
    let getTodosResp = null;
    try {
        getTodosResp = await axios.get('/api/todos');
    } catch (error) {}
    return getTodosResp;
};

// export async function getStaticProps(context) {
//     let todos = null;
//     todos = await getTodos();
//     console.log('\n', '\n', `todos = `, todos, '\n', '\n');
//     return {
//         props: {
//             foo: 'bar'
//         } // will be passed to the page component as props
//     };
// }

const index = (props) => {
    const todosQuery = useQuery('todos', getTodos, { refetchOnWindowFocus: false });
    console.log('\n', '\n', `todosQuery = `, todosQuery, '\n', '\n');

    return (
        <Layout>
            <div className="flex items-center justify-center p-5 text-white">
                <div className="container">
                    <div className="flex justify-start items-center mb-4 text-xl font-bold text-black">To Dos</div>

                    <div className="flex items-center">
                        <img
                            className="h-5 md:h-5 mr-3"
                            layout="intrinsic"
                            src="/plus-square.png"
                            alt="Task Manager logo"
                        />
                        <span className="text-black">Create</span>
                    </div>
                    <div className="flex justify-center items-center content-center w-full">
                        <div>one</div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default index;
