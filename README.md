# 🌿 FOODMEDS- Personalised Diet and Health Tracker(Release 1)

A full-stack health insights web application that computes BMI, **calorie needs**, **nutrient breakdown**, and **body composition** using manual logic and APIs  

Users can sign up, view personalized dashboards, edit profiles, and explore modular UI pages — all backed by a clean React frontend and secure Mongo Db storage.

---

## 🚀 Project Overview

This application gathers user inputs (age, gender, height, weight) and uses custom algorithms to calculate:

- Body Mass Index (BMI)  
- Body composition indicators.
- Daily calorie requirements.
- Personalised Diet Plan based on their health condition 

The objective is to build a self-contained health engine without third-party API dependency.

---

## 🧩 Features

### 🔹 Manual Computations
- BMI, calorie intake, and nutrient distribution calculated manually using JavaScript logic and API.

### 🔹 Authentication & User Data Input
- Sign-Up form with validations for user details.

### 🔹 Dynamic Dashboard
- Displays all computed health metrics in a clean, easy-to-read format. i.e pie chart, bar graph etc

### 🔹 Profile Page
- Shows stored user details with edit options.

### 🔹 Composition Explorer Page
- Shows the contents of each food item selected by the user.

### 🔹 Disease Cure and Nutrition Guide Page
- Gives the required nutrients and foods based on given disease or symptoms.

### 🔹 Modular Navigation
- Separate pages for Sign-Up, Dashboard, Profile, Additional, and Composite navigation.

---

## 🛠 Technology Stack

| Layer       | Technologies |
|-------------|--------------|
| Frontend | React vite|
| Backend  | Node.js (Express) |
| Database | MongoDB |
| Styling  | CSS  and Material UI |
| Tools    | VS Code,  GitHub |

---

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
Gives the required nutrients and proteins based on give disease or symptoms.

### 🔸 6. About Page
Gives the details about our web application.

---

## ▶ Usage Guide

**1. When you open the web application, it will open the welcome page.**  

   <img src="Images/Image 1.png" alt="Welcome Page" width="300" />

**2. Register using the Sign-Up page.** 

   <img src="Images/Image 2.png" alt="Sign-Up Page" width="300" />

**3. Once you are logged in, you can see the dashboard where your healthy body composition is displayed like this.**

   <img src="Images/Image 3.png" alt="Dashboard View 1" width="300" /> <img src="Images/Image 4.png" alt="Dashboard View 2" width="300" />
  
**4. On the sidebar, if you click on the Composition Explorer you can see the different category icons like this. On selecting any of the categories (let's say fruits) you can see all the types of fruits in flashcards.**

   <img src="Images/Image 5.png" alt="Composition Explorer Categories" width="300" />

**5. When you click on any fruit, it gives you the complete composition of that fruit like what vitamins are present etc., and also displays how many calories can be gained by consuming 100g of that particular item.**

   <img src="Images/Image 6.png" alt="Food Composition Details" width="300" />

**6. When you click on Nutrition Guide on the sidebar, you'll get a page like this where you need to give any disease as input.**

   <img src="Images/Image 7.png" alt="Nutrition Guide Input" width="300" />

**7. Based on the given disease or symptoms, it gives the nutrients, vitamins, and proteins required by you and foods to eat by you to get cured or feel better.** 

   <img src="Images/Image 8.png" alt="Nutrition Suggestions" width="300" />

**8. On clicking the Profile icon, you'll get options to update your profile anytime by adding your profile picture, and you can also edit username and password.**

   <img src="Images/Image 9.png" alt="Profile Page" width="300" />

**9. When you click the About option in the sidebar, you will see the pages that are available in this web application.**

   <img src="Images/Image 10.png" alt="About Page" width="300" />

---

## 👥 Team Contributions

| Member      | Contribution |
|-------------|--------------|
| Dakshayani | Designed nutrition guide page which gives the required nutrients and proteins for the disease asked by user |
| Anvesh      | Designed and developed the Authentication and opening pages and integrated the dashboardhome ,composition explorer and profile page with stylish UI |
| Sreeja      | Built the Composition explorer page frontend and backend + Readme file of the project |
| Akshaya     | Created diet plan page based on disease input given by user + integration of Nutrition Guide page + documentation |
| Mann        | Developed the Profile Page with editing options and gathered info about food items. |
| Vishnu      | Built the Dashboard and implemented manual health computations and took care of manual duty related to database. |

---

## 🔮 Future Enhancements(Release 2)

-  AI/ML-based predictive health analysis  
-  Progress tracker
-  AI chatbot for more interaction
-  Mobile app version for wider accessibility  
-  Extended user profile customization
-  Work on diet planner page and make it more practical

---

## ⚠ *NOTE*

Since we haven't deployed yet, to run this project locally, you will need certain *sensitive configuration files* (such as MongoDb keys and environment variables) which are *not included in this public repository* for security reasons.  
We had created dummy .env files named .env.example but did not filled the values for the keys in those files.                                 
If you would like to access these info , please feel free to contact us.

