import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedBackground from "../components/AnimatedBackground";
import axios from "axios";

function Assessment({ user }) {
    const location = useLocation();
    const { subject } = location.state || { subject: "General" };
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [userAnswers, setUserAnswers] = useState([]);
    const [score, setScore] = useState(0);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0); 
    const navigate = useNavigate();
    const questionsFetched = useRef(false);
    const [timeLeft, setTimeLeft] = useState(120); // 2 minutes for each question

    async function fetchQuestions() {
        try {
            // Updated to fetch questions by subject
            const response = await axios.get(`/api/questions?subject=${encodeURIComponent(subject)}`);
            console.log(`Questions for ${subject} fetched successfully`);
            if (Array.isArray(response.data)) {
                setQuestions(response.data);
                setLoading(false);
                setProgress(100);
            } else {
                console.error("Invalid questions format:", response.data);
                // Fallback to mock data if API fails
                const mockQuestions = generateMockQuestions(subject);
                setQuestions(mockQuestions);
                setLoading(false);
                setProgress(100);
            }
        } catch (error) {
            console.error("Error fetching questions:", error);
            // Fallback to mock data
            const mockQuestions = generateMockQuestions(subject);
            setQuestions(mockQuestions);
            setLoading(false);
            setProgress(100);
        }
    }

    // Generate mock questions based on the subject
    function generateMockQuestions(subject) {
        let questions = [];
        
        if (subject === "Mechanical Engineering") {
            questions = [
                {
                    question: "What is the primary function of a heat exchanger?",
                    options: ["To convert mechanical energy to heat", "To transfer heat between two or more fluids", "To increase fluid pressure", "To reduce fluid velocity"],
                    correctAnswer: "To transfer heat between two or more fluids",
                    explanation: "In mechanical engineering, heat exchangers are specialized devices designed to efficiently transfer heat between two or more fluids without allowing them to mix. They operate on the principle of thermal conduction and convection, allowing heat transfer across a solid surface that separates the fluids. This is fundamental to many thermal systems including HVAC, power generation, and chemical processing. The other options describe functions of different mechanical components - energy converters, pumps, and flow restrictors respectively.",
                    difficulty: "medium"
                },
                {
                    question: "Which law of thermodynamics states that energy cannot be created or destroyed?",
                    options: ["Zeroth Law", "First Law", "Second Law", "Third Law"],
                    correctAnswer: "First Law",
                    explanation: "In thermodynamics, the First Law states that energy cannot be created or destroyed, only converted from one form to another. This is also known as the law of conservation of energy. The Zeroth Law deals with thermal equilibrium, the Second Law concerns entropy and the direction of processes, and the Third Law relates to the behavior of systems as they approach absolute zero temperature. Understanding these fundamental laws is critical for analyzing any thermal or energy system in mechanical engineering.",
                    difficulty: "medium"
                },
                {
                    question: "What does the term 'factor of safety' refer to in mechanical design?",
                    options: ["The ratio of ultimate stress to working stress", "The margin against failure", "The efficiency of a machine", "The operational lifetime of a component"],
                    correctAnswer: "The ratio of ultimate stress to working stress",
                    explanation: "In mechanical design, the factor of safety is calculated as the ratio of the ultimate stress (maximum stress a material can withstand) to the working stress (stress the material experiences during normal operation). This ratio provides engineers with a margin of safety to account for uncertainties in material properties, manufacturing variations, unpredicted loading conditions, and other factors that could affect performance. It's a critical parameter in ensuring structures and components don't fail under expected operating conditions.",
                    difficulty: "medium"
                },
                {
                    question: "Which material property describes the ability to deform plastically without fracture?",
                    options: ["Elasticity", "Ductility", "Hardness", "Toughness"],
                    correctAnswer: "Ductility",
                    explanation: "Ductility is the mechanical property that specifically describes a material's ability to deform plastically (permanently) without fracturing. Highly ductile materials like copper or aluminum can be drawn into wires or formed into complex shapes. Elasticity refers to the ability to return to original shape after deformation, hardness measures resistance to indentation or scratching, and toughness refers to a material's ability to absorb energy before fracturing. Each of these properties is important in selecting materials for mechanical applications.",
                    difficulty: "medium"
                },
                {
                    question: "What is the purpose of a flywheel in a mechanical system?",
                    options: ["To reduce friction", "To increase power", "To store rotational energy", "To change direction of motion"],
                    correctAnswer: "To store rotational energy",
                    explanation: "In mechanical engineering, a flywheel is designed to store rotational energy by maintaining angular momentum. This stored energy helps smooth out energy fluctuations in systems with intermittent power sources or loads. The high moment of inertia of the flywheel allows it to resist changes in rotational speed, thereby reducing torque fluctuations and providing more consistent operation. Flywheels are commonly used in engines, punching machines, and other applications requiring energy storage and smoothing.",
                    difficulty: "medium"
                }
            ];
        } else if (subject === "Electrical Engineering") {
            questions = [
                {
                    question: "Ohm's Law states the relationship between which quantities?",
                    options: ["Current, voltage, and resistance", "Force, mass, and acceleration", "Energy, power, and time", "Distance, velocity, and time"],
                    correctAnswer: "Current, voltage, and resistance",
                    explanation: "Ohm's Law is a fundamental principle in electrical engineering that describes the relationship between current (I), voltage (V), and resistance (R) in an electrical circuit. The law states that current through a conductor is directly proportional to voltage and inversely proportional to resistance (I = V/R). This relationship forms the basis for circuit analysis and design. The other options describe relationships in mechanics (Newton's Second Law), physics, and kinematics, not electrical engineering.",
                    difficulty: "medium"
                },
                {
                    question: "What is the unit of electrical capacitance?",
                    options: ["Ohm", "Farad", "Henry", "Tesla"],
                    correctAnswer: "Farad",
                    explanation: "In electrical engineering, capacitance is measured in farads (F), named after physicist Michael Faraday. A capacitor with a capacitance of one farad will store one coulomb of charge when a potential difference of one volt is applied across its terminals. Ohm is the unit of electrical resistance, henry is the unit of inductance, and tesla is the unit of magnetic flux density. Understanding these units is essential for working with electronic components and circuit design.",
                    difficulty: "medium"
                },
                {
                    question: "Which semiconductor device is used as a voltage regulator?",
                    options: ["Transistor", "Zener diode", "LED", "Photodiode"],
                    correctAnswer: "Zener diode",
                    explanation: "A Zener diode is specifically designed to operate in the reverse breakdown region without being damaged, making it ideal for voltage regulation applications. When connected in reverse bias and operated at its breakdown voltage, it maintains a nearly constant voltage across its terminals despite variations in current. This property allows it to stabilize voltage in circuits. Transistors are used for amplification and switching, LEDs for light emission, and photodiodes for light detection, but they are not inherently voltage regulators.",
                    difficulty: "medium"
                },
                {
                    question: "What does MOSFET stand for?",
                    options: ["Metal Oxide Silicon Field Effect Transistor", "Micro Ohm Silicon Ferrite Transistor", "Metal Oxide Semiconductor Field Effect Transistor", "Multiple Output Silicon Field Emission Transistor"],
                    correctAnswer: "Metal Oxide Semiconductor Field Effect Transistor",
                    explanation: "MOSFET stands for Metal Oxide Semiconductor Field Effect Transistor, which is a type of field-effect transistor that uses an insulated gate to create an electric field that controls the conductivity of a channel. MOSFETs are the most common transistors in digital and analog circuits, forming the basic building blocks of modern electronics. Their high input impedance, fast switching capabilities, and low power consumption make them essential components in integrated circuits and power applications.",
                    difficulty: "medium"
                },
                {
                    question: "In a three-phase power system, what is the phase angle difference between consecutive phases?",
                    options: ["90 degrees", "120 degrees", "180 degrees", "360 degrees"],
                    correctAnswer: "120 degrees",
                    explanation: "In a three-phase power system, the three phases are separated by 120 degrees (or 2π/3 radians) from each other. This balanced configuration allows for efficient power transmission with consistent power delivery. The 120-degree separation results in the sum of instantaneous voltages always equaling zero in a balanced system. Three-phase systems are widely used in power generation, transmission, and industrial applications because they provide more consistent power and are more efficient than single-phase systems.",
                    difficulty: "medium"
                }
            ];
        } else if (subject === "Civil Engineering") {
            questions = [
                {
                    question: "What is the primary purpose of a retaining wall?",
                    options: ["To prevent soil erosion", "To resist lateral pressure of soil", "To support the roof", "To divide rooms"],
                    correctAnswer: "To resist lateral pressure of soil",
                    explanation: "In civil engineering, retaining walls are structures designed specifically to resist the lateral (horizontal) pressure of soil, preventing it from sliding or collapsing when there is a change in elevation. They provide lateral support to vertical slopes of soil that would otherwise collapse into a more natural shape. While retaining walls may incidentally help prevent erosion, this is not their primary purpose. Supporting roofs and dividing rooms are functions of different structural elements in buildings.",
                    difficulty: "medium"
                },
                {
                    question: "Which concrete mix ratio (cement:sand:aggregate) is commonly used for structural elements?",
                    options: ["1:2:4", "1:1:1", "2:3:6", "1:4:8"],
                    correctAnswer: "1:2:4",
                    explanation: "In civil engineering practice, a concrete mix ratio of 1:2:4 (cement:sand:coarse aggregate) is commonly used for structural elements like beams, columns, and slabs. This ratio provides a good balance of strength, workability, and economy for general structural applications. The 1:1:1 ratio would have excess cement making it costly and potentially prone to shrinkage cracks, 2:3:6 has less cement and is used for less critical applications, and 1:4:8 is a lean mix used primarily for non-structural applications like leveling courses.",
                    difficulty: "medium"
                },
                {
                    question: "What is the function of a column in a building structure?",
                    options: ["To transfer horizontal loads", "To transfer vertical loads", "To provide aesthetic value", "To insulate the building"],
                    correctAnswer: "To transfer vertical loads",
                    explanation: "In structural engineering, columns are vertical structural elements designed primarily to transfer vertical loads (compressive forces) from the upper levels of a structure down to the foundation. They are critical load-bearing elements in the structural system. While columns may resist some horizontal loads as part of a frame system, this is not their primary function. Beams typically handle horizontal loads, while insulation and aesthetics are secondary considerations in structural design.",
                    difficulty: "medium"
                },
                {
                    question: "Which of the following is NOT a type of foundation?",
                    options: ["Raft foundation", "Pile foundation", "Beam foundation", "Strip foundation"],
                    correctAnswer: "Beam foundation",
                    explanation: "In civil engineering, 'Beam foundation' is not a recognized type of foundation system. Foundations are typically classified as shallow (spread/strip, raft) or deep (pile, caisson) foundations. Strip foundations support walls, raft (or mat) foundations distribute loads over a large area, and pile foundations transfer loads to deeper, stronger soil or rock strata. While beams are structural elements that may be part of a foundation system (such as in grade beams), 'beam foundation' itself is not a standard foundation type.",
                    difficulty: "medium"
                },
                {
                    question: "What does the slump test measure in concrete?",
                    options: ["Strength", "Workability", "Durability", "Density"],
                    correctAnswer: "Workability",
                    explanation: "In concrete testing, the slump test specifically measures the workability or consistency of fresh concrete. It indicates how easily concrete flows and can be placed and compacted. The test involves filling a cone with concrete, removing the cone, and measuring how much the concrete 'slumps' or settles. A higher slump indicates more flowable concrete. Strength is typically measured by compression tests on hardened specimens, durability through various specialized tests, and density by weight-volume relationships.",
                    difficulty: "medium"
                }
            ];
        } else if (subject === "Computer Engineering") {
            questions = [
                {
                    question: "What is the purpose of a cache memory in a computer system?",
                    options: ["To store the operating system", "To speed up data access", "To increase storage capacity", "To protect against data loss"],
                    correctAnswer: "To speed up data access",
                    explanation: "In computer engineering, cache memory serves as a high-speed buffer between the CPU and main memory. Its primary purpose is to speed up data access by storing frequently accessed data and instructions closer to the processor, reducing the time penalty associated with accessing slower main memory. Cache memory operates on the principle of locality (temporal and spatial), keeping recently used and nearby data available for quick access. Operating systems are stored in main memory and persistent storage, not cache; increasing storage capacity is the role of main memory and disk storage; and data protection is handled by backup systems and redundancy mechanisms.",
                    difficulty: "medium"
                },
                {
                    question: "What does CISC stand for in processor architecture?",
                    options: ["Complex Instruction Set Computing", "Complete Integrated System Chip", "Computer Instruction System Code", "Critical Instruction System Controller"],
                    correctAnswer: "Complex Instruction Set Computing",
                    explanation: "CISC stands for Complex Instruction Set Computing, which is a processor design philosophy featuring a large number of specialized instructions, many of which can execute several low-level operations in a single instruction. CISC architectures (like x86) typically have variable-length instructions and emphasize hardware complexity to support a rich instruction set. This contrasts with RISC (Reduced Instruction Set Computing) architectures, which feature simpler, fixed-length instructions and push complexity to the compiler. Understanding these architectural approaches is fundamental to computer engineering and processor design.",
                    difficulty: "medium"
                },
                {
                    question: "Which logic gate outputs TRUE only when all inputs are TRUE?",
                    options: ["OR gate", "AND gate", "XOR gate", "NOR gate"],
                    correctAnswer: "AND gate",
                    explanation: "In digital logic, the AND gate is the only basic logic gate that outputs TRUE (or logical 1) exclusively when all of its inputs are TRUE. This implements the logical conjunction operation, representing the behavior of the 'and' operator in Boolean algebra. The OR gate outputs TRUE if any input is TRUE, the XOR (exclusive OR) gate outputs TRUE when an odd number of inputs are TRUE, and the NOR gate outputs TRUE only when all inputs are FALSE. Understanding these basic gates is essential for designing digital circuits and systems.",
                    difficulty: "medium"
                },
                {
                    question: "In computer networking, what does MAC stand for?",
                    options: ["Machine Access Control", "Multiple Access Control", "Media Access Control", "Memory Access Controller"],
                    correctAnswer: "Media Access Control",
                    explanation: "In computer networking, MAC stands for Media Access Control, which is a sublayer of the Data Link Layer (Layer 2) in the OSI model. The MAC address is a unique identifier assigned to network interfaces for communications on a physical network segment. MAC protocols determine how devices gain access to the transmission medium and permission to transmit data. Ethernet, Wi-Fi, and other networking technologies all implement MAC protocols to manage access to the shared communication medium and avoid collisions.",
                    difficulty: "medium"
                },
                {
                    question: "Which of the following is a volatile memory?",
                    options: ["ROM", "Hard Disk", "RAM", "Flash Drive"],
                    correctAnswer: "RAM",
                    explanation: "In computer systems, Random Access Memory (RAM) is volatile memory, meaning it loses its stored information when power is removed. RAM is used as the working memory of a computer, storing currently executing programs and data that the CPU needs for active operations. In contrast, ROM (Read-Only Memory), Hard Disks, and Flash Drives are all non-volatile storage technologies that retain their data even when powered off. Understanding the characteristics of different memory types is crucial for computer system design and optimization.",
                    difficulty: "medium"
                }
            ];
        } else {
            // Default questions for other engineering subjects
            questions = [
                {
                    question: `In ${subject}, what is the SI unit of force?`,
                    options: ["Watt", "Newton", "Pascal", "Joule"],
                    correctAnswer: "Newton",
                    explanation: `The newton (N) is the SI unit of force, defined as the force needed to accelerate a mass of one kilogram at a rate of one meter per second squared. This is a fundamental unit in ${subject} and all engineering disciplines for calculating and measuring forces in systems. Watts measure power (energy per unit time), pascals measure pressure (force per unit area), and joules measure energy or work (force multiplied by distance). Understanding these basic units is essential for engineering calculations and analysis.`,
                    difficulty: "medium"
                },
                {
                    question: `Which principle is fundamental to most ${subject} applications?`,
                    options: ["Conservation of Energy", "Quantum Theory", "Evolution", "Plate Tectonics"],
                    correctAnswer: "Conservation of Energy",
                    explanation: `The principle of Conservation of Energy is fundamental to virtually all engineering disciplines, including ${subject}. This principle states that energy cannot be created or destroyed, only converted from one form to another. It forms the basis for analyzing systems, designing efficient processes, and understanding energy transfers in engineering applications. Quantum Theory is primarily relevant to physics and certain specialized engineering fields, while Evolution and Plate Tectonics are concepts from biology and geology respectively, not engineering fundamentals.`,
                    difficulty: "medium"
                },
                {
                    question: `What does CAD stand for in ${subject}?`,
                    options: ["Computer Aided Design", "Computer Assisted Drawing", "Computer Automatic Design", "Calculated Automated Drafting"],
                    correctAnswer: "Computer Aided Design",
                    explanation: `CAD stands for Computer Aided Design, which refers to the use of computer software to create, modify, analyze, and optimize engineering designs. In ${subject}, as in other engineering disciplines, CAD tools enable engineers to create precise digital models, perform simulations, and generate technical documentation. These tools enhance productivity, improve design accuracy, and facilitate collaboration. The other options are not standard terminology in engineering practice.`,
                    difficulty: "medium"
                },
                {
                    question: `Which material is commonly used in ${subject} for its high strength-to-weight ratio?`,
                    options: ["Steel", "Aluminum", "Titanium", "Copper"],
                    correctAnswer: "Titanium",
                    explanation: `Titanium is renowned in engineering for its exceptional strength-to-weight ratio, making it particularly valuable in applications where weight reduction is critical while maintaining structural integrity. Despite being more expensive than many other metals, titanium's combination of strength, light weight, and corrosion resistance makes it ideal for aerospace, medical, marine, and high-performance applications in ${subject}. While steel is stronger, aluminum lighter, and copper better for electrical conductivity, titanium offers the best balance of strength and weight.`,
                    difficulty: "medium"
                },
                {
                    question: `What is the primary goal of ${subject}?`,
                    options: ["Solve complex problems using scientific principles", "Maximize profit for corporations", "Reduce computational complexity", "Automate all manual processes"],
                    correctAnswer: "Solve complex problems using scientific principles",
                    explanation: `The primary goal of ${subject}, like all engineering disciplines, is to solve complex real-world problems by applying scientific principles, mathematical methods, and empirical knowledge. Engineers design, develop, and implement solutions that address human needs, improve quality of life, and advance technology. While economic considerations (like profitability) are important in engineering practice, and techniques like computational optimization and automation are tools used by engineers, they are means to the end goal of problem-solving, not the primary purpose of the discipline itself.`,
                    difficulty: "medium"
                }
            ];
        }
        
        return questions;
    }

    useEffect(() => {
        if (!questionsFetched.current) {
            questionsFetched.current = true;
            console.log(`Questions for ${subject} not fetched yet, fetching...`);
            fetchQuestions();
        }
    }, [subject]);

    useEffect(() => {
        if (userAnswers.length === questions.length && questions.length > 0) {
            console.log("All questions answered, calculating score");
            const newScore = userAnswers.reduce((acc, answer, index) => {
                return answer === questions[index].correctAnswer ? acc + 1 : acc;
            }, 0);
            setScore(newScore);
            console.log("Score calculated:", newScore);
            
            // Include explanations in detailed results
            const detailedResults = questions.map((question, index) => ({
                question: question.question,
                options: question.options,
                userAnswer: userAnswers[index],
                correctAnswer: question.correctAnswer,
                isCorrect: userAnswers[index] === question.correctAnswer,
                explanation: question.explanation // Make sure to include the explanation
            }));
            
            navigate("/results", { 
                state: { 
                    score: newScore, 
                    totalQuestions: questions.length,
                    subject: subject,
                    detailedResults: detailedResults
                } 
            });
        }
    }, [userAnswers, questions, navigate, subject]);

    useEffect(() => {
        if (loading) {
            const interval = setInterval(() => {
                setProgress((prevProgress) => {
                    if (prevProgress < 99) {
                        return prevProgress + 1;
                    } else {
                        clearInterval(interval);
                        return prevProgress;
                    }
                });
            }, 25);
            return () => clearInterval(interval);
        }
    }, [loading]);

    useEffect(() => {
        const currentQuestionData = questions[currentQuestion];
        const difficulty = currentQuestionData?.difficulty || "medium";

        // Set timer based on difficulty
        const timeForDifficulty = {
            easy: 20,
            medium: 30,
            hard: 40
        };

        setTimeLeft(timeForDifficulty[difficulty]);

    }, [currentQuestion, questions]);

    useEffect(() => {
        if (timeLeft === 0) {
            handleNext(); // Move to next question if time runs out
        }

        const timer = setInterval(() => {
            setTimeLeft(prevTime => (prevTime > 0 ? prevTime - 1 : 0));
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    useEffect(() => {
        setTimeLeft(120); // Reset timer for each new question
    }, [currentQuestion]);

    const handleAnswer = (answer) => {
        console.log("Answer selected:", answer);
        setUserAnswers(prevAnswers => [...prevAnswers, answer]);
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
            console.log("Moving to next question:", currentQuestion + 1);
        }
        setTimeLeft(120); // Reset timer when an answer is selected
    };

    const handleNext = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(prev => prev - 1);
        }
    };

    const handleSkip = () => {
        handleNext(); // Skip to the next question
    };

    const handleRevisit = () => {
        // Logic to mark question for review or revisit later
        // This could involve adding the question to a "revisit" list
    };

    const question = questions.length > 0 ? questions[currentQuestion] : null;

    return (
        <>
            <AnimatedBackground />
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="container mx-auto px-4 py-8"
            >
                {/* Header with back button */}
                <div className="flex justify-between items-center mb-6 mt-16 mx-12">
                    <h2 className="text-3xl font-bold text-white">{subject} Assessment</h2>
                    <button 
                        onClick={() => navigate('/dashboard')}
                        className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-full flex items-center transition-all duration-300"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Dashboard
                    </button>
                </div>
                
                {loading ? (
                    <div className="text-center text-white mt-10">
                        <p>Loading questions for {subject}...</p>
                        <div className="w-full bg-gray-200 rounded-full h-4 mt-4">
                            <div className="bg-indigo-600 h-4 rounded-full" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>
                ) : question && (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentQuestion}
                            initial={{ x: 300, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -300, opacity: 0 }}
                            className="bg-white p-6 rounded-xl shadow-lg"
                        >
                            <h3 className="text-xl font-semibold mb-4 text-indigo-400">
                                Question {currentQuestion + 1} of {questions.length}
                            </h3>
                            <p className="mb-4 text-lg text-indigo-600">{question?.question}</p>
                            
                            {/* Timer Display */}
                            <div className="text-right text-red-500 font-bold mb-4">
                                Time Left: {timeLeft}s
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {question?.options?.map((option, index) => (
                                    <motion.button
                                        key={index}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleAnswer(option)}
                                        className="bg-indigo-100 p-4 rounded-lg hover:bg-indigo-200 transition duration-300 text-indigo-800"
                                    >
                                        {option}
                                    </motion.button>
                                ))}
                            </div>

                            {/* Navigation Buttons */}
                            <div className="flex justify-between mt-6">
                                <button
                                    onClick={handlePrevious}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition duration-300"
                                    disabled={currentQuestion === 0}
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={handleNext}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition duration-300"
                                    disabled={currentQuestion === questions.length - 1}
                                >
                                    Next
                                </button>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                )}
            </motion.div>
        </>
    );
}

export default Assessment;
