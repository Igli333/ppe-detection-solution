# PPE Detection Solution
## EDISS Winter School 2025
### Team 2: Abu Saleh, Ammara Asif, Igli Balla, Mete Harun, Urina Lama, Alejandro Cedillo

### Background
Ensuring workplace safety is a critical concern in industrial environments such as warehouses, factories, and construction sites. Compliance with Personal Protective Equipment (PPE) regulations is essential to minimize workplace hazards and protect employees. However, manual monitoring for PPE compliance is inefficient, error-prone, and resource-intensive.

### Problem Definition
Current safety monitoring systems rely heavily on human supervision, which can lead to inconsistencies in PPE compliance enforcement. A scalable, automated solution is required to ensure real-time detection of essential PPE items such as helmets, safety goggles, vests, hairnets, and earplugs.

### Objective
To develop an AI-driven system utilizing computer vision and deep learning to detect and verify the presence of PPE in real time. The system should be capable of accurately identifying different types of PPE, ensuring compliance with safety protocols across various environments.

#### Our solution for the problem is to use a microservice architecture to create a pipeline for video frame analysing and PPE detection in real-time of video frames feed from edge cameras into a Kafka Cluster. This project leverages a YOLO-based object detection model to identify PPE in live video feeds.
![Architecture](https://github.com/Igli333/ppe-detection-solution/blob/main/architecture.png)

The UI built-in ReactJS offers live streaming, notifications, and statistics.
![Dashboard](https://github.com/Igli333/ppe-detection-solution/blob/main/Dashboard.png)
![Streaming](https://github.com/Igli333/ppe-detection-solution/blob/main/CameraView.png)
![Statistics](https://github.com/Igli333/ppe-detection-solution/blob/main/Statistics.png)
