import React, { useState, useEffect } from 'react';
import { db } from '../Firebase'; // Adjust the path based on where firebase config is stored
import { collection, addDoc, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { Box, Button, TextField, List, ListItem, ListItemText, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [noteText, setNoteText] = useState('');

  // Fetch notes in real-time
  useEffect(() => {
    const notesCollectionRef = collection(db, 'notes');
    const unsubscribe = onSnapshot(notesCollectionRef, (snapshot) => {
      setNotes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  // Add a new note
  const handleAddNote = async () => {
    if (noteText.trim()) {
      await addDoc(collection(db, 'notes'), { text: noteText });
      setNoteText('');
    }
  };

  // Delete a note
  const handleDeleteNote = async (id) => {
    const noteRef = doc(db, 'notes', id);
    await deleteDoc(noteRef);
  };

  return (
    <Box mt={4}>
      <h2>Notes</h2>

      <Box display="flex" mb={2}>
        <TextField
          label="New Note"
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          variant="outlined"
          fullWidth
          margin="normal"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddNote}
          sx={{ ml: 2 }}
        >
          Add Note
        </Button>
      </Box>

      <List>
        {notes.map(note => (
          <ListItem key={note.id} divider>
            <ListItemText primary={note.text} />
            <IconButton edge="end" onClick={() => handleDeleteNote(note.id)}>
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Notes;
