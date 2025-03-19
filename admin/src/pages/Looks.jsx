import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
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
  CircularProgress
} from '@mui/material';
import { 
  Delete as DeleteIcon, 
  Edit as EditIcon, 
  Add as AddIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon
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
        headers: { token: token }
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

  const handleAddLookClose = (shouldRefresh = false) => {
    setOpenAddForm(false);
    if (shouldRefresh) {
      fetchLooks();
    }
  };

  const handleEditLookOpen = (look) => {
    setSelectedLook(look);
    setOpenEditForm(true);
  };

  const handleEditLookClose = (shouldRefresh = false) => {
    setOpenEditForm(false);
    setSelectedLook(null);
    if (shouldRefresh) {
      fetchLooks();
    }
  };

  const handleToggleActive = async (id, currentStatus) => {
    try {
      const response = await axios.put(
        `${backendURL}/api/looks/${id}`,
        { active: !currentStatus },
        { headers: { token: token } }
      );

      if (response.data.success) {
        setLooks(looks.map(look => 
          look._id === id ? { ...look, active: !currentStatus } : look
        ));
        toast.success('Look status updated');
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
        { headers: { token: token } }
      );

      if (response.data.success) {
        setLooks(looks.map(look => 
          look._id === id ? { ...look, featured: !currentStatus } : look
        ));
        toast.success('Look featured status updated');
      }
    } catch (error) {
      console.error('Error updating look featured status:', error);
      toast.error('Failed to update look featured status');
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
        { headers: { token: token } }
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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Shop The Look</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={handleAddLookOpen}
        >
          Add New Look
        </Button>
      </Box>

      {looks.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="textSecondary">
            No looks created yet. Start by adding one!
          </Typography>
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Thumbnail</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Products</TableCell>
                <TableCell>Featured</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {looks.map((look) => (
                <TableRow key={look._id}>
                  <TableCell>
                    <Box 
                      component="img" 
                      src={look.thumbnail} 
                      alt={look.name}
                      sx={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 1 }}
                    />
                  </TableCell>
                  <TableCell>{look.name}</TableCell>
                  <TableCell>{look.products.length}</TableCell>
                  <TableCell>
                    <IconButton 
                      onClick={() => handleToggleFeatured(look._id, look.featured)}
                      color={look.featured ? "primary" : "default"}
                    >
                      {look.featured ? <StarIcon /> : <StarBorderIcon />}
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <Switch 
                      checked={look.active} 
                      onChange={() => handleToggleActive(look._id, look.active)}
                      color="primary"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(look.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditLookOpen(look)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleConfirmDelete(look._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add Look Dialog */}
      <Dialog open={openAddForm} onClose={() => handleAddLookClose()} maxWidth="md" fullWidth>
        <DialogTitle>Add New Look</DialogTitle>
        <DialogContent>
          <AddLookForm onClose={handleAddLookClose} />
        </DialogContent>
      </Dialog>

      {/* Edit Look Dialog */}
      <Dialog open={openEditForm} onClose={() => handleEditLookClose()} maxWidth="md" fullWidth>
        <DialogTitle>Edit Look</DialogTitle>
        <DialogContent>
          {selectedLook && <EditLookForm look={selectedLook} onClose={handleEditLookClose} />}
        </DialogContent>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog open={confirmDialog.open} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this look? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button onClick={handleDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Looks; 