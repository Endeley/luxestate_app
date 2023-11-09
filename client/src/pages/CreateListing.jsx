import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { useSelector } from 'react-redux';

function CreateListing() {
    const [files, setFiles] = useState([]);
    const { currentUser } = useSelector((state) => state.user);
    const [formData, setFormData] = useState({
        imageUrls: [],
        name: '',
        description: '',
        address: '',
        type: 'rent',
        bedrooms: 1,
        bathrooms: 1,
        regularPrice: 50,
        discountPrice: 0,
        offer: false,
        parking: false,
        furnished: false,
    });
    const [imageUploadError, setImageUploadError] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    console.log(formData);
    const handleImageSubmit = () => {
        if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
            setUploading(true);
            setImageUploadError(false);
            const promises = [];
            for (let i = 0; i < files.length; i++) {
                promises.push(storeImage(files[i]));
            }
            Promise.all(promises)
                .then((urls) => {
                    setFormData({ ...formData, imageUrls: formData.imageUrls.concat(urls) });
                    setImageUploadError(false);
                    setUploading(false);
                })
                // eslint-disable-next-line no-unused-vars
                .catch((error) => {
                    setImageUploadError('image upload failed (2mb max par image');
                    setUploading(false);
                });
        } else {
            setImageUploadError('you can on upload 6 images per listing');
            setUploading(false);
        }
    };
    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    return `upload is ${progress}% done`;
                    // console.log(`upload is ${progress}% done`);
                },
                (error) => {
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL);
                    });
                }
            );
        });
    };
    const handleImageDelete = (index) => {
        setFormData({
            ...formData,
            imageUrls: formData.imageUrls.filter((_, i) => i !== index),
        });
    };

    const handleChange = (e) => {
        if (e.target.id === 'sale' || e.target.id === 'rent') {
            setFormData({
                ...formData,
                type: e.target.id,
            });
        }
        if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
            setFormData({
                ...formData,
                [e.target.id]: e.target.checked,
            });
        }
        if (e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea') {
            setFormData({
                ...formData,
                [e.target.id]: e.target.value,
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (formData.imageUrls.length < 1) return setError('You must at least upload one image');
            if (+formData.regularPrice < +formData.discountPrice) return setError('Discount price must be lower than the regular price');
            setLoading(true);
            setError(false);
            const res = await fetch('/server/listing/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    userRef: currentUser._id,
                }),
            });
            const data = await res.json();
            setLoading(false);
            if (data.success === false) {
                setError(data.message);
            }
            navigate(`/listing/${data._id}`);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    return (
        <main className='p-3 max-w-4xl mx-auto'>
            <h1 className=' text-3xl font-semibold text-center my-7'>Create Listing</h1>
            <form onSubmit={handleSubmit} className='flex flex-col gap-5 sm:flex-row '>
                <div className='flex flex-col gap-4 flex-1'>
                    <input type='text' className='border p-3 rounded-lg' id='name' placeholder='name' maxLength='62' minLength='6' required onChange={handleChange} value={formData.name} />
                    <textarea type='text' className='border p-3 rounded-lg' id='description' placeholder='description' required onChange={handleChange} value={formData.description} />
                    <input type='text' className='border p-3 rounded-lg' id='address' placeholder='address' required onChange={handleChange} value={formData.address} />
                    <div className='flex flex-wrap gap-6'>
                        <div className='flex  gap-2'>
                            <input type='checkbox' id='sale' className='w-5' onChange={handleChange} checked={formData.type === 'sale'} />
                            <span>Sell</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type='checkbox' id='rent' className='w-5' onChange={handleChange} checked={formData.type === 'rent'} />
                            <span>Rent</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type='checkbox' id='parking' className='w-5' onChange={handleChange} checked={formData.parking} />
                            <span>Parking Spot</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type='checkbox' id='furnished' className='w-5' onChange={handleChange} checked={formData.furnished} />
                            <span>Furnished</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type='checkbox' id='offer' className='w-5' onChange={handleChange} checked={formData.offer} />
                            <span>Offer</span>
                        </div>
                    </div>
                    <div className='flex flex-wrap gap-6'>
                        <div className=' flex items-center gap-2'>
                            <input type='number' id='bathrooms' min='1' max='10' required className='p-3 border border-gray-300 rounded-lg' onChange={handleChange} value={formData.bathrooms} />
                            <span>Bathrooms</span>
                        </div>
                        <div className=' flex items-center gap-2'>
                            <input type='number' id='bedrooms' min='1' max='10' required className='p-3 border border-gray-300 rounded-lg' onChange={handleChange} value={formData.bedrooms} />
                            <span>Bedrooms</span>
                        </div>
                        <div className=' flex items-center gap-2'>
                            <input type='number' id='regularPrice' min='100' max='200,000,000' required className='p-3 border border-gray-300 rounded-lg' onChange={handleChange} value={formData.regularPrice} />
                            <div className='flex flex-col items-center'>
                                <p>Regular Price</p>
                                <span className='text-small'>($ / Month)</span>
                            </div>
                        </div>
                        {formData.offer && (
                            <div className=' flex items-center gap-2'>
                                <input type='number' id='discountPrice' min='0' max='200,000,000' required className='p-3 border border-gray-300 rounded-lg' onChange={handleChange} value={formData.discountPrice} />
                                <div className='flex flex-col items-center'>
                                    <p>Discounted Price</p>
                                    <span className='text-small'>($ / Month)</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className='flex flex-col flex-1 gap-4'>
                    <p className='font-semibold'>
                        images:
                        <span className='font-normal text-gray-600 ml-2'>The first image will be the cover (max 6)</span>
                    </p>
                    <div className='flex gap-4'>
                        <input onChange={(e) => setFiles(e.target.files)} type='file' className='p-3 border border-gray-300 rounded w-full' id='images' accept='image/*' multiple />
                        <button type='button' disabled={uploading} onClick={handleImageSubmit} className='p-3 text-slate-900 border border-slate-900  font-semibold rounded uppercase hover:shadow-lg disabled:opacity-80'>
                            {uploading ? 'Uploading...' : 'Upload'}
                        </button>
                    </div>
                    <p className='text-red-700 text-center text-xs'>{imageUploadError && imageUploadError}</p>
                    {formData.imageUrls.length > 0 &&
                        formData.imageUrls.map((url, index) => (
                            <div key={url} className='flex justify-between p-3 border items-center'>
                                <img src={url} alt='listing image' className='w-24 h-24 object-contain rounded-lg' />
                                <button type='button' onClick={() => handleImageDelete(index)} className='p-3 text-white bg-slate-800 rounded-lg uppercase hover:opacity-90 hover:text-red-700'>
                                    Delete
                                </button>
                            </div>
                        ))}
                    <button disabled={loading || uploading} className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-90 disabled:opacity-80'>
                        {loading ? 'Creating...' : 'Create Listing'}
                    </button>
                    {error && <p className='text-red-700 text-xs'>{error}</p>}
                </div>
            </form>
        </main>
    );
}

export default CreateListing;
