# 🌿 FOODMEDS- Personalised Diet and Health Tracker

A full-stack health insights web application that computes BMI, **calorie needs**, **nutrient breakdown**, and **body composition** using manual logic and APIs  

Users can sign up, view personalized dashboards, chat with AI Assistant, get personalised diet plan, edit profiles, and explore modular UI pages — all backed by a clean React frontend and secure MongoDB storage.

---

## 🚀 Project Overview

This application gathers user inputs (age, gender, height, weight) and uses custom algorithms to calculate:

- Body Mass Index (BMI)  
- Body composition indicators.
- Daily calorie requirements.
- Personalised Diet Plan based on the user's health condition.

The objective is to build a self-contained health engine without third-party API dependency.

---

## 🧩 Features

### 🔹 Manual Computations
- BMI, calorie intake, and nutrient distribution calculated manually using JavaScript logic .

### 🔹 Authentication & User Data Input
- Sign-Up form with validations for user details.

### 🔹 Dynamic Dashboard
- Displays all computed health metrics in a clean, easy-to-read format such as pie chart, bar graph etc

### 🔹 Profile Page
- Shows stored user details with edit options.

### 🔹 Composition Explorer Page
- Shows the contents of each food item selected by the user.

### 🔹 Personalised Diet Plan Page
- Gives a personalised diet plan on entering the disease and the activity status of the user.

### 🔹 AI chatbot
- User can chat with AI assistant regarding any queries based on the diet plan, health or anything.

### 🔹 Disease Cure and Nutrition Guide Page
- Gives the required nutrients and foods based on given disease or symptoms.

### 🔹 Modular Navigation
- Separate pages for Sign-Up, Dashboard, Profile, Additional, and Composite navigation.

### 🔹 User-friendly interface
- UI is user friendly and has great USABILITY, can be navigated and used by people of all age groups.

---

## 🛠 Technology Stack

| Layer       | Technologies |
|-------------|--------------|
| Frontend | React Vite|
| Backend  | Node.js (Express) |
| Database | MongoDB |
| Styling  | CSS and Material UI |
| Tools    | VS Code,  GitHub |

---

## 📦 Installation & Libraries Used

To run this project locally, install the following:

🔧 Core Requirements :
- A Text editor like VS code 
- Node.js	v18+ recommended
- npm	Comes with Node
- MongoDB	Local installation or Atlas Cloud

📚 Frontend Libraries :
- React	Core frontend framework
- Vite	Dev server and build system
- Material UI (MUI)	UI components and styling
- Recharts	Graphs and charts
- Axios	API requests
- React Router DOM	Navigation between pages
- React Icons	Icons for UI

🖥️ Backend Libraries
- Express.js	Backend server
- Mongoose	MongoDB ODM
- bcryptjs	Password hashing
- jsonwebtoken	Authentication
- cors	Cross-origin support
- dotenv


## 📄 Project Pages

### 🔸 1. Sign-Up Page
Captures user details with input validation.

### 🔸 2. Composition Explorer Page
Gives the content of each food item selected in flashcards.

### 🔸 3. Dashboard / Body Composition
Manually calculates and displays :
- BMI  
- Ideal body weight
- Body composition 
 in easily understandable way 

### 🔸 4. Profile Page
Displays and allows editing of user details stored in MongoDB.

### 🔸 5. Nutrition Guide Page
Gives the required nutrients and proteins based on given disease or symptoms.

### 🔸 6. Diet Planner page
Gives a personalised diet plan based on the disease entered by user.

### 🔸 7. AI chatbot Page
Increases the user interaction by allowing him/her to ask any personal doubts related to their health or diet.

### 🔸 8. About Page
Gives the details about our web application.

---

## ▶ Usage Guide

## 🎥 User Guide Video

We have created a detailed video guide that explains how to use every feature of our FOODMEDS application, including:

- How to register and log in  
- Navigating through the dashboard  
- Using the Composition Explorer  
- Getting a personalised diet plan  
- Checking nutrient requirements using the Nutrition Guide(Disease Cure).
- Editing your profile  
- Using the AI Chatbot  

