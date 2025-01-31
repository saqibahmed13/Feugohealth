import React, { useEffect, useState } from 'react';
import excelData from '../assets/data.xlsx';
import readXlsxFile from 'read-excel-file';

const Excel = () => {
    const [rows, setRows] = useState([]);
    const [systems, setSystems] = useState([]);
    const [selectedSystem, setSelectedSystem] = useState('');
    const [selectedSharing, setSelectedSharing] = useState('');
    const [dimensions, setDimensions] = useState([]);
    const [selectedDimension, setSelectedDimension] = useState('');
    const [price, setPrice] = useState(null);

    async function fetchData() {
        try {
            const response = await fetch(excelData);
            const blob = await response.blob();
            const data = await readXlsxFile(blob, { sheet: 'DB2' });
            
            const headers = data[0]; // First row is the headers
            const systemsData = data.slice(1).map(row => ({
                systemName: row[0],
                sharingType: row[1],
                dimension: row[2],
                price: row[3]
            }));
            
            const uniqueSystems = Array.from(new Set(systemsData.map(row => row.systemName)));
            setSystems(uniqueSystems);
            setRows(systemsData);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (selectedSystem) {
            const filteredSharing = Array.from(
                new Set(rows.filter(row => row.systemName === selectedSystem).map(row => row.sharingType))
            );
            setSelectedSharing('');
            setDimensions([]);
            setSelectedDimension('');
            setPrice(null);
        }
    }, [selectedSystem]);

    useEffect(() => {
        if (selectedSystem && selectedSharing) {
            const filteredDimensions = rows
                .filter(row => row.systemName === selectedSystem && row.sharingType === selectedSharing)
                .map(row => row.dimension);
            
            setDimensions(filteredDimensions);
            setSelectedDimension('');
            setPrice(null);
            console.log("check",filteredDimensions)
            console.log("rows",rows)
            console.log("selectedSharing", selectedSharing,  selectedSystem)

        }
    }, [selectedSharing]);

    useEffect(() => {
        if (selectedSystem && selectedSharing && selectedDimension) {
            const selectedRow = rows.find(row =>
                row.systemName === selectedSystem &&
                row.sharingType === selectedSharing &&
                row.dimension === selectedDimension
            );
            setPrice(selectedRow ? selectedRow.price : null);
        }
    }, [selectedDimension]);

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Excel Data Viewer</h1>

            {/* System Dropdown */}
            <div className="mb-4">
                <label htmlFor="system-select" className="block mb-2">Select System:</label>
                <select
                    id="system-select"
                    value={selectedSystem}
                    onChange={(e) => setSelectedSystem(e.target.value)}
                    className="border rounded px-2 py-1 w-full"
                >
                    <option value="">-- Select System --</option>
                    {systems.map((system, index) => (
                        <option key={index} value={system}>{system}</option>
                    ))}
                </select>
            </div>

            {/* Sharing Type Dropdown */}
            {selectedSystem && (
                <div className="mb-4">
                    <label htmlFor="sharing-select" className="block mb-2">Select Sharing Type:</label>
                    <select
                        id="sharing-select"
                        value={selectedSharing}
                        onChange={(e) => setSelectedSharing(e.target.value)}
                        className="border rounded px-2 py-1 w-full"
                    >
                        <option value="">-- Select Sharing Type --</option>
                        <option value="Sharing">Sharing</option>
                        <option value="Non-Sharing">Non-Sharing</option>
                    </select>
                </div>
            )}

            {/* Dimension Dropdown */}
            {selectedSharing && (
                <div className="mb-4">
                    <label htmlFor="dimension-select" className="block mb-2">Select Dimension:</label>
                    <select
                        id="dimension-select"
                        value={selectedDimension}
                        onChange={(e) => setSelectedDimension(e.target.value)}
                        className="border rounded px-2 py-1 w-full"
                    >
                        <option value="">-- Select Dimension --</option>
                        {dimensions.map((dimension, index) => (
                            <option key={index} value={dimension}>{dimension}</option>
                        ))}
                    </select>
                </div>
            )}

            {/* Display Price */}
            {price !== null && (
                <div className="mt-4 p-4 border rounded bg-gray-100">
                    <p><strong>Price:</strong> {price}</p>
                </div>
            )}
        </div>
    );
};

export default Excel;