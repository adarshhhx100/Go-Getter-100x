import React, { useState, useEffect } from 'react';
import { db } from '../Firebase';
import { collection, onSnapshot} from 'firebase/firestore';
import { Box, Typography,  Paper } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const Notes = () => {
  const [setNotes] = useState([]);

  useEffect(() => {
    const notesCollectionRef = collection(db, 'notes');
    const unsubscribe = onSnapshot(notesCollectionRef, (snapshot) => {
      setNotes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);



  const handleOpenForm = (event) => {
    setAnchorEl(event.currentTarget);
    setIsFormOpen(true);
  };


  return (
    <Box sx={{
      display: 'flex',
      flexWrap: 'wrap',
      '& > :not(style)': {
        m: 1,
        width: 150,
        height: 150,
      },
    }}>
      <Paper
        elevation={3}
        square={false}
        onClick={handleOpenForm}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          p: 2,
          textAlign: 'center',
        }}
      >
        <AddCircleOutlineIcon color='primary' sx={{ fontSize: 80 }} />
        <Typography variant='h5' gutterBottom>Add Notes</Typography>
      </Paper>

    </Box>
  );
};

export default Notes;

