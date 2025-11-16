import React from "react";
import "../styles/DashboardAbout.css";
import {
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Container,
} from "@mui/material";
import logo1 from "../assets/Personalised.jpeg";
import logo2 from "../assets/diet.jpeg";
import logo3 from "../assets/composition.jpeg";
import logo4 from "../assets/diseasecure.jpeg";
import logo5 from "../assets/track.jpeg";

function About() {
  const cards = [
    { img: logo1, title: "Personalized Body Insights", desc: "Know your body better! FoodMeds calculates your BMI, water %,etc.. based on your age, height, and weight." },
    { img: logo2, title: "Condition-Based Diet Planning", desc: "Get AI-powered meal suggestions personalized for your health conditions like diabetes, hypertension, or obesity — helping you eat smarter and recover faster." },
    { img: logo3, title: "Composition Explorer", desc: "Curious about what’s in your food? Click any fruit, veggie, or meal to reveal its vitamin, mineral, and macronutrient profile." },
    { img: logo4, title: "Disease Cure Assistant", desc: "Get personalized nutrition-based advice for any disease. Discover symptoms, essential nutrients, and food suggestions that support recovery." },
    { img: logo5, title: "Track, Analyze & Improve", desc: "Log your daily meals and FoodMeds will track your trends — calories, carbs, and nutrients — to suggest improvements." },
  ];

  return (
    <Container className="dashboardabout-section">
      <Typography variant="h3" fontWeight={700} gutterBottom align="center">
        About FoodMeds⚕️
      </Typography>
      <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 2 }}>
        FoodMeds helps you balance nutrition and medication through smart diet tracking.
      </Typography>
      <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 5 }}>
        🚀We are on our way to develop this web application in a more interactable and user-friendly way🚀
      </Typography>

      <Grid container spacing={4}>
        {cards.map((c, i) => (
          <Grid item xs={12} sm={6} md={4} mb={5} lg={2.4} key={i}>
            <Card className="dashboardabout-card" elevation={4}>
              <CardMedia component="img" image={c.img} alt={c.title} height="140"  sx={{marginTop: "10px",}} />
              <CardContent>
                <Typography variant="h6" fontWeight={600}>
                  {c.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {c.desc}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 2 }}>
       🌐FoodMeds is developed as part of a university project to enhance health management through technology🌐
      </Typography>
      <Typography variant="body1" align="center" color="text.secondary">
       🚨This platform is not a substitute for professional medical advice🚨
      </Typography>
    </Container>
  );
}

export default About;
