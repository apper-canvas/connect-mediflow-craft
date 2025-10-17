import React, { useState, useEffect } from "react";
import BedCard from "@/components/molecules/BedCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Badge from "@/components/atoms/Badge";
import bedService from "@/services/api/bedService";

const BedManagement = () => {
  const [beds, setBeds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedWard, setSelectedWard] = useState("all");

  const loadBeds = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await bedService.getAll();
      setBeds(data);
    } catch (err) {
      setError("Failed to load bed information. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBeds();
  }, []);

const wards = [...new Set(beds.map(bed => bed.ward_c))];
  
  const filteredBeds = selectedWard === "all" 
? beds 
    : beds.filter(bed => bed.ward_c === selectedWard);

  const getWardStats = (wardName) => {
const wardBeds = beds.filter(bed => bed.ward_c === wardName);
    const available = wardBeds.filter(bed => bed.status_c === "Available").length;
    const occupied = wardBeds.filter(bed => bed.status_c === "Occupied").length;
    const total = wardBeds.length;
    return { available, occupied, total };
  };

  const wardOptions = [
    { 
      value: "all", 
      label: "All Wards", 
      stats: { 
available: beds.filter(b => b.status_c === "Available").length,
        occupied: beds.filter(b => b.status_c === "Occupied").length,
        total: beds.length
      }
    },
    ...wards.map(ward => ({
      value: ward,
      label: ward,
      stats: getWardStats(ward)
    }))
  ];

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadBeds} />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Bed Management</h2>
        <p className="text-gray-600">Monitor bed availability and patient assignments</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Beds</p>
              <p className="text-2xl font-bold text-gray-900">{beds.length}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-secondary/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🏥</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Available</p>
              <p className="text-2xl font-bold text-success">
                {beds.filter(b => b.status === "Available").length}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-success/10 to-accent/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Occupied</p>
              <p className="text-2xl font-bold text-error">
                {beds.filter(b => b.status === "Occupied").length}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-error/10 to-red-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">👤</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Occupancy Rate</p>
              <p className="text-2xl font-bold text-primary">
{beds.length ? Math.round((beds.filter(b => b.status_c === "Occupied").length / beds.length) * 100) : 0}%
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-info/10 to-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {wardOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setSelectedWard(option.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              selectedWard === option.value
                ? "bg-gradient-to-r from-primary to-secondary text-white shadow-md"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            {option.label}
            <div className="ml-2 inline-flex space-x-1">
              <Badge variant="available" className="text-xs">
                {option.stats.available}
              </Badge>
              <Badge variant="occupied" className="text-xs">
                {option.stats.occupied}
              </Badge>
            </div>
          </button>
        ))}
      </div>

      {filteredBeds.length === 0 ? (
        <Empty
          title="No beds found"
          description="No beds available in the selected ward."
          icon="Bed"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBeds.map((bed) => (
            <BedCard
              key={bed.Id}
              bed={bed}
              onClick={(bed) => console.log("Bed clicked:", bed)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BedManagement;