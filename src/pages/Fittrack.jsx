// React & Routing
import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';


// Services
import commonAPI from "../services/commonAPI";
import { BASEURL } from "../services/baseURL";
import { getExercisesAPI, addExerciseAPI, updateExerciseAPI, deleteExerciseAPI } from "../services/allAPIs";

// Material UI
import {
      CssBaseline, ThemeProvider, createTheme, Container, Box, Typography, Button,
      Card, CardContent, IconButton, Grid, TextField, FormControl, InputLabel,
      Select, MenuItem, Fab, Snackbar, Alert, Dialog, DialogTitle, DialogContent,
      DialogActions
} from '@mui/material';

// Icons
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import ListAltIcon from '@mui/icons-material/ListAlt';
import WarningIcon from '@mui/icons-material/Warning';
import SportsGymnasticsIcon from '@mui/icons-material/SportsGymnastics';

// --- CONSTANTS & INITIAL DATA ---
const CATEGORIES = ['All', 'Chest', 'Legs', 'Cardio'];

const CATEGORY_COLORS_MUI = {
      Chest: { border: '#d32f2f', text: '#d32f2f' },
      Legs: { border: '#388e3c', text: '#388e3c' },
      Cardio: { border: '#0288d1', text: '#0288d1' },
};


const CATEGORY_ICONS = {
      Chest: <FitnessCenterIcon sx={{ color: '#d32f2f' }} />,
      Legs: <ListAltIcon sx={{ color: '#388e3c' }} />,
      Cardio: <FlashOnIcon sx={{ color: '#0288d1' }} />,
};



// --- MUI THEME ---
const darkLimeTheme = createTheme({
      palette: {
            mode: 'dark',
            primary: { main: '#ccff00', contrastText: '#121212' },
            secondary: { main: '#64ffda' },
            background: { default: '#121212', paper: '#1e1e1e' },
            text: { primary: '#ffffff', secondary: '#b0b0b0' },
      },
      typography: {
            fontFamily: ['Inter', 'Roboto', 'Arial', 'sans-serif'].join(','),
            h4: { 
                  fontWeight: 800,
                  '@media (max-width:600px)': {
                        fontSize: '1.75rem',
                  },
            },
            h5: {
                  fontWeight: 700,
                  '@media (max-width:600px)': {
                        fontSize: '1.25rem',
                  },
            }
      },
      components: {
            MuiCssBaseline: {
                  styleOverrides: {
                        body: { 
                              backgroundColor: '#121212', 
                              backgroundImage: 'none',
                              scrollbarWidth: 'thin',
                              '&::-webkit-scrollbar': {
                                    width: '8px',
                              },
                              '&::-webkit-scrollbar-track': {
                                    background: '#1e1e1e',
                              },
                              '&::-webkit-scrollbar-thumb': {
                                    background: '#333',
                                    borderRadius: '10px',
                              },
                              '&::-webkit-scrollbar-thumb:hover': {
                                    background: '#444',
                              },
                        },
                  },
            },
            MuiButton: {
                  styleOverrides: {
                        root: { borderRadius: '25px', textTransform: 'none', fontWeight: 600 },
                        containedPrimary: { boxShadow: '0 4px 15px rgba(204, 255, 0, 0.2)' },
                  },
            },
            MuiCard: { 
                  styleOverrides: { 
                        root: { 
                              borderRadius: '20px', 
                              backdropFilter: 'blur(10px)',
                              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                              '&:hover': {
                                    transform: 'translateY(-5px)',
                              }
                        } 
                  } 
            },
            MuiFab: {
                  styleOverrides: {
                        root: {
                              backgroundColor: '#ccff00',
                              color: '#121212',
                              '&:hover': { backgroundColor: '#aaff00' },
                        },
                  },
            },
            MuiTextField: { 
                  defaultProps: { variant: 'filled' },
                  styleOverrides: {
                        root: {
                              '& .MuiFilledInput-root': {
                                    borderRadius: '12px',
                                    backgroundColor: 'rgba(255,255,255,0.05)',
                                    '&:before, &:after': { display: 'none' },
                                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.08)' },
                              }
                        }
                  }
            },
            MuiInputLabel: {
                  styleOverrides: {
                        root: { '&.Mui-focused': { color: '#ccff00' } },
                  },
            },
            MuiPaper: {
                  styleOverrides: {
                        root: { backgroundColor: 'rgba(30, 30, 30, 0.95)', backgroundImage: 'none' }
                  }
            }
      },
});