👉 **Watch the Full User Guide Video here:**  
**[USER GUIDE VIDEO LINK]\** =**(https://drive.google.com/file/d/1L7G8k3ZvgTHYrm_mCSZitHa_kUigOcjN/view?usp=drive_link)** 

**NOTE: This is video was recorded for R1, so it doesn't have new features like AI chat and diet planner.You can check out these pages in the given images below.**

**1. When you open the web application, it will open the welcome page.**  

   <img src="Images/Image 1.png" alt="Welcome Page" width="300" />

**2. Register using the Sign-Up page.** 

   <img src="Images/Image 2.png" alt="Sign-Up Page" width="300" />

**3. Once you are logged in, you can see the dashboard where your healthy body composition metrics are displayed like this.**

   <img src="Images/Image 3.png" alt="Dashboard View 1" width="300" /> <img src="Images/Image 4.png" alt="Dashboard View 2" width="300" />
  
**4. On the sidebar, if you click on the Composition Explorer you can see the different category icons like this. On selecting any of the categories (let's say fruits) you can see all the types of fruits in flashcards.**

   <img src="Images/Image 5.png" alt="Composition Explorer Categories" width="300" />

**5. When you click on any fruit, it gives you the complete composition of that fruit like what vitamins are present etc., and also displays how many calories can be gained by consuming 100g of that particular item.**

   <img src="Images/Image 6.png" alt="Food Composition Details" width="300" />

  
 **6. When you click on the diet planner on the sidebar , it opens a page and asks for the disease and your activity status and gives you the diet based on the entered data.**

   <img src="Images/Image 14.jpg" alt="Nutrition Guide Input" width="300" /> <img src="Images/Image 15.jpg" alt="Nutrition Guide Input" width="300" />

**7. When you click on Nutrition Guide on the sidebar, you'll get a page like this where you need to give any disease as input.**

   <img src="Images/Image 7.png" alt="Nutrition Guide Input" width="300" />

**8. Based on the given disease or symptoms, it gives the nutrients, vitamins, and proteins required by you and foods to eat by you to get cured or feel better.** 

   <img src="Images/Image 8.png" alt="Nutrition Suggestions" width="300" />

**9. On clicking the Profile icon, you'll get options to update your profile anytime by adding your profile picture, and you can also edit username and password.**

   <img src="Images/Image 9.png" alt="Profile Page" width="300" />

   
**10. When you select AI ChatBot in the sidebar, you will be able to interact with a AI Assistant that can reply to the questions related to food, recipes, diseases, nutrition, .. anything that relates with our web application.**
    **Anything out of domain will get an out of scope message from AI Assistant.**

   <img src="Images/Image 11.png" alt="About Page" width="300" /> <img src="Images/Image 12.png" alt="About Page" width="300" />

**At last you can go for a LOGOUT option to get your account out of this application.**

  <img src="Images/Image 13.png" alt="About Page" width="300" />
   

---

## 👥 Team Contributions

| Member      | Contribution |
|-------------|--------------|
| Dakshayani | Designed nutrition guide page which gives the required nutrients and proteins for the disease asked by user |
| Anvesh      | Designed and developed the Authentication, opening and AI chatbot pages and integrated remaining pages with stylish UI |
| Vishnu      | Built the Dashboard and implemented manual health computations and took care of manual duty related to database and presentation work |
| Sreeja      | Built the Composition explorer page frontend and backend + Readme file of the project |
| Akshaya     | Created diet plan page based on disease input given by user +  documentation |
| Mann        | Developed the Profile Page with editing options and gathered info about food items. |

---

##  Enhancements after  R1:
-  Diet planner page
-  AI chatbot page
-  Floating action button


## 🔮 Future Enhancements

-  AI/ML-based predictive health analysis  
-  Progress tracker
-  Mobile app version for wider accessibility  
-  Extended user profile customization

---

## ⚠ *NOTE*

Since we haven't deployed yet, to run this project locally, you will need certain *sensitive configuration files* (such as MongoDb keys and environment variables) which are *not included in this public repository* for security reasons.  
We had created dummy .env files named .env.example but did not fill the values for the keys in those files.                                 
If you would like to access this info , please feel free to contact us.

