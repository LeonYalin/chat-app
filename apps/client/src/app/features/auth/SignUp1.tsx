import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@client/hooks';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { signUpAsync } from './auth.slice';
import { Alert } from '@mui/material';
import { useState } from 'react';

interface IFormInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export function SignUp() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [error, setError] = useState<string>('');

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
  });

  const onSubmit: SubmitHandler<IFormInput> = async data => {
    const name = `${data.firstName} ${data.lastName}`;
    dispatch(signUpAsync({ name, email: data.email, password: data.password, navigate, setError }));
  };
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="firstName"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    autoComplete="given-name"
                    name="firstName"
                    fullWidth
                    id="firstName"
                    label="First Name"
                    autoFocus
                    inputProps={{ 'data-testid': 'signup-input-firstname' }}
                    error={!!errors.firstName}
                    helperText={errors.firstName && 'First name is required'}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="lastName"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    autoComplete="family-name"
                    inputProps={{ 'data-testid': 'signup-input-lastname' }}
                    error={!!errors.lastName}
                    helperText={errors.lastName && 'Last name is required'}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="email"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    inputProps={{ 'data-testid': 'signup-input-email' }}
                    error={!!errors.email}
                    helperText={errors.email && 'Email is required'}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="password"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    inputProps={{ 'data-testid': 'signup-input-password' }}
                    error={!!errors.password}
                    helperText={errors.password && 'Password is required'}
                  />
                )}
              />
            </Grid>
          </Grid>
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} data-testid="signup-submit-btn">
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="#" variant="body2" data-testid="signup-signin-link">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
        {error && (
          <Box sx={{ mt: 5, width: '100%' }} data-testid="signup-errors-container">
            <Alert severity="error">{error}</Alert>
          </Box>
        )}
      </Box>
    </Container>
  );
}
