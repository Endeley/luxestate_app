import { useRef, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { Link } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserFailure, deleteUserStart, deleteUserSuccess, singOutUserStart, singOutUserFailure, singOutUserSuccess } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';

function Profile() {
    const fileRef = useRef(null);
    const { currentUser, loading, error } = useSelector((state) => state.user);
    const [file, setFile] = useState(undefined);
    const [filePercentage, setFilePercentage] = useState(0);
    const [fileUploadError, setFileUploadError] = useState(false);
    const [formData, setFormData] = useState({});
    const [updateSucess, setUpdateSuccess] = useState(false);
    const [showListingsError, setShowListingsError] = useState(false);
    const [userListings, setUserListings] = useState([]);
    const dispatch = useDispatch();

    /* 
======firebase storage =======
    allow read;
      allow write: if
      request.resource.size < 2 * 1024 * 1024 &&
      request.resource.contentType.matches('image/.*')
*/
    useEffect(() => {
        if (file) {
            handleFileUpload(file);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [file]);
    const handleFileUpload = (file) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setFilePercentage(Math.round(progress));
            },
            // eslint-disable-next-line no-unused-vars
            (_error) => {
                setFileUploadError(true);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setFormData({ ...formData, avatar: downloadURL });
                });
            }
        );
    };
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            dispatch(updateUserStart());
            const res = await fetch(`/server/user/update/${currentUser._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (data.success === false) {
                dispatch(updateUserFailure(data.message));
                return;
            }
            dispatch(updateUserSuccess(data));
            setUpdateSuccess(true);
        } catch (error) {
            dispatch(updateUserFailure(error.message));
        }
    };
    const handleDeleteUser = async () => {
        try {
            dispatch(deleteUserStart());
            const res = await fetch(`/server/user/delete/${currentUser._id}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            if (data.success === false) {
                dispatch(deleteUserFailure(data.message));
                return;
            }
            dispatch(deleteUserSuccess(data));
        } catch (error) {
            dispatch(deleteUserFailure(error.message));
        }
    };

    const handleSignOut = async () => {
        try {
            dispatch(singOutUserStart());
            const res = await fetch('/server/auth/signout');
            const data = await res.json();
            if (data.success === false) {
                dispatch(deleteUserFailure(data.message));
                return;
            }
            dispatch(deleteUserSuccess(data));
        } catch (error) {
            dispatch(deleteUserFailure(error.message));
        }
    };

    const handleShowListings = async () => {
        try {
            setShowListingsError(false);
            const res = await fetch(`/server/user/listings/${currentUser._id}`);

            const data = await res.json();

            if (data.success === false) {
                setShowListingsError(true);
                return;
            }
            setUserListings(data);
        } catch (error) {
            setShowListingsError(true);
        }
    };

    const handleListingDelete = async (listingId) => {
        try {
            const res = await fetch(`/server/listing/delete/${listingId}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            if (data.success === false) {
                console.log(data.message);
                return;
            }
            setUserListings((prev) => prev.filter((listing) => listing._id !== listingId));
        } catch (error) {
            console.log(error.message);
        }
    };
    return (
        <div className='p-3 max-w-lg mx-auto'>
            <h1 className='text3xl font-semibold text-center my-7'>Profile</h1>
            <form onSubmit={handleSubmit} className='flex flex-col gap-6 '>
                <input onChange={(e) => setFile(e.target.files[0])} type='file' ref={fileRef} hidden accept='image/*' />
                <img onClick={() => fileRef.current.click()} src={formData.avatar || currentUser.avatar} alt='profile' className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2' />

                <p className='text-sm self-center'>
                    {fileUploadError ? (
                        <span className='text-red-700'>Error Image upload(image must be less than 2 mb)</span>
                    ) : filePercentage > 0 && filePercentage < 100 ? (
                        <span className='text-slate-700'>{`Uploading ${filePercentage}%`}</span>
                    ) : filePercentage === 100 ? (
                        <span className='text-green-700'>Image uploaded Successfully</span>
                    ) : (
                        ''
                    )}
                </p>
                <input type='text' placeholder='username' defaultValue={currentUser.username} id='username' className='border p-3 rounded-lg text-center tracking-widest' onChange={handleChange} />
                <input type='email' placeholder='email' defaultValue={currentUser.email} id='email' className='border p-3 rounded-lg text-center tracking-widest' onChange={handleChange} />
                <input type='password' placeholder='password' id='password' className='border p-3 rounded-lg text-center tracking-widest' onChange={handleChange} />
                <button disabled={loading} className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-90 disabled:opacity-80'>
                    {loading ? 'Loading...' : 'update'}
                </button>
                <Link className='bg-green-700 text-white rounded-lg p-3 uppercase text-center hover:opacity-90' to={'/create-listing'}>
                    Create Listing
                </Link>
            </form>
            <div className='flex justify-between mt-6'>
                <span onClick={handleDeleteUser} className='text-red-700 cursor-pointer'>
                    Delete Account
                </span>
                <span onClick={handleSignOut} className='text-red-700 cursor-pointer'>
                    Sign Out
                </span>
            </div>
            <p className='text-red-700 mt-5'>{error ? error : ''}</p>
            <p className='text-green-700 mt-5'>{updateSucess ? 'User updated successfully' : ''}</p>
            <button onClick={handleShowListings} className='text-slate-800 w-full text-lg uppercase bg-slate-400 rounded-lg'>
                ..... Your Listings .....
            </button>
            <p className='text-red-700 mt-5'>{showListingsError ? 'Error show listings' : ''}</p>

            {userListings &&
                userListings.length > 0 &&
                userListings.map((listing) => (
                    <div key={listing._id} className='border rounded-lg p-3 flex justify-between items-center uppercase  bg-slate-200 my-3  gap-6'>
                        <Link to={`/listing/${listing._id}`}>
                            <img src={listing.imageUrls[0]} alt='listing cover' className='h-24 w-40 object-contain rounded-sm' />
                        </Link>
                        <Link className='flex-1 truncate hover:underline ' to={`/listing/${listing._id}`}>
                            <p>{listing.name}</p>
                        </Link>
                        <div className='flex flex-col gap-4'>
                            <button onClick={() => handleListingDelete(listing._id)} className='p-2 text-sm text-white bg-slate-800 rounded-lg uppercase hover:opacity-90 hover:text-red-700'>
                                Delete
                            </button>
                            <Link to={`/update-listing/${listing._id}`}>
                                <button className='p-2 text-sm text-white bg-slate-800 rounded-lg uppercase hover:opacity-90 hover:text-red-700'>EDIT</button>
                            </Link>
                        </div>
                    </div>
                ))}
        </div>
    );
}

export default Profile;
