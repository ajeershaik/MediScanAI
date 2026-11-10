import { useState } from "react";

import API from "../api/axios";


function MedicineSearch() {

    const [medicine, setMedicine] =
        useState("");

    const [result, setResult] =
        useState(null);

    const [loading, setLoading] =
        useState(false);


    const handleSearch = async () => {

        if (!medicine) return;

        try {

            setLoading(true);

            const response =
                await API.post(
                    "/medicine/search",
                    { medicine }
                );

            setResult(response.data);

            setLoading(false);

        } catch (error) {

            console.log(error);

            setLoading(false);

        }

    };


    return (

        <div className="bg-white p-6 rounded-2xl shadow-lg">

            <h1 className="text-3xl font-bold mb-6 text-blue-600">

                Medicine Search

            </h1>


            <div className="flex gap-3">

                <input
                    type="text"
                    placeholder="Enter medicine name..."
                    value={medicine}
                    onChange={(e) =>
                        setMedicine(
                            e.target.value
                        )
                    }
                    className="flex-1 border p-3 rounded-xl"
                />


                <button
                    onClick={handleSearch}
                    className="bg-blue-600 text-white px-6 rounded-xl"
                >
                    Search
                </button>

            </div>


            {
                loading && (

                    <p className="mt-4">
                        AI analyzing medicine...
                    </p>

                )
            }


            {
                result && (

                    <div className="mt-6 bg-slate-100 p-5 rounded-xl">

                        <h2 className="text-2xl font-bold mb-4">

                            {result.medicine}

                        </h2>


                        <p>
                            <strong>Purpose:</strong>
                            {" "}
                            {result.purpose}
                        </p>

                        <p>
                            <strong>Reason:</strong>
                            {" "}
                            {result.reason}
                        </p>

                        <p>
                            <strong>Side Effects:</strong>
                            {" "}
                            {result.sideEffects?.join(", ")}
                        </p>

                        <p>
                            <strong>Precautions:</strong>
                            {" "}
                            {result.precautions?.join(", ")}
                        </p>

                        <p className="mt-4">
                            <strong>AI Guidance:</strong>
                            {" "}
                            {result.aiGuidance}
                        </p>

                    </div>

                )
            }

        </div>

    );

}


export default MedicineSearch;