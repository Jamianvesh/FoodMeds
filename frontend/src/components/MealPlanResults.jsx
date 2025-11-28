import {
  Paper,
  Box,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

function MealPlanResults({ plan }) {
  if (!plan) return null;

  const parseSection = (text) => {
    if (!text) return [];
    return text.split("\n").filter((line) => line.trim());
  };

  const breakfast = plan.mealPlan?.breakfast || [];
  const lunch = plan.mealPlan?.lunch || [];
  const dinner = plan.mealPlan?.dinner || [];

  return (
    <Box>
      {/* Nutrition Summary */}
      {plan.summary && (
        <Paper elevation={2} sx={{
          mb: 2, p: 3, borderRadius: "18px",
          background: "#fff", boxShadow: "0 4px 16px rgba(38,150,180,0.08)"
        }}>
          <Typography variant="h5" color="#20b2aa" fontWeight={700} mb={2}>
            Nutrition Summary
          </Typography>
          <Typography fontSize={16}>{plan.summary}</Typography>
        </Paper>
      )}

      {/* Daily Nutrients */}
      {plan.nutrients && (
        <Paper elevation={2} sx={{
          mb: 2, p: 3, borderRadius: "18px",
          background: "#fff", boxShadow: "0 4px 16px rgba(32,178,170,0.08)"
        }}>
          <Typography variant="h5" color="#20b2aa" fontWeight={700} mb={2}>
            Daily Nutrients
          </Typography>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {Object.entries(plan.nutrients).map(([key, value]) => (
              <Grid item xs={12} sm={6} md={4} key={key}>
                <Paper elevation={0} sx={{
                  border: "2.5px solid #20b2aa", p: 2, borderRadius: "14px",
                  background: "#f7fbfc", mb: 0.5
                }}>
                  <Typography variant="subtitle2" color="#20b2aa" fontWeight={600} gutterBottom>
                    {key}
                  </Typography>
                  <Typography variant="body1" color="#0097a7" fontWeight={700}>
                    {value}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {/* MEAL PLAN: each meal in its own Paper */}
      <Paper elevation={2} sx={{
        mb: 2, p: 2, borderRadius: "18px", background: "#fff"
      }}>
        <Typography variant="h5" color="#20b2aa" fontWeight={700} mb={2}>
          Meal Plan
        </Typography>
        <Grid container spacing={2}>
          {breakfast.length > 0 && (
            <Grid item xs={12}>
              <Paper elevation={1} sx={{
                p: 2, borderRadius: "14px", mb: 1.3, background: "#f5fbf9"
              }}>
                <Typography variant="h6" color="#00b2aa" fontWeight={700} mb={1}>
                  Breakfast
                </Typography>
                <List dense>
                  {breakfast.map((item, idx) => (
                    <ListItem key={idx} sx={{ py: 0.5 }}>
                      <ListItemText
                        primary={
                          typeof item === "string"
                            ? item
                            : item.title || JSON.stringify(item)
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
          )}
          {lunch.length > 0 && (
            <Grid item xs={12}>
              <Paper elevation={1} sx={{
                p: 2, borderRadius: "14px", mb: 1.3, background: "#f5fbf9"
              }}>
                <Typography variant="h6" color="#00b2aa" fontWeight={700} mb={1}>
                  Lunch
                </Typography>
                <List dense>
                  {lunch.map((item, idx) => (
                    <ListItem key={idx} sx={{ py: 0.5 }}>
                      <ListItemText
                        primary={
                          typeof item === "string"
                            ? item
                            : item.title || JSON.stringify(item)
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
          )}
          {dinner.length > 0 && (
            <Grid item xs={12}>
              <Paper elevation={1} sx={{
                p: 2, borderRadius: "14px", mb: 1, background: "#f5fbf9"
              }}>
                <Typography variant="h6" color="#00b2aa" fontWeight={700} mb={1}>
                  Dinner
                </Typography>
                <List dense>
                  {dinner.map((item, idx) => (
                    <ListItem key={idx} sx={{ py: 0.5 }}>
                      <ListItemText
                        primary={
                          typeof item === "string"
                            ? item
                            : item.title || JSON.stringify(item)
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Paper>

      {/* Health Tips */}
      {plan.tips && (
        <Paper elevation={2} sx={{
          p: 3, borderRadius: "18px", background: "#fff"
        }}>
          <Typography variant="h5" color="#20b2aa" fontWeight={700} mb={2}>
            Health Tips
          </Typography>
          <List>
            {parseSection(plan.tips).map((tip, idx) => (
              <ListItem key={idx}>
                <ListItemText primary={tip} />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
}

export default MealPlanResults;
