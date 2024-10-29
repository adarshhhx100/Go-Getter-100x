import React, { useState, useEffect } from 'react';
import { db } from '../Firebase'; // Adjust the path based on where firebase config is stored
import { collection, addDoc, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Box, Button, TextField, List, ListItem, ListItemText, IconButton, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteBody, setNoteBody] = useState('');
  const [editNoteId, setEditNoteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch notes in real-time
  useEffect(() => {
    const notesCollectionRef = collection(db, 'notes');
    const unsubscribe = onSnapshot(notesCollectionRef, (snapshot) => {
      setNotes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  // Add or update a note
  const handleAddNote = async () => {
    if (noteTitle.trim() && noteBody.trim()) {
      if (editNoteId) {
        const noteRef = doc(db, 'notes', editNoteId);
        await updateDoc(noteRef, { title: noteTitle, body: noteBody });
        setEditNoteId(null);
      } else {
        await addDoc(collection(db, 'notes'), { title: noteTitle, body: noteBody, createdAt: new Date() });
      }
      // Clear fields after adding/updating
      setNoteTitle('');
      setNoteBody('');
    }
  };

  // Delete a note
  const handleDeleteNote = async (id) => {
    const noteRef = doc(db, 'notes', id);
    await deleteDoc(noteRef);
  };

  // Set fields to edit a note
  const handleEditNote = (note) => {
    setNoteTitle(note.title);
    setNoteBody(note.body);
    setEditNoteId(note.id);
  };

  // Filter notes based on search query
  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box mt={4}>
      <Typography variant="h4" gutterBottom>
        Write your notes...
      </Typography>

      {/* Search Bar */}
      <Box display="flex" mb={2} alignItems="center">
        <TextField
          label="Search Notes"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          variant="outlined"
          size="small"
          sx={{ flexGrow: 1, mr: 1 }}
        />
        <IconButton color="primary">
          <SearchIcon />
        </IconButton>
      </Box>

      {/* Note Input Fields */}
      <Box display="flex" flexDirection="column" mb={2}>
        <TextField
          label="Note Title"
          value={noteTitle}
          onChange={(e) => setNoteTitle(e.target.value)}
          variant="outlined"
          margin="normal"
        />
        <TextField
          label="Note Body"
          value={noteBody}
          onChange={(e) => setNoteBody(e.target.value)}
          variant="outlined"
          margin="normal"
          multiline
          rows={4}
        />
        <Button
          variant="contained"
          color="primary"
          size="medium"
          onClick={handleAddNote}
          sx={{ mt: 2, px: 3, py: 1.5, borderRadius: '8px' }}
        >
          <Typography variant="h6">{editNoteId ? 'Update Note' : 'Add Note'}</Typography>
        </Button>
      </Box>

      {/* Notes List */}
      <List>
        {filteredNotes.map(note => (
          <ListItem key={note.id} divider>
            <ListItemText 
              primary={note.title} 
              secondary={note.createdAt ? `- Created at: ${new Date(note.createdAt.seconds * 1000).toLocaleString()}` : ''} // Show date if available
            />
            <IconButton edge="end" onClick={() => handleEditNote(note)}>
              <EditIcon />
            </IconButton>
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