// --- Original Component ---// ⚙️ CORRECTED BackgroundVideo COMPONENT
const BackgroundVideo = () => (
      <Box
            sx={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  width: '100vw',
                  height: '100vh',
                  zIndex: -2,
                  overflow: 'hidden',
                  pointerEvents: 'none',
            }}
      >
            <Box
                  sx={{
                        position: 'absolute',
                        inset: 0,
                        backgroundColor: 'rgba(0,0,0,0.65)', // Dimmer overlay
                        zIndex: -1,
                  }}
            />
            <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                  }}
            >
                  <source src='/videos/FitTrack-bg.mp4' type="video/mp4" />
                  Your browser does not support the video tag.
            </video>
      </Box>
);

// --- TOAST NOTIFICATION ---
const ToastNotification = ({ message, type, onClose }) => {

      const severity = type === 'success' ? 'success' : 'error';
      const color = type === 'success' ? 'primary' : 'error';
      return (
            <Snackbar
                  open={!!message}
                  autoHideDuration={4000}
                  onClose={onClose}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                  <Alert
                        onClose={onClose}
                        severity={severity}
                        variant="filled"
                        sx={{
                              width: '100%',
                              backgroundColor:
                                    color === 'primary'
                                          ? darkLimeTheme.palette.primary.main
                                          : darkLimeTheme.palette.error.main,
                              color: darkLimeTheme.palette.background.default,
                              fontWeight: 'bold',
                        }}
                  >
                        {message}
                  </Alert>
            </Snackbar>
      );
};

// --- CONFIRMATION MODAL ---
const ConfirmationModal = ({ message, onConfirm, onClose }) => (
      // ... (ConfirmationModal component remains unchanged) ...
      <Dialog
            open
            onClose={onClose}
            PaperProps={{
                  sx: { borderRadius: '16px', bgcolor: 'background.paper', border: '1px solid #333' },
            }}
      >
            <DialogTitle sx={{ textAlign: 'center', pb: 0, pt: 3 }}>
                  <WarningIcon sx={{ color: 'error.main', fontSize: 40, mb: 1 }} />
                  <Typography variant="h6" fontWeight="bold">Confirm Deletion</Typography>
            </DialogTitle>
            <DialogContent sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="textSecondary">
                        {message}
                  </Typography>
            </DialogContent>
            <DialogActions sx={{ p: 3, pt: 1, justifyContent: 'space-between' }}>
                  <Button onClick={onClose} variant="outlined" color="inherit" sx={{ width: '48%' }}>
                        Cancel
                  </Button>
                  <Button
                        onClick={onConfirm}
                        variant="contained"
                        color="error"
                        sx={{ width: '48%' }}
                  >
                        Delete
                  </Button>
            </DialogActions>
      </Dialog>
);

// --- FAB BUTTON ---
const FabButton = ({ onClick }) => (

      <Fab
            color="primary"
            onClick={onClick}
            sx={{ position: 'fixed', bottom: 30, right: 30, zIndex: 100 }}
      >
            <AddIcon />
      </Fab>
);

