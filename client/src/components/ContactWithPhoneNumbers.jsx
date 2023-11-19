/* eslint-disable react/prop-types */
import { useState } from 'react';

// eslint-disable-next-line no-unused-vars
const ContactWithPhoneNumbers = ({ listing, setContact }) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');

    const handleContactSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:3000/server/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phoneNumber,
                    mobileNumber,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Contact submitted successfully:', data);
            } else {
                console.error('Error submitting contact:', data.message);
            }
        } catch (error) {
            console.error('Error:', error.message);
        }

        // Reset the form and close the contact section
        setPhoneNumber('');
        setMobileNumber('');
        setContact(false);
    };

    return (
        <div className='mt-6'>
            <form onSubmit={handleContactSubmit} className='flex flex-col gap-4'>
                <label htmlFor='phoneNumber'>Phone Number:</label>
                <input type='tel' id='phoneNumber' value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />

                <label htmlFor='mobileNumber'>Mobile Number:</label>
                <input type='tel' id='mobileNumber' value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} required />

                <button type='submit' className='bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3'>
                    Submit Contact
                </button>
            </form>
        </div>
    );
};

export default ContactWithPhoneNumbers;
