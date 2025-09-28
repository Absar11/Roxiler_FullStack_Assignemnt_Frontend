import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStores, clearStoreError } from '../features/store/storeSlice';
import StoreCard from '../components/normalUser/StoreCard';

const UserStoreList = () => {
    const dispatch = useDispatch();
    const { list: stores, isLoading, error, statusMessage } = useSelector((state) => state.stores);
    

    const [searchTerm, setSearchTerm] = useState('');
    const [sort, setSort] = useState('name ASC');
    const [searchQuery, setSearchQuery] = useState('');


    useEffect(() => {
        dispatch(fetchStores({ search: searchQuery, sort }));
    }, [dispatch, searchQuery, sort]);

    useEffect(() => {
        if (error || statusMessage) {
            const timer = setTimeout(() => {
                dispatch(clearStoreError());
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [error, statusMessage, dispatch]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setSearchQuery(searchTerm);
    };

    return (
        <div className="space-y-6 p-6">
            <h1 className="text-3xl font-bold text-gray-800">Available Stores</h1>

            <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-lg shadow-md border">
                {/* Search Form */}
                <form onSubmit={handleSearchSubmit} className="flex space-x-3 w-full md:w-1/2">
                    <input
                        type="text"
                        placeholder="Search by Name or Address..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-grow px-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition">
                        Search
                    </button>
                </form>

                {/* Sort Control */}
                <div className="flex items-center space-x-2 mt-4 md:mt-0">
                    <label className="text-sm font-medium text-gray-700">Sort By:</label>
                    <select 
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        className="px-3 py-2 border rounded-md"
                    >
                        <option value="name ASC">Name (A-Z)</option>
                        <option value="name DESC">Name (Z-A)</option>
                        <option value="overall_rating DESC">Rating (Highest)</option>
                        <option value="overall_rating ASC">Rating (Lowest)</option>
                    </select>
                </div>
            </div>

            {/* Status Messages */}
            {isLoading && <div className="text-center text-indigo-600 font-semibold">Loading stores...</div>}
            {error && <div className="p-3 text-red-700 bg-red-100 rounded-lg">{error}</div>}
            {statusMessage && <div className="p-3 text-green-700 bg-green-100 rounded-lg">{statusMessage}</div>}

            {/* Store List Display */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stores.length > 0 ? (
                    stores.map((store) => (
                        <StoreCard key={store.store_id} store={store} />
                    ))
                ) : !isLoading && (
                    <p className="text-gray-600 col-span-full">No stores found matching your criteria.</p>
                )}
            </div>
        </div>
    );
};

export default UserStoreList;