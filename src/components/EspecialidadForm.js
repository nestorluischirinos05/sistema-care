// components/EspecialidadForm.js
import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
  Alert,
  IconButton,
  Tooltip,
  Collapse,
  Card,
  CardContent,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import axios from 'axios';
import CONFIG from '../config.js';

const EspecialidadForm = () => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [especialidades, setEspecialidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Cargar especialidades al montar
  useEffect(() => {
    const cargarEspecialidades = async () => {
      try {
        const res = await axios.get(`${CONFIG.API_BASE_URL}/api/especialidades/`);
        setEspecialidades(res.data);
      } catch (err) {
        setError('No se pudieron cargar las especialidades.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    cargarEspecialidades();
  }, []);

  // Registrar nueva especialidad
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    try {
      const res = await axios.post(`${CONFIG.API_BASE_URL}/api/especialidades/`, {
        nombre,
        descripcion: descripcion.trim() || null, // Puede ser opcional
      });
      setEspecialidades([res.data, ...especialidades]);
      setNombre('');
      setDescripcion('');
      setSuccess('Especialidad registrada exitosamente.');
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      setError('Error al registrar la especialidad. Puede que ya exista.');
      console.error(err.response?.data || err.message);
      setTimeout(() => setError(''), 5000);
    }
  };

  // Eliminar especialidad
  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta especialidad?')) return;

    try {
      await axios.delete(`${CONFIG.API_BASE_URL}/api/especialidades/${id}/`);
      setEspecialidades(especialidades.filter(e => e.id !== id));
      setSuccess('Especialidad eliminada correctamente.');
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      setError('No se pudo eliminar la especialidad.');
      console.error(err);
      setTimeout(() => setError(''), 5000);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}>
      <Paper
        sx={{
          padding: 3,
          borderRadius: 3,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          backgroundColor: '#f8f9ff',
        }}
      >
        {/* Encabezado */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography
            variant="h5"
            fontWeight="bold"
            color="primary.main"
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <AddIcon />
            Registrar Especialidad
          </Typography>
        </Box>

        {/* Mensajes */}
        {success && (
          <Alert severity="success" sx={{ mb: 3, fontSize: '0.9rem' }}>
            {success}
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ mb: 3, fontSize: '0.9rem' }}>
            {error}
          </Alert>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} noValidate>
          <TextField
            label="Nombre de la especialidad"
            fullWidth
            required
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Cardiología, Pediatría"
            variant="outlined"
            margin="normal"
            sx={{
              backgroundColor: 'white',
              borderRadius: 1,
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#b3d4fc' },
                '&:hover fieldset': { borderColor: '#1976d2' },
                '&.Mui-focused fieldset': { borderColor: '#1976d2' },
              },
            }}
          />
          <TextField
            label="Descripción (opcional)"
            fullWidth
            multiline
            rows={3}
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Ej: Se enfoca en el diagnóstico y tratamiento de enfermedades del corazón..."
            variant="outlined"
            margin="normal"
            sx={{
              backgroundColor: 'white',
              borderRadius: 1,
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#b3d4fc' },
                '&:hover fieldset': { borderColor: '#1976d2' },
                '&.Mui-focused fieldset': { borderColor: '#1976d2' },
              },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            sx={{
              mt: 2,
              fontWeight: 600,
              px: 4,
              py: 1,
              borderRadius: 2,
              boxShadow: 2,
              backgroundColor: '#1976d2',
              '&:hover': { backgroundColor: '#1565c0' },
            }}
            disabled={!nombre.trim()}
          >
            Registrar
          </Button>
        </form>
      </Paper>

      {/* Tabla de especialidades */}
      <Paper
        sx={{
          mt: 3,
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }}
      >
        <Box
          sx={{
            backgroundColor: '#1976d2',
            color: 'white',
            p: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            📋 Especialidades Registradas
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Total: {especialidades.length}
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography>Cargando especialidades...</Typography>
          </Box>
        ) : especialidades.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>
            <Typography>No hay especialidades registradas.</Typography>
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>Nombre</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>Descripción</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {especialidades.map((especialidad) => (
                <TableRow
                  key={especialidad.id}
                  hover
                  sx={{
                    '&:nth-of-type(odd)': { backgroundColor: '#f9f9ff' },
                    '&:hover': { backgroundColor: '#e3f2fd !important' },
                  }}
                >
                  <TableCell sx={{ fontSize: '0.9rem', color: 'text.secondary' }}>
                    {especialidad.id}
                  </TableCell>
                  <TableCell>
                    <Typography
                      sx={{
                        fontWeight: 500,
                        color: 'text.primary',
                        textTransform: 'capitalize',
                      }}
                    >
                      {especialidad.nombre.toLowerCase()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        maxWidth: 300,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        cursor: 'pointer',
                      }}
                      title={especialidad.descripcion || 'Sin descripción'}
                    >
                      {especialidad.descripcion || 'Sin descripción'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Eliminar especialidad">
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => handleDelete(especialidad.id)}
                        sx={{ borderRadius: 1 }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>
    </Container>
  );
};

export default EspecialidadForm;