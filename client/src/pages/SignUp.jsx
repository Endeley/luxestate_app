//
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function SignUp() {
    const [formData, setFormData] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const handlehange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await fetch('/server/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            console.log(data);
            if (data.success === false) {
                setError(data.message);
                setLoading(false);
                return;
            }
            setLoading(false);
            setError(null);
            navigate('/sign-in');
        } catch (error) {
            setLoading(false);
            setError(error.message);
        }
    };

    return (
        <div className='p-3 max-w-lg mx-auto'>
            <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                <input type='username' placeholder='username' className='border p-3 rounded-lg outline-none ' id='username' onChange={handlehange} />
                <input type='email' placeholder='email' className='border p-3 rounded-lg outline-none ' id='email' onChange={handlehange} />
                <input type='password' placeholder='password' className='border p-3 rounded-lg outline-none ' id='password' onChange={handlehange} />
                <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
                    {loading ? 'Loading...' : 'Sign Up'}
                </button>
            </form>
            <div className='flex gap-2 mt-5'>
                <p>Have an Account?</p>
                <Link to={'/sign-in'}>
                    <span className='text-blue-700'> Sign In</span>
                </Link>
            </div>
            {error && <p className='text-red-500 mt-5'>{error}</p>}
        </div>
    );
}

export default SignUp;