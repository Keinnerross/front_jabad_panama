'use client'
import React, { useState, useRef, useEffect } from "react";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";
import { FaLeaf, FaUtensils, FaHome, FaMountain, FaFish, FaBed, FaMugHot, FaTree, FaTag } from "react-icons/fa";

export const EntryLayout = ({ data, filterKey = "category", renderItem }) => {
  const [currentFilter, setCurrentFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const contentRef = useRef(null);
  const isNextTriggered = useRef(false);

  const filters = ["All", ...new Set(data.map(item => item[filterKey]))];

  const iconMap = {
    Adventure: FaMountain,
    Nature: FaLeaf,
    Food: FaUtensils,
    Cultural: FaHome,
    Fishing: FaFish,
    Hostel: FaBed,
    Hotel: FaBed,
    "Boutique Hotel": FaBed,
    Resort: FaTree,
    Villa: FaHome,
    "Eco Lodge": FaTree,
    Bakery: FaMugHot,
    Catering: FaUtensils
  };

  const filteredData = currentFilter === "All"
    ? data
    : data.filter(item => item[filterKey] === currentFilter);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    if (isNextTriggered.current && contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      isNextTriggered.current = false;
    }
  }, [currentPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      isNextTriggered.current = true;
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div ref={contentRef} className="w-full px-6 md:px-0 py-12 flex justify-center">
      <div className="w-full max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h2 className="text-3xl font-bold text-darkBlue">
            Discover, Taste & Explore
          </h2>

          <div className="flex flex-wrap gap-2">
            {filters.map((filter, index) => {
              const IconComponent = iconMap[filter] || FaTag;
              const isActive = currentFilter === filter;
              return (
                <button
                  key={index}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm md:text-base cursor-pointer ${isActive
                      ? "bg-darkBlue text-white"
                      : "bg-white text-darkBlue border border-gray-300"
                    }`}
                  onClick={() => {
                    setCurrentFilter(filter);
                    setCurrentPage(1);
                  }}
                >
                  {filter !== "All" && (
                    <IconComponent className={isActive ? "text-white" : "text-primary"} />
                  )}
                  <span className="font-semibold">{filter}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-8">
          {paginatedData.map((item, index) => (
            <React.Fragment key={index}>
              {renderItem(item)}
            </React.Fragment>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-end gap-4">
            <button
              className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors cursor-pointer ${currentPage === 1
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-darkBlue text-white hover:bg-opacity-90"
                }`}
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              <FiChevronLeft />
              <span>Previous</span>
            </button>

            <button
              className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors cursor-pointer ${currentPage === totalPages
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-darkBlue text-white hover:bg-opacity-90"
                }`}
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              <span>Next</span>
              <FiChevronRight />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