// --- EXERCISE CARD ---
const ExerciseCard = ({ exercise, onEdit, onDelete }) => {
      // ... (ExerciseCard component remains largely unchanged, added subtle background to support video) ...
      const { exerciseName, sets, reps, category } = exercise;
      const accent = CATEGORY_COLORS_MUI[category] || { border: '#777', text: '#ccc' };
      const Icon = CATEGORY_ICONS[category] || <FitnessCenterIcon sx={{ color: '#ccc' }} />;

      return (
            <Card
                  sx={{
                        bgcolor: 'background.paper',
                        '&:hover': { boxShadow: `0 0 20px -5px ${accent.text}90` },
                  }}
                  elevation={5}
            >
                  <CardContent sx={{ display: 'flex', justifyContent: 'space-between', p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                              <Box sx={{ p: 1.5, borderRadius: '50%', bgcolor: '#2e2e2e', mr: 2.5 }}>{Icon}</Box>
                              <Box>
                                    <Typography variant="h6" noWrap fontWeight="bold">
                                          {exerciseName}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                          <Box component="span" color="text.primary" fontWeight="bold">
                                                {sets}
                                          </Box>{' '}
                                          Sets •{' '}
                                          <Box component="span" color="text.primary" fontWeight="bold">
                                                {reps}
                                          </Box>{' '}
                                          Reps
                                    </Typography>
                              </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <IconButton onClick={() => onEdit(exercise)} color="inherit">
                                    <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton onClick={() => onDelete(exercise)} color="inherit">
                                    <DeleteIcon fontSize="small" />
                              </IconButton>
                        </Box>
                  </CardContent>
            </Card>
      );
};

// --- EXERCISE FORM MODAL ---
const ExerciseFormModal = ({ exercise, onClose, onSave }) => {

      const today = new Date().toISOString().slice(0, 10);
      const [formData, setFormData] = useState(
            exercise || { exerciseName: '', sets: 3, reps: 12, category: 'Chest', date: today }
      );

      const handleChange = (e) => {
            const { name, value } = e.target;
            setFormData((prev) => ({ ...prev, [name]: value }));
      };

      const handleSubmit = (e) => {
            e.preventDefault();
            onSave({ ...formData, sets: +formData.sets, reps: +formData.reps });
      };

      return (
            <Dialog
                  open
                  onClose={onClose}
                  fullWidth
                  maxWidth="sm"
                  PaperProps={{ sx: { borderRadius: '20px', bgcolor: 'background.paper' } }}
            >
                  <DialogTitle>
                        {exercise?.id ? 'Edit Log Entry' : 'Log New Exercise'}
                        <IconButton onClick={onClose} sx={{ position: 'absolute', right: 16, top: 16 }}>
                              <CloseIcon />
                        </IconButton>
                  </DialogTitle>
                  <DialogContent>
                        <Box component="form" onSubmit={handleSubmit}>
                              <TextField
                                    label="Workout Date"
                                    name="date"
                                    type="date"
                                    fullWidth
                                    value={formData.date}
                                    onChange={handleChange}
                                    margin="normal"
                              />
                              <TextField
                                    label="Exercise Name"
                                    name="exerciseName"
                                    fullWidth
                                    value={formData.exerciseName}
                                    onChange={handleChange}
                                    margin="normal"
                              />
                              <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                          <TextField
                                                label="Sets"
                                                name="sets"
                                                type="number"
                                                fullWidth
                                                value={formData.sets}
                                                onChange={handleChange}
                                          />
                                    </Grid>
                                    <Grid item xs={6}>
                                          <TextField
                                                label="Reps"
                                                name="reps"
                                                type="number"
                                                fullWidth
                                                value={formData.reps}
                                                onChange={handleChange}
                                          />
                                    </Grid>
                              </Grid>
                              <FormControl fullWidth margin="normal">
                                    <InputLabel>Category</InputLabel>
                                    <Select name="category" value={formData.category} onChange={handleChange}>
                                          {['Chest', 'Legs', 'Cardio'].map((c) => (
                                                <MenuItem key={c} value={c}>
                                                      {c}
                                                </MenuItem>
                                          ))}
                                    </Select>
                              </FormControl>
                        </Box>
                  </DialogContent>
                  <DialogActions>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button variant="contained" color="primary" onClick={handleSubmit}>
                              {exercise?.id ? 'Update Entry' : 'Log Workout'}
                        </Button>
                  </DialogActions>
            </Dialog>
      );
};

// --- MAIN COMPONENT ---
// ... (All Imports and Helper Components: BackgroundVideo, ToastNotification, ConfirmationModal, FabButton, ExerciseCard, ExerciseFormModal) ...

// --- MAIN COMPONENT ---
function FitTrack() {
      const { id } = useParams();
      const [user, setUser] = useState(null);
      const [exercises, setExercises] = useState([]);

      // State for Modals/Toasts/Filters
      const [modalExercise, setModalExercise] = useState(null);
      const [notification, setNotification] = useState(null);
      const [confirmation, setConfirmation] = useState(null);
      const [selectedCategory, setSelectedCategory] = useState('All');
      const [searchTerm, setSearchTerm] = useState('');
      const [searchDate, setSearchDate] = useState('');

      useEffect(() => {
            if (!id) return;

            const fetchUserAndExercises = async () => {
                  try {
                        const userData = await commonAPI("GET", `${BASEURL}/users/${id}`);
                        setUser(userData.data);

                        const res = await getExercisesAPI(id);
                        setExercises(res.data || []);
                  } catch (error) {
                        console.error("Error fetching data:", error);
                  }
            };
            fetchUserAndExercises();
      }, [id]);

      // **FIX: Grouping Logic**
      const groupedExercises = useMemo(() => {
            let list = exercises;

            // 1. Filtering
            if (searchTerm)
                  list = list.filter((e) =>
                        e.exerciseName.toLowerCase().includes(searchTerm.toLowerCase())
                  );

            if (searchDate)
                  list = list.filter((e) => e.date === searchDate);

            if (selectedCategory !== 'All')
                  list = list.filter((e) => e.category === selectedCategory);

            // 2. Grouping
            const groups = list.reduce((acc, exercise) => {
                  const date = exercise.date;
                  if (!acc[date]) {
                        acc[date] = [];
                  }
                  acc[date].push(exercise);
                  return acc;
            }, {});

            // 3. Sorting (Sort the dates descendingly to show most recent first)
            const sortedDates = Object.keys(groups).sort((a, b) => new Date(b) - new Date(a));

            return { groups, sortedDates };
      }, [exercises, selectedCategory, searchTerm, searchDate]);
      // --- End Grouping Logic ---


      // ADD or UPDATE logic (unchanged)
      const handleSave = async (data) => {
            try {
                  if (data.id) {
                        await updateExerciseAPI(data.id, data);
                        setExercises((prev) => prev.map((e) => (e.id === data.id ? data : e)));
                        setNotification({ message: "Entry Updated!", type: "success" });
                  } else {
                        const newExercise = { ...data, userId: id };
                        const res = await addExerciseAPI(newExercise);
                        setExercises((prev) => [...prev, res.data]);
                        setNotification({ message: "Workout Logged!", type: "success" });
                  }
            } catch (err) {
                  console.error("Error saving exercise:", err);
                  setNotification({ message: "Failed to save!", type: "error" });
            }
            setModalExercise(null);
      };

      // DELETE logic (unchanged)
      const handleDelete = (exercise) =>
            setConfirmation({
                  message: `Delete ${exercise.exerciseName}?`,
                  onConfirm: async () => {
                        try {
                              await deleteExerciseAPI(exercise.id);
                              setExercises((prev) => prev.filter((e) => e.id !== exercise.id));
                              setNotification({ message: "Deleted!", type: "success" });
                        } catch (err) {
                              console.error("Delete failed:", err);
                              setNotification({ message: "Failed to delete!", type: "error" });
                        }
                        setConfirmation(null);
                  },
            });


      return (
            <ThemeProvider theme={darkLimeTheme}>
                  <BackgroundVideo />
                  <CssBaseline />
                  {/* ✅ FIX: Ensure the main content container allows the content to extend the body's scroll height.
                - Removed any 'height' or 'overflow' limitations from the parent container.
                - Added pb: 8 (padding-bottom) to prevent the FAB button from obscuring the last content. 
            */}
                  <Container
                        maxWidth="md"
                        sx={{
                              pb: 8, // Adds necessary padding to see the last card above the FAB
                              position: 'relative', // Ensures zIndex works
                              zIndex: 1, // ✅ CORRECT: Layers content over the fixed video (zIndex: -2)
                              // ❌ IMPORTANT: NO height: '100vh' or overflow: 'auto/scroll' here!
                        }}
                  >
                        {/* Header */}
                        <Box sx={{ py: { xs: 4, md: 6 }, mb: 4, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                              <Typography variant="h4" fontWeight="800">
                                    Welcome to{" "}
                                    <Box component="span" color="primary.main">FitTrack</Box>
                                    {user ? `, ${user.username}` : ""}
                                    <SportsGymnasticsIcon sx={{ color: 'primary.main', ml: 1.5, fontSize: { xs: 24, md: 30 }, verticalAlign: 'middle' }} />
                              </Typography>
                              <Typography color="textSecondary" sx={{ mt: 1 }}>Track your fitness progress with style</Typography>
                        </Box>

                        {/* Filters/Search */}
                        <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
                              {CATEGORIES.map((cat) => (
                                    <Button
                                          key={cat}
                                          variant={selectedCategory === cat ? 'contained' : 'outlined'}
                                          onClick={() => setSelectedCategory(cat)}
                                          sx={{ px: 3 }}
                                    >
                                          {cat}
                                    </Button>
                              ))}
                        </Box>
                        <Grid container spacing={2} sx={{ mb: 3 }}>
                              <Grid item xs={12} sm={6}>
                                    {/* ... Search TextField ... */}
                                    <TextField
                                          fullWidth
                                          variant="filled"
                                          label="Search by Exercise"
                                          value={searchTerm}
                                          onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                    {/* ... Date Picker ... */}
                                    <TextField
                                          fullWidth
                                          variant="filled"
                                          label="Search by Date"
                                          type="date"
                                          value={searchDate || ''}
                                          onChange={(e) => setSearchDate(e.target.value)}
                                    />
                              </Grid>
                        </Grid>

                        {/* Rendering Grouped Exercises (Unchanged) */}
                        <Box sx={{ mb: 4 }}>
                              {groupedExercises.sortedDates.length === 0 && (
                                    <Typography variant="h6" color="textSecondary" sx={{ mt: 4, textAlign: 'center' }}>
                                          No workouts logged yet, or no results for current filters.
                                    </Typography>
                              )}
                              {groupedExercises.sortedDates.map((date) => (
                                    <Box key={date} sx={{ mb: 4 }}>
                                          {/* Date Header */}
                                          <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main', borderBottom: '2px solid #333' }}>
                                                {new Date(date).toLocaleDateString('en-US', {
                                                      weekday: 'long',
                                                      year: 'numeric',
                                                      month: 'long',
                                                      day: 'numeric',
                                                })}
                                          </Typography>

                                          {/* Exercise Cards for the date */}
                                          <Grid container spacing={2}>
                                                {groupedExercises.groups[date].map((exercise) => (
                                                      <Grid item xs={12} key={exercise.id}>
                                                            <ExerciseCard
                                                                  exercise={exercise}
                                                                  onEdit={setModalExercise}
                                                                  onDelete={handleDelete}
                                                            />
                                                      </Grid>
                                                ))}
                                          </Grid>
                                    </Box>
                              ))}
                        </Box>

                        {/* Modals and FAB (Unchanged) */}
                        <FabButton
                              onClick={() =>
                                    setModalExercise({ exerciseName: '', sets: 3, reps: 12, category: 'Chest', date: new Date().toISOString().slice(0, 10) })
                              }
                        />

                        {modalExercise && (
                              <ExerciseFormModal exercise={modalExercise} onClose={() => setModalExercise(null)} onSave={handleSave} />
                        )}
                        {confirmation && (
                              <ConfirmationModal message={confirmation.message} onConfirm={confirmation.onConfirm} onClose={() => setConfirmation(null)} />
                        )}
                        {notification && (
                              <ToastNotification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />
                        )}
                  </Container>
            </ThemeProvider>
      );
};

export default FitTrack;