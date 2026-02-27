'use client'
import { useState, useRef, useEffect, useCallback } from 'react';
import { FaTimes, FaClock } from "react-icons/fa";

// CSS to hide scrollbar for WebKit browsers
const scrollbarHideStyles = `
    .wheel-scroll-container::-webkit-scrollbar {
        display: none;
    }
`;

// Simple wheel column - click to select, no complex scroll snap
const WheelColumn = ({ items, selectedValue, onSelect, formatValue }) => {
    const containerRef = useRef(null);
    const itemHeight = 44;
    const visibleItems = 5;
    const containerHeight = itemHeight * visibleItems;

    // Intercept wheel to scroll one item at a time
    const isWheelScrolling = useRef(false);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleWheel = (e) => {
            e.preventDefault();
            if (isWheelScrolling.current) return;

            isWheelScrolling.current = true;
            const direction = e.deltaY > 0 ? 1 : -1;
            const currentScroll = container.scrollTop;
            const targetScroll = currentScroll + direction * itemHeight;

            container.scrollTo({
                top: targetScroll,
                behavior: 'smooth'
            });

            setTimeout(() => {
                isWheelScrolling.current = false;
            }, 150);
        };

        container.addEventListener('wheel', handleWheel, { passive: false });
        return () => container.removeEventListener('wheel', handleWheel);
    }, [itemHeight]);

    // Scroll to selected value on mount
    useEffect(() => {
        if (containerRef.current) {
            const index = items.indexOf(selectedValue);
            if (index !== -1) {
                const scrollPosition = index * itemHeight;
                containerRef.current.scrollTop = scrollPosition;
            }
        }
    }, [selectedValue, items, itemHeight]);

    // Handle scroll end - snap to nearest item
    const scrollTimeoutRef = useRef(null);
    const handleScrollEnd = useCallback(() => {
        if (!containerRef.current) return;

        const scrollTop = containerRef.current.scrollTop;
        const nearestIndex = Math.round(scrollTop / itemHeight);
        const clampedIndex = Math.max(0, Math.min(nearestIndex, items.length - 1));
        const targetScroll = clampedIndex * itemHeight;

        // Snap to nearest item
        containerRef.current.scrollTo({
            top: targetScroll,
            behavior: 'smooth'
        });

        // Update selection
        if (items[clampedIndex] !== selectedValue) {
            onSelect(items[clampedIndex]);
        }
    }, [items, selectedValue, onSelect, itemHeight]);

    const onScroll = useCallback(() => {
        if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
        }
        scrollTimeoutRef.current = setTimeout(handleScrollEnd, 150);
    }, [handleScrollEnd]);

    // Click to select and scroll to item
    const handleItemClick = (item, index) => {
        onSelect(item);
        if (containerRef.current) {
            containerRef.current.scrollTo({
                top: index * itemHeight,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="relative overflow-hidden" style={{ height: containerHeight }}>
            {/* Highlight band in center */}
            <div
                className="absolute left-0 right-0 pointer-events-none z-10 border-2 border-primary bg-primary/10 rounded-lg"
                style={{
                    top: itemHeight * 2,
                    height: itemHeight
                }}
            />

            {/* Fade gradients */}
            <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white to-transparent pointer-events-none z-20" />
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none z-20" />

            {/* Scrollable list */}
            <div
                ref={containerRef}
                className="h-full overflow-y-auto wheel-scroll-container "
                onScroll={onScroll}
                style={{
                    paddingTop: itemHeight * 2,
                    paddingBottom: itemHeight * 2,
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                }}
            >
                <div className="flex flex-col ">
                    {items.map((item, index) => {
                        const isSelected = item === selectedValue;
                        return (
                            <div
                                key={item}
                                onClick={() => handleItemClick(item, index)}
                                className={`flex items-center justify-center cursor-pointer transition-colors ${
                                    isSelected
                                        ? 'text-primary font-bold text-xl'
                                        : 'text-gray-400 text-lg hover:text-gray-600'
                                }`}
                                style={{ height: itemHeight }}
                            >
                                {formatValue ? formatValue(item) : item}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export const TimeSelectorModal = ({
    isOpen,
    onClose,
    selectedTime,
    setSelectedTime,
    setShowTimeError,
    hourStart = 8,
    hourEnd = 23
}) => {
    // Check if current selection is ASAP
    const [isASAP, setIsASAP] = useState(selectedTime === 'ASAP');

    // Parse initial time, default to hourStart
    const parseTime = (time) => {
        if (time && time !== 'ASAP') {
            const [h, m] = time.split(':').map(Number);
            return { hour: h, minute: m };
        }
        return { hour: hourStart, minute: 0 };
    };

    const initialTime = parseTime(selectedTime);
    const [selectedHour, setSelectedHour] = useState(initialTime.hour);
    const [selectedMinute, setSelectedMinute] = useState(initialTime.minute);

    // Hours: dynamic range from hourStart to hourEnd
    const hours = Array.from({ length: hourEnd - hourStart + 1 }, (_, i) => hourStart + i);

    // Minutes: 00, 30
    const minutes = [0, 30];

    // Handle ASAP selection
    const handleASAPSelect = () => {
        setIsASAP(true);
        setSelectedTime('ASAP');
        setShowTimeError(false);
    };

    // Handle time wheel selection (deselects ASAP)
    const handleHourSelect = (hour) => {
        setIsASAP(false);
        setSelectedHour(hour);
    };

    const handleMinuteSelect = (minute) => {
        setIsASAP(false);
        setSelectedMinute(minute);
    };

    // Update selected time when hour or minute changes (only if not ASAP)
    useEffect(() => {
        if (!isASAP) {
            const timeString = `${selectedHour.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')}`;
            setSelectedTime(timeString);
            setShowTimeError(false);
        }
    }, [selectedHour, selectedMinute, setSelectedTime, setShowTimeError, isASAP]);

    // Reset to parsed time when modal opens
    useEffect(() => {
        if (isOpen) {
            if (selectedTime === 'ASAP') {
                setIsASAP(true);
            } else {
                setIsASAP(false);
                const parsed = parseTime(selectedTime);
                setSelectedHour(parsed.hour);
                setSelectedMinute(parsed.minute);
                // Si no hay tiempo seleccionado, commitear el default para evitar que quede en null
                if (!selectedTime) {
                    const defaultTime = `${parsed.hour.toString().padStart(2, '0')}:${parsed.minute.toString().padStart(2, '0')}`;
                    setSelectedTime(defaultTime);
                    setShowTimeError(false);
                }
            }
        }
    }, [isOpen]);

    return (
        <>
        <style>{scrollbarHideStyles}</style>
        <div
            className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-2 transition-all duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={(e) => {
                e.stopPropagation();
                onClose();
            }}
        >
            <div
                className={`bg-white rounded-xl shadow-2xl w-full max-w-[340px] sm:max-w-[380px] overflow-hidden transition-all duration-200 transform ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200">
                    <h3 className="text-base font-semibold text-darkBlue">Select Time</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 cursor-pointer p-1"
                    >
                        <FaTimes size={14} />
                    </button>
                </div>

                {/* ASAP Button */}
                <div className="px-4 pt-4">
                    <button
                        onClick={handleASAPSelect}
                        className={`w-full py-3 rounded-lg font-medium transition-colors cursor-pointer flex items-center justify-center gap-2 ${
                            isASAP
                                ? 'bg-primary text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                        }`}
                    >
                        <FaClock className={isASAP ? 'text-white' : 'text-primary'} />
                        <span>ASAP</span>
                        <span className="text-xs opacity-75">(As Soon As Possible)</span>
                    </button>
                </div>

                {/* Divider */}
                <div className="flex items-center px-4 py-2">
                    <div className="flex-1 border-t border-gray-200"></div>
                    <span className="px-3 text-xs text-gray-400">or select a time</span>
                    <div className="flex-1 border-t border-gray-200"></div>
                </div>

                {/* Time Picker Wheels */}
                <div className="px-4 pb-4">
                    <div className={`flex items-center justify-center gap-2 transition-opacity ${isASAP ? 'opacity-50' : 'opacity-100'}`}>
                        {/* Hours wheel */}
                        <div className="w-24">
                            <WheelColumn
                                items={hours}
                                selectedValue={selectedHour}
                                onSelect={handleHourSelect}
                                formatValue={(h) => h.toString().padStart(2, '0')}
                            />
                        </div>

                        {/* Separator */}
                        <div className="text-2xl font-bold text-primary">:</div>

                        {/* Minutes wheel */}
                        <div className="w-24">
                            <WheelColumn
                                items={minutes}
                                selectedValue={selectedMinute}
                                onSelect={handleMinuteSelect}
                                formatValue={(m) => m.toString().padStart(2, '0')}
                            />
                        </div>
                    </div>
                </div>

                {/* Confirm Button */}
                <div className="px-4 py-3 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        className="w-full py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-opacity-90 transition-colors cursor-pointer text-sm"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
        </>
    );
};
