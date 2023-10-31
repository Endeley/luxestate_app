//
import { FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';

//
function Header() {
    return (
        <header className='bg-slate-800 shadow-lg'>
            <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
                <Link to='/'>
                    <h1 className='font-bold text-sm sm:text-2xl flex flex-wrap'>
                        <span className='text-slate-500 tracking-widest'>Lux</span>
                        <span className='text-slate-300 tracking-widest'>Estate</span>
                    </h1>
                </Link>
                <form className='bg-slate-100 p-3 rounded-lg flex items-center'>
                    <input type='text' placeholder='search...' className='bg-transparent focus:outline-none w-24 sm:w-64' />
                    <FaSearch className='text-slate-700' />
                </form>
                <ul className='flex gap-4 text-lg'>
                    <Link to='/'>
                        <li className='hidden sm:inline text-slate-300 hover:text-gray-50'>Home</li>
                    </Link>
                    <Link to='about'>
                        <li className='hidden sm:inline text-slate-300 hover:text-gray-50'>About</li>
                    </Link>
                    <Link to='/sign-in'>
                        <li className=' text-slate-300 hover:text-gray-50'>Sign In</li>
                    </Link>
                </ul>
            </div>
        </header>
    );
}

export default Header;
