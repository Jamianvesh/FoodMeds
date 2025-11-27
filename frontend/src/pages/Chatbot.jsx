import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  Button,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery,
  Tooltip,
  CircularProgress
} from "@mui/material";
import {
  Send as SendIcon,
  Add as AddIcon,
  DeleteOutline as DeleteIcon,
  MenuOpen as MenuOpenIcon,
  SmartToy as BotIcon,
  Person as UserIcon,
  Download as DownloadIcon,
  WarningAmber as WarningIcon
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";

// --- CONFIGURATION ---
const apiBase = import.meta.env.VITE_API_URL || "http://localhost:3000";
const API_ENDPOINT = `${apiBase}/api/chat/gemini`;

export default function Chatbot() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);
  
  // State
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  
  // History is the master source of truth
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("foodmeds_chat_history") || "[]");
    } catch {
      return [];
    }
  });

  // Active Chat ID
  const [currentChatId, setCurrentChatId] = useState(null);
  
  // Derived state: The messages to display for the current view
  // If no ID is selected, we show nothing (Welcome Screen handles this check)
  const activeMessages = currentChatId 
    ? history.find(c => c.id === currentChatId)?.messages || [] 
    : [];

  const messagesEndRef = useRef(null);

  // --- EFFECTS ---

  // 1. Persist History
  useEffect(() => {
    localStorage.setItem("foodmeds_chat_history", JSON.stringify(history));
  }, [history]);

  // 2. Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeMessages, loading]);

  // --- HANDLERS ---

  const createNewChat = () => {
    // Just reset the current ID. 
    // We don't push to history until the user actually sends a message.
    setCurrentChatId(null);
    if (isMobile) setIsSidebarOpen(false);
  };

  const deleteChat = (e, id) => {
    e.stopPropagation();
    const newHistory = history.filter((c) => c.id !== id);
    setHistory(newHistory);
    // If we deleted the active chat, go back to welcome screen
    if (currentChatId === id) {
      setCurrentChatId(null);
    }
  };

  const exportCurrentChat = () => {
    if (activeMessages.length === 0) return;
    const blob = new Blob([JSON.stringify(activeMessages, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `foodmeds_chat_${currentChatId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSend = async (manualMsg = null) => {
    const textToSend = manualMsg || input;
    if (!textToSend.trim()) return;

    // --- CRITICAL FIX FOR NEW CHAT LOGIC ---
    let targetChatId = currentChatId;
    let newHistory = [...history];
    const userMsg = { role: "user", text: textToSend.trim(), ts: Date.now() };

    // 1. If we are on "Welcome Screen" (no ID), create a NEW chat session
    if (!targetChatId) {
      targetChatId = Date.now();
      const newChatSession = {
        id: targetChatId,
        title: textToSend.slice(0, 30) + "...", // Title based on first msg
        messages: [userMsg], // Add first message immediately
        timestamp: Date.now(),
      };
      // Prepend to history
      newHistory = [newChatSession, ...newHistory];
    } else {
      // 2. If existing chat, append message to it
      newHistory = newHistory.map(chat => {
        if (chat.id === targetChatId) {
          return { ...chat, messages: [...chat.messages, userMsg] };
        }
        return chat;
      });
    }

    // Update State Synchronously
    setHistory(newHistory);
    setCurrentChatId(targetChatId); // Ensure we stick to this chat
    setInput("");
    setLoading(true);

    try {
      // 3. API Call
      const res = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.text }),
      });

      const data = await res.json();
      const botText = data.ok ? data.reply : (data.reply || "Error: Could not fetch response.");

      // 4. Append Bot Response to the SAME chat ID
      const botMsg = { role: "bot", text: botText, ts: Date.now() };
      
      setHistory(prev => prev.map(chat => {
        if (chat.id === targetChatId) {
          return { ...chat, messages: [...chat.messages, botMsg] };
        }
        return chat;
      }));

    } catch (err) {
      console.error(err);
      const errorMsg = { role: "bot", text: "⚠️ Server connection failed. Please check your backend.", ts: Date.now() };
      setHistory(prev => prev.map(chat => {
        if (chat.id === targetChatId) {
          return { ...chat, messages: [...chat.messages, errorMsg] };
        }
        return chat;
      }));
    } finally {
      setLoading(false);
    }
  };

  // --- SUB-COMPONENTS ---

  const SidebarContent = () => (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", bgcolor: "#fff", borderRight: "1px solid #eee" }}>
      <Box sx={{ p: 2 }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<AddIcon />}
          onClick={createNewChat}
          sx={{ borderRadius: 8, bgcolor: "#4CAF7D", boxShadow: "none", textTransform: "none", py: 1 }}
        >
          New Conversation
        </Button>
      </Box>

      <Typography variant="caption" sx={{ px: 3, py: 1, color: "text.secondary", fontWeight: 700, letterSpacing: 0.5 }}>
        RECENT CHATS
      </Typography>
      
      <List sx={{ flex: 1, overflowY: "auto", px: 1 }}>
        {history.length === 0 && (
          <Typography variant="caption" sx={{ p: 2, display: "block", textAlign: "center", color: "#999" }}>
            No history yet.
          </Typography>
        )}
        {history.map((chat) => (
          <ListItem 
            key={chat.id} 
            disablePadding
            secondaryAction={
              <IconButton edge="end" size="small" onClick={(e) => deleteChat(e, chat.id)}>
                <DeleteIcon fontSize="small" sx={{ opacity: 0.5, "&:hover": { opacity: 1, color: "red" } }} />
              </IconButton>
            }
          >
            <ListItemButton 
              selected={currentChatId === chat.id}
              onClick={() => { setCurrentChatId(chat.id); if (isMobile) setIsSidebarOpen(false); }}
              sx={{ 
                borderRadius: 2, 
                mb: 0.5,
                "&.Mui-selected": { bgcolor: "rgba(76, 175, 125, 0.1)", color: "#143D33", borderLeft: "3px solid #4CAF7D" }
              }}
            >
              <ListItemText 
                primary={chat.title} 
                primaryTypographyProps={{ fontSize: "0.85rem", noWrap: true, fontWeight: currentChatId === chat.id ? 600 : 400 }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box sx={{ p: 1, textAlign: "center", bgcolor: "#fafafa" }}>
        <Typography variant="caption" color="text.secondary">FoodMeds AI</Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", height: "calc(100vh - 180px)", position: "relative", overflow: "hidden", bgcolor: "#f5f6fa", borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
      
      {/* SIDEBAR */}
      <Box component="nav" sx={{ width: { md: isSidebarOpen ? 260 : 0 }, flexShrink: { md: 0 }, transition: "width 0.3s ease" }}>
        <Drawer
          variant={isMobile ? "temporary" : "persistent"}
          open={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          sx={{ "& .MuiDrawer-paper": { position: "absolute", width: 260, border: "none" } }}
          ModalProps={{ keepMounted: true }}
        >
          <SidebarContent />
        </Drawer>
      </Box>

      {/* MAIN CHAT AREA */}
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", height: "100%", position: "relative" }}>
        
        {/* HEADER */}
        <Paper elevation={0} sx={{ p: 1, display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #eee", bgcolor: "rgba(255,255,255,0.9)", backdropFilter: "blur(10px)", zIndex: 10 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <MenuOpenIcon color="primary" />
            </IconButton>
            <Box>
              <Typography variant="subtitle1" fontWeight={700} color="#143D33">
                FoodMeds Assistant
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                 <Box component="span" sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "#4CAF7D" }} />
                 AI ChatBot
              </Typography>
            </Box>
          </Box>
          <Tooltip title="Export Chat">
             <span>
               <IconButton onClick={exportCurrentChat} disabled={activeMessages.length === 0} size="small">
                 <DownloadIcon />
               </IconButton>
             </span>
          </Tooltip>
        </Paper>

        {/* CHAT CONTENT */}
        <Box sx={{ flexGrow: 1, overflowY: "auto", p: 1, bgcolor: "#fff", display: "flex", flexDirection: "column" }}>
          
          {/* STRICT SWITCH: If no messages, show Welcome. If messages, show List. */}
          {activeMessages.length === 0 ? (
            
            // --- 1. WELCOME SCREEN ---
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: 0.9 }}>
              <Avatar sx={{ width: 70, height: 70, bgcolor: "#e8f5e9", color: "#4CAF7D", mb: 3 }}>
                <BotIcon fontSize="large" />
              </Avatar>
              <Typography variant="h5" fontWeight={700} color="#143D33" gutterBottom>
                What can I help with?
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 4, textAlign: "center", maxWidth: 400 }}>
                I can create recipes, analyze nutrients, or suggest foods for specific health conditions.
              </Typography>

              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, justifyContent: "center", maxWidth: 650 }}>
                {[
                  "🥗 Foods rich in Iron?",
                  "🥞 Biryani recipe",
                  "🍎 Is apple good for diabetes?",
                  "📉 How many calories in 100g of rice?",
                ].map((s, i) => (
                  <Button 
                    key={i} 
                    variant="outlined" 
                    onClick={() => handleSend(s)}
                    sx={{ 
                      borderRadius: 6, 
                      color: "#555", 
                      borderColor: "#eee", 
                      bgcolor: "#fff",
                      textTransform: "none",
                      px: 3, py: 1,
                      "&:hover": { borderColor: "#4CAF7D", bgcolor: "#f1f8e9" }
                    }}
                  >
                    {s}
                  </Button>
                ))}
              </Box>
            </Box>

          ) : (

            // --- 2. MESSAGE LIST ---
            <Box sx={{ maxWidth: 900, mx: "auto", width: "100%" }}>
              {activeMessages.map((m, idx) => (
                <Box key={idx} sx={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", mb: 2 }}>
                  
                  {/* Bot Avatar */}
                  {m.role === "bot" && (
                    <Avatar sx={{ width: 32, height: 32, bgcolor: "#4CAF7D", mr: 1.5, mt: 0.5 }}>
                      <BotIcon fontSize="small" />
                    </Avatar>
                  )}
                  
                  {/* Message Bubble */}
                  <Paper 
                    elevation={0}
                    sx={{ 
                      p: 2, 
                      maxWidth: { xs: "85%", md: "75%" },
                      borderRadius: 3,
                      bgcolor: m.role === "user" ? "#4CAF7D" : "#f5f6fa",
                      color: m.role === "user" ? "#fff" : "#143D33",
                      borderTopLeftRadius: m.role === "bot" ? 4 : 16,
                      borderTopRightRadius: m.role === "user" ? 4 : 16,
                      boxShadow: m.role === "user" ? "0 4px 12px rgba(76, 175, 125, 0.3)" : "none"
                    }}
                  >
                    {m.role === "user" ? (
                      <Typography variant="body1" sx={{ lineHeight: 1.5 }}>{m.text}</Typography>
                    ) : (
                      <Box sx={{ "& p": { m: 0, mb: 1, lineHeight: 1.5 }, "& ul, & ol": { m: 0, pl: 2.5 }, "& li": { mb: 0.5 }, "& strong": { fontWeight: 700, color: "#2e7d32" } }}>
                         <ReactMarkdown>{m.text}</ReactMarkdown>
                      </Box>
                    )}
                  </Paper>

                  {/* User Avatar */}
                  {m.role === "user" && (
                    <Avatar sx={{ width: 32, height: 32, bgcolor: "#56a1cf", ml: 1.5, mt: 0.5 }}>
                      <UserIcon fontSize="small" />
                    </Avatar>
                  )}
                </Box>
              ))}

              {/* TYPING INDICATOR (Shown INSIDE the list, at the bottom) */}
              {loading && (
                <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 3 }}>
                   <Avatar sx={{ width: 32, height: 32, bgcolor: "#4CAF7D", mr: 1.5, opacity: 0.7 }}>
                      <BotIcon fontSize="small" />
                    </Avatar>
                    <Paper elevation={0} sx={{ p: 2, borderRadius: 3, borderTopLeftRadius: 4, bgcolor: "#f5f6fa" }}>
                      <Box sx={{ display: "flex", gap: 0.5 }}>
                        <Typography variant="body2" color="text.secondary">Analyzing...</Typography>
                        <CircularProgress size={14} thickness={5} sx={{ color: "#4CAF7D", ml: 1, mt: 0.5 }} />
                      </Box>
                    </Paper>
                </Box>
              )}
              
              {/* Invisible element to trigger scroll */}
              <div ref={messagesEndRef} />
            </Box>
          )}
        </Box>

        {/* INPUT AREA (Fixed) */}
        <Box sx={{ p: 1.2, bgcolor: "#fff", borderTop: "1px solid #eee" }}>
           <Paper 
             component="form"
             onSubmit={(e) => { e.preventDefault(); handleSend(); }}
             elevation={0}
             sx={{ 
               display: "flex", 
               alignItems: "center", 
               bgcolor: "#f5f6fa", 
               borderRadius: 4, 
               px: 2, 
               py: 0.5,
               border: "1px solid transparent",
               transition: "all 0.2s",
               "&:focus-within": { border: "1px solid #4CAF7D", bgcolor: "#fff", boxShadow: "0 0 0 4px rgba(76,175,125,0.1)" } 
             }}
           >
             <TextField
               fullWidth
               placeholder="Ask anything related to health, food, disease, ..."
               variant="standard"
               value={input}
               onChange={(e) => setInput(e.target.value)}
               disabled={loading}
               InputProps={{ disableUnderline: true }}
               sx={{ ml: 1 }}
             />
             <IconButton type="submit" disabled={loading || !input.trim()} sx={{ color: input.trim() ? "#4CAF7D" : "#ccc" }}>
               <SendIcon />
             </IconButton>
           </Paper>
           
           <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1, mt: 1.5, opacity: 0.7 }}>
             <WarningIcon sx={{ fontSize: 14, color: "#f57c00" }} />
             <Typography variant="caption" color="text.secondary" align="center" sx={{ fontSize: "11px" }}>
               I am an AI, not a doctor. Consult a professional for medical advice.
             </Typography>
           </Box>
        </Box>

      </Box>
    </Box>
  );
}