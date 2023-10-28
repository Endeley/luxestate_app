function Header() {
    return (
        <header className='bg-slate-800 shadow-lg'>
            <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
                <h1 className='font-bold text-sm sm:text-2xl flex flex-wrap'>
                    <span className='text-slate-500 tracking-widest'>Lux</span>
                    <span className='text-slate-300 tracking-widest'>Estate</span>
                </h1>
                <form className='bg-slate-100 p-3 rounded-lg'>
                    <input type='text' placeholder='search...' className='bg-transparent' />
                </form>
            </div>
        </header>
    );
}

export default Header;
