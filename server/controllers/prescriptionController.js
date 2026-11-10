
const extractTextFromImage =
require("../services/ocrService");

const parsePrescription =
require("../services/medicineParser");

const generateSummary =
require("../services/aiSummaryService");

const analyzeMedicine =
require("../services/medicineAIService");

const Prescription =
require("../models/Prescription");


exports.uploadPrescription = async (req, res) => {

    try {

        // check image
        if (!req.file) {

            return res.status(400).json({

                success: false,
                message: "No prescription image uploaded"

            });

        }

        const imagePath = req.file.path;

        // OCR
        const extractedText =
            await extractTextFromImage(imagePath);

        console.log("OCR TEXT:", extractedText);

        // Parse medicines
        const parsedMedicines =
            parsePrescription(extractedText);

        console.log(
            "PARSED MEDICINES:",
            parsedMedicines
        );

        const analyzedMedicines = [];

        // AI Analysis
        for (const med of parsedMedicines) {

            try {

                const analysis =
                    await analyzeMedicine(
                        med.medicine
                    );

                console.log(
                    "AI ANALYSIS:",
                    analysis
                );

                analyzedMedicines.push({

                    medicine:
                        med.medicine || "Unknown",

                    frequency:
                        analysis?.frequency ||
                        "Not available",

                    purpose:
                        analysis?.purpose ||
                        "Not available",

                    reasonForUse:
                        analysis?.reasonForUse ||
                        "Not available",

                    sideEffects:
                        Array.isArray(
                            analysis?.sideEffects
                        )
                            ? analysis.sideEffects
                            : [],

                    precautions:
                        Array.isArray(
                            analysis?.precautions
                        )
                            ? analysis.precautions
                            : [],

                    guidance:
                        analysis?.guidance ||
                        "No guidance available",

                    disclaimer:
                        analysis?.disclaimer ||
                        "Consult doctor before taking medicines."

                });

            } catch (err) {

                console.log(
                    "AI ERROR:",
                    err.message
                );

                analyzedMedicines.push({

                    medicine:
                        med.medicine || "Unknown",

                    frequency:
                        "Not available",

                    purpose:
                        "Not available",

                    reasonForUse:
                        "Not available",

                    sideEffects: [],

                    precautions: [],

                    guidance:
                        "Please consult doctor.",

                    disclaimer:
                        "AI-generated information may be inaccurate."

                });

            }

        }

        // Summary
        const summary =
            generateSummary(
                analyzedMedicines
            );

        // Save DB
        const savedPrescription =
            await Prescription.create({

                user: req.user.id,

                image: imagePath,

                extractedText,

                parsedMedicines:
                    analyzedMedicines,

                summary

            });

        // FINAL RESPONSE
        return res.status(200).json({

            success: true,

            prescription: {

                _id:
                    savedPrescription._id,

                extractedText,

                parsedMedicines:
                    analyzedMedicines,

                summary

            }

        });

    } catch (error) {

        console.log(
            "UPLOAD ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Prescription analysis failed"

        });

    }

};


exports.getPrescriptionHistory =
async (req, res) => {

    try {

        const prescriptions =
            await Prescription.find({

                user: req.user.id

            }).sort({

                createdAt: -1

            });

        res.status(200).json({

            success: true,
            prescriptions

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,
            message: "Failed to fetch history"

        });

    }

};
