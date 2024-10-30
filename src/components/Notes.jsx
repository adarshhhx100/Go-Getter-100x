import React, { useState, useEffect } from 'react';
import { db } from '../Firebase';
import { collection, addDoc, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Box, Button, TextField, List, ListItem, ListItemText, IconButton, Typography, Divider } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material.Edit';
import SearchIcon from '@mui/icons-material.Search';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteBody, setNoteBody] = useState('');
  const [editNoteId, setEditNoteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNote, setSelectedNote] = useState(null);

  useEffect(() => {
    const notesCollectionRef = collection(db, 'notes');
    const unsubscribe = onSnapshot(notesCollectionRef, (snapshot) => {
      setNotes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const handleAddNote = async () => {
    if (noteTitle.trim() && noteBody.trim()) {
      if (editNoteId) {
        const noteRef = doc(db, 'notes', editNoteId);
        await updateDoc(noteRef, { title: noteTitle, body: noteBody });
        setEditNoteId(null);
      } else {
        await addDoc(collection(db, 'notes'), { title: noteTitle, body: noteBody, createdAt: new Date() });
      }
      
      setNoteTitle('');
      setNoteBody('');
    }
  };

  const handleDeleteNote = async (id) => {
    const noteRef = doc(db, 'notes', id);
    await deleteDoc(noteRef);
  };

  const handleEditNote = (note) => {
    setNoteTitle(note.title);
    setNoteBody(note.body);
    setEditNoteId(note.id);
  };

  const handleSelectNote = (note) => {
    setSelectedNote(note);
  };

  const handleBackToList = () => {
    setSelectedNote(null);
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box mt={4}>
      <Typography variant="h4" gutterBottom>
        Write your notes...
      </Typography>

      {selectedNote ? (
        // View for selected note details
        <Box>
          <Typography variant="h5" gutterBottom>{selectedNote.title}</Typography>
          <Typography variant="body1" gutterBottom>{selectedNote.body}</Typography>
          <Button variant="outlined" color="primary" onClick={handleBackToList} sx={{ mt: 2 }}>
            Back to Notes List
          </Button>
        </Box>
      ) : (
        // Notes list and add note form
        <>
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
              sx={{ 
                resize: 'vertical', // Allows resizing vertically
                overflow: 'auto'    // Ensures scroll when content overflows
              }}
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

          <List>
            {filteredNotes.map(note => (
              <ListItem key={note.id} divider onClick={() => handleSelectNote(note)} button>
                <ListItemText 
                  primary={note.title} 
                  secondary={note.createdAt ? `- Created at: ${new Date(note.createdAt.seconds * 1000).toLocaleString()}` : ''}
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
        </>
      )}
    </Box>
  );
};

export default Notes;
