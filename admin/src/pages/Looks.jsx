import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Card,
  CardContent,
  CardMedia,
  Grid,
  IconButton, 
  Switch,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Fade,
  Slide,
  Container,
  Avatar,
  Tooltip,
  Badge,
  Paper
} from '@mui/material';
import { 
  Delete as DeleteIcon, 
  Edit as EditIcon, 
  Add as AddIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  ShoppingBag as ShoppingBagIcon,
  CalendarToday as CalendarIcon,
  Palette as PaletteIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import axios from 'axios';
import AddLookForm from '../components/AddLookForm';
import EditLookForm from '../components/EditLookForm';

const Looks = () => {
  const [looks, setLooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openAddForm, setOpenAddForm] = useState(false);
  const [openEditForm, setOpenEditForm] = useState(false);
  const [selectedLook, setSelectedLook] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, id: null });
  
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem('token');

  const fetchLooks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendURL}/api/looks`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        setLooks(response.data.looks);
      }
    } catch (error) {
      console.error('Error fetching looks:', error);
      toast.error('Failed to fetch looks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLooks();
  }, []);

  const handleAddLookOpen = () => {
    setOpenAddForm(true);
  };

  const handleAddLookClose = () => {
    setOpenAddForm(false);
    fetchLooks();
  };

  const handleEditLookOpen = (look) => {
    setSelectedLook(look);
    setOpenEditForm(true);
  };

  const handleEditLookClose = () => {
    setSelectedLook(null);
    setOpenEditForm(false);
    fetchLooks();
  };

  const handleToggleActive = async (id, currentStatus) => {
    try {
      const response = await axios.put(
        `${backendURL}/api/looks/${id}`,
        { active: !currentStatus },
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setLooks(looks.map(look => 
          look._id === id ? { ...look, active: !currentStatus } : look
        ));
        toast.success(`Look ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
      }
    } catch (error) {
      console.error('Error updating look status:', error);
      toast.error('Failed to update look status');
    }
  };

  const handleToggleFeatured = async (id, currentStatus) => {
    try {
      const response = await axios.put(
        `${backendURL}/api/looks/${id}`,
        { featured: !currentStatus },
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setLooks(looks.map(look => 
          look._id === id ? { ...look, featured: !currentStatus } : look
        ));
        toast.success(`Look ${!currentStatus ? 'featured' : 'unfeatured'} successfully`);
      }
    } catch (error) {
      console.error('Error updating look status:', error);
      toast.error('Failed to update look status');
    }
  };

  const handleConfirmDelete = (id) => {
    setConfirmDialog({ open: true, id });
  };

  const handleCancelDelete = () => {
    setConfirmDialog({ open: false, id: null });
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `${backendURL}/api/looks/${confirmDialog.id}`,
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setLooks(looks.filter(look => look._id !== confirmDialog.id));
        toast.success('Look deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting look:', error);
      toast.error('Failed to delete look');
    } finally {
      setConfirmDialog({ open: false, id: null });
    }
  };

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '400px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}
      >
        <CircularProgress size={60} sx={{ color: 'white', mb: 2 }} />
        <Typography variant="h6" sx={{ color: 'white', opacity: 0.9 }}>
          Loading your amazing looks...
        </Typography>
      </Box>
    );
  }

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        py: 4
      }}
    >
      <Container maxWidth="xl">
        {/* Header Section */}
        <Paper 
          elevation={0}
          sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: 4,
            p: 4,
            mb: 4,
            color: 'white'
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography 
                variant="h3" 
                sx={{ 
                  fontWeight: 'bold',
                  mb: 1,
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }}
              >
                Shop The Look
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                Curate stunning fashion collections and product showcases
              </Typography>
            </Box>
            <Button 
              variant="contained" 
              size="large"
              startIcon={<AddIcon />}
              onClick={handleAddLookOpen}
              sx={{ 
                bgcolor: 'white',
                color: '#667eea',
                fontWeight: 'bold',
                px: 4,
                py: 1.5,
                borderRadius: 3,
                textTransform: 'none',
                fontSize: '1.1rem',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.9)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              Create New Look
            </Button>
          </Box>
        </Paper>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
                color: 'white',
                borderRadius: 3,
                '&:hover': { transform: 'translateY(-4px)' },
                transition: 'transform 0.3s ease'
              }}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <PaletteIcon sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {looks.length}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Total Looks
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                background: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
                color: 'white',
                borderRadius: 3,
                '&:hover': { transform: 'translateY(-4px)' },
                transition: 'transform 0.3s ease'
              }}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <VisibilityIcon sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {looks.filter(look => look.active).length}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Active Looks
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                background: 'linear-gradient(135deg, #feca57 0%, #ff9ff3 100%)',
                color: 'white',
                borderRadius: 3,
                '&:hover': { transform: 'translateY(-4px)' },
                transition: 'transform 0.3s ease'
              }}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <StarIcon sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {looks.filter(look => look.featured).length}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Featured
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                color: '#333',
                borderRadius: 3,
                '&:hover': { transform: 'translateY(-4px)' },
                transition: 'transform 0.3s ease'
              }}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <ShoppingBagIcon sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {looks.reduce((acc, look) => acc + look.products.length, 0)}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Total Products
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Looks Grid */}
        {looks.length === 0 ? (
          <Paper 
            sx={{ 
              textAlign: 'center', 
              py: 8,
              borderRadius: 4,
              background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
            }}
          >
            <PaletteIcon sx={{ fontSize: 80, color: '#ff6b6b', mb: 2 }} />
            <Typography variant="h4" sx={{ color: '#333', mb: 2, fontWeight: 'bold' }}>
              No looks created yet
            </Typography>
            <Typography variant="h6" sx={{ color: '#666', mb: 3 }}>
              Start creating your first amazing collection!
            </Typography>
            <Button 
              variant="contained" 
              size="large"
              startIcon={<AddIcon />}
              onClick={handleAddLookOpen}
              sx={{ 
                bgcolor: '#ff6b6b',
                px: 4,
                py: 1.5,
                borderRadius: 3,
                textTransform: 'none',
                fontSize: '1.1rem'
              }}
            >
              Create Your First Look
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={4}>
            {looks.map((look, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={look._id}>
                <Fade in={true} timeout={300 + index * 100}>
                  <Card 
                    sx={{ 
                      borderRadius: 4,
                      overflow: 'hidden',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                      '&:hover': { 
                        transform: 'translateY(-8px) scale(1.02)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
                      },
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      position: 'relative',
                      background: 'white'
                    }}
                  >
                    {/* Featured Badge */}
                    {look.featured && (
                      <Chip 
                        icon={<StarIcon />}
                        label="Featured"
                        sx={{
                          position: 'absolute',
                          top: 12,
                          left: 12,
                          zIndex: 2,
                          bgcolor: '#ffd700',
                          color: '#333',
                          fontWeight: 'bold'
                        }}
                      />
                    )}

                    {/* Status Badge */}
                    <Chip 
                      icon={look.active ? <VisibilityIcon /> : <VisibilityOffIcon />}
                      label={look.active ? 'Active' : 'Inactive'}
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        zIndex: 2,
                        bgcolor: look.active ? '#4caf50' : '#f44336',
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                    />

                    {look.thumbnail ? (
                      <CardMedia
                        component="img"
                        height="240"
                        image={look.thumbnail}
                        alt={look.name || 'Look'}
                        sx={{ 
                          objectFit: 'cover',
                          filter: look.active ? 'none' : 'grayscale(50%)'
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          height: 240,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                          color: '#1976d2'
                        }}
                      >
                        <Box sx={{ textAlign: 'center' }}>
                          <PaletteIcon sx={{ fontSize: 60, mb: 1, opacity: 0.7 }} />
                          <Typography variant="body2" sx={{ opacity: 0.8 }}>
                            No Image Available
                          </Typography>
                        </Box>
                      </Box>
                    )}
                    
                    <CardContent sx={{ p: 3 }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 'bold',
                          mb: 2,
                          color: '#333',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {look.name || `Look #${index + 1}`}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <ShoppingBagIcon sx={{ fontSize: 20, color: '#666', mr: 1 }} />
                        <Typography variant="body2" sx={{ color: '#666' }}>
                          {look.products.length} Products
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <CalendarIcon sx={{ fontSize: 20, color: '#666', mr: 1 }} />
                        <Typography variant="body2" sx={{ color: '#666' }}>
                          {new Date(look.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>

                      {/* Action Buttons */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Tooltip title="Toggle Featured">
                            <IconButton 
                              onClick={() => handleToggleFeatured(look._id, look.featured)}
                              sx={{ 
                                color: look.featured ? '#ffd700' : '#ccc',
                                '&:hover': { color: '#ffd700' }
                              }}
                            >
                              {look.featured ? <StarIcon /> : <StarBorderIcon />}
                            </IconButton>
                          </Tooltip>
                          
                          <Tooltip title="Toggle Active Status">
                            <Switch 
                              checked={look.active} 
                              onChange={() => handleToggleActive(look._id, look.active)}
                              sx={{
                                '& .MuiSwitch-switchBase.Mui-checked': {
                                  color: '#4caf50',
                                },
                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                  backgroundColor: '#4caf50',
                                },
                              }}
                            />
                          </Tooltip>
                        </Box>

                        <Box>
                          <Tooltip title="Edit Look">
                            <IconButton 
                              onClick={() => handleEditLookOpen(look)}
                              sx={{ 
                                color: '#2196f3',
                                '&:hover': { bgcolor: 'rgba(33, 150, 243, 0.1)' }
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          
                          <Tooltip title="Delete Look">
                            <IconButton 
                              onClick={() => handleConfirmDelete(look._id)}
                              sx={{ 
                                color: '#f44336',
                                '&:hover': { bgcolor: 'rgba(244, 67, 54, 0.1)' }
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Add Look Dialog */}
      <Dialog 
        open={openAddForm} 
        onClose={() => handleAddLookClose()} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
          }
        }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          fontSize: '1.5rem',
          fontWeight: 'bold'
        }}>
          Create New Look
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <AddLookForm onClose={handleAddLookClose} />
        </DialogContent>
      </Dialog>

      {/* Edit Look Dialog */}
      <Dialog 
        open={openEditForm} 
        onClose={() => handleEditLookClose()} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
          }
        }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          fontSize: '1.5rem',
          fontWeight: 'bold'
        }}>
          Edit Look
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {selectedLook && <EditLookForm look={selectedLook} onClose={handleEditLookClose} />}
        </DialogContent>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog 
        open={confirmDialog.open} 
        onClose={handleCancelDelete}
        PaperProps={{
          sx: {
            borderRadius: 4,
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
          }
        }}
      >
        <DialogTitle sx={{ 
          color: '#f44336',
          fontSize: '1.3rem',
          fontWeight: 'bold'
        }}>
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: '#666', fontSize: '1.1rem' }}>
            Are you sure you want to delete this look? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={handleCancelDelete}
            sx={{ 
              color: '#666',
              fontWeight: 'bold',
              textTransform: 'none'
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDelete} 
            variant="contained"
            sx={{ 
              bgcolor: '#f44336',
              fontWeight: 'bold',
              textTransform: 'none',
              '&:hover': { bgcolor: '#d32f2f' }
            }}
          >
            Delete Look
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Looks;