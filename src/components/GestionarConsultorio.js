// src/components/GestionarConsultorio.js
import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  Avatar,
  IconButton,
  InputAdornment,
  Divider
} from '@mui/material';
import { Save, PhotoCamera } from '@mui/icons-material';
import apiClient from '../services/apiClient';

export default function GestionarConsultorio() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [logoPreview, setLogoPreview] = useState('');

  const [formData, setFormData] = useState({
    nombre: '',
    rif: '',
    direccion: '',
    correo: '',
    telefono: '',
    logo: null,
  });

  // Cargar el consultorio activo
  useEffect(() => {
    const cargarConsultorio = async () => {
      try {
        const res = await apiClient.get('/api/consultorio/activo/');
        const data = res.data;
        setFormData({
          nombre: data.nombre || '',
          rif: data.rif || '',
          direccion: data.direccion || '',
          correo: data.correo || '',
          telefono: data.telefono || '',
          logo: null,
        });
        setLogoPreview(data.logo || '');
      } catch (err) {
        console.error('No hay consultorio configurado:', err);
        setError('No se pudo cargar la configuración del consultorio.');
      } finally {
        setLoading(false);
      }
    };
    cargarConsultorio();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, logo: file });
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key]) formDataToSend.append(key, formData[key]);
    });

    try {
      await apiClient.post('/api/consultorio/guardar/', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSuccess('✅ Consultorio guardado correctamente.');
    } catch (err) {
      setError('❌ Error al guardar. Verifica los datos o el servidor.');
      console.error('Error al guardar consultorio:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold" color="primary">
          Configuración del Consultorio
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
          Gestiona los datos generales del consultorio para impresión, facturación y cabeceras.
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            name="nombre"
            label="Nombre o Razón Social"
            value={formData.nombre}
            onChange={handleChange}
            margin="normal"
            required
            helperText="Nombre que aparecerá en recetas e historias"
          />
          <TextField
            fullWidth
            name="rif"
            label="RIF"
            value={formData.rif}
            onChange={handleChange}
            margin="normal"
            required
            helperText="Ej: J-12345678-9"
          />
          <TextField
            fullWidth
            name="direccion"
            label="Dirección"
            value={formData.direccion}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={3}
            helperText="Dirección completa del consultorio"
          />
          <TextField
            fullWidth
            name="correo"
            label="Correo Electrónico"
            type="email"
            value={formData.correo}
            onChange={handleChange}
            margin="normal"
            helperText="Correo de contacto"
          />
          <TextField
            fullWidth
            name="telefono"
            label="Teléfono"
            value={formData.telefono}
            onChange={handleChange}
            margin="normal"
            helperText="Teléfono de contacto"
          />

          <Divider sx={{ my: 3 }} />

          {/* Subir logo */}
          <Typography variant="subtitle1" gutterBottom>Logo del Consultorio</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Avatar
              src={logoPreview}
              alt="Logo actual"
              sx={{ width: 80, height: 80 }}
            />
            <Box>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="logo-upload"
                type="file"
                onChange={handleFileChange}
              />
              <label htmlFor="logo-upload">
                <Button
                  component="span"
                  variant="outlined"
                  startIcon={<PhotoCamera />}
                  size="small"
                >
                  Subir Logo
                </Button>
              </label>
              <Typography variant="caption" color="textSecondary" display="block" sx={{ mt: 1 }}>
                PNG, JPG hasta 2MB
              </Typography>
            </Box>
          </Box>

          <Box sx={{ mt: 4 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={<Save />}
              disabled={saving}
              size="large"
            >
              {saving ? 'Guardando...' : 'Guardar Configuración'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}