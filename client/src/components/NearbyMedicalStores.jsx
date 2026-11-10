import { useEffect, useState } from "react";


function NearbyMedicalStores() {

    const [location, setLocation] =
        useState(null);


    useEffect(() => {

        navigator.geolocation.getCurrentPosition(

            (position) => {

                setLocation({

                    lat: position.coords.latitude,

                    lng: position.coords.longitude

                });

            },

            (error) => {

                console.log(error);

            }

        );

    }, []);


    return (

        <div className="max-w-5xl mx-auto mt-10 bg-white shadow-2xl rounded-3xl p-6 md:p-10 border border-slate-200">

            <h1 className="text-4xl font-bold text-blue-700 mb-4">
                📍 Nearby Medical Stores
            </h1>

            <p className="text-gray-600 mb-6">
                Find nearby pharmacies, hospitals,
                and clinics near your location.
            </p>


            {
                location ? (

                    <iframe

                        title="Nearby Medical Stores"

                        width="100%"

                        height="500"

                        className="rounded-3xl"

                        loading="lazy"

                        allowFullScreen

                        src={`https://www.google.com/maps?q=pharmacy+hospitals+clinics+near+${location.lat},${location.lng}&output=embed`}

                    />

                ) : (

                    <div className="bg-slate-100 p-6 rounded-2xl text-center">

                        Getting your location...

                    </div>

                )
            }

        </div>

    );

}


export default NearbyMedicalStores;