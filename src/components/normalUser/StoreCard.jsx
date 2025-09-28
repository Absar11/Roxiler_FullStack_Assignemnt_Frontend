import React, { useState } from 'react';
import { useDispatch} from 'react-redux';
import { submitRating } from '../../features/store/storeSlice';

const StarRating = ({ value, onClick }) => {
    return (
        <div className="flex space-x-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <svg
                    key={star}
                    onClick={() => onClick(star)}
                    className={`w-5 h-5 cursor-pointer transition-colors ${
                        star <= value ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.31 4.022a1 1 0 00.95.691h4.237c.969 0 1.371 1.243.588 1.81l-3.43 2.492a1 1 0 00-.364 1.118l1.31 4.022c.3.921-.755 1.688-1.542 1.118l-3.43-2.492a1 1 0 00-1.176 0l-3.43 2.492c-.787.57-1.84-.197-1.542-1.118l1.31-4.022a1 1 0 00-.364-1.118L2.14 9.45c-.783-.567-.38-1.81.588-1.81h4.237a1 1 0 00.95-.691l1.31-4.022z" />
                </svg>
            ))}
        </div>
    );
};

const StoreCard = ({ store }) => {
    const dispatch = useDispatch();
    const [ratingHover, setRatingHover] = useState(0);
    const hasRated = store.user_submitted_rating !== null;
    const currentRating = store.user_submitted_rating || 0;
    const overallRating = store.overall_rating ? parseFloat(store.overall_rating).toFixed(1) : 'N/A';

    const handleRatingClick = (newRating) => {
        if (window.confirm(`Do you want to ${hasRated ? 'modify' : 'submit'} your rating to ${newRating} stars?`)) {
            dispatch(submitRating({ store_id: store.store_id, rating_value: newRating }));
        }
    };

    return (
        <div className="bg-white p-5 shadow-lg rounded-xl border border-gray-200 flex flex-col justify-between h-full">
            <div>
                <h3 className="text-xl font-bold text-indigo-700">{store.name}</h3>
                <p className="text-gray-500 text-sm mb-3">{store.address}</p>
                
                <div className="flex items-center space-x-4 border-t pt-3 mt-3">
                    {/* Overall Rating */}
                    <div className="flex flex-col items-center">
                        <span className="text-3xl font-extrabold text-green-600">
                            {overallRating}
                        </span>
                        <span className="text-xs text-gray-600">Overall Rating</span>
                    </div>


                    <div className="h-10 border-r border-gray-300"></div>

                    {/* User Rating Controls */}
                    <div className="flex flex-col items-start flex-grow">
                        <span className="text-sm font-medium mb-1">
                            Your Rating: <span className="text-indigo-600">{currentRating || 'None'}</span>
                        </span>
                        
                        <div 
                            onMouseLeave={() => setRatingHover(0)} 
                            className="flex items-center"
                        >
                            <StarRating 
                                value={ratingHover || currentRating} 
                                onClick={handleRatingClick}
                                onMouseEnter={(star) => setRatingHover(star)}
                            />
                            {hasRated && (
                                <span className="text-xs text-gray-400 ml-2">
                                    (Click to Modify)
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StoreCard;