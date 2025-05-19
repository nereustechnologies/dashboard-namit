// "use client"

// import { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import { Progress } from "@/components/ui/progress"
// import { Badge } from "@/components/ui/badge"
// import { Battery, Bluetooth, CheckCircle, AlertCircle, Info } from "lucide-react"
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// // These are the UUIDs from your Python backend
// const SERVICE_UUID = "19b10000-e8f2-537e-4f6c-d104768a1214"
// const CHARACTERISTIC_UUID = "19b10001-e8f2-537e-4f6c-d104768a1214"

// interface SensorConnectProps {
//   onConnect: (connections: any) => void
//   customerData: any
// }

// export default function SensorConnect({ onConnect, customerData }: SensorConnectProps) {
//   const [connecting, setConnecting] = useState(false)
//   const [connected, setConnected] = useState(false)
//   const [progress, setProgress] = useState(0)
//   const [bluetoothSupported, setBluetoothSupported] = useState(true)
//   const [sensors, setSensors] = useState([
//     { id: "LL", name: "Left Lower", battery: 0, connected: false, device: null, characteristic: null },
//     { id: "LU", name: "Left Upper", battery: 0, connected: false, device: null, characteristic: null },
//     { id: "RL", name: "Right Lower", battery: 0, connected: false, device: null, characteristic: null },
//     { id: "RU", name: "Right Upper", battery: 0, connected: false, device: null, characteristic: null },
//   ])

//   useEffect(() => {
//     // Check if Web Bluetooth is supported
//     if (!navigator.bluetooth) {
//       setBluetoothSupported(false)
//     }
//   }, [])

//   const handleConnect = async () => {
//     if (!navigator.bluetooth) {
//       alert("Web Bluetooth is not supported in your browser. Try using Chrome or Edge.")
//       return
//     }

//     setConnecting(true)
//     setProgress(10)

//     try {
//       // Request device with the filter for ArduinoIMU
//       const device = await navigator.bluetooth.requestDevice({
//         filters: [{ name: 'ArduinoIMU' }],
//         optionalServices: [SERVICE_UUID]
//       })
      
//       setProgress(30)
      
//       // Connect to GATT server
//       const server = await device.gatt?.connect()
//       setProgress(50)
      
//       // Get the IMU service
//       const service = await server?.getPrimaryService(SERVICE_UUID)
//       setProgress(70)
      
//       // Get the characteristic
//       const characteristic = await service?.getCharacteristic(CHARACTERISTIC_UUID)
//       setProgress(90)

//       // Assign this device to a sensor position
//       const firstUnconnected = sensors.findIndex(s => !s.connected)
//       if (firstUnconnected >= 0) {
//         const updatedSensors = [...sensors]
//         updatedSensors[firstUnconnected] = {
//           ...updatedSensors[firstUnconnected],
//           connected: true,
//           device: device,
//           characteristic: characteristic,
//           battery: Math.floor(Math.random() * 30) + 70 // Mock battery level for now
//         }
//         setSensors(updatedSensors)
//       }

//       // Check if all needed sensors are connected
//       const connectedCount = sensors.filter(s => s.connected).length + 1
      
//       setProgress(100)
      
//       // If at least one sensor is connected, allow proceeding
//       if (connectedCount > 0) {
//         setConnected(true)
//       }
      
//       // Setup disconnect listener
//       device.addEventListener('gattserverdisconnected', () => {
//         // Find and update the disconnected sensor
//         const updatedSensors = sensors.map(s => 
//           s.device === device ? { ...s, connected: false, device: null, characteristic: null } : s
//         )
//         setSensors(updatedSensors)
        
//         // If no sensors are connected anymore, update the connected state
//         if (!updatedSensors.some(s => s.connected)) {
//           setConnected(false)
//         }
//       })

//     } catch (error) {
//       console.error('Bluetooth connection error:', error)
      
//       // If no devices were found or user cancelled, show mock sensors for testing
//       if (!sensors.some(s => s.connected)) {
//         mockSensors()
//       }
//     } finally {
//       setConnecting(false)
//     }
//   }

//   const mockSensors = () => {
//     // For testing when real devices aren't available
//     console.log("Using mock sensors")
    
//     // Create mock device and characteristic objects
//     const createMockDevice = (id: string) => {
//       return {
//         id,
//         gatt: {
//           connected: true
//         },
//         addEventListener: () => {}
//       };
//     };
    
//     const createMockCharacteristic = () => {
//       return {
//         readValue: async () => new DataView(new ArrayBuffer(8)),
//         writeValue: async () => {},
//         startNotifications: async () => {},
//         addEventListener: () => {}
//       };
//     };
    
