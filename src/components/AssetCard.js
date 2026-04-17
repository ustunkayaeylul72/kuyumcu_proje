import React from 'react';

const AssetCard = ({ image, title, type, price }) => {
    return (
        <div className="asset-card">
            {image && (
                <div className="asset-image-container">
                    <img src={image} alt={title} className="asset-image" />
                </div>
            )}
            <h3>{title}</h3>
            <p className="type">{type}</p>
            <p className="price">{price}</p>
        </div>
    );
};

export default AssetCard;
