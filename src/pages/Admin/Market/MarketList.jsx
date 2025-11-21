// src/components/MarketList.jsx
import React, { useState, useEffect, useCallback } from "react";
import { getAllMarkets, deleteMarket } from "./marketapi";
import MarketForm from "./MarketForm";
import { Plus } from "lucide-react";

const MarketList = () => {
  const [markets, setMarkets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [marketToEdit, setMarketToEdit] = useState(null); // Used for update

  const fetchMarkets = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAllMarkets();
      setMarkets(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMarkets();
  }, [fetchMarkets]);

  const handleDelete = async (marketId, marketName) => {
    if (
      window.confirm(
        `Are you sure you want to delete the market: ${marketName}?`
      )
    ) {
      setError(null);
      try {
        await deleteMarket(marketId);
        fetchMarkets(); // Refresh the list
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const openCreateForm = () => {
    setMarketToEdit(null); // Ensure it's for creation
    setIsFormOpen(true);
  };

  const openUpdateForm = (market) => {
    setMarketToEdit(market);
    setIsFormOpen(true);
  };

  // Helper to extract the actual ID string from the MongoDB object structure
  const getMarketId = (market) => market._id.$oid;

  return (
    <div className="mx-auto p-3 font-sans text-white bg- min-h-screen">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-3 border-b border-white pb-2">
        💰 Market Management
      </h2>

      <button
        className="flex gap-2 items-center border text-sm text-white font-bold py-1.5 px-3 rounded transition duration-150 mb-4"
        onClick={openCreateForm}
      >
        <Plus size={18} /> Create New Market
      </button>

      {error && (
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4"
          role="alert"
        >
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      {isLoading && <p className="text-lg text-blue-500">Loading markets...</p>}

      {!isLoading && markets.length === 0 && !error && (
        <p className="text-lg text-gray-500">
          No markets available. Create one!
        </p>
      )}

      {/* Key changes for table scrolling:
        1. max-h-96: Sets a maximum height (approx 24rem) for the container.
        2. overflow-y-auto: Enables vertical scrolling when content exceeds max-h.
        3. overflow-x-auto: Enables horizontal scrolling for wide tables.
      */}
      <div className="shadow **max-h-96 overflow-y-auto overflow-x-auto** border-b border-gray-200 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-white/20 sticky top-0 backdrop-blur-sm z-10">
            {" "}
            {/* Added sticky top-0 and z-10 for fixed header */}
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                Open Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                Close Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white/20 divide-y divide-gray-200">
            {markets.map((market) => (
              <tr key={getMarketId(market)} className="hover:bg-gray-50/20">
                {" "}
                {/* Slightly updated hover color */}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200">
                  {market.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                  {market.open_time}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                  {market.close_time}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      market.is_active
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {market.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => openUpdateForm(market)}
                    className="text-indigo-300 hover:text-indigo-500 mr-4 transition duration-150"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      handleDelete(getMarketId(market), market.name)
                    }
                    className="text-red-400 hover:text-red-600 transition duration-150"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MarketForm Modal */}
      {isFormOpen && (
        <MarketForm
          market={marketToEdit}
          onClose={() => setIsFormOpen(false)}
          onSave={fetchMarkets}
        />
      )}
    </div>
  );
};

export default MarketList;