//     setSensors([
//       { 
//         id: "LL", 
//         name: "Left Lower", 
//         battery: 85, 
//         connected: true, 
//         device: createMockDevice("LL"), 
//         characteristic: createMockCharacteristic() 
//       },
//       { 
//         id: "LU", 
//         name: "Left Upper", 
//         battery: 92, 
//         connected: true, 
//         device: createMockDevice("LU"), 
//         characteristic: createMockCharacteristic() 
//       },
//       { 
//         id: "RL", 
//         name: "Right Lower", 
//         battery: 78, 
//         connected: true, 
//         device: createMockDevice("RL"), 
//         characteristic: createMockCharacteristic() 
//       },
//       { 
//         id: "RU", 
//         name: "Right Upper", 
//         battery: 88, 
//         connected: true, 
//         device: createMockDevice("RU"), 
//         characteristic: createMockCharacteristic() 
//       },
//     ])
//     setConnected(true)
//   }

//   const getBatteryIcon = (level: number) => {
//     if (level >= 80) return <Battery size={16} className="text-green-500" />
//     if (level >= 40) return <Battery size={16} className="text-yellow-500" />
//     return <Battery size={16} className="text-red-500" />
//   }

//   const handleProceed = () => {
//     // Create sensor connection object from the sensors array
//     const connections = {
//       leftLower: sensors.find(s => s.id === "LL")?.connected ? {
//         device: sensors.find(s => s.id === "LL")?.device,
//         characteristic: sensors.find(s => s.id === "LL")?.characteristic
//       } : null,
//       leftUpper: sensors.find(s => s.id === "LU")?.connected ? {
//         device: sensors.find(s => s.id === "LU")?.device,
//         characteristic: sensors.find(s => s.id === "LU")?.characteristic
//       } : null,
//       rightLower: sensors.find(s => s.id === "RL")?.connected ? {
//         device: sensors.find(s => s.id === "RL")?.device,
//         characteristic: sensors.find(s => s.id === "RL")?.characteristic
//       } : null,
//       rightUpper: sensors.find(s => s.id === "RU")?.connected ? {
//         device: sensors.find(s => s.id === "RU")?.device,
//         characteristic: sensors.find(s => s.id === "RU")?.characteristic
//       } : null
//     };
    
//     onConnect(connections);
//   }

//   return (
//     <div className="space-y-6">
//       <div className="space-y-2">
//         <h3 className="text-lg font-medium flex items-center gap-2">
//           <Bluetooth size={20} className="text-primary" />
//           Connect IMU Sensors
//         </h3>
//         <p className="text-sm text-gray-400">
//           Please connect the IMU sensors to the customer. Make sure all four sensors are properly attached.
//         </p>
//       </div>

//       {!bluetoothSupported && (
//         <Alert variant="destructive">
//           <Info className="h-4 w-4" />
//           <AlertTitle>Web Bluetooth not supported</AlertTitle>
//           <AlertDescription>
//             Your browser doesn't support Web Bluetooth. Please use Chrome, Edge or Opera.
//             Mock sensors will be used instead.
//           </AlertDescription>
//         </Alert>
//       )}

