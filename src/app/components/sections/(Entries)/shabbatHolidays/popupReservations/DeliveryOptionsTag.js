'use client'
import { FaChevronDown, FaTruck, FaMapMarkerAlt, FaUtensils } from "react-icons/fa";

export const DeliveryOptionsTag = ({
    deliveryType,
    pickupAddress,
    selectedDeliveryZone,
    deliveryAddress,
    deliveryFee,
    showDeliveryError,
    onClick
}) => {
    // Get display text for delivery options tag
    const getDeliveryDisplayText = () => {
        if (deliveryType === 'dine_in') {
            return `Dine In - ${pickupAddress}`;
        }
        if (deliveryType === 'pickup') {
            return `Pickup - ${pickupAddress}`;
        }
        if (deliveryType === 'delivery') {
            if (selectedDeliveryZone) {
                return `Delivery - ${selectedDeliveryZone.zone_name}`;
            }
            if (deliveryAddress) {
                return `Delivery - ${deliveryAddress}`;
            }
            return "Delivery - Select details";
        }
        return "Select delivery option";
    };

    return (
        <div className="flex-1">
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onClick();
                }}
                className={`w-full p-3 border rounded-lg text-left flex justify-between items-center cursor-pointer hover:border-primary transition-colors ${
                    showDeliveryError
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300 bg-white hover:bg-gray-50'
                }`}
            >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                    {deliveryType === 'dine_in' ? (
                        <FaUtensils className="text-primary text-sm flex-shrink-0" />
                    ) : deliveryType === 'pickup' ? (
                        <FaMapMarkerAlt className="text-primary text-sm flex-shrink-0" />
                    ) : (
                        <FaTruck className="text-primary text-sm flex-shrink-0" />
                    )}
                    <span className="text-sm text-gray-700 truncate flex-1 min-w-0" title={getDeliveryDisplayText()}>
                        {getDeliveryDisplayText()}
                    </span>
                </div>
                <FaChevronDown className="text-gray-400 text-xs flex-shrink-0" />
            </button>
            {showDeliveryError && (
                <p className="text-red-500 text-xs mt-1">Please select a delivery option</p>
            )}
            {deliveryType === 'delivery' && deliveryFee > 0 && (
                <p className="text-primary text-xs mt-1 font-medium">
                    Delivery fee: +${deliveryFee.toFixed(2)}
                </p>
            )}
        </div>
    );
};
