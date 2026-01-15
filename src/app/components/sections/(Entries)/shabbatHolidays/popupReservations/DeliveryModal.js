'use client'
import { FaTimes, FaMapMarkerAlt, FaTruck } from "react-icons/fa";

export const DeliveryModal = ({
    isOpen,
    onClose,
    deliveryType,
    setDeliveryType,
    pickupAddress,
    deliveryZonesConfig,
    selectedDeliveryZone,
    setSelectedDeliveryZone,
    setDeliveryFee,
    deliveryAddress,
    setDeliveryAddress,
    setShowDeliveryError
}) => {
    if (!isOpen) return null;

    const handleZoneSelect = (zone) => {
        setSelectedDeliveryZone(zone);
        setDeliveryFee(zone.delivery_fee > 0 ? parseFloat(zone.delivery_fee) : 0);
        setShowDeliveryError(false);
    };

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
            onClick={(e) => {
                e.stopPropagation();
                onClose();
            }}
        >
            <div
                className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-darkBlue">Delivery Options</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 cursor-pointer p-1"
                    >
                        <FaTimes size={16} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200">
                    <button
                        onClick={() => {
                            setDeliveryType('pickup');
                            setShowDeliveryError(false);
                        }}
                        className={`flex-1 py-3 px-4 text-sm font-medium transition-colors cursor-pointer flex items-center justify-center gap-2 ${
                            deliveryType === 'pickup'
                                ? 'text-primary border-b-2 border-primary bg-primary/5'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        <FaMapMarkerAlt />
                        Pickup
                    </button>
                    <button
                        onClick={() => {
                            setDeliveryType('delivery');
                            setShowDeliveryError(false);
                        }}
                        className={`flex-1 py-3 px-4 text-sm font-medium transition-colors cursor-pointer flex items-center justify-center gap-2 ${
                            deliveryType === 'delivery'
                                ? 'text-primary border-b-2 border-primary bg-primary/5'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        <FaTruck />
                        Delivery
                    </button>
                </div>

                {/* Content */}
                <div className="p-4">
                    {deliveryType === 'pickup' ? (
                        // Pickup Content
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <FaMapMarkerAlt className="text-primary text-lg mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Pickup Location</p>
                                    <p className="text-sm text-gray-600 mt-1">{pickupAddress}</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        // Delivery Content
                        <div className="space-y-3">
                            {deliveryZonesConfig.useZones ? (
                                // Delivery zones selector
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-gray-700">Select your zone</p>
                                    <div className="space-y-2 max-h-48 overflow-y-auto">
                                        {deliveryZonesConfig.zones.map(zone => (
                                            <label
                                                key={zone.id}
                                                className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                                                    selectedDeliveryZone?.id === zone.id
                                                        ? 'bg-primary/10 border-2 border-primary'
                                                        : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                                                }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <input
                                                        type="radio"
                                                        name="deliveryZoneModal"
                                                        checked={selectedDeliveryZone?.id === zone.id}
                                                        onChange={() => handleZoneSelect(zone)}
                                                        className="w-4 h-4 text-primary cursor-pointer"
                                                    />
                                                    <span className="text-sm text-gray-700">{zone.zone_name}</span>
                                                </div>
                                                <span className={`text-sm font-medium ${
                                                    zone.delivery_fee > 0 ? 'text-gray-700' : 'text-green-600'
                                                }`}>
                                                    {zone.delivery_fee > 0 ? `+$${zone.delivery_fee}` : 'Free'}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                // Address input
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-gray-700">Enter your address</p>
                                    <input
                                        type="text"
                                        placeholder="Enter delivery address"
                                        value={deliveryAddress}
                                        onChange={(e) => {
                                            setDeliveryAddress(e.target.value);
                                            setShowDeliveryError(false);
                                        }}
                                        className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 text-sm focus:border-primary focus:outline-none"
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Confirm Button */}
                <div className="p-4 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        className="w-full py-3 bg-primary text-white font-medium rounded-lg hover:bg-opacity-90 transition-colors cursor-pointer"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};