//       <div className="grid grid-cols-2 gap-4">
//         {sensors.map((sensor) => (
//           <Card
//             key={sensor.id}
//             className={`border ${sensor.connected ? "border-green-500" : "border-gray-700"} bg-secondary`}
//           >
//             <CardContent className="p-4">
//               <div className="flex items-center justify-between mb-2">
//                 <span className="font-medium">{sensor.name}</span>
//                 <Badge
//                   variant={sensor.connected ? "default" : "outline"}
//                   className={sensor.connected ? "bg-green-500" : ""}
//                 >
//                   {sensor.connected ? (
//                     <span className="flex items-center gap-1">
//                       <CheckCircle size={12} />
//                       Connected
//                     </span>
//                   ) : (
//                     <span className="flex items-center gap-1">
//                       <AlertCircle size={12} />
//                       Disconnected
//                     </span>
//                   )}
//                 </Badge>
//               </div>
//               {sensor.connected && (
//                 <div className="flex items-center space-x-2">
//                   <span className="text-sm flex items-center gap-1">
//                     {getBatteryIcon(sensor.battery)}
//                     Battery:
//                   </span>
//                   <Progress value={sensor.battery} className="h-2" />
//                   <span className="text-sm">{sensor.battery}%</span>
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       {connecting && (
//         <div className="space-y-2">
//           <div className="flex items-center justify-between">
//             <span>Connecting to sensors...</span>
//             <span>{progress}%</span>
//           </div>
//           <Progress value={progress} className="h-2" />
//         </div>
//       )}

//       <div className="flex justify-between">
//         <Button variant="outline" onClick={() => window.history.back()} className="border-gray-700">
//           Back
//         </Button>

//         {!connected ? (
//           <Button onClick={handleConnect} disabled={connecting} className="bg-primary text-black hover:bg-primary/90">
//             {connecting ? "Connecting..." : "Connect to Sensors"}
//           </Button>
//         ) : (
//           <Button onClick={handleProceed} className="bg-primary text-black hover:bg-primary/90">
//             Next: Start Testing
//           </Button>
//         )}
//       </div>
//     </div>
//   )
// }

"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import CustomerForm from "@/components/customer-form"
import SensorConnect from "@/components/sensor-connect"
import TestExercises from "@/components/test-exercises"
import TestRating from "@/components/test-rating"
import { ClipboardList, Bluetooth, Dumbbell, Star } from "lucide-react"

export default function NewTest() {
  const [step, setStep] = useState(1)
  const [customerData, setCustomerData] = useState<any>(null)
  const [sensorConnected, setSensorConnected] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [testData, setTestData] = useState<any>({
    exercises: [],
    ratings: {},
  })

  const handleCustomerSubmit = (data: any) => {
    setCustomerData(data)
    setStep(2)
  }

  const handleSensorConnect = () => {
    setSensorConnected(true)
    setStep(3)
  }

  const handleTestComplete = (exerciseData: any, zipFileId: string) => {
    setTestData((prev) => ({
      ...prev,
      exercises: exerciseData,
      zipFileId: zipFileId,
    }))
    setTestCompleted(true)
    setStep(4)
  }

  const handleRatingSubmit = async (ratings: any) => {
    setTestData((prev) => ({
      ...prev,
      ratings,
    }))

    try {
      // Get token from localStorage
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Authentication required")
      }

      // Send test data to API
      const response = await fetch("/api/tests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          customerId: customerData.id,
          exercises: Object.entries(testData.exercises).map(([id, data]: [string, any]) => ({
            name: id,
            category:
              id.includes("knee") || id.includes("lunge")
                ? "mobility"
                : id.includes("squat")
                  ? "strength"
                  : "endurance",
            completed: true,
            data: data,
          })),
          ratings,
          zipFileId: testData.zipFileId, // Add the zipFileId to link with the test
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to save test data")
      }

      // Reset the form
      alert("Test completed and data saved successfully!")
      setStep(1)
      setCustomerData(null)
      setSensorConnected(false)
      setTestCompleted(false)
      setTestData({
        exercises: [],
        ratings: {},
      })
    } catch (error) {
      console.error("Error saving test data:", error)
      alert(error instanceof Error ? error.message : "An error occurred while saving test data")
    }
  }

  return (
    <Card className="border-primary/20 bg-card">
      <CardHeader>
        <CardTitle className="text-xl text-primary">New Fitness Test</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className={`flex-1 border-t-2 ${step >= 1 ? "border-primary" : "border-gray-700"}`}></div>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? "bg-primary text-black" : "bg-gray-700"}`}
            >
              <ClipboardList size={18} />
            </div>
            <div className={`flex-1 border-t-2 ${step >= 2 ? "border-primary" : "border-gray-700"}`}></div>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? "bg-primary text-black" : "bg-gray-700"}`}
            >
              <Bluetooth size={18} />
            </div>
            <div className={`flex-1 border-t-2 ${step >= 3 ? "border-primary" : "border-gray-700"}`}></div>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 3 ? "bg-primary text-black" : "bg-gray-700"}`}
            >
              <Dumbbell size={18} />
            </div>
            <div className={`flex-1 border-t-2 ${step >= 4 ? "border-primary" : "border-gray-700"}`}></div>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 4 ? "bg-primary text-black" : "bg-gray-700"}`}
            >
              <Star size={18} />
            </div>
            <div className={`flex-1 border-t-2 ${step >= 4 ? "border-primary" : "border-gray-700"}`}></div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-400">
            <span>Customer Info</span>
            <span>Connect Sensor</span>
            <span>Test Exercises</span>
            <span>Rating</span>
          </div>
        </div>

        {step === 1 && <CustomerForm onSubmit={handleCustomerSubmit} />}

        {step === 2 && <SensorConnect onConnect={handleSensorConnect} customerData={customerData} />}

        {step === 3 && <TestExercises onComplete={handleTestComplete} customerData={customerData} />}

        {step === 4 && (
          <TestRating onSubmit={handleRatingSubmit} onBack={() => setStep(3)} customerData={customerData} />
        )}
      </CardContent>
    </Card>
  )
}
