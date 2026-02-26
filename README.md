🚀 HapticLink
Assistive Haptic Communication System for Blind and Deaf Individuals
📌 Project Overview

HapticLink is a smart assistive wearable ankle band that enables communication through vibration patterns.
It is designed specifically for blind and deaf individuals, helping them detect environmental hazards and sound alerts using haptic feedback.

The system combines:

ESP32 (BLE enabled)

Ultrasonic sensor

IR sensors (Left & Right)

Flame sensor

Vibration motors

Web-based real-time dashboard

🎯 Key Features

✅ Obstacle detection using ultrasonic sensor
✅ Directional IR detection (Left / Right)
✅ Fire detection using flame sensor
✅ Sound detection via web microphone input
✅ Smart vibration feedback patterns
✅ Real-time BLE monitoring dashboard
✅ Last trigger tracking system
✅ Event log history
✅ Fully responsive Bootstrap dashboard

🧠 System Architecture
🔹 Hardware (ESP32 Side)

Reads sensor data

Detects hazard conditions

Triggers vibration motors

Sends live data via BLE

Tracks last vibration trigger

Uses non-blocking timing with millis()

🔹 Web Dashboard

Connects via Web Bluetooth API

Displays:

Distance

Battery percentage

IR status

Flame detection

Last vibration trigger

Event history log

Sends sound-based alert command to ESP32

Fully responsive (Mobile / Tablet / Desktop)

🛠 Hardware Components
Component	Purpose
ESP32 Dev Module	Main controller with BLE
Ultrasonic Sensor	Distance measurement
IR Sensors (2)	Left & Right obstacle detection
Flame Sensor	Fire detection
Vibration Motors (2)	Haptic feedback
Transistor Driver Circuit	Safe motor control
Li-ion Battery / 5V Supply	Power source
📡 BLE Communication Format

ESP32 sends data in this format:

DIST:25.4,BAT:85,FLAME:1,IRL:1,IRR:0,TRIG:RIGHT
Data Fields:

DIST → Distance in cm

BAT → Battery %

FLAME → 0 = Fire detected

IRL → Left obstacle

IRR → Right obstacle

TRIG → Last vibration trigger

⚡ Vibration Logic
Condition	Duration
Fire Detected	5 sec
Distance ≤ 20 cm	5 sec
Left IR Trigger	2 sec
Right IR Trigger	2 sec
Sound Alert (Web)	3 sec

Non-blocking timing implemented using millis().

💻 Web Dashboard Tech Stack

HTML5

CSS3 (Glassmorphism + Neon Theme)

Bootstrap 5

JavaScript

Web Bluetooth API

Web Audio API

📱 Responsive Design

The dashboard automatically adapts to:

📱 Mobile devices

📲 Tablets

💻 Desktop screens

🔐 Safety Considerations

Motors must be driven using transistor or MOSFET

Shared ground between sensors and ESP32

Avoid direct motor connection to GPIO

Ensure correct voltage for sensors

🌍 Social Impact

HapticLink aims to:

Improve independent mobility

Enhance environmental awareness

Provide non-auditory communication

Promote inclusive wearable technology

🏆 Future Improvements

AI-based sound classification

Adjustable vibration intensity

GPS-based navigation alerts

Mobile app version

Cloud data logging

👨‍💻 Developed By

Team CR
HapticLink © 2026

If you want, I can also create:

📄 A project report (PDF format)

🎤 A 3-minute presentation script

🖼 A project poster

📊 A system architecture diagram

🏅 A competition pitch deck

Tell me what you need next 😎🔥
