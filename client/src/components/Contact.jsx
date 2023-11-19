/* eslint-disable react/prop-types */
//
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

//
//
function Contact({ listing }) {
    const [owner, setOwner] = useState(null);

    const [message, setMessage] = useState('');

    const onChange = (e) => {
        setMessage(e.target.value);
    };

    useEffect(() => {
        const fetchOwner = async () => {
            try {
                const res = await fetch(`/server/user/${listing.userRef}`);
                const data = await res.json();

                setOwner(data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchOwner();

        // eslint-disable-next-line react/prop-types
    }, [listing.userRef]);
    return (
        <>
            {owner && (
                <div className='flex flex-col gap-2'>
                    <p>
                        Contact <span className='font-semibold'>{owner.username}</span> for <span className='font-semibold'>{listing.name.toLowerCase()}</span>
                    </p>
                    {listing.displayContacts && (
                        <>
                            <p>Mobile Contact: {owner.mobileContact}</p>
                            <p>Telephone Contact: {owner.telContact}</p>
                            <p>telephone</p>
                        </>
                    )}

                    <textarea name='message' id='message' rows='2' value={message} onChange={onChange} placeholder='Enter your message here...' className='w-full border p-3 rounded-lg'></textarea>

                    <Link to={`mailto:${owner.email}?subject=Regarding ${listing.name}&body=${message}`} className='bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95'>
                        Send Message
                    </Link>
                </div>
            )}
        </>
    );
}

export default Contact;
