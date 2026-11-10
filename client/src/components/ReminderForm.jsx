import { useEffect, useState } from "react";

import API from "../api/axios";

import toast from "react-hot-toast";

import { motion } from "framer-motion";

import {
    FaBell,
    FaCheckCircle
} from "react-icons/fa";


function ReminderForm() {

    const [medicine, setMedicine] = useState("");

    const [time, setTime] = useState("");

    const [reminders, setReminders] = useState([]);

    const [notified, setNotified] = useState([]);


    // fetch reminders
    const fetchReminders = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await API.get(

                "/reminder",

                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }

            );

            setReminders(response.data.reminders);

        } catch (error) {

            console.log(error);

        }

    };


    // request notification permission
    const requestNotificationPermission =
        async () => {

        if ("Notification" in window) {

            await Notification.requestPermission();

        }

    };


    // initial load
    useEffect(() => {

        fetchReminders();

        requestNotificationPermission();

    }, []);


    // reminder notification checker
    useEffect(() => {

        const interval = setInterval(() => {

            const now = new Date();

            const currentTime =
                now.toTimeString().slice(0, 5);

            reminders.forEach((reminder) => {

                if (

                    reminder.time === currentTime &&

                    !notified.includes(
                        reminder._id
                    )

                ) {

                    // browser notification
                    new Notification(

                        "⏰ Medicine Reminder",

                        {
                            body:
                                `Time to take ${reminder.medicine}`
                        }

                    );

                    // toast notification
                    toast.success(

                        `Time to take ${reminder.medicine} 💊`

                    );

                    setNotified((prev) => [

                        ...prev,

                        reminder._id

                    ]);

                }

            });

        }, 60000);

        return () => clearInterval(interval);

    }, [reminders, notified]);


    // create reminder
    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const token =
                localStorage.getItem("token");

            await API.post(

                "/reminder",

                {
                    medicine,
                    time
                },

                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }

            );

            toast.success(
                "Reminder added successfully 😎"
            );

            setMedicine("");

            setTime("");

            fetchReminders();

        } catch (error) {

            console.log(error);

            toast.error(
                "Failed to add reminder ❌"
            );

        }

    };


    // delete reminder
    const handleDelete = async (id) => {

        try {

            const token =
                localStorage.getItem("token");

            await API.delete(

                `/reminder/${id}`,

                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }

            );

            toast.success(
                "Reminder completed ✅"
            );

            fetchReminders();

        } catch (error) {

            console.log(error);

            toast.error(
                "Failed to remove reminder ❌"
            );

        }

    };


    return (

        <div className="max-w-4xl mx-auto mt-10 bg-white shadow-2xl rounded-3xl p-6 md:p-10 border border-slate-200">


            {/* heading */}
            <motion.div

                initial={{ opacity: 0, y: -20 }}

                animate={{ opacity: 1, y: 0 }}

                className="text-center mb-8"

            >

                <h1 className="text-4xl font-bold text-blue-700 mb-3 flex justify-center items-center gap-3">

                    <FaBell />

                    Medicine Reminders

                </h1>

                <p className="text-gray-600 text-lg">
                    Stay on track with your medicine schedule.
                </p>

            </motion.div>


            {/* form */}
            <form

                onSubmit={handleSubmit}

                className="mb-10"

            >

                <input

                    type="text"

                    placeholder="Medicine Name"

                    value={medicine}

                    onChange={(e) =>
                        setMedicine(e.target.value)
                    }

                    className="w-full border p-4 rounded-2xl mb-4 outline-none focus:ring-2 focus:ring-blue-500"

                />


                <input

                    type="time"

                    value={time}

                    onChange={(e) =>
                        setTime(e.target.value)
                    }

                    className="w-full border p-4 rounded-2xl mb-4 outline-none focus:ring-2 focus:ring-blue-500"

                />


                <button

                    type="submit"

                    className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-4 rounded-2xl text-lg font-semibold"

                >
                    Add Reminder
                </button>

            </form>


            {/* reminder list */}
            <div>

                <h2 className="text-3xl font-bold mb-6 text-slate-800">
                    Your Reminders
                </h2>


                {
                    reminders.length === 0 ? (

                        <div className="bg-slate-100 p-6 rounded-2xl text-center text-gray-500">

                            No reminders added yet

                        </div>

                    ) : (

                        reminders.map((reminder) => (

                            <motion.div

                                key={reminder._id}

                                whileHover={{
                                    scale: 1.02
                                }}

                                className="bg-gradient-to-r from-blue-50 to-cyan-50 p-5 rounded-3xl mb-5 shadow-md border border-slate-200 flex flex-col md:flex-row md:justify-between md:items-center gap-4"

                            >

                                <div>

                                    <p className="text-xl font-bold text-blue-700 mb-2">
                                        💊 {reminder.medicine}
                                    </p>

                                    <p className="text-gray-700">
                                        <strong>
                                            Reminder Time:
                                        </strong>
                                        {" "}
                                        {reminder.time}
                                    </p>

                                </div>


                                <button

                                    onClick={() =>
                                        handleDelete(
                                            reminder._id
                                        )
                                    }

                                    className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 transition text-white px-5 py-3 rounded-2xl"

                                >

                                    <FaCheckCircle />

                                    Completed

                                </button>

                            </motion.div>

                        ))

                    )
                }

            </div>

        </div>

    );

}


export default ReminderForm;