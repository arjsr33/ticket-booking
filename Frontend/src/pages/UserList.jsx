import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUsers, updateUserById, deleteUserById } from '../redux/userSlice';
import { 
  Container, Typography, Box, Button, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper, Dialog, DialogActions, 
  DialogContent, DialogTitle, TextField, Select, MenuItem, FormControl,
  InputLabel, CircularProgress, Snackbar, Alert
} from '@mui/material';

const UserList = () => {
  const dispatch = useDispatch();
  const { allUsers, loading, error } = useSelector(state => state.user);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', role: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    console.log('Dispatching fetchAllUsers');
    dispatch(fetchAllUsers())
      .unwrap()
      .then(result => console.log('fetchAllUsers result:', result))
      .catch(error => console.error('fetchAllUsers error:', error));
  }, [dispatch]);

  const handleEdit = (user) => {
    setEditingUser(user);
    setEditForm({ name: user.name, email: user.email, role: user.role });
  };

  const handleCloseEdit = () => {
    setEditingUser(null);
    setEditForm({ name: '', email: '', role: '' });
  };

  const handleInputChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSubmitEdit = () => {
    dispatch(updateUserById({ id: editingUser._id, userData: editForm }))
      .unwrap()
      .then(() => {
        handleCloseEdit();
        setSnackbar({ open: true, message: 'User updated successfully', severity: 'success' });
      })
      .catch(error => {
        console.error('Error updating user:', error);
        setSnackbar({ open: true, message: 'Failed to update user', severity: 'error' });
      });
  };

  const handleDelete = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      dispatch(deleteUserById(userId))
        .unwrap()
        .then(() => {
          setSnackbar({ open: true, message: 'User deleted successfully', severity: 'success' });
        })
        .catch(error => {
          console.error('Error deleting user:', error);
          setSnackbar({ open: true, message: 'Failed to delete user', severity: 'error' });
        });
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <CircularProgress />
    </Box>
  );

  if (error) return (
    <Container>
      <Alert severity="error">
        <Typography variant="h6">Error fetching users</Typography>
        <Typography>{error}</Typography>
        <Button onClick={() => dispatch(fetchAllUsers())} color="inherit" sx={{ mt: 2 }}>
          Retry
        </Button>
      </Alert>
    </Container>
  );

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>User Management</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allUsers.map(user => (
                <TableRow key={user._id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <Button color="primary" onClick={() => handleEdit(user)}>Edit</Button>
                    <Button 
                      color="secondary" 
                      onClick={() => handleDelete(user._id)}
                      disabled={user.role === 'admin'}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Dialog open={Boolean(editingUser)} onClose={handleCloseEdit}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="name"
            label="Name"
            type="text"
            fullWidth
            value={editForm.name}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="email"
            label="Email"
            type="email"
            fullWidth
            value={editForm.email}
            onChange={handleInputChange}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              name="role"
              value={editForm.role}
              onChange={handleInputChange}
              label="Role"
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit}>Cancel</Button>
          <Button onClick={handleSubmitEdit} color="primary">Save</Button>
        </DialogActions>
      </Dialog>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default UserList;