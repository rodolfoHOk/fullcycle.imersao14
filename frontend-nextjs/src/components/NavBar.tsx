import { AppBar, IconButton, Toolbar, Typography } from '@mui/material';
import { DriveEtaRounded } from '@mui/icons-material';

export const NavBar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu">
          <DriveEtaRounded />
        </IconButton>

        <Typography variant="h6">Full Cycle Driver</Typography>
      </Toolbar>
    </AppBar>
  );
};
